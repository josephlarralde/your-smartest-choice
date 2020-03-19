'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var _server = require('soundworks/server');

var _jazzMidi = require('jazz-midi');

var _jazzMidi2 = _interopRequireDefault(_jazzMidi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:midi';
var midi = new _jazzMidi2.default.MIDI();

var NOTE_ON = 144;
var NOTE_OFF = 128;

var Midi = function (_Service) {
  (0, _inherits3.default)(Midi, _Service);

  function Midi() {
    (0, _classCallCheck3.default)(this, Midi);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Midi.__proto__ || (0, _getPrototypeOf2.default)(Midi)).call(this, SERVICE_ID));

    var defaults = {};

    _this.configure(defaults);

    _this.ports = new _map2.default();
    return _this;
  }

  (0, _createClass3.default)(Midi, [{
    key: 'start',
    value: function start() {
      for (var key in this.options) {
        var port = midi.MidiInOpen(this.options[key], this._onMessage(key));
        this.ports.set(key, port);

        console.log('----------------------------------------------------------');
        console.log('Listening midi interface: ' + key + ' (' + this.options[key] + ')');
        console.log('----------------------------------------------------------');
      }

      this.ready();
    }
  }, {
    key: '_onMessage',
    value: function _onMessage(key) {
      var _this2 = this;

      return function (t, msg) {
        var _msg = (0, _slicedToArray3.default)(msg, 3),
            cmd = _msg[0],
            pitch = _msg[1],
            velocity = _msg[2];

        switch (cmd) {
          case NOTE_ON:
            _this2.emit('NOTE_ON', pitch, velocity, msg);
            break;
          case NOTE_OFF:
            _this2.emit('NOTE_OFF', pitch, velocity, msg);
            break;
        }
      };
    }
  }]);
  return Midi;
}(_server.Service);

_server.serviceManager.register(SERVICE_ID, Midi);

