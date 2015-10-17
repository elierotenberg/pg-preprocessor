import should from 'should/as-function';
import processDirectives from '../';
const { describe, it } = global;

describe('declare', () => {
  it('should work local and global', () =>
    processDirectives({}, `${__dirname}/fixtures/declare-local.sql`)
    .then((contents) => {
      console.warn(contents);
      should(contents).be.a.String();
    })
  );
});

describe('require', () => {
  it('should resolve global decls but not local decls', () => {
    processDirectives({}, `${__dirname}/fixtures/require.sql`)
    .then((contents) => {
      console.warn(contents);
      should(contents).be.a.String();
    });
  });
});
