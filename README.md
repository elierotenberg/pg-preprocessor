pg-preprocessor
===============

This package is a dump and simple SQL preprocessor to help you manage simple dependencies and split code in multiple files with SQL code.

It doesn't provide any feature requiring actual SQL parsing. It only implements several simple directives.

It is designed for usage with PgSQL, but really could be used with any kind of files.

### Usage

A directive is a line starting with `-- @directiveName`. Directive parameters are then specified inline. For example:
```sql
-- @require /public/functions/utils/foo
-- @declare local BAR bar_should_expand_to_this
-- @declare global BAZ baz_should_expand_to_this
create table BAR as foo();
```

This will ensure that `/public/functions/utils/foo.sql` has been executed before this (if possible, see below), and will replace:
- BAR with `bar_should_expand_to_this` in the current file,
- BAZ with `baz_should_expand_to_this` in the current file and any subsequent file.

To apply the transformation, use the NodeJS API:

`npm install pg-preprocessor`

```js
import processDirectives from 'pg-preprocessor';

processDirectives({
  basePath: `${__dirname}/src/sql`,
}, `./entryPoint.sql`)
.then((contents) => ...)
```

The signature of the process function is `process(opts, entry)` where `opts` is a configuration object:
- `basePath`: the base path for `@require` in non-relative form (defaults to `process.cwd()`)
- `blacklist`: array of directive names to blacklist (defaults to `[]`)

### Available directives

`-- @require absoluteOrRelativePath`

Ensures that the given file will have been executed before what comes after the directive. Note that each file is required at most once, eg. if the given file has already been loaded earlier, it will not be loaded once more. Cyclic dependencies aren't allowed so if cycles are detected, `process` will throw. If the `.sql` extension is omitted, it will be automatically added. The required file will also be processed.

`-- @include absoluteOrRelativePath`

Replace this directive with the contents of the given file, regardless of whether it has already been loaded or not. The given file will still be processed. Cyclic dependencies aren't supported but aren't checked against: it is your responsibility to avoid them.

`-- @declare globalOrLocal identifier expr`

Replace any subsequent occurrence of identifier by expr. If globalOrLocal is local, then only the current file will be affected. If globalOrLocal is global, then the current file and any subsequently included files will be affected. Identifier should be in CAPS_LOCK. expr can be anything (including whitespace, special chars, etc).
