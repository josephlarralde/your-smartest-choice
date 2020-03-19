'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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

var SERVICE_ID = 'service:group-filter';

// mock implementation - should use compass
/**
 * @todo - rename to `GroupFilter`
 *
 * Track the current group in which the player is (whatever it means...)
 * group can be: `'blue', 'pink', 'red', 'yellow'`
 */

var GroupFilter = function (_Service) {
  (0, _inherits3.default)(GroupFilter, _Service);

  function GroupFilter() {
    (0, _classCallCheck3.default)(this, GroupFilter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GroupFilter.__proto__ || (0, _getPrototypeOf2.default)(GroupFilter)).call(this, SERVICE_ID, false));

    _this._group = null;
    _this._listeners = new _set2.default();
    _this._zones = [];
    _this._zoneGroupMap = new _map2.default();
    _this._emulateMotionTimeout = null;

    var defaults = {
      directions: {}
    };

    _this.configure(defaults);

    _this._onOrientation = _this._onOrientation.bind(_this);
    _this._emulateMotion = _this._emulateMotion.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(GroupFilter, [{
    key: 'init',
    value: function init() {
      // define zones in degrees for each instruments
      var directions = this.options.directions;

      for (var group in directions) {
        var angle = directions[group];
        var startAngle = angle - 45;
        var endAngle = angle + 45;

        if (startAngle < 0) startAngle = 360 + startAngle;

        if (endAngle > 360) endAngle = endAngle - 360;

        var zone = [startAngle, endAngle];

        this._zones.push(zone);
        this._zoneGroupMap.set(zone, group);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      if (!this.hasStarted) this.init();

      this.ready();
    }
  }, {
    key: 'stop',
    value: function stop() {}
  }, {
    key: 'startListening',
    value: function startListening() {
      this.stopListening();

      if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', this._onOrientation, false);else this._emulateMotionTimeout = setTimeout(this._emulateMotion, 100);
    }
  }, {
    key: 'stopListening',
    value: function stopListening() {
      if (window.DeviceOrientationEvent) window.removeEventListener('deviceorientation', this._onOrientation, false);else clearTimeout(this._emulateMotionTimeout);
    }
  }, {
    key: '_emulateMotion',
    value: function _emulateMotion() {
      var colors = (0, _keys2.default)(this.options.directions);
      var index = Math.floor(Math.random() * colors.length);
      this._group = colors[index];

      this._propagate('compass', 0);
      this._propagate('group', this._group);

      var delay = Math.random() * 6 + 4;
      this._emulateMotionTimeout = setTimeout(this._emulateMotion, delay * 1000);
    }
  }, {
    key: '_onOrientation',
    value: function _onOrientation(data) {
      var compass = data.alpha; // degress
      var group = this._group;

      for (var i = 0; i < this._zones.length; i++) {
        var zone = this._zones[i];
        var start = zone[0];
        var end = zone[1];

        if (start < end && compass >= start && compass < end) {
          this._group = this._zoneGroupMap.get(zone);
          break;
        }

        if (start > end && (compass >= start || compass < end)) {
          this._group = this._zoneGroupMap.get(zone);
          break;
        }
      }

      this._propagate('compass', compass);

      if (group !== this._group) this._propagate('group', this._group);
    }
  }, {
    key: '_propagate',
    value: function _propagate(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this._listeners.forEach(function (callback) {
        return callback.apply(undefined, [channel].concat(args));
      });
    }
  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._listeners.add(callback);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(callback) {
      this._listeners.delete(callback);
    }

    /**
     * Return the current state among `'blue', 'pink', 'red', 'yellow'`.
     */

  }, {
    key: 'getState',
    value: function getState() {
      return this._group;
    }

    /**
     * Test a state against the current one.
     */

  }, {
    key: 'test',
    value: function test(value) {
      return value === this._group;
    }
  }]);
  return GroupFilter;
}(_client.Service);

_client.serviceManager.register(SERVICE_ID, GroupFilter);

exports.default = GroupFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyb3VwRmlsdGVyLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJHcm91cEZpbHRlciIsIl9ncm91cCIsIl9saXN0ZW5lcnMiLCJfem9uZXMiLCJfem9uZUdyb3VwTWFwIiwiX2VtdWxhdGVNb3Rpb25UaW1lb3V0IiwiZGVmYXVsdHMiLCJkaXJlY3Rpb25zIiwiY29uZmlndXJlIiwiX29uT3JpZW50YXRpb24iLCJiaW5kIiwiX2VtdWxhdGVNb3Rpb24iLCJvcHRpb25zIiwiZ3JvdXAiLCJhbmdsZSIsInN0YXJ0QW5nbGUiLCJlbmRBbmdsZSIsInpvbmUiLCJwdXNoIiwic2V0IiwiaGFzU3RhcnRlZCIsImluaXQiLCJyZWFkeSIsInN0b3BMaXN0ZW5pbmciLCJ3aW5kb3ciLCJEZXZpY2VPcmllbnRhdGlvbkV2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldFRpbWVvdXQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY2xlYXJUaW1lb3V0IiwiY29sb3JzIiwiaW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJfcHJvcGFnYXRlIiwiZGVsYXkiLCJkYXRhIiwiY29tcGFzcyIsImFscGhhIiwiaSIsInN0YXJ0IiwiZW5kIiwiZ2V0IiwiY2hhbm5lbCIsImFyZ3MiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJhZGQiLCJkZWxldGUiLCJ2YWx1ZSIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUEsSUFBTUEsYUFBYSxzQkFBbkI7O0FBRUE7QUFDQTs7Ozs7OztJQU1NQyxXOzs7QUFDSix5QkFBYztBQUFBOztBQUFBLGdKQUNORCxVQURNLEVBQ00sS0FETjs7QUFHWixVQUFLRSxNQUFMLEdBQWMsSUFBZDtBQUNBLFVBQUtDLFVBQUwsR0FBa0IsbUJBQWxCO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLEVBQWQ7QUFD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Q3BELGVBQUsxQyxNQUFMLEdBQWMsS0FBS0csYUFBTCxDQUFtQndDLEdBQW5CLENBQXVCM0IsSUFBdkIsQ0FBZDtBQUNBO0FBQ0Q7O0FBRUQsWUFBSXlCLFFBQVFDLEdBQVIsS0FBZ0JKLFdBQVdHLEtBQVgsSUFBb0JILFVBQVVJLEdBQTlDLENBQUosRUFBd0Q7QUFDdEQsZUFBSzFDLE1BQUwsR0FBYyxLQUFLRyxhQUFMLENBQW1Cd0MsR0FBbkIsQ0FBdUIzQixJQUF2QixDQUFkO0FBQ0E7QUFDRDtBQUNGOztBQUVELFdBQUttQixVQUFMLENBQWdCLFNBQWhCLEVBQTJCRyxPQUEzQjs7QUFFQSxVQUFJMUIsVUFBVSxLQUFLWixNQUFuQixFQUNFLEtBQUttQyxVQUFMLENBQWdCLE9BQWhCLEVBQXlCLEtBQUtuQyxNQUE5QjtBQUNIOzs7K0JBRVU0QyxPLEVBQWtCO0FBQUEsd0NBQU5DLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUMzQixXQUFLNUMsVUFBTCxDQUFnQjZDLE9BQWhCLENBQXdCO0FBQUEsZUFBWUMsMkJBQVNILE9BQVQsU0FBcUJDLElBQXJCLEVBQVo7QUFBQSxPQUF4QjtBQUNEOzs7Z0NBRVdFLFEsRUFBVTtBQUNwQixXQUFLOUMsVUFBTCxDQUFnQitDLEdBQWhCLENBQW9CRCxRQUFwQjtBQUNEOzs7bUNBRWNBLFEsRUFBVTtBQUN2QixXQUFLOUMsVUFBTCxDQUFnQmdELE1BQWhCLENBQXVCRixRQUF2QjtBQUNEOztBQUVEOzs7Ozs7K0JBR1c7QUFDVCxhQUFPLEtBQUsvQyxNQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozt5QkFHS2tELEssRUFBTztBQUNWLGFBQVFBLFVBQVUsS0FBS2xELE1BQXZCO0FBQ0Q7OztFQWpJdUJtRCxlOztBQW9JMUJDLHVCQUFlQyxRQUFmLENBQXdCdkQsVUFBeEIsRUFBb0NDLFdBQXBDOztrQkFFZUEsVyIsImZpbGUiOiJHcm91cEZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlcnZpY2UsIHNlcnZpY2VNYW5hZ2VyIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Z3JvdXAtZmlsdGVyJztcblxuLy8gbW9jayBpbXBsZW1lbnRhdGlvbiAtIHNob3VsZCB1c2UgY29tcGFzc1xuLyoqXG4gKiBAdG9kbyAtIHJlbmFtZSB0byBgR3JvdXBGaWx0ZXJgXG4gKlxuICogVHJhY2sgdGhlIGN1cnJlbnQgZ3JvdXAgaW4gd2hpY2ggdGhlIHBsYXllciBpcyAod2hhdGV2ZXIgaXQgbWVhbnMuLi4pXG4gKiBncm91cCBjYW4gYmU6IGAnYmx1ZScsICdwaW5rJywgJ3JlZCcsICd5ZWxsb3cnYFxuICovXG5jbGFzcyBHcm91cEZpbHRlciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICB0aGlzLl9ncm91cCA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX3pvbmVzID0gW107XG4gICAgdGhpcy5fem9uZUdyb3VwTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2VtdWxhdGVNb3Rpb25UaW1lb3V0ID0gbnVsbDtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGlyZWN0aW9uczoge30sXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX29uT3JpZW50YXRpb24gPSB0aGlzLl9vbk9yaWVudGF0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZW11bGF0ZU1vdGlvbiA9IHRoaXMuX2VtdWxhdGVNb3Rpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLy8gZGVmaW5lIHpvbmVzIGluIGRlZ3JlZXMgZm9yIGVhY2ggaW5zdHJ1bWVudHNcbiAgICBjb25zdCBkaXJlY3Rpb25zID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbnM7XG5cbiAgICBmb3IgKGxldCBncm91cCBpbiBkaXJlY3Rpb25zKSB7XG4gICAgICBjb25zdCBhbmdsZSA9IGRpcmVjdGlvbnNbZ3JvdXBdO1xuICAgICAgbGV0IHN0YXJ0QW5nbGUgPSBhbmdsZSAtIDQ1O1xuICAgICAgbGV0IGVuZEFuZ2xlID0gYW5nbGUgKyA0NTtcblxuICAgICAgaWYgKHN0YXJ0QW5nbGUgPCAwKVxuICAgICAgICBzdGFydEFuZ2xlID0gMzYwICsgc3RhcnRBbmdsZTtcblxuICAgICAgaWYgKGVuZEFuZ2xlID4gMzYwKVxuICAgICAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlIC0gMzYwO1xuXG4gICAgICBjb25zdCB6b25lID0gW3N0YXJ0QW5nbGUsIGVuZEFuZ2xlXTtcblxuICAgICAgdGhpcy5fem9uZXMucHVzaCh6b25lKTtcbiAgICAgIHRoaXMuX3pvbmVHcm91cE1hcC5zZXQoem9uZSwgZ3JvdXApO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBzdG9wKCkge31cblxuICBzdGFydExpc3RlbmluZygpIHtcbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcoKTtcblxuICAgIGlmICh3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudClcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIHRoaXMuX29uT3JpZW50YXRpb24sIGZhbHNlKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9lbXVsYXRlTW90aW9uVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5fZW11bGF0ZU1vdGlvbiwgMTAwKTtcbiAgfVxuXG4gIHN0b3BMaXN0ZW5pbmcoKSB7XG4gICAgaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgdGhpcy5fb25PcmllbnRhdGlvbiwgZmFsc2UpO1xuICAgIGVsc2VcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9lbXVsYXRlTW90aW9uVGltZW91dCk7XG4gIH1cblxuICBfZW11bGF0ZU1vdGlvbigpIHtcbiAgICBjb25zdCBjb2xvcnMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuZGlyZWN0aW9ucyk7XG4gICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvcnMubGVuZ3RoKTtcbiAgICB0aGlzLl9ncm91cCA9IGNvbG9yc1tpbmRleF07XG5cbiAgICB0aGlzLl9wcm9wYWdhdGUoJ2NvbXBhc3MnLCAwKTtcbiAgICB0aGlzLl9wcm9wYWdhdGUoJ2dyb3VwJywgdGhpcy5fZ3JvdXApO1xuXG4gICAgY29uc3QgZGVsYXkgPSBNYXRoLnJhbmRvbSgpICogNiArIDQ7XG4gICAgdGhpcy5fZW11bGF0ZU1vdGlvblRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuX2VtdWxhdGVNb3Rpb24sIGRlbGF5ICogMTAwMCk7XG4gIH1cblxuICBfb25PcmllbnRhdGlvbihkYXRhKSB7XG4gICAgY29uc3QgY29tcGFzcyA9IGRhdGEuYWxwaGE7IC8vIGRlZ3Jlc3NcbiAgICBjb25zdCBncm91cCA9IHRoaXMuX2dyb3VwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl96b25lcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgem9uZSA9IHRoaXMuX3pvbmVzW2ldO1xuICAgICAgY29uc3Qgc3RhcnQgPSB6b25lWzBdO1xuICAgICAgY29uc3QgZW5kID0gem9uZVsxXTtcblxuICAgICAgaWYgKHN0YXJ0IDwgZW5kICYmIGNvbXBhc3MgPj0gc3RhcnQgJiYgY29tcGFzcyA8IGVuZCkge1xuICAgICAgICB0aGlzLl9ncm91cCA9IHRoaXMuX3pvbmVHcm91cE1hcC5nZXQoem9uZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhcnQgPiBlbmQgJiYgKGNvbXBhc3MgPj0gc3RhcnQgfHzCoGNvbXBhc3MgPCBlbmQpKSB7XG4gICAgICAgIHRoaXMuX2dyb3VwID0gdGhpcy5fem9uZUdyb3VwTWFwLmdldCh6b25lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcHJvcGFnYXRlKCdjb21wYXNzJywgY29tcGFzcyk7XG5cbiAgICBpZiAoZ3JvdXAgIT09IHRoaXMuX2dyb3VwKVxuICAgICAgdGhpcy5fcHJvcGFnYXRlKCdncm91cCcsIHRoaXMuX2dyb3VwKTtcbiAgfVxuXG4gIF9wcm9wYWdhdGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKGNoYW5uZWwsIC4uLmFyZ3MpKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2xpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY3VycmVudCBzdGF0ZSBhbW9uZyBgJ2JsdWUnLCAncGluaycsICdyZWQnLCAneWVsbG93J2AuXG4gICAqL1xuICBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXA7XG4gIH1cblxuICAvKipcbiAgICogVGVzdCBhIHN0YXRlIGFnYWluc3QgdGhlIGN1cnJlbnQgb25lLlxuICAgKi9cbiAgdGVzdCh2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgPT09IHRoaXMuX2dyb3VwKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBHcm91cEZpbHRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IEdyb3VwRmlsdGVyO1xuIl19