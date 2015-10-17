'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var describe = global.describe;
var it = global.it;

describe('declare', function () {
  it('should work local and global', function () {
    return _2['default']({}, __dirname + '/fixtures/declare-local.sql').then(function (contents) {
      console.warn(contents);
      _shouldAsFunction2['default'](contents).be.a.String();
    });
  });
});

describe('require', function () {
  it('should resolve global decls but not local decls', function () {
    _2['default']({}, __dirname + '/fixtures/require.sql').then(function (contents) {
      console.warn(contents);
      _shouldAsFunction2['default'](contents).be.a.String();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9pbmRleC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztnQ0FBbUIsb0JBQW9COzs7O2dCQUNULEtBQUs7Ozs7SUFDM0IsUUFBUSxHQUFTLE1BQU0sQ0FBdkIsUUFBUTtJQUFFLEVBQUUsR0FBSyxNQUFNLENBQWIsRUFBRTs7QUFFcEIsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFNO0FBQ3hCLElBQUUsQ0FBQyw4QkFBOEIsRUFBRTtXQUNqQyxjQUFrQixFQUFFLEVBQUssU0FBUyxpQ0FBOEIsQ0FDL0QsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ2xCLGFBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkIsb0NBQU8sUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNoQyxDQUFDO0dBQUEsQ0FDSCxDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUUsWUFBTTtBQUN4QixJQUFFLENBQUMsaURBQWlELEVBQUUsWUFBTTtBQUMxRCxrQkFBa0IsRUFBRSxFQUFLLFNBQVMsMkJBQXdCLENBQ3pELElBQUksQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUNsQixhQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLG9DQUFPLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Il9fdGVzdHNfXy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuaW1wb3J0IHByb2Nlc3NEaXJlY3RpdmVzIGZyb20gJy4uLyc7XHJcbmNvbnN0IHsgZGVzY3JpYmUsIGl0IH0gPSBnbG9iYWw7XHJcblxyXG5kZXNjcmliZSgnZGVjbGFyZScsICgpID0+IHtcclxuICBpdCgnc2hvdWxkIHdvcmsgbG9jYWwgYW5kIGdsb2JhbCcsICgpID0+XHJcbiAgICBwcm9jZXNzRGlyZWN0aXZlcyh7fSwgYCR7X19kaXJuYW1lfS9maXh0dXJlcy9kZWNsYXJlLWxvY2FsLnNxbGApXHJcbiAgICAudGhlbigoY29udGVudHMpID0+IHtcclxuICAgICAgY29uc29sZS53YXJuKGNvbnRlbnRzKTtcclxuICAgICAgc2hvdWxkKGNvbnRlbnRzKS5iZS5hLlN0cmluZygpO1xyXG4gICAgfSlcclxuICApO1xyXG59KTtcclxuXHJcbmRlc2NyaWJlKCdyZXF1aXJlJywgKCkgPT4ge1xyXG4gIGl0KCdzaG91bGQgcmVzb2x2ZSBnbG9iYWwgZGVjbHMgYnV0IG5vdCBsb2NhbCBkZWNscycsICgpID0+IHtcclxuICAgIHByb2Nlc3NEaXJlY3RpdmVzKHt9LCBgJHtfX2Rpcm5hbWV9L2ZpeHR1cmVzL3JlcXVpcmUuc3FsYClcclxuICAgIC50aGVuKChjb250ZW50cykgPT4ge1xyXG4gICAgICBjb25zb2xlLndhcm4oY29udGVudHMpO1xyXG4gICAgICBzaG91bGQoY29udGVudHMpLmJlLmEuU3RyaW5nKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
