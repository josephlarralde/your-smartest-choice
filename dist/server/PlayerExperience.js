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

      // sounds that sound ok on compass :
      // 25, 26, 27, 28, 31, 32
      // ==> let's say 27 28 31 32 are ok

      this.timeline.midiMap.forEach(function (pair) {
        _this2.sharedParams.addParamListener(pair[0], function (value) {
          if (value === 'on') {
            _this2.broadcast('player', null, 'note:on', pair[1] - keyboardOffset);
          } else if (value === 'off') {
            _this2.broadcast('player', null, 'note:off', pair[1] - keyboardOffset);
          }
        });
      });

      this.sharedParams.addParamListener('compass:enableRandomMIDINotes', function (value) {
        _this2.timeline.enableRandomMidiNotesGenerator(value === 'on');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiUGxheWVyRXhwZXJpZW5jZSIsImNsaWVudFR5cGUiLCJtaWRpQ29uZmlnIiwid2lubmVyc1Jlc3VsdHMiLCJjaGVja2luIiwicmVxdWlyZSIsInNoYXJlZENvbmZpZyIsInNoYXJlZFBhcmFtcyIsInN5bmMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJzY2hlZHVsZXIiLCJzZXRUaW1lb3V0IiwiY3VycmVudFN0YXRlIiwia2V5Ym9hcmRPZmZzZXQiLCJnZXQiLCJCUE0iLCJiZWF0RHVyYXRpb24iLCJhZGRQYXJhbUxpc3RlbmVyIiwidmFsdWUiLCJzeW5jVGltZSIsImdldFN5bmNUaW1lIiwidHJpZ2dlckF0IiwiYnJvYWRjYXN0IiwidGltZWxpbmUiLCJUaW1lbGluZSIsInN0YXJ0Iiwib24iLCJpbmRleCIsInRpbWVMZWZ0IiwibWlkaU1hcCIsImZvckVhY2giLCJwYWlyIiwiZW5hYmxlUmFuZG9tTWlkaU5vdGVzR2VuZXJhdG9yIiwiY2xpZW50IiwicmVjZWl2ZSIsInNlbmQiLCJ1cGRhdGUiLCJjbGllbnRzIiwibGVuZ3RoIiwiZ2V0SW5kZXhFbGFwc2VkVGltZSIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQTtJQUNxQkEsZ0I7OztBQUNuQiw0QkFBWUMsVUFBWixFQUF3QkMsVUFBeEIsRUFBb0NDLGNBQXBDLEVBQW9EO0FBQUE7O0FBQUEsMEpBQzVDRixVQUQ0Qzs7QUFHbEQsVUFBS0csT0FBTCxHQUFlLE1BQUtDLE9BQUwsQ0FBYSxTQUFiLENBQWY7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtELE9BQUwsQ0FBYSxlQUFiLENBQXBCO0FBQ0EsVUFBS0UsWUFBTCxHQUFvQixNQUFLRixPQUFMLENBQWEsZUFBYixDQUFwQjtBQUNBLFVBQUtHLElBQUwsR0FBWSxNQUFLSCxPQUFMLENBQWEsTUFBYixD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LEVBQXVDLEtBQUtDLE9BQUwsQ0FBYUMsTUFBcEQ7QUFDQSxXQUFLSCxJQUFMLENBQVVGLE1BQVYsRUFBa0IsbUJBQWxCLEVBQXVDLEtBQUtWLFFBQUwsQ0FBY0ksS0FBckQsRUFBNEQsS0FBS0osUUFBTCxDQUFjZ0IsbUJBQWQsRUFBNUQ7QUFDQTs7QUFFQTtBQUNBNUIsaUJBQVcsWUFBTTtBQUNmLGVBQUt3QixJQUFMLENBQVVGLE1BQVYsRUFBa0IsY0FBbEIsRUFBa0MsSUFBbEMsRUFBd0MsT0FBS3JCLFlBQTdDO0FBQ0QsT0FGRCxFQUVHLEdBRkg7QUFHRDs7O3lCQUVJcUIsTSxFQUFRO0FBQ1gscUpBQVdBLE1BQVg7O0FBRUEsV0FBSzFCLFlBQUwsQ0FBa0I2QixNQUFsQixDQUF5QixZQUF6QixFQUF1QyxLQUFLQyxPQUFMLENBQWFDLE1BQXBEO0FBQ0Q7OztFQTlGMkNFLGtCOztrQkFBekJ4QyxnQiIsImZpbGUiOiJQbGF5ZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXhwZXJpZW5jZSB9IGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL1RpbWVsaW5lJztcblxuLy8gc2VydmVyLXNpZGUgJ3BsYXllcicgZXhwZXJpZW5jZS5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckV4cGVyaWVuY2UgZXh0ZW5kcyBFeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZSwgbWlkaUNvbmZpZywgd2lubmVyc1Jlc3VsdHMpIHtcbiAgICBzdXBlcihjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicpO1xuICAgIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcblxuICAgIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicpO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuXG4gICAgLy8gdGhpcy5taWRpID0gdGhpcy5yZXF1aXJlKCdtaWRpJywgbWlkaUNvbmZpZyk7XG5cbiAgICB0aGlzLndpbm5lcnNSZXN1bHRzID0gd2lubmVyc1Jlc3VsdHM7XG4gICAgdGhpcy5zZXRUaW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IG51bGw7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBrZXlib2FyZE9mZnNldCA9IHRoaXMuc2hhcmVkQ29uZmlnLmdldCgna2V5Ym9hcmRPZmZzZXQnKTtcbiAgICBjb25zdCBCUE0gPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ0JQTScpO1xuICAgIGNvbnN0IGJlYXREdXJhdGlvbiA9IDYwIC8gQlBNO1xuXG4gICAgLy8gdGhpcy5taWRpLmFkZExpc3RlbmVyKCdOT1RFX09OJywgKHBpdGNoLCB2ZWxvY2l0eSwgbXNnKSA9PiB7XG4gICAgLy8gICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ25vdGU6b24nLCBwaXRjaCAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdOT1RFX09OOiAnICsgKHBpdGNoIC0ga2V5Ym9hcmRPZmZzZXQpKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIHRoaXMubWlkaS5hZGRMaXN0ZW5lcignTk9URV9PRkYnLCAocGl0Y2gsIHZlbG9jaXR5LCBtc2cpID0+IHtcbiAgICAvLyAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnbm90ZTpvZmYnLCBwaXRjaCAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICAvLyB9KTsgICAgXG5cbiAgICAvLyBkZWZlciBzdGF0ZSBjaGFuZ2UgdG8gbmV4dCBiZWF0XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignZ2xvYmFsOnN0YXRlJywgKHZhbHVlKSA9PiB7XG4gICAgICBjb25zdCBzeW5jVGltZSA9ICB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAgICAgIGNvbnN0IHRyaWdnZXJBdCA9IHN5bmNUaW1lOy8vICsgYmVhdER1cmF0aW9uO1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB2YWx1ZTtcbiBcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnZ2xvYmFsOnN0YXRlJywgdHJpZ2dlckF0LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lID0gbmV3IFRpbWVsaW5lKHRoaXMuc2hhcmVkUGFyYW1zLCB0aGlzLnN5bmMpO1xuICAgIHRoaXMudGltZWxpbmUuc3RhcnQoKTtcbiAgICB0aGlzLnRpbWVsaW5lLm9uKCdpbmRleCcsIChpbmRleCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coYHN0YXRlIGluZGV4ICR7aW5kZXh9YCk7XG4gICAgICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ3N0YXRlOmluZGV4JywgaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50aW1lbGluZS5vbignY291bnRkb3duJywgKHRpbWVMZWZ0KSA9PiB7XG4gICAgICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ2dsb2JhbDp0aW1lJywgdGltZUxlZnQpO1xuICAgIH0pO1xuXG4gICAgLy8gc291bmRzIHRoYXQgc291bmQgb2sgb24gY29tcGFzcyA6XG4gICAgLy8gMjUsIDI2LCAyNywgMjgsIDMxLCAzMlxuICAgIC8vID09PiBsZXQncyBzYXkgMjcgMjggMzEgMzIgYXJlIG9rXG5cbiAgICB0aGlzLnRpbWVsaW5lLm1pZGlNYXAuZm9yRWFjaCgocGFpcikgPT4ge1xuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcihwYWlyWzBdLCAodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSAnb24nKSB7XG4gICAgICAgICAgdGhpcy5icm9hZGNhc3QoJ3BsYXllcicsIG51bGwsICdub3RlOm9uJywgcGFpclsxXSAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ29mZicpIHtcbiAgICAgICAgICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ25vdGU6b2ZmJywgcGFpclsxXSAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdjb21wYXNzOmVuYWJsZVJhbmRvbU1JRElOb3RlcycsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy50aW1lbGluZS5lbmFibGVSYW5kb21NaWRpTm90ZXNHZW5lcmF0b3IodmFsdWUgPT09ICdvbicpO1xuICAgIH0pO1xuICB9XG5cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgc3VwZXIuZW50ZXIoY2xpZW50KTtcblxuICAgIC8vIGV2ZXJ5dGhpbmcgaXMgZmFrZWQgbm93XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3BsYXllcjpzY29yZScsICgpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdnbG9iYWw6c2NvcmUnLCB0aGlzLndpbm5lcnNSZXN1bHRzKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICAgIHRoaXMuc2VuZChjbGllbnQsICd0aW1lbGluZTpwb3NpdGlvbicsIHRoaXMudGltZWxpbmUuaW5kZXgsIHRoaXMudGltZWxpbmUuZ2V0SW5kZXhFbGFwc2VkVGltZSgpKTtcbiAgICAvLyB0aGlzLnNlbmQoY2xpZW50LCAnc3RhdGU6aW5kZXgnLCB0aGlzLnRpbWVsaW5lLmluZGV4KTtcblxuICAgIC8vIHVnbHkgaGFjay4uLlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2dsb2JhbDpzdGF0ZScsIG51bGwsIHRoaXMuY3VycmVudFN0YXRlKTtcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgZXhpdChjbGllbnQpIHtcbiAgICBzdXBlci5leGl0KGNsaWVudCk7XG5cbiAgICB0aGlzLnNoYXJlZFBhcmFtcy51cGRhdGUoJ251bVBsYXllcnMnLCB0aGlzLmNsaWVudHMubGVuZ3RoKTtcbiAgfVxufVxuIl19