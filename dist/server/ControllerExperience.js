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
    }
  }]);
  return ControllerExperience;
}(_server.Experience);

exports.default = ControllerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlIiwiY2xpZW50VHlwZXMiLCJvcHRpb25zIiwic2hhcmVkUGFyYW1zIiwicmVxdWlyZSIsImVycm9yUmVwb3J0ZXIiLCJhdXRoIiwiYWRkTGlzdGVuZXIiLCJmaWxlIiwibGluZSIsImNvbCIsIm1zZyIsInVzZXJBZ2VudCIsImJyb2FkY2FzdCIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7SUFFTUEsb0I7OztBQUNKLGdDQUFZQyxXQUFaLEVBQXVDO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsa0tBQy9CRCxXQUQrQjs7QUFHckMsVUFBS0UsWUFBTCxHQUFvQixNQUFLQyxPQUFMLENBQWEsZUFBYixDQUFwQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0QsT0FBTCxDQUFhLGdCQUFiLENBQXJCOztBQUVBLFFBQUlGLFFBQVFJLElBQVosRUFDRSxNQUFLQSxJQUFMLEdBQVksTUFBS0YsT0FBTCxDQUFhLE1BQWIsQ0FBWjtBQVBtQztBQVF0Qzs7Ozs0QkFFTztBQUFBOztBQUNOLFdBQUtDLGFBQUwsQ0FBbUJFLFdBQW5CLENBQStCLE9BQS9CLEVBQXdDLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxHQUFiLEVBQWtCQyxHQUFsQixFQUF1QkMsU0FBdkIsRUFBcUM7QUFDM0UsZUFBS0MsU0FBTCxDQUFlLFlBQWYsRUFBNkIsSUFBN0IsRUFBbUMsS0FBbkMsRUFBMEMsT0FBMUMsRUFBbURMLElBQW5ELEVBQXlEQyxJQUF6RCxFQUErREMsR0FBL0QsRUFBb0VDLEdBQXBFLEVBQXlFQyxTQUF6RTtBQUNELE9BRkQ7QUFHRDs7O0VBZmdDRSxrQjs7a0JBa0JwQmQsb0IiLCJmaWxlIjoiQ29udHJvbGxlckV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHBlcmllbmNlIH0gZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuXG5jbGFzcyBDb250cm9sbGVyRXhwZXJpZW5jZSBleHRlbmRzIEV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoY2xpZW50VHlwZXMpO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLmVycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG5cbiAgICBpZiAob3B0aW9ucy5hdXRoKVxuICAgICAgdGhpcy5hdXRoID0gdGhpcy5yZXF1aXJlKCdhdXRoJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmVycm9yUmVwb3J0ZXIuYWRkTGlzdGVuZXIoJ2Vycm9yJywgKGZpbGUsIGxpbmUsIGNvbCwgbXNnLCB1c2VyQWdlbnQpID0+IHtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdjb250cm9sbGVyJywgbnVsbCwgJ2xvZycsICdlcnJvcicsIGZpbGUsIGxpbmUsIGNvbCwgbXNnLCB1c2VyQWdlbnQpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJFeHBlcmllbmNlO1xuIl19