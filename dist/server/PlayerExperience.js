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

  function PlayerExperience(clientType, midiConfig, winnersResults) {
    (0, _classCallCheck3.default)(this, PlayerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PlayerExperience.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience)).call(this, clientType));

    _this.checkin = _this.require('checkin');
    _this.sharedConfig = _this.require('shared-config');
    _this.sharedParams = _this.require('shared-params');
    _this.sync = _this.require('sync');

    _this.audioBufferManager = _this.require('audio-buffer-manager');
    _this.scheduler = _this.require('sync-scheduler');

    _this.midi = _this.require('midi', midiConfig);

    _this.winnersResults = winnersResults;
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

      this.midi.addListener('NOTE_ON', function (pitch, velocity, msg) {
        _this2.broadcast('player', null, 'note:on', pitch - keyboardOffset);
        console.log('NOTE_ON: ' + (pitch - keyboardOffset));
      });

      this.midi.addListener('NOTE_OFF', function (pitch, velocity, msg) {
        _this2.broadcast('player', null, 'note:off', pitch - keyboardOffset);
      });

      // defer state change to next beat
      this.sharedParams.addParamListener('global:state', function (value) {
        var syncTime = _this2.sync.getSyncTime();
        var triggerAt = syncTime + beatDuration;
        _this2.currentState = value;

        _this2.broadcast('player', null, 'global:state', triggerAt, value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiUGxheWVyRXhwZXJpZW5jZSIsImNsaWVudFR5cGUiLCJtaWRpQ29uZmlnIiwid2lubmVyc1Jlc3VsdHMiLCJjaGVja2luIiwicmVxdWlyZSIsInNoYXJlZENvbmZpZyIsInNoYXJlZFBhcmFtcyIsInN5bmMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJzY2hlZHVsZXIiLCJtaWRpIiwiY3VycmVudFN0YXRlIiwia2V5Ym9hcmRPZmZzZXQiLCJnZXQiLCJCUE0iLCJiZWF0RHVyYXRpb24iLCJhZGRMaXN0ZW5lciIsInBpdGNoIiwidmVsb2NpdHkiLCJtc2ciLCJicm9hZGNhc3QiLCJjb25zb2xlIiwibG9nIiwiYWRkUGFyYW1MaXN0ZW5lciIsInZhbHVlIiwic3luY1RpbWUiLCJnZXRTeW5jVGltZSIsInRyaWdnZXJBdCIsImNsaWVudCIsInJlY2VpdmUiLCJzZW5kIiwidXBkYXRlIiwiY2xpZW50cyIsImxlbmd0aCIsInNldFRpbWVvdXQiLCJFeHBlcmllbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBO0lBQ3FCQSxnQjs7O0FBQ25CLDRCQUFZQyxVQUFaLEVBQXdCQyxVQUF4QixFQUFvQ0MsY0FBcEMsRUFBb0Q7QUFBQTs7QUFBQSwwSkFDNUNGLFVBRDRDOztBQUdsRCxVQUFLRyxPQUFMLEdBQWUsTUFBS0MsT0FBTCxDQUFhLFNBQWIsQ0FBZjtBQUNBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0QsT0FBTCxDQUFhLGVBQWIsQ0FBcEI7QUFDQSxVQUFLRSxZQUFMLEdBQW9CLE1BQUtGLE9BQUwsQ0FBYSxlQUFiLENBQXBCO0FBQ0EsVUFBS0csSUFBTCxHQUFZLE1BQUtILE9BQUwsQ0FBYSxNQUFiLENBQVo7O0FBRUEsVUFBS0ksa0JBQUwsR0FBMEIsTUFBS0osT0FBTCxDQUFhLHNCQUFiLENBQTFCO0FBQ0EsVUFBS0ssU0FBTCxHQUFpQixNQUFLTCxPQUFMLENBQWEsZ0JBQWIsQ0FBakI7O0FBRUEsVUFBS00sSUFBTCxHQUFZLE1BQUtOLE9BQUwsQ0FBYSxNQUFiLEVBQXFCSCxVQUFyQixDQUFaOztBQUVBLFVBQUtDLGNBQUwsR0FBc0JBLGNBQXRCO0FBQ0EsVUFBS1MsWUFBTCxHQUFvQixJQUFwQjtBQWRrRDtBQWVuRDs7Ozs0QkFFTztBQUFBOztBQUNOLFVBQU1DLGlCQUFpQixLQUFLUCxZQUFMLENBQWtCUSxHQUFsQixDQUFzQixnQkFBdEIsQ0FBdkI7QUFDQSxVQUFNQyxNQUFNLEtBQUtULFlBQUwsQ0FBa0JRLEdBQWxCLENBQXNCLEtBQXRCLENBQVo7QUFDQSxVQUFNRSxlQUFlLEtBQUtELEdBQTFCOztBQUVBLFdBQUtKLElBQUwsQ0FBVU0sV0FBVixDQUFzQixTQUF0QixFQUFpQyxVQUFDQyxLQUFELEVBQVFDLFFBQVIsRUFBa0JDLEdBQWxCLEVBQTBCO0FBQ3pELGVBQUtDLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLElBQXpCLEVBQStCLFNBQS9CLEVBQTBDSCxRQUFRTCxjQUFsRDtBQUNBUyxnQkFBUUMsR0FBUixDQUFZLGVBQWVMLFFBQVFMLGNBQXZCLENBQVo7QUFDRCxPQUhEOztBQUtBLFdBQUtGLElBQUwsQ0FBVU0sV0FBVixDQUFzQixVQUF0QixFQUFrQyxVQUFDQyxLQUFELEVBQVFDLFFBQVIsRUFBa0JDLEdBQWxCLEVBQTBCO0FBQzFELGVBQUtDLFNBQUwsQ0FBZSxRQUFmLEVBQXlCLElBQXpCLEVBQStCLFVBQS9CLEVBQTJDSCxRQUFRTCxjQUFuRDtBQUNELE9BRkQ7O0FBSUE7QUFDQSxXQUFLTixZQUFMLENBQWtCaUIsZ0JBQWxCLENBQW1DLGNBQW5DLEVBQW1ELFVBQUNDLEtBQUQsRUFBVztBQUM1RCxZQUFNQyxXQUFZLE9BQUtsQixJQUFMLENBQVVtQixXQUFWLEVBQWxCO0FBQ0EsWUFBTUMsWUFBWUYsV0FBV1YsWUFBN0I7QUFDQSxlQUFLSixZQUFMLEdBQW9CYSxLQUFwQjs7QUFFQSxlQUFLSixTQUFMLENBQWUsUUFBZixFQUF5QixJQUF6QixFQUErQixjQUEvQixFQUErQ08sU0FBL0MsRUFBMERILEtBQTFEO0FBQ0QsT0FORDtBQU9EOzs7MEJBRUtJLE0sRUFBUTtBQUFBOztBQUNaLHNKQUFZQSxNQUFaOztBQUVBO0FBQ0EsV0FBS0MsT0FBTCxDQUFhRCxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDLFlBQU07QUFDekMsZUFBS0UsSUFBTCxDQUFVRixNQUFWLEVBQWtCLGNBQWxCLEVBQWtDLE9BQUsxQixjQUF2QztBQUNELE9BRkQ7O0FBSUEsV0FBS0ksWUFBTCxDQUFrQnlCLE1BQWxCLENBQXlCLFlBQXpCLEVBQXVDLEtBQUtDLE9BQUwsQ0FBYUMsTUFBcEQ7O0FBRUE7QUFDQUMsaUJBQVcsWUFBTTtBQUNmLGVBQUtKLElBQUwsQ0FBVUYsTUFBVixFQUFrQixjQUFsQixFQUFrQyxJQUFsQyxFQUF3QyxPQUFLakIsWUFBN0M7QUFDRCxPQUZELEVBRUcsR0FGSDtBQUdEOzs7eUJBRUlpQixNLEVBQVE7QUFDWCxxSkFBV0EsTUFBWDs7QUFFQSxXQUFLdEIsWUFBTCxDQUFrQnlCLE1BQWxCLENBQXlCLFlBQXpCLEVBQXVDLEtBQUtDLE9BQUwsQ0FBYUMsTUFBcEQ7QUFDRDs7O0VBOUQyQ0Usa0I7O2tCQUF6QnBDLGdCIiwiZmlsZSI6IlBsYXllckV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHBlcmllbmNlIH0gZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuXG4vLyBzZXJ2ZXItc2lkZSAncGxheWVyJyBleHBlcmllbmNlLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyRXhwZXJpZW5jZSBleHRlbmRzIEV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBtaWRpQ29uZmlnLCB3aW5uZXJzUmVzdWx0cykge1xuICAgIHN1cGVyKGNsaWVudFR5cGUpO1xuXG4gICAgdGhpcy5jaGVja2luID0gdGhpcy5yZXF1aXJlKCdjaGVja2luJyk7XG4gICAgdGhpcy5zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgICB0aGlzLnNoYXJlZFBhcmFtcyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLXBhcmFtcycpO1xuICAgIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJyk7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSB0aGlzLnJlcXVpcmUoJ3N5bmMtc2NoZWR1bGVyJyk7XG5cbiAgICB0aGlzLm1pZGkgPSB0aGlzLnJlcXVpcmUoJ21pZGknLCBtaWRpQ29uZmlnKTtcblxuICAgIHRoaXMud2lubmVyc1Jlc3VsdHMgPSB3aW5uZXJzUmVzdWx0cztcbiAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IG51bGw7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBrZXlib2FyZE9mZnNldCA9IHRoaXMuc2hhcmVkQ29uZmlnLmdldCgna2V5Ym9hcmRPZmZzZXQnKTtcbiAgICBjb25zdCBCUE0gPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ0JQTScpO1xuICAgIGNvbnN0IGJlYXREdXJhdGlvbiA9IDYwIC8gQlBNO1xuXG4gICAgdGhpcy5taWRpLmFkZExpc3RlbmVyKCdOT1RFX09OJywgKHBpdGNoLCB2ZWxvY2l0eSwgbXNnKSA9PiB7XG4gICAgICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ25vdGU6b24nLCBwaXRjaCAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICAgIGNvbnNvbGUubG9nKCdOT1RFX09OOiAnICsgKHBpdGNoIC0ga2V5Ym9hcmRPZmZzZXQpKTtcbiAgICB9KTtcblxuICAgIHRoaXMubWlkaS5hZGRMaXN0ZW5lcignTk9URV9PRkYnLCAocGl0Y2gsIHZlbG9jaXR5LCBtc2cpID0+IHtcbiAgICAgIHRoaXMuYnJvYWRjYXN0KCdwbGF5ZXInLCBudWxsLCAnbm90ZTpvZmYnLCBwaXRjaCAtIGtleWJvYXJkT2Zmc2V0KTtcbiAgICB9KTtcblxuICAgIC8vIGRlZmVyIHN0YXRlIGNoYW5nZSB0byBuZXh0IGJlYXRcbiAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdnbG9iYWw6c3RhdGUnLCAodmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IHN5bmNUaW1lID0gIHRoaXMuc3luYy5nZXRTeW5jVGltZSgpO1xuICAgICAgY29uc3QgdHJpZ2dlckF0ID0gc3luY1RpbWUgKyBiZWF0RHVyYXRpb247XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHZhbHVlO1xuXG4gICAgICB0aGlzLmJyb2FkY2FzdCgncGxheWVyJywgbnVsbCwgJ2dsb2JhbDpzdGF0ZScsIHRyaWdnZXJBdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgc3VwZXIuZW50ZXIoY2xpZW50KTtcblxuICAgIC8vIGV2ZXJ5dGhpbmcgaXMgZmFrZWQgbm93XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3BsYXllcjpzY29yZScsICgpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdnbG9iYWw6c2NvcmUnLCB0aGlzLndpbm5lcnNSZXN1bHRzKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuXG4gICAgLy8gdWdseSBoYWNrLi4uXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZ2xvYmFsOnN0YXRlJywgbnVsbCwgdGhpcy5jdXJyZW50U3RhdGUpO1xuICAgIH0sIDEwMCk7XG4gIH1cblxuICBleGl0KGNsaWVudCkge1xuICAgIHN1cGVyLmV4aXQoY2xpZW50KTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICB9XG59XG4iXX0=