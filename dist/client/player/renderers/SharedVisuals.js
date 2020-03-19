'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('soundworks/client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SharedVisuals = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(SharedVisuals, _Canvas2dRenderer);

  function SharedVisuals(groupConfig) {
    (0, _classCallCheck3.default)(this, SharedVisuals);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SharedVisuals.__proto__ || (0, _getPrototypeOf2.default)(SharedVisuals)).call(this));

    _this.groupConfig = groupConfig;
    _this._glitch = null;
    return _this;
  }

  (0, _createClass3.default)(SharedVisuals, [{
    key: 'trigger',
    value: function trigger(group, sustained, duration) {
      var color = group === 'all' ? '#ffffff' : this.groupConfig[group].hex;

      this._glitch = {
        group: group,
        color: color,
        ttl: sustained ? +Infinity : duration,
        sustained: sustained
      };
    }
  }, {
    key: 'stop',
    value: function stop(group) {
      if (this._glitch && this._glitch.group === group && this._glitch.sustained === true) this._glitch = null;
    }
  }, {
    key: 'kill',
    value: function kill() {
      this._glitch = null;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      if (this._glitch) {
        this._glitch.ttl -= dt;

        if (this._glitch.ttl < 0) this._glitch = null;
      }
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      var w = this.canvasWidth;
      var h = this.canvasHeight;

      if (this._glitch) {
        ctx.save();
        ctx.globalAlpha = Math.random();
        ctx.fillStyle = this._glitch.color;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    }
  }]);
  return SharedVisuals;
}(_client.Canvas2dRenderer);

