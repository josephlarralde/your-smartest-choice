'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('soundworks/client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:image-manager';

var ImageManager = function (_Service) {
  (0, _inherits3.default)(ImageManager, _Service);

  function ImageManager() {
    (0, _classCallCheck3.default)(this, ImageManager);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ImageManager.__proto__ || (0, _getPrototypeOf2.default)(ImageManager)).call(this, SERVICE_ID, false));

    var defaults = {
      files: {}
    };

    _this.images = {};
    return _this;
  }

  (0, _createClass3.default)(ImageManager, [{
    key: 'configure',
    value: function configure(options) {
      if (options.files) {
        if (!this.options.files) this.options.files = {};

        (0, _assign2.default)(this.options.files, options.files);
        delete options.files;
      }

      (0, _get3.default)(ImageManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(ImageManager.prototype), 'configure', this).call(this, options);
    }
  }, {
    key: 'start',
    value: function start() {
      var files = this.options.files;
      var nbrFiles = (0, _keys2.default)(files).length;
      this._nbrFiles = nbrFiles;
      this._counter = 0;

      for (var name in files) {
        var path = files[name];
        var image = new Image();
        image.src = path;
        image.onload = this._onLoad(name, image);
      }
    }
  }, {
    key: '_onLoad',
    value: function _onLoad(name, image) {
      var _this2 = this;

      return function () {
        _this2.images[name] = image;
        _this2._counter += 1;

        if (_this2._counter >= _this2._nbrFiles) _this2.ready();
      };
    }
  }, {
    key: 'get',
    value: function get(name) {
      return this.images[name];
    }
  }, {
    key: 'getAsCanvas',
    value: function getAsCanvas(name) {
      var img = this.images[name];
      var w = img.width;
      var h = img.height;
      var $canvas = document.createElement('canvas');
      var ctx = $canvas.getContext('2d');
      ctx.canvas.width = w;
      ctx.canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      return $canvas;
    }
  }, {
    key: 'getAsHalfSizeCanvas',
    value: function getAsHalfSizeCanvas(name) {
      var img = this.images[name];
      var w = img.width;
      var h = img.height;
      var $canvas = document.createElement('canvas');
      var ctx = $canvas.getContext('2d');
      ctx.canvas.width = w;
      ctx.canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h, 0, 0, Math.floor(w / 2), Math.floor(h / 2));

      return $canvas;
    }
  }]);
  return ImageManager;
}(_client.Service);

_client.serviceManager.register(SERVICE_ID, ImageManager);