exports.default = Midi;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1pZGkuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIm1pZGkiLCJqYXp6IiwiTUlESSIsIk5PVEVfT04iLCJOT1RFX09GRiIsIk1pZGkiLCJkZWZhdWx0cyIsImNvbmZpZ3VyZSIsInBvcnRzIiwia2V5Iiwib3B0aW9ucyIsInBvcnQiLCJNaWRpSW5PcGVuIiwiX29uTWVzc2FnZSIsInNldCIsImNvbnNvbGUiLCJsb2ciLCJyZWFkeSIsInQiLCJtc2ciLCJjbWQiLCJwaXRjaCIsInZlbG9jaXR5IiwiZW1pdCIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7QUFDQSxJQUFNQyxPQUFPLElBQUlDLG1CQUFLQyxJQUFULEVBQWI7O0FBRUEsSUFBTUMsVUFBVSxHQUFoQjtBQUNBLElBQU1DLFdBQVcsR0FBakI7O0lBR01DLEk7OztBQUNKLGtCQUFjO0FBQUE7O0FBQUEsa0lBQ05OLFVBRE07O0FBR1osUUFBTU8sV0FBVyxFQUFqQjs7QUFFQSxVQUFLQyxTQUFMLENBQWVELFFBQWY7O0FBRUEsVUFBS0UsS0FBTCxHQUFhLG1CQUFiO0FBUFk7QUFRYjs7Ozs0QkFFTztBQUNOLFdBQUssSUFBSUMsR0FBVCxJQUFnQixLQUFLQyxPQUFyQixFQUE4QjtBQUM1QixZQUFNQyxPQUFPWCxLQUFLWSxVQUFMLENBQWdCLEtBQUtGLE9BQUwsQ0FBYUQsR0FBYixDQUFoQixFQUFtQyxLQUFLSSxVQUFMLENBQWdCSixHQUFoQixDQUFuQyxDQUFiO0FBQ0EsYUFBS0QsS0FBTCxDQUFXTSxHQUFYLENBQWVMLEdBQWYsRUFBb0JFLElBQXBCOztBQUVBSSxnQkFBUUMsR0FBUixDQUFZLDREQUFaO0FBQ0FELGdCQUFRQyxHQUFSLGdDQUF5Q1AsR0FBekMsVUFBaUQsS0FBS0MsT0FBTCxDQUFhRCxHQUFiLENBQWpEO0FBQ0FNLGdCQUFRQyxHQUFSLENBQVksNERBQVo7QUFDRDs7QUFFRCxXQUFLQyxLQUFMO0FBQ0Q7OzsrQkFFVVIsRyxFQUFLO0FBQUE7O0FBQ2QsYUFBTyxVQUFDUyxDQUFELEVBQUlDLEdBQUosRUFBWTtBQUFBLGdEQUNjQSxHQURkO0FBQUEsWUFDVkMsR0FEVTtBQUFBLFlBQ0xDLEtBREs7QUFBQSxZQUNFQyxRQURGOztBQUdqQixnQkFBUUYsR0FBUjtBQUNFLGVBQUtqQixPQUFMO0FBQ0UsbUJBQUtvQixJQUFMLENBQVUsU0FBVixFQUFxQkYsS0FBckIsRUFBNEJDLFFBQTVCLEVBQXNDSCxHQUF0QztBQUNBO0FBQ0YsZUFBS2YsUUFBTDtBQUNFLG1CQUFLbUIsSUFBTCxDQUFVLFVBQVYsRUFBc0JGLEtBQXRCLEVBQTZCQyxRQUE3QixFQUF1Q0gsR0FBdkM7QUFDQTtBQU5KO0FBUUQsT0FYRDtBQVlEOzs7RUFyQ2dCSyxlOztBQXdDbkJDLHVCQUFlQyxRQUFmLENBQXdCM0IsVUFBeEIsRUFBb0NNLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJNaWRpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZSwgc2VydmljZU1hbmFnZXIgfSBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG5pbXBvcnQgamF6eiBmcm9tICdqYXp6LW1pZGknO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bWlkaSc7XG5jb25zdCBtaWRpID0gbmV3IGphenouTUlESSgpO1xuXG5jb25zdCBOT1RFX09OID0gMTQ0O1xuY29uc3QgTk9URV9PRkYgPSAxMjg7XG5cblxuY2xhc3MgTWlkaSBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnBvcnRzID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMub3B0aW9ucykge1xuICAgICAgY29uc3QgcG9ydCA9IG1pZGkuTWlkaUluT3Blbih0aGlzLm9wdGlvbnNba2V5XSwgdGhpcy5fb25NZXNzYWdlKGtleSkpO1xuICAgICAgdGhpcy5wb3J0cy5zZXQoa2V5LCBwb3J0KTtcblxuICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAgIGNvbnNvbGUubG9nKGBMaXN0ZW5pbmcgbWlkaSBpbnRlcmZhY2U6ICR7a2V5fSAoJHt0aGlzLm9wdGlvbnNba2V5XX0pYCk7XG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgIH1cblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIF9vbk1lc3NhZ2Uoa2V5KSB7XG4gICAgcmV0dXJuICh0LCBtc2cpID0+IHtcbiAgICAgIGNvbnN0IFtjbWQsIHBpdGNoLCB2ZWxvY2l0eV0gPSBtc2c7XG5cbiAgICAgIHN3aXRjaCAoY21kKSB7XG4gICAgICAgIGNhc2UgTk9URV9PTjpcbiAgICAgICAgICB0aGlzLmVtaXQoJ05PVEVfT04nLCBwaXRjaCwgdmVsb2NpdHksIG1zZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgTk9URV9PRkY6XG4gICAgICAgICAgdGhpcy5lbWl0KCdOT1RFX09GRicsIHBpdGNoLCB2ZWxvY2l0eSwgbXNnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE1pZGkpO1xuXG5leHBvcnQgZGVmYXVsdCBNaWRpO1xuIl19