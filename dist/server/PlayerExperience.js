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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _server = require('soundworks/server');

var _Timeline = require('./Timeline');

var _Timeline2 = _interopRequireDefault(_Timeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// server-side 'player' experience.
var PlayerExperience = function (_Experience) {
  (0, _inherits3.default)(PlayerExperience, _Experience);

  function PlayerExperience(clientType, midiConfig, winnersResults) {
    (0, _classCallCheck3.default)(this, PlayerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PlayerExperience.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience)).call(this, clientType));

    _this.checkin = _this.require('checkin');
    _this.sharedConfig = _this.require('shared-config');
    _this.sharedParams = _this.require('shared-params');
    _this.sync = _this.require('sync');

    _this.audioBufferManager = _this.require('audio-buffer-manager');
    _this.scheduler = _this.require('sync-scheduler');

    // this.midi = this.require('midi', midiConfig);

    _this.winnersResults = winnersResults;
    _this.setTimeout = null;
    _this.currentState = null;
    return _this;
  }

  (0, _createClass3.default)(PlayerExperience, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var keyboardOffset = this.sharedConfig.get('keyboardOffset');
      var BPM = this.sharedConfig.get('BPM');
      var beatDuration = 60 / BPM;

      // this.midi.addListener('NOTE_ON', (pitch, velocity, msg) => {
      //   this.broadcast('player', null, 'note:on', pitch - keyboardOffset);
      //   console.log('NOTE_ON: ' + (pitch - keyboardOffset));
      // });

      // this.midi.addListener('NOTE_OFF', (pitch, velocity, msg) => {
      //   this.broadcast('player', null, 'note:off', pitch - keyboardOffset);
      // });

      // defer state change to next beat
      this.sharedParams.addParamListener('global:state', function (value) {
        var syncTime = _this2.sync.getSyncTime();
        var triggerAt = syncTime; // + beatDuration;
        _this2.currentState = value;

        _this2.broadcast('player', null, 'global:state', triggerAt, value);
      });

      this.timeline = new _Timeline2.default(this.sharedParams, this.sync);
      this.timeline.start();
      this.timeline.on('index', function (index) {
        // console.log(`state index ${index}`);
        _this2.broadcast('player', null, 'state:index', index);
      });

      this.timeline.on('countdown', function (timeLeft) {
        _this2.broadcast('player', null, 'global:time', timeLeft);
      });
    }
  }, {
    key: 'enter',
    value: function enter(client) {
      var _this3 = this;

      (0, _get3.default)(PlayerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience.prototype), 'enter', this).call(this, client);

      // everything is faked now
      this.receive(client, 'player:score', function () {
        _this3.send(client, 'global:score', _this3.winnersResults);
      });

      this.sharedParams.update('numPlayers', this.clients.length);
      this.send(client, 'timeline:position', this.timeline.index, this.timeline.getIndexElapsedTime());
      // this.send(client, 'state:index', this.timeline.index);

      // ugly hack...
      setTimeout(function () {
        _this3.send(client, 'global:state', null, _this3.currentState);
      }, 100);
    }
  }, {
    key: 'exit',
    value: function exit(client) {
      (0, _get3.default)(PlayerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience.prototype), 'exit', this).call(this, client);

      this.sharedParams.update('numPlayers', this.clients.length);
    }
  }]);
  return PlayerExperience;
}(_server.Experience);

