import _ from 'lodash';
import Promise from 'bluebird';
import fs from 'fs';
import p from 'path';
Promise.promisifyAll(fs);

const DIRECTIVE_PREFIX = '-- @';

const DIRECTIVE_REGEXP = /^\-\- \@([^ ]*) (.*)$/;

const DECLARE_REGEXP = /^(local|global) ([^ ]*) (.*)$/;

const defaultOpts = {
  basePath: process.cwd(),
  encoding: 'utf8',
  blacklist: [],
};

const directives = {};

function startsWith(originString, searchString, position) {
  position = position || 0;
  return originString.indexOf(searchString, position) === position;
}

function resolveWithoutExt(opts, { entry }, path) {
  if(startsWith(path, '.')) {
    const { dir } = p.parse(entry);
    return p.resolve(dir, path);
  }
  return p.resolve(opts.basePath, path);
}

function resolve(opts, { entry }, path) {
  const pathWithoutExt = resolveWithoutExt(opts, { entry }, path);
  if(p.extname(pathWithoutExt) === '') {
    return pathWithoutExt + '.sql';
  }
  return pathWithoutExt;
}

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

function replaceAll(string, original, replaced) {
  return string.replace(new RegExp(escapeRegExp(original), 'g'), replaced);
}

function processNextDirective(opts, state) {
  const { linesAlreadyProcessed, linesToProcess } = state;
  const firstDirective = _.first(linesToProcess, (line) => startsWith(line, DIRECTIVE_PREFIX));
  if(!firstDirective) {
    _.each(linesToProcess, (line) => linesAlreadyProcessed.push(line));
    return linesAlreadyProcessed;
  }
  const params = firstDirective.match(DIRECTIVE_REGEXP);
  if(params === null) {
    throw new Error(`Unrecognized directive in ${state.entry}: ${firstDirective}`);
  }
  const [, directiveName, directiveArgs] = params;
  if(!_.has(directives, directiveName)) {
    throw new Error(`Unknown directive in ${state.entry}: ${directiveName}`);
  }
  if(_.includes(opts.blacklist, directiveName)) {
    return directives._noop(opts, state);
  }
  return directives[directiveName](opts, state, directiveArgs);
}

function processSingleFile(opts, state) {
  const { entry, globalDecls, localDecls } = state;
  return fs.readFileAsync(entry)
  .then((contents) => {
    const decls = Object.assign({}, globalDecls, localDecls);
    const linesToProcess = _.reduce(decls, (current, expr, identifier) =>
      replaceAll(current, expr, identifier),
    replaceAll(contents.toString(opts.encoding), '\r\n', '\n')).split('\n');
    return processNextDirective(opts, Object.assign(state, { linesAlreadyProcessed: [], linesToProcess }));
  });
}

Object.assign(directives, {
  _noop(opts, state) {
    const { linesAlreadyProcessed, linesToProcess } = state;
    linesAlreadyProcessed.push(linesToProcess.shift());
    return processNextDirective(opts, Object.assign(state, { linesAlreadyProcessed, linesToProcess }));
  },

  require(opts, state, path) {
    const { alreadyRequired, globalDecls, includeStack } = state;
    const childEntry = resolve(opts, state, path);
    if(_.has(alreadyRequired, childEntry)) {
      const { linesAlreadyProcessed, linesToProcess } = state;
      linesToProcess.shift();
      linesAlreadyProcessed.push(`-- REQUIRE ALREADY REQUIRED ${path}`);
      return processNextDirective(opts, Object.assign(state, { linesAlreadyProcessed, linesToProcess }));
    }
    alreadyRequired[childEntry] = true;
    const childIncludeStack = _.clone(includeStack);
    const childGlobalDecls = _.clone(globalDecls);
    childIncludeStack.push(childEntry);
    const childState = {
      entry: childEntry,
      linesToProcess: null,
      linesAlreadyProcessed: null,
      localDecls: {},
      globalDecls: childGlobalDecls,
      alreadyRequired,
      includeStack: childIncludeStack,
    };
    return processSingleFile(opts, childState)
    .then((childLines) => {
      alreadyRequired[childEntry] = childLines;
      const { linesAlreadyProcessed, linesToProcess } = state;
      linesToProcess.shift();
      linesAlreadyProcessed.push(`-- REQUIRE BEGIN ${path}`);
      _.each(childLines, (line) => linesAlreadyProcessed.push(line));
      const newGlobalDecls = {};
      _.each(childGlobalDecls, (expr, identifier) => {
        if(!_.has(globalDecls, identifier)) {
          newGlobalDecls[identifier] = expr;
        }
      });
      _.each(linesToProcess, (line, k) =>
        _.each(newGlobalDecls, (expr, identifier) =>
          linesToProcess[k] = replaceAll(linesToProcess[k], identifier, expr)
        )
      );
      linesAlreadyProcessed.push(`-- REQUIRE END ${path}`);
      return processNextDirective(opts, Object.assign(state, { linesAlreadyProcessed, linesToProcess }));
    });
  },

  include(opts, state, path) {
    const { globalDecls, alreadyRequired, includeStack } = state;
    const childEntry = resolve(opts, state, path);
    if(_.includes(includeStack, childEntry)) {
      throw new Error(`Cyclic include is not allowed: ${path}`);
    }
    const childIncludeStack = _.clone(includeStack);
    childIncludeStack.push(childEntry);
    const childState = {
      entry: childEntry,
      linesToProcess: null,
      linesAlreadyProcessed: null,
      localDecls: {},
      globalDecls,
      alreadyRequired,
      includeStack: childIncludeStack,
    };
    return processSingleFile(opts, childState)
    .then((childLines) => {
      console.warn({ childLines });
      const { linesAlreadyProcessed, linesToProcess } = state;
      linesToProcess.shift();
      linesAlreadyProcessed.push(`-- INCLUDE BEGIN ${childEntry}`);
      _.each(childLines, (line) => linesAlreadyProcessed.push(line));
      linesAlreadyProcessed.push(`-- INCLUDE END ${childEntry}`);
      return processNextDirective(opts, Object.assign(state, { linesAlreadyProcessed, linesToProcess }));
    });
  },

  declare(opts, state, args) {
    const match = args.match(DECLARE_REGEXP);
    if(match === null) {
      throw new Error(`Unrecognized declare: ${args}`);
    }
    const [, localOrGlobal, identifier, expr] = match;
    if(localOrGlobal === 'local') {
      state.localDecls[identifier] = expr;
    }
    if(localOrGlobal === 'global') {
      state.globalDecls[identifier] = expr;
    }
    const { linesAlreadyProcessed, linesToProcess } = state;
    linesAlreadyProcessed.push(linesToProcess.shift());
    _.each(linesToProcess, (line, k) => linesToProcess[k] = replaceAll(line, identifier, expr));
    return processNextDirective(opts, Object.assign(state, { linesAlreadyProcessed, linesToProcess }));
  },
});

function processDirectives(opts, entry) {
  _.defaults(opts, defaultOpts);
  const state = {
    entry,
    linesToProcess: null,
    linesAlreadyProcessed: null,
    localDecls: {},
    globalDecls: {},
    alreadyRequired: {},
    includeStack: [entry],
  };
  return processSingleFile(opts, state)
  .then((lines) => lines.join('\n'));
}

export default processDirectives;
