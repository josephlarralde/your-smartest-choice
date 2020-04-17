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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// server-side 'player' experience.
var PlayerExperience = function (_Experience) {
  (0, _inherits3.default)(PlayerExperience, _Experience);

  function PlayerExperience(clientType, midiConfig, winnersResults, timeline) {
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
    _this.timeline = timeline;
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

      this.timeline.start();
      this.timeline.on('index', function (index) {
        console.log('state index ' + index);
        _this2.broadcast('player', null, 'state:index', index);
      });

      this.startTime = this.sync.getSyncTime();
      this.lastTime = this.startTime;
      this.cumulatedTime = 0;
      this.pollInterval = 1;
      this.lastInterval = this.pollInterval;

      this._setTimeout = function () {
        var syncTime = _this2.sync.getSyncTime();
        var totalTime = syncTime - _this2.startTime;
        var timelineTotalSecDuration = _this2.timeline.totalDuration * 0.001;

        if (totalTime >= timelineTotalSecDuration) {
          _this2.startTime += timelineTotalSecDuration;
          _this2.cumulatedTime = totalTime - timelineTotalSecDuration;
        }

        var delta = syncTime - _this2.lastTime;
        var nextInterval = _this2.pollInterval;

        if (delta < _this2.lastInterval) {
          nextInterval = _this2.lastInterval - delta;
        }

        if (delta > _this2.lastInterval && delta < 2 * _this2.lastInterval) {
          _this2.cumulatedTime += _this2.pollInterval;
          var realTime = syncTime - _this2.startTime;
          var diff = realTime - _this2.cumulatedTime;

          nextInterval = _this2.pollInterval - diff;
          _this2.lastInterval = nextInterval;
          _this2.lastTime = syncTime;

          // if (totalTime >= this.timeline.totalDuration) {
          //   this.lastTime
          // }

          _this2.broadcast('player', null, 'global:time', syncTime, timelineTotalSecDuration - totalTime);
        }

        setTimeout(_this2._setTimeout, nextInterval);
      };

      this._setTimeout();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiUGxheWVyRXhwZXJpZW5jZSIsImNsaWVudFR5cGUiLCJtaWRpQ29uZmlnIiwid2lubmVyc1Jlc3VsdHMiLCJ0aW1lbGluZSIsImNoZWNraW4iLCJyZXF1aXJlIiwic2hhcmVkQ29uZmlnIiwic2hhcmVkUGFyYW1zIiwic3luYyIsImF1ZGlvQnVmZmVyTWFuYWdlciIsInNjaGVkdWxlciIsInNldFRpbWVvdXQiLCJjdXJyZW50U3RhdGUiLCJrZXlib2FyZE9mZnNldCIsImdldCIsIkJQTSIsImJlYXREdXJhdGlvbiIsImFkZFBhcmFtTGlzdGVuZXIiLCJ2YWx1ZSIsInN5bmNUaW1lIiwiZ2V0U3luY1RpbWUiLCJ0cmlnZ2VyQXQiLCJicm9hZGNhc3QiLCJzdGFydCIsIm9uIiwiaW5kZXgiLCJjb25zb2xlIiwibG9nIiwic3RhcnRUaW1lIiwibGFzdFRpbWUiLCJjdW11bGF0ZWRUaW1lIiwicG9sbEludGVydmFsIiwibGFzdEludGVydmFsIiwiX3NldFRpbWVvdXQiLCJ0b3RhbFRpbWUiLCJ0aW1lbGluZVRvdGFsU2VjRHVyYXRpb24iLCJ0b3RhbER1cmF0aW9uIiwiZGVsdGEiLCJuZXh0SW50ZXJ2YWwiLCJyZWFsVGltZSIsImRpZmYiLCJjbGllbnQiLCJyZWNlaXZlIiwic2VuZCIsInVwZGF0ZSIsImNsaWVudHMiLCJsZW5ndGgiLCJFeHBlcmllbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBO0lBQ3FCQSxnQjs7O0FBQ25CLDRCQUFZQyxVQUFaLEVBQXdCQyxVQUF4QixFQUFvQ0MsY0FBcEMsRUFBb0RDLFFBQXBELEVBQThEO0FBQUE7O0FBQUEsMEpBQ3RESCxVQURzRDs7QUFHNUQsVUFBS0ksT0FBTCxHQUFlLE1BQUtDLE9BQUwsQ0FBYSxTQUFiLENBQWY7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtELE9BQUwsQ0FBYSxlQUFiLENB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WUFBTCxHQUFvQk0sWUFBcEI7QUFDQSxpQkFBS1QsUUFBTCxHQUFnQlYsUUFBaEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFLRyxTQUFMLENBQWUsUUFBZixFQUF5QixJQUF6QixFQUErQixhQUEvQixFQUE4Q0gsUUFBOUMsRUFBd0RnQiwyQkFBMkJELFNBQW5GO0FBQ0Q7O0FBRUR2QixtQkFBVyxPQUFLc0IsV0FBaEIsRUFBNkJLLFlBQTdCO0FBQ0QsT0FsQ0Q7O0FBb0NBLFdBQUtMLFdBQUw7QUFDRDs7OzBCQUVLUSxNLEVBQVE7QUFBQTs7QUFDWixzSkFBWUEsTUFBWjs7QUFFQTtBQUNBLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixjQUFyQixFQUFxQyxZQUFNO0FBQ3pDLGVBQUtFLElBQUwsQ0FBVUYsTUFBVixFQUFrQixjQUFsQixFQUFrQyxPQUFLdkMsY0FBdkM7QUFDRCxPQUZEOztBQUlBLFdBQUtLLFlBQUwsQ0FBa0JxQyxNQUFsQixDQUF5QixZQUF6QixFQUF1QyxLQUFLQyxPQUFMLENBQWFDLE1BQXBEOztBQUVBO0FBQ0FuQyxpQkFBVyxZQUFNO0FBQ2YsZUFBS2dDLElBQUwsQ0FBVUYsTUFBVixFQUFrQixjQUFsQixFQUFrQyxJQUFsQyxFQUF3QyxPQUFLN0IsWUFBN0M7QUFDRCxPQUZELEVBRUcsR0FGSDtBQUdEOzs7eUJBRUk2QixNLEVBQVE7QUFDWCxxSkFBV0EsTUFBWDs7QUFFQSxXQUFLbEMsWUFBTCxDQUFrQnFDLE1BQWxCLENBQXlCLFlBQXpCLEVBQXVDLEtBQUtDLE9BQUwsQ0FBYUMsTUFBcEQ7QUFDRDs7O0VBbEgyQ0Msa0I7O2tCQUF6QmhELGdCIiwiZmlsZSI6IlBsYXllckV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHBlcmllbmNlIH0gZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuXG4vLyBzZXJ2ZXItc2lkZSAncGxheWVyJyBleHBlcmllbmNlLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyRXhwZXJpZW5jZSBleHRlbmRzIEV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBtaWRpQ29uZmlnLCB3aW5uZXJzUmVzdWx0cywgdGltZWxpbmUpIHtcbiAgICBzdXBlcihjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicpO1xuICAgIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcblxuICAgIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicpO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuXG4gICAgLy8gdGhpcy5taWRpID0gdGhpcy5yZXF1aXJlKCdtaWRpJywgbWlkaUNvbmZpZyk7XG5cbiAgICB0aGlzLndpbm5lcnNSZXN1bHRzID0gd2lubmVyc1Jlc3VsdHM7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICAgIHRoaXMuc2V0VGltZW91dCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50U3RhdGUgPSBudWxsO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3Qga2V5Ym9hcmRPZmZzZXQgPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ2tleWJvYXJkT2Zmc2V0Jyk7XG4gICAgY29uc3QgQlBNID0gdGhpcy5zaGFyZWRDb25maWcuZ2V0KCdCUE0nKTtcbiAgICBjb25zdCBiZWF0RHVyYXRpb24gPSA2MCAvIEJQTTtcblxuICAgIC8vIHRoaXMubWlkaS5hZGRMaXN0ZW5lcignTk9URV9PTicsIChwaXRjaCwgdmVsb2NpdHksIG1zZykgPT4ge1xuICAgIC8vICAgdGhpcy5icm9hZGNhc3QoJ3BsYXllcicsIG51bGwsICdub3RlOm9uJywgcGl0Y2ggLSBrZXlib2FyZE9mZnNldCk7XG4gICAgLy8gICBjb25zb2xlLmxvZygnTk9URV9PTjogJyArIChwaXRjaCAtIGtleWJvYXJkT2Zmc2V0KSk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyB0aGlzLm1pZGkuYWRkTGlzdGVuZXIoJ05PVEVfT0ZGJywgKHBpdGNoLCB2ZWxvY2l0eSwgbXNnKSA9PiB7XG4gICAgLy8gICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ25vdGU6b2ZmJywgcGl0Y2ggLSBrZXlib2FyZE9mZnNldCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBkZWZlciBzdGF0ZSBjaGFuZ2UgdG8gbmV4dCBiZWF0XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignZ2xvYmFsOnN0YXRlJywgKHZhbHVlKSA9PiB7XG4gICAgICBjb25zdCBzeW5jVGltZSA9ICB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAgICAgIGNvbnN0IHRyaWdnZXJBdCA9IHN5bmNUaW1lOy8vICsgYmVhdER1cmF0aW9uO1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB2YWx1ZTtcbiBcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnZ2xvYmFsOnN0YXRlJywgdHJpZ2dlckF0LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRpbWVsaW5lLnN0YXJ0KCk7XG4gICAgdGhpcy50aW1lbGluZS5vbignaW5kZXgnLCAoaW5kZXgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBzdGF0ZSBpbmRleCAke2luZGV4fWApO1xuICAgICAgdGhpcy5icm9hZGNhc3QoJ3BsYXllcicsIG51bGwsICdzdGF0ZTppbmRleCcsIGluZGV4KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG4gICAgdGhpcy5sYXN0VGltZSA9IHRoaXMuc3RhcnRUaW1lO1xuICAgIHRoaXMuY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgdGhpcy5wb2xsSW50ZXJ2YWwgPSAxO1xuICAgIHRoaXMubGFzdEludGVydmFsID0gdGhpcy5wb2xsSW50ZXJ2YWw7XG5cbiAgICB0aGlzLl9zZXRUaW1lb3V0ID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAgICAgIGNvbnN0IHRvdGFsVGltZSA9IHN5bmNUaW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgICBjb25zdCB0aW1lbGluZVRvdGFsU2VjRHVyYXRpb24gPSB0aGlzLnRpbWVsaW5lLnRvdGFsRHVyYXRpb24gKiAwLjAwMTtcblxuICAgICAgaWYgKHRvdGFsVGltZSA+PSB0aW1lbGluZVRvdGFsU2VjRHVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgKz0gdGltZWxpbmVUb3RhbFNlY0R1cmF0aW9uO1xuICAgICAgICB0aGlzLmN1bXVsYXRlZFRpbWUgPSB0b3RhbFRpbWUgLSB0aW1lbGluZVRvdGFsU2VjRHVyYXRpb247XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlbHRhID0gc3luY1RpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgbGV0IG5leHRJbnRlcnZhbCA9IHRoaXMucG9sbEludGVydmFsO1xuXG4gICAgICBpZiAoZGVsdGEgPCB0aGlzLmxhc3RJbnRlcnZhbCkge1xuICAgICAgICBuZXh0SW50ZXJ2YWwgPSB0aGlzLmxhc3RJbnRlcnZhbCAtIGRlbHRhO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVsdGEgPiB0aGlzLmxhc3RJbnRlcnZhbCAmJiBkZWx0YSA8IDIgKiB0aGlzLmxhc3RJbnRlcnZhbCkge1xuICAgICAgICB0aGlzLmN1bXVsYXRlZFRpbWUgKz0gdGhpcy5wb2xsSW50ZXJ2YWw7XG4gICAgICAgIGNvbnN0IHJlYWxUaW1lID0gc3luY1RpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgICAgY29uc3QgZGlmZiA9IHJlYWxUaW1lIC0gdGhpcy5jdW11bGF0ZWRUaW1lO1xuXG4gICAgICAgIG5leHRJbnRlcnZhbCA9IHRoaXMucG9sbEludGVydmFsIC0gZGlmZjtcbiAgICAgICAgdGhpcy5sYXN0SW50ZXJ2YWwgPSBuZXh0SW50ZXJ2YWw7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSBzeW5jVGltZTtcblxuICAgICAgICAvLyBpZiAodG90YWxUaW1lID49IHRoaXMudGltZWxpbmUudG90YWxEdXJhdGlvbikge1xuICAgICAgICAvLyAgIHRoaXMubGFzdFRpbWVcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnZ2xvYmFsOnRpbWUnLCBzeW5jVGltZSwgdGltZWxpbmVUb3RhbFNlY0R1cmF0aW9uIC0gdG90YWxUaW1lKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dCh0aGlzLl9zZXRUaW1lb3V0LCBuZXh0SW50ZXJ2YWwpO1xuICAgIH07XG5cbiAgICB0aGlzLl9zZXRUaW1lb3V0KCk7XG4gIH1cblxuICBlbnRlcihjbGllbnQpIHtcbiAgICBzdXBlci5lbnRlcihjbGllbnQpO1xuXG4gICAgLy8gZXZlcnl0aGluZyBpcyBmYWtlZCBub3dcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncGxheWVyOnNjb3JlJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2dsb2JhbDpzY29yZScsIHRoaXMud2lubmVyc1Jlc3VsdHMpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG5cbiAgICAvLyB1Z2x5IGhhY2suLi5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdnbG9iYWw6c3RhdGUnLCBudWxsLCB0aGlzLmN1cnJlbnRTdGF0ZSk7XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgc3VwZXIuZXhpdChjbGllbnQpO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMudXBkYXRlKCdudW1QbGF5ZXJzJywgdGhpcy5jbGllbnRzLmxlbmd0aCk7XG4gIH1cbn1cbiJdfQ==