exports.default = PlayerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiUGxheWVyRXhwZXJpZW5jZSIsImNsaWVudFR5cGUiLCJtaWRpQ29uZmlnIiwid2lubmVyc1Jlc3VsdHMiLCJjaGVja2luIiwicmVxdWlyZSIsInNoYXJlZENvbmZpZyIsInNoYXJlZFBhcmFtcyIsInN5bmMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJzY2hlZHVsZXIiLCJzZXRUaW1lb3V0IiwiY3VycmVudFN0YXRlIiwia2V5Ym9hcmRPZmZzZXQiLCJnZXQiLCJCUE0iLCJiZWF0RHVyYXRpb24iLCJhZGRQYXJhbUxpc3RlbmVyIiwidmFsdWUiLCJzeW5jVGltZSIsImdldFN5bmNUaW1lIiwidHJpZ2dlckF0IiwiYnJvYWRjYXN0IiwidGltZWxpbmUiLCJUaW1lbGluZSIsInN0YXJ0Iiwib24iLCJpbmRleCIsInRpbWVMZWZ0IiwiY2xpZW50IiwicmVjZWl2ZSIsInNlbmQiLCJ1cGRhdGUiLCJjbGllbnRzIiwibGVuZ3RoIiwiZ2V0SW5kZXhFbGFwc2VkVGltZSIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQTtJQUNxQkEsZ0I7OztBQUNuQiw0QkFBWUMsVUFBWixFQUF3QkMsVUFBeEIsRUFBb0NDLGNBQXBDLEVBQW9EO0FBQUE7O0FBQUEsMEpBQzVDRixVQUQ0Qzs7QUFHbEQsVUFBS0csT0FBTCxHQUFlLE1BQUtDLE9BQUwsQ0FBYSxTQUFiLENBQWY7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtELE9BQUwsQ0FBYSxlQUFiLENBQXBCO0FBQ0EsVUFBS0UsWUFBTCxHQUFvQixNQUFLRixPQUFMLENBQWEsZUFBYixDQUFwQjtBQUNBLFVBQUtHLElBQUwsR0FBWSxNQUFLSCxPQUFMLENBQWEsTUFBYixDQUFaOztBQUVBLFVBQUtJLGtCQUFMLEdBQTBCLE1BQUtKLE9BQUwsQ0FBYSxzQkFBYixDQUExQjtBQUNBLFVBQUtLLFNBQUwsR0FBaUIsTUFBS0wsT0FBTCxDQUFhLGdCQUFiLENBQWpCOztBQUVBOztBQUVBLFVBQUtGLGNBQUwsR0FBc0JBLGNBQXRCO0FBQ0EsVUFBS1EsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFVBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFma0Q7QUFnQm5EOzs7OzRCQUVPO0FBQUE7O0FBQ04sVUFBTUMsaUJBQWlCLEtBQUtQLFlBQUwsQ0FBa0JRLEdBQWxCLENBQXNCLGdCQUF0QixDQUF2QjtBQUNBLFVBQU1DLE1BQU0sS0FBS1QsWUFBTCxDQUFrQlEsR0FBbEIsQ0FBc0IsS0FBdEIsQ0FBWjtBQUNBLFVBQU1FLGVBQWUsS0FBS0QsR0FBMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBS1IsWUFBTCxDQUFrQlUsZ0JBQWxCLENBQW1DLGNBQW5DLEVBQW1ELFVBQUNDLEtBQUQsRUFBVztBQUM1RCxZQUFNQyxXQUFZLE9BQUtYLElBQUwsQ0FBVVksV0FBVixFQUFsQjtBQUNBLFlBQU1DLFlBQVlGLFFBQWxCLENBRjRELENBRWpDO0FBQzNCLGVBQUtQLFlBQUwsR0FBb0JNLEtBQXBCOztBQUVBLGVBQUtJLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLElBQXpCLEVBQStCLGNBQS9CLEVBQStDRCxTQUEvQyxFQUEwREgsS0FBMUQ7QUFDRCxPQU5EOztBQVFBLFdBQUtLLFFBQUwsR0FBZ0IsSUFBSUMsa0JBQUosQ0FBYSxLQUFLakIsWUFBbEIsRUFBZ0MsS0FBS0MsSUFBckMsQ0FBaEI7QUFDQSxXQUFLZSxRQUFMLENBQWNFLEtBQWQ7QUFDQSxXQUFLRixRQUFMLENBQWNHLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsVUFBQ0MsS0FBRCxFQUFXO0FBQ25DO0FBQ0EsZUFBS0wsU0FBTCxDQUFlLFFBQWYsRUFBeUIsSUFBekIsRUFBK0IsYUFBL0IsRUFBOENLLEtBQTlDO0FBQ0QsT0FIRDs7QUFLQSxXQUFLSixRQUFMLENBQWNHLEVBQWQsQ0FBaUIsV0FBakIsRUFBOEIsVUFBQ0UsUUFBRCxFQUFjO0FBQzFDLGVBQUtOLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLElBQXpCLEVBQStCLGFBQS9CLEVBQThDTSxRQUE5QztBQUNELE9BRkQ7QUFHRDs7OzBCQUVLQyxNLEVBQVE7QUFBQTs7QUFDWixzSkFBWUEsTUFBWjs7QUFFQTtBQUNBLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixjQUFyQixFQUFxQyxZQUFNO0FBQ3pDLGVBQUtFLElBQUwsQ0FBVUYsTUFBVixFQUFrQixjQUFsQixFQUFrQyxPQUFLMUIsY0FBdkM7QUFDRCxPQUZEOztBQUlBLFdBQUtJLFlBQUwsQ0FBa0J5QixNQUFsQixDQUF5QixZQUF6QixFQUF1QyxLQUFLQyxPQUFMLENBQWFDLE1BQXBEO0FBQ0EsV0FBS0gsSUFBTCxDQUFVRixNQUFWLEVBQWtCLG1CQUFsQixFQUF1QyxLQUFLTixRQUFMLENBQWNJLEtBQXJELEVBQTRELEtBQUtKLFFBQUwsQ0FBY1ksbUJBQWQsRUFBNUQ7QUFDQTs7QUFFQTtBQUNBeEIsaUJBQVcsWUFBTTtBQUNmLGVBQUtvQixJQUFMLENBQVVGLE1BQVYsRUFBa0IsY0FBbEIsRUFBa0MsSUFBbEMsRUFBd0MsT0FBS2pCLFlBQTdDO0FBQ0QsT0FGRCxFQUVHLEdBRkg7QUFHRDs7O3lCQUVJaUIsTSxFQUFRO0FBQ1gscUpBQVdBLE1BQVg7O0FBRUEsV0FBS3RCLFlBQUwsQ0FBa0J5QixNQUFsQixDQUF5QixZQUF6QixFQUF1QyxLQUFLQyxPQUFMLENBQWFDLE1BQXBEO0FBQ0Q7OztFQTVFMkNFLGtCOztrQkFBekJwQyxnQiIsImZpbGUiOiJQbGF5ZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXhwZXJpZW5jZSB9IGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL1RpbWVsaW5lJztcblxuLy8gc2VydmVyLXNpZGUgJ3BsYXllcicgZXhwZXJpZW5jZS5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckV4cGVyaWVuY2UgZXh0ZW5kcyBFeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZSwgbWlkaUNvbmZpZywgd2lubmVyc1Jlc3VsdHMpIHtcbiAgICBzdXBlcihjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicpO1xuICAgIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcblxuICAgIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicpO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuXG4gICAgLy8gdGhpcy5taWRpID0gdGhpcy5yZXF1aXJlKCdtaWRpJywgbWlkaUNvbmZpZyk7XG5cbiAgICB0aGlzLndpbm5lcnNSZXN1bHRzID0gd2lubmVyc1Jlc3VsdHM7XG4gICAgdGhpcy5zZXRUaW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IG51bGw7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBrZXlib2FyZE9mZnNldCA9IHRoaXMuc2hhcmVkQ29uZmlnLmdldCgna2V5Ym9hcmRPZmZzZXQnKTtcbiAgICBjb25zdCBCUE0gPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ0JQTScpO1xuICAgIGNvbnN0IGJlYXREdXJhdGlvbiA9IDYwIC8gQlBNO1xuXG4gICAgLy8gdGhpcy5taWRpLmFkZExpc3RlbmVyKCdOT1RFX09OJywgKHBpdGNoLCB2ZWxvY2l0eSwgbXNnKSA9PiB7XG4gICAgLy8gICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ25vdGU6b24nLCBwaXRjaCAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdOT1RFX09OOiAnICsgKHBpdGNoIC0ga2V5Ym9hcmRPZmZzZXQpKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIHRoaXMubWlkaS5hZGRMaXN0ZW5lcignTk9URV9PRkYnLCAocGl0Y2gsIHZlbG9jaXR5LCBtc2cpID0+IHtcbiAgICAvLyAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnbm90ZTpvZmYnLCBwaXRjaCAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGRlZmVyIHN0YXRlIGNoYW5nZSB0byBuZXh0IGJlYXRcbiAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdnbG9iYWw6c3RhdGUnLCAodmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IHN5bmNUaW1lID0gIHRoaXMuc3luYy5nZXRTeW5jVGltZSgpO1xuICAgICAgY29uc3QgdHJpZ2dlckF0ID0gc3luY1RpbWU7Ly8gKyBiZWF0RHVyYXRpb247XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHZhbHVlO1xuIFxuICAgICAgdGhpcy5icm9hZGNhc3QoJ3BsYXllcicsIG51bGwsICdnbG9iYWw6c3RhdGUnLCB0cmlnZ2VyQXQsIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIHRoaXMudGltZWxpbmUgPSBuZXcgVGltZWxpbmUodGhpcy5zaGFyZWRQYXJhbXMsIHRoaXMuc3luYyk7XG4gICAgdGhpcy50aW1lbGluZS5zdGFydCgpO1xuICAgIHRoaXMudGltZWxpbmUub24oJ2luZGV4JywgKGluZGV4KSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhgc3RhdGUgaW5kZXggJHtpbmRleH1gKTtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnc3RhdGU6aW5kZXgnLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLm9uKCdjb3VudGRvd24nLCAodGltZUxlZnQpID0+IHtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnZ2xvYmFsOnRpbWUnLCB0aW1lTGVmdCk7XG4gICAgfSk7XG4gIH1cblxuICBlbnRlcihjbGllbnQpIHtcbiAgICBzdXBlci5lbnRlcihjbGllbnQpO1xuXG4gICAgLy8gZXZlcnl0aGluZyBpcyBmYWtlZCBub3dcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncGxheWVyOnNjb3JlJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2dsb2JhbDpzY29yZScsIHRoaXMud2lubmVyc1Jlc3VsdHMpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG4gICAgdGhpcy5zZW5kKGNsaWVudCwgJ3RpbWVsaW5lOnBvc2l0aW9uJywgdGhpcy50aW1lbGluZS5pbmRleCwgdGhpcy50aW1lbGluZS5nZXRJbmRleEVsYXBzZWRUaW1lKCkpO1xuICAgIC8vIHRoaXMuc2VuZChjbGllbnQsICdzdGF0ZTppbmRleCcsIHRoaXMudGltZWxpbmUuaW5kZXgpO1xuXG4gICAgLy8gdWdseSBoYWNrLi4uXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZ2xvYmFsOnN0YXRlJywgbnVsbCwgdGhpcy5jdXJyZW50U3RhdGUpO1xuICAgIH0sIDEwMCk7XG4gIH1cblxuICBleGl0KGNsaWVudCkge1xuICAgIHN1cGVyLmV4aXQoY2xpZW50KTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICB9XG59XG4iXX0=