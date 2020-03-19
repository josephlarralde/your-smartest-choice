'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _client = require('soundworks/client');

var _SampleSynth = require('./SampleSynth');

var _SampleSynth2 = _interopRequireDefault(_SampleSynth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = _client.audio.audioContext;

var SharedSynth = function () {
  function SharedSynth(config, buffers, groupFilter, output) {
    var _this = this;

    (0, _classCallCheck3.default)(this, SharedSynth);

    this.groupFilter = groupFilter; // zone filter service
    this.output = output;

    this.pitchConfigMap = new _map2.default();
    this.configSynthMap = new _map2.default();
    this.activeConfigs = new _set2.default();

    this._currentSynth = null;
    this._currentConfig = null;

    config.forEach(function (conf, index) {
      conf.buffer = buffers[index];

      var pitch = conf.midiKey;
      var synth = new _SampleSynth2.default(conf);
      synth.connect(_this.output);

      _this.pitchConfigMap.set(pitch, conf);
      _this.configSynthMap.set(conf, synth);
    });

    this.updateGroup = this.updateGroup.bind(this);
  }

  (0, _createClass3.default)(SharedSynth, [{
    key: 'updateGroup',
    value: function updateGroup(group) {
      if (this._currentConfig && this._currentConfig.group !== 'all') this._stop();else if (this._currentConfig && this._currentConfig.group === 'all') return this._currentConfig;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.activeConfigs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var config = _step.value;

          if (config.group === group || config.group === 'all') {
            this._start(config);
            return config;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }
  }, {
    key: 'noteOn',
    value: function noteOn(pitch) {
      var config = this.pitchConfigMap.get(pitch);

      if (config) {
        this.activeConfigs.add(config);

        if (this.groupFilter.test(config.group) || config.group === 'all') {
          this._stop();
          this._start(config);
          return config;
        }
      }

      return null;
    }
  }, {
    key: 'noteOff',
    value: function noteOff(pitch) {
      var config = this.pitchConfigMap.get(pitch);

      if (config) {
        this.activeConfigs.delete(config);
        this._stop();
        return config;
      }

      return null;
    }
  }, {
    key: '_start',
    value: function _start(config) {
      var synth = this.configSynthMap.get(config);
      synth.start(audioContext.currentTime);

      this._currentSynth = synth;
      this._currentConfig = config;
    }
  }, {
    key: '_stop',
    value: function _stop() {
      if (this._currentSynth !== null) {
        this._currentSynth.stop(audioContext.currentTime);
        this._currentSynth = null;
        this._currentConfig = null;
      }
    }
  }]);
  return SharedSynth;
}();

exports.default = SharedSynth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFN5bnRoLmpzIl0sIm5hbWVzIjpbImF1ZGlvQ29udGV4dCIsImF1ZGlvIiwiU2hhcmVkU3ludGgiLCJjb25maWciLCJidWZmZXJzIiwiZ3JvdXBGaWx0ZXIiLCJvdXRwdXQiLCJwaXRjaENvbmZpZ01hcCIsImNvbmZpZ1N5bnRoTWFwIiwiYWN0aXZlQ29uZmlncyIsIl9jdXJyZW50U3ludGgiLCJfY3VycmVudENvbmZpZyIsImZvckVhY2giLCJjb25mIiwiaW5kZXgiLCJidWZmZXIiLCJwaXRjaCIsIm1pZGlLZXkiLCJzeW50aCIsIlNhbXBsZVN5bnRoIiwiY29ubmVjdCIsInNldCIsInVwZGF0ZUdyb3VwIiwiYmluZCIsImdyb3VwIiwiX3N0b3AiLCJfc3RhcnQiLCJnZXQiLCJhZGQiLCJ0ZXN0IiwiZGVsZXRlIiwic3RhcnQiLCJjdXJyZW50VGltZSIsInN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGVBQWVDLGNBQU1ELFlBQTNCOztJQUVNRSxXO0FBQ0osdUJBQVlDLE1BQVosRUFBb0JDLE9BQXBCLEVBQTZCQyxXQUE3QixFQUEwQ0MsTUFBMUMsRUFBa0Q7QUFBQTs7QUFBQTs7QUFDaEQsU0FBS0QsV0FBTCxHQUFtQkEsV0FBbkIsQ0FEZ0QsQ0FDaEI7QUFDaEMsU0FBS0MsTUFBTCxHQUFjQSxNQUFkOztBQUVBLFNBQUtDLGNBQUwsR0FBc0IsbUJBQXRCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixtQkFBdEI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLG1CQUFyQjs7QUFFQSxTQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixJQUF0Qjs7QUFFQVIsV0FBT1MsT0FBUCxDQUFlLFVBQUNDLElBQUQsRUFBT0MsS0FBUCxFQUFpQjtBQUM5QkQsV0FBS0UsTUFBTCxHQUFjWCxRQUFRVSxLQUFSLENBQWQ7O0FBRUEsVUFBTUUsUUFBUUgsS0FBS0ksT0FBbkI7QUFDQSxVQUFNQyxRQUFRLElBQUlDLHFCQUFKLENBQWdCTixJQUFoQixDQUFkO0FBQ0FLLFlBQU1FLE9BQU4sQ0FBYyxNQUFLZCxNQUFuQjs7QUFFQSxZQUFLQyxjQUFMLENBQW9CYyxHQUFwQixDQUF3QkwsS0FBeEIsRUFBK0JILElBQS9CO0FBQ0EsWUFBS0wsY0FBTCxDQUFvQmEsR0FBcEIsQ0FBd0JSLElBQXhCLEVBQThCSyxLQUE5QjtBQUNELEtBVEQ7O0FBV0EsU0FBS0ksV0FBTCxHQUFtQixLQUFLQSxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNEOzs7O2dDQUVXQyxLLEVBQU87QUFDakIsVUFBSSxLQUFLYixjQUFMLElBQXVCLEtBQUtBLGNBQUwsQ0FBb0JhLEtBQXBCLEtBQThCLEtBQXpELEVBQ0UsS0FBS0MsS0FBTCxHQURGLEtBRUssSUFBSSxLQUFLZCxjQUFMLElBQXVCLEtBQUtBLGNBQUwsQ0FBb0JhLEtBQXBCLEtBQThCLEtBQXpELEVBQ0gsT0FBTyxLQUFLYixjQUFaOztBQUplO0FBQUE7QUFBQTs7QUFBQTtBQU1qQix3REFBbUIsS0FBS0YsYUFBeEIsNEdBQXVDO0FBQUEsY0FBOUJOLE1BQThCOztBQUNyQyxjQUFJQSxPQUFPcUIsS0FBUCxLQUFpQkEsS0FBakIsSUFBMkJyQixPQUFPcUIsS0FBUCxLQUFpQixLQUFoRCxFQUF1RDtBQUNyRCxpQkFBS0UsTUFBTCxDQUFZdkIsTUFBWjtBQUNBLG1CQUFPQSxNQUFQO0FBQ0Q7QUFDRjtBQVhnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWFqQixhQUFPLElBQVA7QUFDRDs7OzJCQUVNYSxLLEVBQU87QUFDWixVQUFNYixTQUFTLEtBQUtJLGNBQUwsQ0FBb0JvQixHQUFwQixDQUF3QlgsS0FBeEIsQ0FBZjs7QUFFQSxVQUFJYixNQUFKLEVBQVk7QUFDVixhQUFLTSxhQUFMLENBQW1CbUIsR0FBbkIsQ0FBdUJ6QixNQUF2Qjs7QUFFQSxZQUFJLEtBQUtFLFdBQUwsQ0FBaUJ3QixJQUFqQixDQUFzQjFCLE9BQU9xQixLQUE3QixLQUF1Q3JCLE9BQU9xQixLQUFQLEtBQWlCLEtBQTVELEVBQW1FO0FBQ2pFLGVBQUtDLEtBQUw7QUFDQSxlQUFLQyxNQUFMLENBQVl2QixNQUFaO0FBQ0EsaUJBQU9BLE1BQVA7QUFDRDtBQUNGOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7NEJBRU9hLEssRUFBTztBQUNiLFVBQU1iLFNBQVMsS0FBS0ksY0FBTCxDQUFvQm9CLEdBQXBCLENBQXdCWCxLQUF4QixDQUFmOztBQUVBLFVBQUliLE1BQUosRUFBWTtBQUNWLGFBQUtNLGFBQUwsQ0FBbUJxQixNQUFuQixDQUEwQjNCLE1BQTFCO0FBQ0EsYUFBS3NCLEtBQUw7QUFDQSxlQUFPdEIsTUFBUDtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7MkJBRU1BLE0sRUFBUTtBQUNiLFVBQU1lLFFBQVEsS0FBS1YsY0FBTCxDQUFvQm1CLEdBQXBCLENBQXdCeEIsTUFBeEIsQ0FBZDtBQUNBZSxZQUFNYSxLQUFOLENBQVkvQixhQUFhZ0MsV0FBekI7O0FBRUEsV0FBS3RCLGFBQUwsR0FBcUJRLEtBQXJCO0FBQ0EsV0FBS1AsY0FBTCxHQUFzQlIsTUFBdEI7QUFDRDs7OzRCQUVPO0FBQ04sVUFBSSxLQUFLTyxhQUFMLEtBQXVCLElBQTNCLEVBQWlDO0FBQy9CLGFBQUtBLGFBQUwsQ0FBbUJ1QixJQUFuQixDQUF3QmpDLGFBQWFnQyxXQUFyQztBQUNBLGFBQUt0QixhQUFMLEdBQXFCLElBQXJCO0FBQ0EsYUFBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBQ0Y7Ozs7O2tCQUdZVCxXIiwiZmlsZSI6IlNoYXJlZFN5bnRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW8gfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgU2FtcGxlU3ludGggZnJvbSAnLi9TYW1wbGVTeW50aCc7XG5cbmNvbnN0IGF1ZGlvQ29udGV4dCA9IGF1ZGlvLmF1ZGlvQ29udGV4dDtcblxuY2xhc3MgU2hhcmVkU3ludGgge1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIGJ1ZmZlcnMsIGdyb3VwRmlsdGVyLCBvdXRwdXQpIHtcbiAgICB0aGlzLmdyb3VwRmlsdGVyID0gZ3JvdXBGaWx0ZXI7IC8vIHpvbmUgZmlsdGVyIHNlcnZpY2VcbiAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcblxuICAgIHRoaXMucGl0Y2hDb25maWdNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5jb25maWdTeW50aE1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MgPSBuZXcgU2V0KCk7XG5cbiAgICB0aGlzLl9jdXJyZW50U3ludGggPSBudWxsO1xuICAgIHRoaXMuX2N1cnJlbnRDb25maWcgPSBudWxsO1xuXG4gICAgY29uZmlnLmZvckVhY2goKGNvbmYsIGluZGV4KSA9PiB7XG4gICAgICBjb25mLmJ1ZmZlciA9IGJ1ZmZlcnNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBwaXRjaCA9IGNvbmYubWlkaUtleTtcbiAgICAgIGNvbnN0IHN5bnRoID0gbmV3IFNhbXBsZVN5bnRoKGNvbmYpO1xuICAgICAgc3ludGguY29ubmVjdCh0aGlzLm91dHB1dCk7XG5cbiAgICAgIHRoaXMucGl0Y2hDb25maWdNYXAuc2V0KHBpdGNoLCBjb25mKTtcbiAgICAgIHRoaXMuY29uZmlnU3ludGhNYXAuc2V0KGNvbmYsIHN5bnRoKTtcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlR3JvdXAgPSB0aGlzLnVwZGF0ZUdyb3VwLmJpbmQodGhpcyk7XG4gIH1cblxuICB1cGRhdGVHcm91cChncm91cCkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50Q29uZmlnICYmIHRoaXMuX2N1cnJlbnRDb25maWcuZ3JvdXAgIT09ICdhbGwnKVxuICAgICAgdGhpcy5fc3RvcCgpO1xuICAgIGVsc2UgaWYgKHRoaXMuX2N1cnJlbnRDb25maWcgJiYgdGhpcy5fY3VycmVudENvbmZpZy5ncm91cCA9PT0gJ2FsbCcpXG4gICAgICByZXR1cm4gdGhpcy5fY3VycmVudENvbmZpZztcblxuICAgIGZvciAobGV0IGNvbmZpZyBvZiB0aGlzLmFjdGl2ZUNvbmZpZ3MpIHtcbiAgICAgIGlmIChjb25maWcuZ3JvdXAgPT09IGdyb3VwIHx8ICBjb25maWcuZ3JvdXAgPT09ICdhbGwnKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0KGNvbmZpZyk7XG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBub3RlT24ocGl0Y2gpIHtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnBpdGNoQ29uZmlnTWFwLmdldChwaXRjaCk7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MuYWRkKGNvbmZpZyk7XG5cbiAgICAgIGlmICh0aGlzLmdyb3VwRmlsdGVyLnRlc3QoY29uZmlnLmdyb3VwKSB8fCBjb25maWcuZ3JvdXAgPT09ICdhbGwnKSB7XG4gICAgICAgIHRoaXMuX3N0b3AoKTtcbiAgICAgICAgdGhpcy5fc3RhcnQoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG5vdGVPZmYocGl0Y2gpIHtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnBpdGNoQ29uZmlnTWFwLmdldChwaXRjaCk7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MuZGVsZXRlKGNvbmZpZyk7XG4gICAgICB0aGlzLl9zdG9wKCk7XG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgX3N0YXJ0KGNvbmZpZykge1xuICAgIGNvbnN0IHN5bnRoID0gdGhpcy5jb25maWdTeW50aE1hcC5nZXQoY29uZmlnKTtcbiAgICBzeW50aC5zdGFydChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuXG4gICAgdGhpcy5fY3VycmVudFN5bnRoID0gc3ludGg7XG4gICAgdGhpcy5fY3VycmVudENvbmZpZyA9IGNvbmZpZztcbiAgfVxuXG4gIF9zdG9wKCkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50U3ludGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRTeW50aC5zdG9wKGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgICB0aGlzLl9jdXJyZW50U3ludGggPSBudWxsO1xuICAgICAgdGhpcy5fY3VycmVudENvbmZpZyA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZFN5bnRoO1xuIl19