exports.default = ImageManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkltYWdlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiSW1hZ2VNYW5hZ2VyIiwiZGVmYXVsdHMiLCJmaWxlcyIsImltYWdlcyIsIm9wdGlvbnMiLCJuYnJGaWxlcyIsImxlbmd0aCIsIl9uYnJGaWxlcyIsIl9jb3VudGVyIiwibmFtZSIsInBhdGgiLCJpbWFnZSIsIkltYWdlIiwic3JjIiwib25sb2FkIiwiX29uTG9hZCIsInJlYWR5IiwiaW1nIiwidyIsIndpZHRoIiwiaCIsImhlaWdodCIsIiRjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjdHgiLCJnZXRDb250ZXh0IiwiY2FudmFzIiwiZHJhd0ltYWdlIiwiTWF0aCIsImZsb29yIiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFNQSxhQUFhLHVCQUFuQjs7SUFJTUMsWTs7O0FBQ0osMEJBQWM7QUFBQTs7QUFBQSxrSkFDTkQsVUFETSxFQUNNLEtBRE47O0FBR1osUUFBTUUsV0FBVztBQUNmQyxhQUFPO0FBRFEsS0FBakI7O0FBSUEsVUFBS0MsTUFBTCxHQUFjLEVBQWQ7QUFQWTtBQVFiOzs7OzhCQUVTQyxPLEVBQVM7QUFDakIsVUFBSUEsUUFBUUYsS0FBWixFQUFtQjtBQUNqQixZQUFJLENBQUMsS0FBS0UsT0FBTCxDQUFhRixLQUFsQixFQUNFLEtBQUtFLE9BQUwsQ0FBYUYsS0FBYixHQUFxQixFQUFyQjs7QUFFRiw4QkFBYyxLQUFLRSxPQUFMLENBQWFGLEtBQTNCLEVBQWtDRSxRQUFRRixLQUExQztBQUNBLGVBQU9FLFFBQVFGLEtBQWY7QUFDRDs7QUFFRCxrSkFBZ0JFLE9BQWhCO0FBQ0Q7Ozs0QkFFTztBQUNOLFVBQU1GLFFBQVEsS0FBS0UsT0FBTCxDQUFhRixLQUEzQjtBQUNBLFVBQU1HLFdBQVcsb0JBQVlILEtBQVosRUFBbUJJLE1BQXBDO0FBQ0EsV0FBS0MsU0FBTCxHQUFpQkYsUUFBakI7QUFDQSxXQUFLRyxRQUFMLEdBQWdCLENBQWhCOztBQUVBLFdBQUssSUFBSUMsSUFBVCxJQUFpQlAsS0FBakIsRUFBd0I7QUFDdEIsWUFBTVEsT0FBT1IsTUFBTU8sSUFBTixDQUFiO0FBQ0EsWUFBTUUsUUFBUSxJQUFJQyxLQUFKLEVBQWQ7QUFDQUQsY0FBTUUsR0FBTixHQUFZSCxJQUFaO0FBQ0FDLGNBQU1HLE1BQU4sR0FBZSxLQUFLQyxPQUFMLENBQWFOLElBQWIsRUFBbUJFLEtBQW5CLENBQWY7QUFDRDtBQUNGOzs7NEJBRU9GLEksRUFBTUUsSyxFQUFPO0FBQUE7O0FBQ25CLGFBQU8sWUFBTTtBQUNYLGVBQUtSLE1BQUwsQ0FBWU0sSUFBWixJQUFvQkUsS0FBcEI7QUFDQSxlQUFLSCxRQUFMLElBQWlCLENBQWpCOztBQUVBLFlBQUksT0FBS0EsUUFBTCxJQUFpQixPQUFLRCxTQUExQixFQUNFLE9BQUtTLEtBQUw7QUFDSCxPQU5EO0FBT0Q7Ozt3QkFFR1AsSSxFQUFNO0FBQ1IsYUFBTyxLQUFLTixNQUFMLENBQVlNLElBQVosQ0FBUDtBQUNEOzs7Z0NBRVdBLEksRUFBTTtBQUNoQixVQUFNUSxNQUFNLEtBQUtkLE1BQUwsQ0FBWU0sSUFBWixDQUFaO0FBQ0EsVUFBTVMsSUFBSUQsSUFBSUUsS0FBZDtBQUNBLFVBQU1DLElBQUlILElBQUlJLE1BQWQ7QUFDQSxVQUFNQyxVQUFVQyxTQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQWhCO0FBQ0EsVUFBTUMsTUFBTUgsUUFBUUksVUFBUixDQUFtQixJQUFuQixDQUFaO0FBQ0FELFVBQUlFLE1BQUosQ0FBV1IsS0FBWCxHQUFtQkQsQ0FBbkI7QUFDQU8sVUFBSUUsTUFBSixDQUFXTixNQUFYLEdBQW9CRCxDQUFwQjtBQUNBSyxVQUFJRyxTQUFKLENBQWNYLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUJDLENBQXpCLEVBQTRCRSxDQUE1Qjs7QUFFQSxhQUFPRSxPQUFQO0FBQ0Q7Ozt3Q0FFbUJiLEksRUFBTTtBQUN4QixVQUFNUSxNQUFNLEtBQUtkLE1BQUwsQ0FBWU0sSUFBWixDQUFaO0FBQ0EsVUFBTVMsSUFBSUQsSUFBSUUsS0FBZDtBQUNBLFVBQU1DLElBQUlILElBQUlJLE1BQWQ7QUFDQSxVQUFNQyxVQUFVQyxTQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQWhCO0FBQ0EsVUFBTUMsTUFBTUgsUUFBUUksVUFBUixDQUFtQixJQUFuQixDQUFaO0FBQ0FELFVBQUlFLE1BQUosQ0FBV1IsS0FBWCxHQUFtQkQsQ0FBbkI7QUFDQU8sVUFBSUUsTUFBSixDQUFXTixNQUFYLEdBQW9CRCxDQUFwQjtBQUNBSyxVQUFJRyxTQUFKLENBQWNYLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUJDLENBQXpCLEVBQTRCRSxDQUE1QixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQ1MsS0FBS0MsS0FBTCxDQUFXWixJQUFJLENBQWYsQ0FBckMsRUFBd0RXLEtBQUtDLEtBQUwsQ0FBV1YsSUFBSSxDQUFmLENBQXhEOztBQUVBLGFBQU9FLE9BQVA7QUFDRDs7O0VBM0V3QlMsZTs7QUE4RTNCQyx1QkFBZUMsUUFBZixDQUF3QmxDLFVBQXhCLEVBQW9DQyxZQUFwQzs7a0JBRWVBLFkiLCJmaWxlIjoiSW1hZ2VNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZSwgc2VydmljZU1hbmFnZXIgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTppbWFnZS1tYW5hZ2VyJztcblxuXG5cbmNsYXNzIEltYWdlTWFuYWdlciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGZpbGVzOiB7fSxcbiAgICB9O1xuXG4gICAgdGhpcy5pbWFnZXMgPSB7fTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuZmlsZXMpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmZpbGVzKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZmlsZXMgPSB7fTtcblxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMuZmlsZXMsIG9wdGlvbnMuZmlsZXMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuZmlsZXM7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLm9wdGlvbnMuZmlsZXM7XG4gICAgY29uc3QgbmJyRmlsZXMgPSBPYmplY3Qua2V5cyhmaWxlcykubGVuZ3RoO1xuICAgIHRoaXMuX25ickZpbGVzID0gbmJyRmlsZXM7XG4gICAgdGhpcy5fY291bnRlciA9IDA7XG5cbiAgICBmb3IgKGxldCBuYW1lIGluIGZpbGVzKSB7XG4gICAgICBjb25zdCBwYXRoID0gZmlsZXNbbmFtZV07XG4gICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2Uuc3JjID0gcGF0aDtcbiAgICAgIGltYWdlLm9ubG9hZCA9IHRoaXMuX29uTG9hZChuYW1lLCBpbWFnZSk7XG4gICAgfVxuICB9XG5cbiAgX29uTG9hZChuYW1lLCBpbWFnZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmltYWdlc1tuYW1lXSA9IGltYWdlO1xuICAgICAgdGhpcy5fY291bnRlciArPSAxO1xuXG4gICAgICBpZiAodGhpcy5fY291bnRlciA+PSB0aGlzLl9uYnJGaWxlcylcbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH07XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIHJldHVybiB0aGlzLmltYWdlc1tuYW1lXTtcbiAgfVxuXG4gIGdldEFzQ2FudmFzKG5hbWUpIHtcbiAgICBjb25zdCBpbWcgPSB0aGlzLmltYWdlc1tuYW1lXTtcbiAgICBjb25zdCB3ID0gaW1nLndpZHRoO1xuICAgIGNvbnN0IGggPSBpbWcuaGVpZ2h0O1xuICAgIGNvbnN0ICRjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjb25zdCBjdHggPSAkY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4LmNhbnZhcy53aWR0aCA9IHc7XG4gICAgY3R4LmNhbnZhcy5oZWlnaHQgPSBoO1xuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB3LCBoKTtcblxuICAgIHJldHVybiAkY2FudmFzO1xuICB9XG5cbiAgZ2V0QXNIYWxmU2l6ZUNhbnZhcyhuYW1lKSB7XG4gICAgY29uc3QgaW1nID0gdGhpcy5pbWFnZXNbbmFtZV07XG4gICAgY29uc3QgdyA9IGltZy53aWR0aDtcbiAgICBjb25zdCBoID0gaW1nLmhlaWdodDtcbiAgICBjb25zdCAkY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY29uc3QgY3R4ID0gJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5jYW52YXMud2lkdGggPSB3O1xuICAgIGN0eC5jYW52YXMuaGVpZ2h0ID0gaDtcbiAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdywgaCwgMCwgMCwgTWF0aC5mbG9vcih3IC8gMiksIE1hdGguZmxvb3IoaCAvIDIpKTtcblxuICAgIHJldHVybiAkY2FudmFzO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEltYWdlTWFuYWdlcik7XG5cbmV4cG9ydCBkZWZhdWx0IEltYWdlTWFuYWdlcjtcbiJdfQ==