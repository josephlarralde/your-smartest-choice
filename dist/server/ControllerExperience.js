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

var _server = require('soundworks/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ControllerExperience = function (_Experience) {
  (0, _inherits3.default)(ControllerExperience, _Experience);

  function ControllerExperience(clientTypes) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, ControllerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ControllerExperience.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience)).call(this, clientTypes));

    _this.sharedParams = _this.require('shared-params');
    _this.errorReporter = _this.require('error-reporter');

    if (options.auth) _this.auth = _this.require('auth');
    return _this;
  }

  (0, _createClass3.default)(ControllerExperience, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      this.errorReporter.addListener('error', function (file, line, col, msg, userAgent) {
        _this2.broadcast('controller', null, 'log', 'error', file, line, col, msg, userAgent);
      });

      // this is how we get all important information about a shared param :
      // console.log(this.sharedParams.params['compass:instructions'].data);

      // this.sharedParams.addParamListener('compass:instructions', val => {
      //   console.log('new compass:instructions value :');
      //   console.log(val);
      // });

      // setInterval(() => {
      //   this.sharedParams.update('compass:instructions', 'none');
      // }, 1000);
    }
  }]);
  return ControllerExperience;
}(_server.Experience);

exports.default = ControllerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlIiwiY2xpZW50VHlwZXMiLCJvcHRpb25zIiwic2hhcmVkUGFyYW1zIiwicmVxdWlyZSIsImVycm9yUmVwb3J0ZXIiLCJhdXRoIiwiYWRkTGlzdGVuZXIiLCJmaWxlIiwibGluZSIsImNvbCIsIm1zZyIsInVzZXJBZ2VudCIsImJyb2FkY2FzdCIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7SUFFTUEsb0I7OztBQUNKLGdDQUFZQyxXQUFaLEVBQXVDO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsa0tBQy9CRCxXQUQrQjs7QUFHckMsVUFBS0UsWUFBTCxHQUFvQixNQUFLQyxPQUFMLENBQWEsZUFBYixDQUFwQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0QsT0FBTCxDQUFhLGdCQUFiLENBQXJCOztBQUVBLFFBQUlGLFFBQVFJLElBQVosRUFDRSxNQUFLQSxJQUFMLEdBQVksTUFBS0YsT0FBTCxDQUFhLE1BQWIsQ0FBWjtBQVBtQztBQVF0Qzs7Ozs0QkFFTztBQUFBOztBQUNOLFdBQUtDLGFBQUwsQ0FBbUJFLFdBQW5CLENBQStCLE9BQS9CLEVBQXdDLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxHQUFiLEVBQWtCQyxHQUFsQixFQUF1QkMsU0FBdkIsRUFBcUM7QUFDM0UsZUFBS0MsU0FBTCxDQUFlLFlBQWYsRUFBNkIsSUFBN0IsRUFBbUMsS0FBbkMsRUFBMEMsT0FBMUMsRUFBbURMLElBQW5ELEVBQXlEQyxJQUF6RCxFQUErREMsR0FBL0QsRUFBb0VDLEdBQXBFLEVBQXlFQyxTQUF6RTtBQUNELE9BRkQ7O0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDRDs7O0VBM0JnQ0Usa0I7O2tCQThCcEJkLG9CIiwiZmlsZSI6IkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXhwZXJpZW5jZSB9IGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcblxuY2xhc3MgQ29udHJvbGxlckV4cGVyaWVuY2UgZXh0ZW5kcyBFeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGNsaWVudFR5cGVzKTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gICAgdGhpcy5lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuXG4gICAgaWYgKG9wdGlvbnMuYXV0aClcbiAgICAgIHRoaXMuYXV0aCA9IHRoaXMucmVxdWlyZSgnYXV0aCcpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5lcnJvclJlcG9ydGVyLmFkZExpc3RlbmVyKCdlcnJvcicsIChmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KSA9PiB7XG4gICAgICB0aGlzLmJyb2FkY2FzdCgnY29udHJvbGxlcicsIG51bGwsICdsb2cnLCAnZXJyb3InLCBmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KTtcbiAgICB9KTtcblxuICAgIC8vIHRoaXMgaXMgaG93IHdlIGdldCBhbGwgaW1wb3J0YW50IGluZm9ybWF0aW9uIGFib3V0IGEgc2hhcmVkIHBhcmFtIDpcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnNoYXJlZFBhcmFtcy5wYXJhbXNbJ2NvbXBhc3M6aW5zdHJ1Y3Rpb25zJ10uZGF0YSk7XG5cbiAgICAvLyB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdjb21wYXNzOmluc3RydWN0aW9ucycsIHZhbCA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnbmV3IGNvbXBhc3M6aW5zdHJ1Y3Rpb25zIHZhbHVlIDonKTtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHZhbCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgLy8gICB0aGlzLnNoYXJlZFBhcmFtcy51cGRhdGUoJ2NvbXBhc3M6aW5zdHJ1Y3Rpb25zJywgJ25vbmUnKTtcbiAgICAvLyB9LCAxMDAwKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyRXhwZXJpZW5jZTtcbiJdfQ==