exports.default = SharedVisuals;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFZpc3VhbHMuanMiXSwibmFtZXMiOlsiU2hhcmVkVmlzdWFscyIsImdyb3VwQ29uZmlnIiwiX2dsaXRjaCIsImdyb3VwIiwic3VzdGFpbmVkIiwiZHVyYXRpb24iLCJjb2xvciIsImhleCIsInR0bCIsIkluZmluaXR5IiwiZHQiLCJjdHgiLCJ3IiwiY2FudmFzV2lkdGgiLCJoIiwiY2FudmFzSGVpZ2h0Iiwic2F2ZSIsImdsb2JhbEFscGhhIiwiTWF0aCIsInJhbmRvbSIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwicmVzdG9yZSIsIkNhbnZhczJkUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7SUFFTUEsYTs7O0FBQ0oseUJBQVlDLFdBQVosRUFBeUI7QUFBQTs7QUFBQTs7QUFHdkIsVUFBS0EsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxVQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUp1QjtBQUt4Qjs7Ozs0QkFFT0MsSyxFQUFPQyxTLEVBQVdDLFEsRUFBVTtBQUNsQyxVQUFNQyxRQUFTSCxVQUFVLEtBQVgsR0FBb0IsU0FBcEIsR0FBZ0MsS0FBS0YsV0FBTCxDQUFpQkUsS0FBakIsRUFBd0JJLEdBQXRFOztBQUVBLFdBQUtMLE9BQUwsR0FBZTtBQUNiQyxlQUFPQSxLQURNO0FBRWJHLGVBQU9BLEtBRk07QUFHYkUsYUFBS0osWUFBWSxDQUFDSyxRQUFiLEdBQXdCSixRQUhoQjtBQUliRCxtQkFBV0E7QUFKRSxPQUFmO0FBTUQ7Ozt5QkFFSUQsSyxFQUFPO0FBQ1YsVUFBSSxLQUFLRCxPQUFMLElBQWdCLEtBQUtBLE9BQUwsQ0FBYUMsS0FBYixLQUF1QkEsS0FBdkMsSUFBZ0QsS0FBS0QsT0FBTCxDQUFhRSxTQUFiLEtBQTJCLElBQS9FLEVBQ0UsS0FBS0YsT0FBTCxHQUFlLElBQWY7QUFDSDs7OzJCQUVNO0FBQ0wsV0FBS0EsT0FBTCxHQUFlLElBQWY7QUFDRDs7OzJCQUVNUSxFLEVBQUk7QUFDVCxVQUFJLEtBQUtSLE9BQVQsRUFBa0I7QUFDaEIsYUFBS0EsT0FBTCxDQUFhTSxHQUFiLElBQW9CRSxFQUFwQjs7QUFFQSxZQUFJLEtBQUtSLE9BQUwsQ0FBYU0sR0FBYixHQUFtQixDQUF2QixFQUNFLEtBQUtOLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUFDRjs7OzJCQUVNUyxHLEVBQUs7QUFDVixVQUFNQyxJQUFJLEtBQUtDLFdBQWY7QUFDQSxVQUFNQyxJQUFJLEtBQUtDLFlBQWY7O0FBRUEsVUFBSSxLQUFLYixPQUFULEVBQWtCO0FBQ2hCUyxZQUFJSyxJQUFKO0FBQ0FMLFlBQUlNLFdBQUosR0FBa0JDLEtBQUtDLE1BQUwsRUFBbEI7QUFDQVIsWUFBSVMsU0FBSixHQUFnQixLQUFLbEIsT0FBTCxDQUFhSSxLQUE3QjtBQUNBSyxZQUFJVSxRQUFKLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQlQsQ0FBbkIsRUFBc0JFLENBQXRCO0FBQ0FILFlBQUlXLE9BQUo7QUFDRDtBQUNGOzs7RUFoRHlCQyx3Qjs7a0JBbURidkIsYSIsImZpbGUiOiJTaGFyZWRWaXN1YWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzMmRSZW5kZXJlciB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcblxuY2xhc3MgU2hhcmVkVmlzdWFscyBleHRlbmRzIENhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3Rvcihncm91cENvbmZpZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmdyb3VwQ29uZmlnID0gZ3JvdXBDb25maWc7XG4gICAgdGhpcy5fZ2xpdGNoID0gbnVsbDtcbiAgfVxuXG4gIHRyaWdnZXIoZ3JvdXAsIHN1c3RhaW5lZCwgZHVyYXRpb24pIHtcbiAgICBjb25zdCBjb2xvciA9IChncm91cCA9PT0gJ2FsbCcpID8gJyNmZmZmZmYnIDogdGhpcy5ncm91cENvbmZpZ1tncm91cF0uaGV4O1xuXG4gICAgdGhpcy5fZ2xpdGNoID0ge1xuICAgICAgZ3JvdXA6IGdyb3VwLFxuICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgdHRsOiBzdXN0YWluZWQgPyArSW5maW5pdHkgOiBkdXJhdGlvbixcbiAgICAgIHN1c3RhaW5lZDogc3VzdGFpbmVkLFxuICAgIH07XG4gIH1cblxuICBzdG9wKGdyb3VwKSB7XG4gICAgaWYgKHRoaXMuX2dsaXRjaCAmJiB0aGlzLl9nbGl0Y2guZ3JvdXAgPT09IGdyb3VwICYmIHRoaXMuX2dsaXRjaC5zdXN0YWluZWQgPT09IHRydWUpXG4gICAgICB0aGlzLl9nbGl0Y2ggPSBudWxsO1xuICB9XG5cbiAga2lsbCgpIHtcbiAgICB0aGlzLl9nbGl0Y2ggPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgaWYgKHRoaXMuX2dsaXRjaCkge1xuICAgICAgdGhpcy5fZ2xpdGNoLnR0bCAtPSBkdDtcblxuICAgICAgaWYgKHRoaXMuX2dsaXRjaC50dGwgPCAwKVxuICAgICAgICB0aGlzLl9nbGl0Y2ggPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBjb25zdCB3ID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICBpZiAodGhpcy5fZ2xpdGNoKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLl9nbGl0Y2guY29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdywgaCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRWaXN1YWxzO1xuIl19