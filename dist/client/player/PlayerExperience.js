'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _client = require('soundworks/client');

var soundworks = _interopRequireWildcard(_client);

var _SharedSynth = require('./audio/SharedSynth');

var _SharedSynth2 = _interopRequireDefault(_SharedSynth);

var _SharedVisuals = require('./renderers/SharedVisuals');

var _SharedVisuals2 = _interopRequireDefault(_SharedVisuals);

var _spriteConfig = require('../../../data/sprite-config.json');

var _spriteConfig2 = _interopRequireDefault(_spriteConfig);

var _sharedVisualsConfig = require('../../../data/shared-visuals-config.json');

var _sharedVisualsConfig2 = _interopRequireDefault(_sharedVisualsConfig);

var _sharedSynthConfig = require('../../../data/shared-synth-config.json');

var _sharedSynthConfig2 = _interopRequireDefault(_sharedSynthConfig);

var _areaConfig = require('../../../data/area-config.json');

var _areaConfig2 = _interopRequireDefault(_areaConfig);

var _killTheBalloonsConfig = require('../../../data/kill-the-balloons-config.json');

var _killTheBalloonsConfig2 = _interopRequireDefault(_killTheBalloonsConfig);

var _avoidTheRainConfig = require('../../../data/avoid-the-rain-config.json');

var _avoidTheRainConfig2 = _interopRequireDefault(_avoidTheRainConfig);

var _WaitState = require('./states/WaitState');

var _WaitState2 = _interopRequireDefault(_WaitState);

var _CompassState = require('./states/CompassState');

var _CompassState2 = _interopRequireDefault(_CompassState);

var _BalloonsCoverState = require('./states/BalloonsCoverState');

var _BalloonsCoverState2 = _interopRequireDefault(_BalloonsCoverState);

var _KillTheBalloonsState = require('./states/KillTheBalloonsState');

var _KillTheBalloonsState2 = _interopRequireDefault(_KillTheBalloonsState);

var _IntermezzoState = require('./states/IntermezzoState');

var _IntermezzoState2 = _interopRequireDefault(_IntermezzoState);

var _AvoidTheRainState = require('./states/AvoidTheRainState');

var _AvoidTheRainState2 = _interopRequireDefault(_AvoidTheRainState);

var _ScoresState = require('./states/ScoresState');

var _ScoresState2 = _interopRequireDefault(_ScoresState);

var _EndState = require('./states/EndState');

var _EndState2 = _interopRequireDefault(_EndState);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// states


// config
var audioContext = soundworks.audioContext;
var client = soundworks.client;

var states = {
  wait: _WaitState2.default,
  compass: _CompassState2.default,
  balloonsCover: _BalloonsCoverState2.default,
  killTheBalloons: _KillTheBalloonsState2.default,
  intermezzo: _IntermezzoState2.default,
  avoidTheRain: _AvoidTheRainState2.default,
  scores: _ScoresState2.default,
  end: _EndState2.default
};

var globalState = {
  score: { red: 0, blue: 0, pink: 0, yellow: 0 }
};

var viewTemplate = '\n  <canvas class="background"></canvas>\n  <div id="shared-visual-container" class="background"></div>\n  <div id="state-container" class="foreground"></div>\n';

var PlayerView = function (_soundworks$CanvasVie) {
  (0, _inherits3.default)(PlayerView, _soundworks$CanvasVie);

  function PlayerView() {
    (0, _classCallCheck3.default)(this, PlayerView);
    return (0, _possibleConstructorReturn3.default)(this, (PlayerView.__proto__ || (0, _getPrototypeOf2.default)(PlayerView)).apply(this, arguments));
  }

  (0, _createClass3.default)(PlayerView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)(PlayerView.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerView.prototype), 'onRender', this).call(this);

      this.$stateContainer = this.$el.querySelector('#state-container');
      this.$sharedVisualContainer = this.$el.querySelector('#shared-visual-container');
    }
  }, {
    key: 'onResize',
    value: function onResize(width, height, orientation) {
      (0, _get3.default)(PlayerView.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerView.prototype), 'onResize', this).call(this, width, height, orientation);

      this.$sharedVisualContainer.style.width = width + 'px';
      this.$sharedVisualContainer.style.height = height + 'px';
    }
  }, {
    key: 'showSharedVisual',
    value: function showSharedVisual(path) {
      var $container = this.$sharedVisualContainer;
      $container.style.backgroundImage = 'url(' + path + ')';
      $container.style.backgroundRepeat = 'no-repeat';
      $container.style.backgroundPosition = '50% 50%';
      $container.style.backgroundSize = 'contain';

      // force re-rendering for iOS
      $container.style.width = '0px';
      var width = this.viewportWidth + 'px';
      setTimeout(function () {
        return $container.style.width = width;
      }, 0);
    }
  }, {
    key: 'hideSharedVisual',
    value: function hideSharedVisual() {
      // if (this.$sharedVisualContainer)
      this.$sharedVisualContainer.style.backgroundImage = '';
    }
  }, {
    key: 'getStateContainer',
    value: function getStateContainer() {
      return this.$stateContainer;
    }
  }]);
  return PlayerView;
}(soundworks.CanvasView);

var PlayerExperience = function (_soundworks$Experienc) {
  (0, _inherits3.default)(PlayerExperience, _soundworks$Experienc);

  function PlayerExperience(assetsDomain) {
    (0, _classCallCheck3.default)(this, PlayerExperience);

    // configurations
    var _this2 = (0, _possibleConstructorReturn3.default)(this, (PlayerExperience.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience)).call(this));

    _this2.sharedSynthConfig = _sharedSynthConfig2.default;
    _this2.sharedVisualsConfig = _sharedVisualsConfig2.default;
    _this2.spriteConfig = _spriteConfig2.default;
    _this2.areaConfig = _areaConfig2.default;
    _this2.killTheBalloonsConfig = _killTheBalloonsConfig2.default;
    _this2.avoidTheRainConfig = _avoidTheRainConfig2.default;

    // -------------------------------------------
    // prepare paths for audio files
    // -------------------------------------------

    var sharedSynthFiles = _sharedSynthConfig2.default.map(function (entry) {
      return 'sounds/shared-synth/' + entry.filename;
    });

    var killTheBalloonsFiles = _killTheBalloonsConfig2.default.files.map(function (filename) {
      return 'sounds/kill-the-balloons/' + filename;
    });

    var avoidTheRainSines = _avoidTheRainConfig2.default.sines.map(function (filename) {
      return 'sounds/avoid-the-rain/' + filename;
    });

    var avoidTheRainGlitches = _avoidTheRainConfig2.default.glitches.map(function (filename) {
      return 'sounds/avoid-the-rain/' + filename;
    });

    // -------------------------------------------

    var audioFiles = {
      'shared-synth': sharedSynthFiles,
      'kill-the-balloons': killTheBalloonsFiles,
      'avoid-the-rain:sines': avoidTheRainSines,
      'avoid-the-rain:glitches': avoidTheRainGlitches
    };

    _this2.platform = _this2.require('platform', { features: ['web-audio', 'device-sensor'] });

    _this2.checkin = _this2.require('checkin', { showDialog: false });
    _this2.audioBufferManager = _this2.require('audio-buffer-manager', {
      assetsDomain: assetsDomain,
      files: audioFiles
    });

    _this2.groupFilter = _this2.require('group-filter', {
      directions: _areaConfig2.default.directions
    });

    // load here instead of platform
    _this2.imageManager = _this2.require('image-manager', {
      files: (0, _assign2.default)({}, {
        'sprite:blue': _this2.spriteConfig.groups.blue.file,
        'sprite:pink': _this2.spriteConfig.groups.pink.file,
        'sprite:yellow': _this2.spriteConfig.groups.yellow.file,
        'sprite:red': _this2.spriteConfig.groups.red.file
      }, _this2.sharedVisualsConfig)
    });

    _this2.sharedParams = _this2.require('shared-params');
    _this2.sync = _this2.require('sync');
    _this2.scheduler = _this2.require('sync-scheduler');

    _this2._setState = _this2._setState.bind(_this2);
    // this._onAcceleration = this._onAcceleration.bind(this);
    _this2._onCompassUpdate = _this2._onCompassUpdate.bind(_this2);
    _this2._setVolume = _this2._setVolume.bind(_this2);
    _this2._onSharedVisualTrigger = _this2._onSharedVisualTrigger.bind(_this2);

    _this2._accelerationListeners = new _set2.default();
    _this2._compassListeners = {};
    return _this2;
  }

  (0, _createClass3.default)(PlayerExperience, [{
    key: 'start',
    value: function start() {
      var _this3 = this;

      (0, _get3.default)(PlayerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience.prototype), 'start', this).call(this);

      // populate spriteConfig with the sprite images
      this.spriteConfig.groups.blue.image = this.imageManager.getAsCanvas('sprite:blue');
      this.spriteConfig.groups.pink.image = this.imageManager.getAsCanvas('sprite:pink');
      this.spriteConfig.groups.yellow.image = this.imageManager.getAsCanvas('sprite:yellow');
      this.spriteConfig.groups.red.image = this.imageManager.getAsCanvas('sprite:red');

      this.spriteConfig.groups.blue.halfSizeImage = this.imageManager.getAsHalfSizeCanvas('sprite:blue');
      this.spriteConfig.groups.pink.halfSizeImage = this.imageManager.getAsHalfSizeCanvas('sprite:pink');
      this.spriteConfig.groups.yellow.halfSizeImage = this.imageManager.getAsHalfSizeCanvas('sprite:yellow');
      this.spriteConfig.groups.red.halfSizeImage = this.imageManager.getAsHalfSizeCanvas('sprite:red');

      this.spriteConfig.colors = (0, _keys2.default)(this.spriteConfig.groups);

      // initialize the view
      this.view = new PlayerView(viewTemplate, {}, {}, {
        preservePixelRatio: false,
        ratios: { '#state-container': 1 }
      });

      this.show().then(function () {
        // master audio
        _this3.master = audioContext.createGain();
        _this3.master.connect(audioContext.destination);
        _this3.master.gain.value = 1;

        // global view
        _this3.view.setPreRender(function (ctx, dt, width, height) {
          ctx.clearRect(0, 0, width, height);
        });

        // global synth and visuals (Huihui controlled)
        _this3.sharedSynth = new _SharedSynth2.default(_this3.sharedSynthConfig, _this3.audioBufferManager.get('shared-synth'), _this3.groupFilter, _this3.getAudioDestination());

        _this3.sharedVisuals = new _SharedVisuals2.default(_this3.spriteConfig.groups);

        _this3.view.addRenderer(_this3.sharedVisuals);

        // @todo - revise all this, this is far from really efficient
        _this3.receive('note:on', function (pitch) {
          var res = _this3.sharedSynth.noteOn(pitch);

          if (res !== null) _this3.sharedVisuals.trigger(res.group, res.sustained, res.duration);
        });

        _this3.receive('note:off', function (pitch) {
          var res = _this3.sharedSynth.noteOff(pitch);

          if (res !== null) _this3.sharedVisuals.stop(res.group);
        });

        _this3.addCompassListener('group', function (group) {
          var res = _this3.sharedSynth.updateGroup(group);

          if (res !== null) _this3.sharedVisuals.trigger(res.group, res.sustained, res.duration);else _this3.sharedVisuals.kill();
        });

        // state of the application
        _this3.groupFilter.startListening();
        _this3.groupFilter.addListener(_this3._onCompassUpdate);
        _this3.sharedParams.addParamListener('global:volume', _this3._setVolume);
        _this3.sharedParams.addParamListener('global:shared-visual', _this3._onSharedVisualTrigger);

        _this3.receive('global:state', function (syncTime, state) {
          _this3.scheduler.defer(function () {
            return _this3._setState(state);
          }, syncTime);
        });
      });
    }
  }, {
    key: 'getAudioDestination',
    value: function getAudioDestination() {
      return this.master;
    }
  }, {
    key: '_setVolume',
    value: function _setVolume(value) {
      this.master.gain.value = value;
    }
  }, {
    key: '_setState',
    value: function _setState(name) {
      var ctor = states[name];

      if (!ctor) throw new Error('Invalid state: "' + name + '"');

      var state = new ctor(this, globalState, client);

      if (this._state) this._state.exit();

      this.hideSharedVisual();
      this._state = state;
      this._state.enter();
      this._currentStateName = name;
    }
  }, {
    key: '_onSharedVisualTrigger',
    value: function _onSharedVisualTrigger(value) {
      if (value === 'none') this.hideSharedVisual();else this.showSharedVisual(value);
    }
  }, {
    key: 'showSharedVisual',
    value: function showSharedVisual(id) {
      var path = this.sharedVisualsConfig[id];
      this.view.showSharedVisual(path);
    }
  }, {
    key: 'hideSharedVisual',
    value: function hideSharedVisual() {
      this.view.hideSharedVisual();
    }
  }, {
    key: 'addCompassListener',
    value: function addCompassListener(channel, callback) {
      if (!this._compassListeners[channel]) this._compassListeners[channel] = new _set2.default();

      this._compassListeners[channel].add(callback);
    }
  }, {
    key: 'removeCompassListener',
    value: function removeCompassListener(channel, callback) {
      if (this._compassListeners[channel]) this._compassListeners[channel].delete(callback);
    }
  }, {
    key: '_onCompassUpdate',
    value: function _onCompassUpdate(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this._compassListeners[channel]) this._compassListeners[channel].forEach(function (callback) {
        return callback.apply(undefined, args);
      });
    }
  }]);
  return PlayerExperience;
}(soundworks.Experience);

exports.default = PlayerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvQ29udGV4dCIsImNsaWVudCIsInN0YXRlcyIsIndhaXQiLCJXYWl0U3RhdGUiLCJjb21wYXNzIiwiQ29tcGFzc1N0YXRlIiwiYmFsbG9vbnNDb3ZlciIsIkJhbGxvb25zQ292ZXJTdGF0ZSIsImtpbGxUaGVCYWxsb29ucyIsIktpbGxUaGVCYWxsb29uc1N0YXRlIiwiaW50ZXJtZXp6byIsIkludGVybWV6em9TdGF0ZSIsImF2b2lkVGhlUmFpbiIsIkF2b2lkVGhlUmFpblN0YXRlIiwic2NvcmVzIiwiU2NvcmVzU3RhdGUiLCJlbmQiLCJFbmRTdGF0ZSIsImdsb2JhbFN0YXRlIiwic2NvcmUiLCJyZWQiLCJibHVlIiwicGluayIsInllbGxvdyIsInZpZXdUZW1wbGF0ZSIsIlBsYXllclZpZXciLCIkc3RhdGVDb250YWluZXIiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiJHNoYXJlZFZpc3VhbENvbnRhaW5lciIsIndpZHRoIiwiaGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzdHlsZSIsInBhdGgiLCIkY29udGFpbmVyIiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFJlcGVhdCIsImJhY2tncm91bmRQb3NpdGlvbiIsImJhY2tncm91bmRTaXplIiwidmlld3BvcnRXaWR0aCIsInNldFRpbWVvdXQiLCJDYW52YXNWaWV3IiwiUGxheWVyRXhwZXJpZW5jZSIsImFzc2V0c0RvbWFpbiIsInNoYXJlZFN5bnRoQ29uZmlnIiwic2hhcmVkVmlzdWFsc0NvbmZpZyIsInNwcml0ZUNvbmZpZyIsImFyZWFDb25maWciLCJraWxsVGhlQmFsbG9vbnNDb25maWciLCJhdm9pZFRoZVJhaW5Db25maWciLCJzaGFyZWRTeW50aEZpbGVzIiwibWFwIiwiZW50cnkiLCJmaWxlbmFtZSIsImtpbGxUaGVCYWxsb29uc0ZpbGVzIiwiZmlsZXMiLCJhdm9pZFRoZVJhaW5TaW5lcyIsInNpbmVzIiwiYXZvaWRUaGVSYWluR2xpdGNoZXMiLCJnbGl0Y2hlcyIsImF1ZGlvRmlsZXMiLCJwbGF0Zm9ybSIsInJlcXVpcmUiLCJmZWF0dXJlcyIsImNoZWNraW4iLCJzaG93RGlhbG9nIiwiYXVkaW9CdWZmZXJNYW5hZ2VyIiwiZ3JvdXBGaWx0ZXIiLCJkaXJlY3Rpb25zIiwiaW1hZ2VNYW5hZ2VyIiwiZ3JvdXBzIiwiZmlsZSIsInNoYXJlZFBhcmFtcyIsInN5bmMiLCJzY2hlZHVsZXIiLCJfc2V0U3RhdGUiLCJiaW5kIiwiX29uQ29tcGFzc1VwZGF0ZSIsIl9zZXRWb2x1bWUiLCJfb25TaGFyZWRWaXN1YWxUcmlnZ2VyIiwiX2FjY2VsZXJhdGlvbkxpc3RlbmVycyIsIl9jb21wYXNzTGlzdGVuZXJzIiwiaW1hZ2UiLCJnZXRBc0NhbnZhcyIsImhhbGZTaXplSW1hZ2UiLCJnZXRBc0hhbGZTaXplQ2FudmFzIiwiY29sb3JzIiwidmlldyIsInByZXNlcnZlUGl4ZWxSYXRpbyIsInJhdGlvcyIsInNob3ciLCJ0aGVuIiwibWFzdGVyIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImdhaW4iLCJ2YWx1ZSIsInNldFByZVJlbmRlciIsImN0eCIsImR0IiwiY2xlYXJSZWN0Iiwic2hhcmVkU3ludGgiLCJTaGFyZWRTeW50aCIsImdldCIsImdldEF1ZGlvRGVzdGluYXRpb24iLCJzaGFyZWRWaXN1YWxzIiwiU2hhcmVkVmlzdWFscyIsImFkZFJlbmRlcmVyIiwicmVjZWl2ZSIsInBpdGNoIiwicmVzIiwibm90ZU9uIiwidHJpZ2dlciIsImdyb3VwIiwic3VzdGFpbmVkIiwiZHVyYXRpb24iLCJub3RlT2ZmIiwic3RvcCIsImFkZENvbXBhc3NMaXN0ZW5lciIsInVwZGF0ZUdyb3VwIiwia2lsbCIsInN0YXJ0TGlzdGVuaW5nIiwiYWRkTGlzdGVuZXIiLCJhZGRQYXJhbUxpc3RlbmVyIiwic3luY1RpbWUiLCJzdGF0ZSIsImRlZmVyIiwibmFtZSIsImN0b3IiLCJFcnJvciIsIl9zdGF0ZSIsImV4aXQiLCJoaWRlU2hhcmVkVmlzdWFsIiwiZW50ZXIiLCJfY3VycmVudFN0YXRlTmFtZSIsInNob3dTaGFyZWRWaXN1YWwiLCJpZCIsImNoYW5uZWwiLCJjYWxsYmFjayIsImFkZCIsImRlbGV0ZSIsImFyZ3MiLCJmb3JFYWNoIiwiRXhwZXJpZW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLFU7O0FBQ1o7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBUkE7OztBQVJBO0FBa0JBLElBQU1DLGVBQWVELFdBQVdDLFlBQWhDO0FBQ0EsSUFBTUMsU0FBU0YsV0FBV0UsTUFBMUI7O0FBRUEsSUFBTUMsU0FBUztBQUNiQyxRQUFNQyxtQkFETztBQUViQyxXQUFTQyxzQkFGSTtBQUdiQyxpQkFBZUMsNEJBSEY7QUFJYkMsbUJBQWlCQyw4QkFKSjtBQUtiQyxjQUFZQyx5QkFMQztBQU1iQyxnQkFBY0MsMkJBTkQ7QUFPYkMsVUFBUUMscUJBUEs7QUFRYkMsT0FBS0M7QUFSUSxDQUFmOztBQVdBLElBQU1DLGNBQWM7QUFDbEJDLFNBQU8sRUFBRUMsS0FBSyxDQUFQLEVBQVVDLE1BQU0sQ0FBaEIsRUFBbUJDLE1BQU0sQ0FBekIsRUFBNEJDLFFBQVEsQ0FBcEM7QUFEVyxDQUFwQjs7QUFJQSxJQUFNQyxpTEFBTjs7SUFNTUMsVTs7Ozs7Ozs7OzsrQkFDTztBQUNUOztBQUVBLFdBQUtDLGVBQUwsR0FBdUIsS0FBS0MsR0FBTCxDQUFTQyxhQUFULENBQXVCLGtCQUF2QixDQUF2QjtBQUNBLFdBQUtDLHNCQUFMLEdBQThCLEtBQUtGLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QiwwQkFBdkIsQ0FBOUI7QUFDRDs7OzZCQUVRRSxLLEVBQU9DLE0sRUFBUUMs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LE9BQXZCLElBQWtDLG1CQUFsQzs7QUFFRixXQUFLekQsaUJBQUwsQ0FBdUJ5RCxPQUF2QixFQUFnQ0UsR0FBaEMsQ0FBb0NELFFBQXBDO0FBQ0Q7OzswQ0FFcUJELE8sRUFBU0MsUSxFQUFVO0FBQ3ZDLFVBQUksS0FBSzFELGlCQUFMLENBQXVCeUQsT0FBdkIsQ0FBSixFQUNFLEtBQUt6RCxpQkFBTCxDQUF1QnlELE9BQXZCLEVBQWdDRyxNQUFoQyxDQUF1Q0YsUUFBdkM7QUFDSDs7O3FDQUVnQkQsTyxFQUFrQjtBQUFBLHdDQUFOSSxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFDakMsVUFBSSxLQUFLN0QsaUJBQUwsQ0FBdUJ5RCxPQUF2QixDQUFKLEVBQ0UsS0FBS3pELGlCQUFMLENBQXVCeUQsT0FBdkIsRUFBZ0NLLE9BQWhDLENBQXdDO0FBQUEsZUFBWUosMEJBQVlHLElBQVosQ0FBWjtBQUFBLE9BQXhDO0FBQ0g7OztFQXRONEJqSixXQUFXbUosVTs7a0JBeU4zQnRHLGdCIiwiZmlsZSI6IlBsYXllckV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBTaGFyZWRTeW50aCBmcm9tICcuL2F1ZGlvL1NoYXJlZFN5bnRoJztcbmltcG9ydCBTaGFyZWRWaXN1YWxzIGZyb20gJy4vcmVuZGVyZXJzL1NoYXJlZFZpc3VhbHMnO1xuXG4vLyBjb25maWdcbmltcG9ydCBzcHJpdGVDb25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9zcHJpdGUtY29uZmlnLmpzb24nO1xuaW1wb3J0IHNoYXJlZFZpc3VhbHNDb25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9zaGFyZWQtdmlzdWFscy1jb25maWcuanNvbic7XG5pbXBvcnQgc2hhcmVkU3ludGhDb25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9zaGFyZWQtc3ludGgtY29uZmlnLmpzb24nO1xuaW1wb3J0IGFyZWFDb25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9hcmVhLWNvbmZpZy5qc29uJztcbmltcG9ydCBraWxsVGhlQmFsbG9vbnNDb25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9raWxsLXRoZS1iYWxsb29ucy1jb25maWcuanNvbic7XG5pbXBvcnQgYXZvaWRUaGVSYWluQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEvYXZvaWQtdGhlLXJhaW4tY29uZmlnLmpzb24nO1xuXG4vLyBzdGF0ZXNcbmltcG9ydCBXYWl0U3RhdGUgZnJvbSAnLi9zdGF0ZXMvV2FpdFN0YXRlJztcbmltcG9ydCBDb21wYXNzU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQ29tcGFzc1N0YXRlJztcbmltcG9ydCBCYWxsb29uc0NvdmVyU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQmFsbG9vbnNDb3ZlclN0YXRlJztcbmltcG9ydCBLaWxsVGhlQmFsbG9vbnNTdGF0ZSBmcm9tICcuL3N0YXRlcy9LaWxsVGhlQmFsbG9vbnNTdGF0ZSc7XG5pbXBvcnQgSW50ZXJtZXp6b1N0YXRlIGZyb20gJy4vc3RhdGVzL0ludGVybWV6em9TdGF0ZSc7XG5pbXBvcnQgQXZvaWRUaGVSYWluU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQXZvaWRUaGVSYWluU3RhdGUnO1xuaW1wb3J0IFNjb3Jlc1N0YXRlIGZyb20gJy4vc3RhdGVzL1Njb3Jlc1N0YXRlJztcbmltcG9ydCBFbmRTdGF0ZSBmcm9tICcuL3N0YXRlcy9FbmRTdGF0ZSc7XG5cbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgY2xpZW50ID0gc291bmR3b3Jrcy5jbGllbnQ7XG5cbmNvbnN0IHN0YXRlcyA9IHtcbiAgd2FpdDogV2FpdFN0YXRlLFxuICBjb21wYXNzOiBDb21wYXNzU3RhdGUsXG4gIGJhbGxvb25zQ292ZXI6IEJhbGxvb25zQ292ZXJTdGF0ZSxcbiAga2lsbFRoZUJhbGxvb25zOiBLaWxsVGhlQmFsbG9vbnNTdGF0ZSxcbiAgaW50ZXJtZXp6bzogSW50ZXJtZXp6b1N0YXRlLFxuICBhdm9pZFRoZVJhaW46IEF2b2lkVGhlUmFpblN0YXRlLFxuICBzY29yZXM6IFNjb3Jlc1N0YXRlLFxuICBlbmQ6IEVuZFN0YXRlLFxufTtcblxuY29uc3QgZ2xvYmFsU3RhdGUgPSB7XG4gIHNjb3JlOiB7IHJlZDogMCwgYmx1ZTogMCwgcGluazogMCwgeWVsbG93OiAwIH0sXG59O1xuXG5jb25zdCB2aWV3VGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgaWQ9XCJzaGFyZWQtdmlzdWFsLWNvbnRhaW5lclwiIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvZGl2PlxuICA8ZGl2IGlkPVwic3RhdGUtY29udGFpbmVyXCIgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+PC9kaXY+XG5gO1xuXG5jbGFzcyBQbGF5ZXJWaWV3IGV4dGVuZHMgc291bmR3b3Jrcy5DYW52YXNWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuJHN0YXRlQ29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignI3N0YXRlLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJyNzaGFyZWQtdmlzdWFsLWNvbnRhaW5lcicpO1xuICB9XG5cbiAgb25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbik7XG5cbiAgICB0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXIuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy4kc2hhcmVkVmlzdWFsQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gIH1cblxuICBzaG93U2hhcmVkVmlzdWFsKHBhdGgpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy4kc2hhcmVkVmlzdWFsQ29udGFpbmVyO1xuICAgICRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3BhdGh9KWA7XG4gICAgJGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgJGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgJGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb250YWluJztcblxuICAgIC8vIGZvcmNlIHJlLXJlbmRlcmluZyBmb3IgaU9TXG4gICAgJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcwcHgnO1xuICAgIGNvbnN0IHdpZHRoID0gYCR7dGhpcy52aWV3cG9ydFdpZHRofXB4YDtcbiAgICBzZXRUaW1lb3V0KCgpID0+ICRjb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aCwgMCk7XG4gIH1cblxuICBoaWRlU2hhcmVkVmlzdWFsKCkge1xuICAgIC8vIGlmICh0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXIpXG4gICAgICB0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJyc7XG4gIH1cblxuICBnZXRTdGF0ZUNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy4kc3RhdGVDb250YWluZXI7XG4gIH1cbn1cblxuY2xhc3MgUGxheWVyRXhwZXJpZW5jZSBleHRlbmRzIHNvdW5kd29ya3MuRXhwZXJpZW5jZSB7XG4gIGNvbnN0cnVjdG9yKGFzc2V0c0RvbWFpbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBjb25maWd1cmF0aW9uc1xuICAgIHRoaXMuc2hhcmVkU3ludGhDb25maWcgPSBzaGFyZWRTeW50aENvbmZpZztcbiAgICB0aGlzLnNoYXJlZFZpc3VhbHNDb25maWcgPSBzaGFyZWRWaXN1YWxzQ29uZmlnO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMuYXJlYUNvbmZpZyA9IGFyZWFDb25maWc7XG4gICAgdGhpcy5raWxsVGhlQmFsbG9vbnNDb25maWcgPSBraWxsVGhlQmFsbG9vbnNDb25maWc7XG4gICAgdGhpcy5hdm9pZFRoZVJhaW5Db25maWcgPSBhdm9pZFRoZVJhaW5Db25maWc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gcHJlcGFyZSBwYXRocyBmb3IgYXVkaW8gZmlsZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBjb25zdCBzaGFyZWRTeW50aEZpbGVzID0gc2hhcmVkU3ludGhDb25maWcubWFwKChlbnRyeSkgPT4ge1xuICAgICAgcmV0dXJuIGBzb3VuZHMvc2hhcmVkLXN5bnRoLyR7ZW50cnkuZmlsZW5hbWV9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGtpbGxUaGVCYWxsb29uc0ZpbGVzID0ga2lsbFRoZUJhbGxvb25zQ29uZmlnLmZpbGVzLm1hcCgoZmlsZW5hbWUpID0+IHtcbiAgICAgIHJldHVybiBgc291bmRzL2tpbGwtdGhlLWJhbGxvb25zLyR7ZmlsZW5hbWV9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGF2b2lkVGhlUmFpblNpbmVzID0gYXZvaWRUaGVSYWluQ29uZmlnLnNpbmVzLm1hcChmaWxlbmFtZSA9PiB7XG4gICAgICByZXR1cm4gYHNvdW5kcy9hdm9pZC10aGUtcmFpbi8ke2ZpbGVuYW1lfWA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhdm9pZFRoZVJhaW5HbGl0Y2hlcyA9IGF2b2lkVGhlUmFpbkNvbmZpZy5nbGl0Y2hlcy5tYXAoZmlsZW5hbWUgPT4ge1xuICAgICAgcmV0dXJuIGBzb3VuZHMvYXZvaWQtdGhlLXJhaW4vJHtmaWxlbmFtZX1gO1xuICAgIH0pO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgY29uc3QgYXVkaW9GaWxlcyA9IHtcbiAgICAgICdzaGFyZWQtc3ludGgnOiBzaGFyZWRTeW50aEZpbGVzLFxuICAgICAgJ2tpbGwtdGhlLWJhbGxvb25zJzoga2lsbFRoZUJhbGxvb25zRmlsZXMsXG4gICAgICAnYXZvaWQtdGhlLXJhaW46c2luZXMnOiBhdm9pZFRoZVJhaW5TaW5lcyxcbiAgICAgICdhdm9pZC10aGUtcmFpbjpnbGl0Y2hlcyc6IGF2b2lkVGhlUmFpbkdsaXRjaGVzLFxuICAgIH07XG5cbiAgICB0aGlzLnBsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6IFsnd2ViLWF1ZGlvJywgJ2RldmljZS1zZW5zb3InXSB9KTtcblxuICAgIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicsIHsgc2hvd0RpYWxvZzogZmFsc2UgfSk7XG4gICAgdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywge1xuICAgICAgYXNzZXRzRG9tYWluOiBhc3NldHNEb21haW4sXG4gICAgICBmaWxlczogYXVkaW9GaWxlcyxcbiAgICB9KTtcblxuICAgIHRoaXMuZ3JvdXBGaWx0ZXIgPSB0aGlzLnJlcXVpcmUoJ2dyb3VwLWZpbHRlcicsIHtcbiAgICAgIGRpcmVjdGlvbnM6IGFyZWFDb25maWcuZGlyZWN0aW9ucyxcbiAgICB9KTtcblxuICAgIC8vIGxvYWQgaGVyZSBpbnN0ZWFkIG9mIHBsYXRmb3JtXG4gICAgdGhpcy5pbWFnZU1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2ltYWdlLW1hbmFnZXInLCB7XG4gICAgICBmaWxlczogT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICAnc3ByaXRlOmJsdWUnOiB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMuYmx1ZS5maWxlLFxuICAgICAgICAnc3ByaXRlOnBpbmsnOiB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucGluay5maWxlLFxuICAgICAgICAnc3ByaXRlOnllbGxvdyc6IHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy55ZWxsb3cuZmlsZSxcbiAgICAgICAgJ3Nwcml0ZTpyZWQnOiB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmZpbGUsXG4gICAgICB9LCB0aGlzLnNoYXJlZFZpc3VhbHNDb25maWcpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnc3luYy1zY2hlZHVsZXInKTtcblxuICAgIHRoaXMuX3NldFN0YXRlID0gdGhpcy5fc2V0U3RhdGUuYmluZCh0aGlzKTtcbiAgICAvLyB0aGlzLl9vbkFjY2VsZXJhdGlvbiA9IHRoaXMuX29uQWNjZWxlcmF0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Db21wYXNzVXBkYXRlID0gdGhpcy5fb25Db21wYXNzVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc2V0Vm9sdW1lID0gdGhpcy5fc2V0Vm9sdW1lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TaGFyZWRWaXN1YWxUcmlnZ2VyID0gdGhpcy5fb25TaGFyZWRWaXN1YWxUcmlnZ2VyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9hY2NlbGVyYXRpb25MaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fY29tcGFzc0xpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgICAgICAvLyBwb3B1bGF0ZSBzcHJpdGVDb25maWcgd2l0aCB0aGUgc3ByaXRlIGltYWdlc1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5ibHVlLmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTpibHVlJyk7XG4gICAgdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnBpbmsuaW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0NhbnZhcygnc3ByaXRlOnBpbmsnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMueWVsbG93LmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTp5ZWxsb3cnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTpyZWQnKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5ibHVlLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6Ymx1ZScpO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5waW5rLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6cGluaycpO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy55ZWxsb3cuaGFsZlNpemVJbWFnZSA9IHRoaXMuaW1hZ2VNYW5hZ2VyLmdldEFzSGFsZlNpemVDYW52YXMoJ3Nwcml0ZTp5ZWxsb3cnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6cmVkJyk7XG5cbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5jb2xvcnMgPSBPYmplY3Qua2V5cyh0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aGUgdmlld1xuICAgIHRoaXMudmlldyA9IG5ldyBQbGF5ZXJWaWV3KHZpZXdUZW1wbGF0ZSwge30sIHt9LCB7XG4gICAgICBwcmVzZXJ2ZVBpeGVsUmF0aW86IGZhbHNlLFxuICAgICAgcmF0aW9zOiB7ICcjc3RhdGUtY29udGFpbmVyJzogMSB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zaG93KCkudGhlbigoKSA9PiB7XG4gICAgICAvLyBtYXN0ZXIgYXVkaW9cbiAgICAgIHRoaXMubWFzdGVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIHRoaXMubWFzdGVyLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgIHRoaXMubWFzdGVyLmdhaW4udmFsdWUgPSAxO1xuXG4gICAgICAvLyBnbG9iYWwgdmlld1xuICAgICAgdGhpcy52aWV3LnNldFByZVJlbmRlcigoY3R4LCBkdCwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGdsb2JhbCBzeW50aCBhbmQgdmlzdWFscyAoSHVpaHVpIGNvbnRyb2xsZWQpXG4gICAgICB0aGlzLnNoYXJlZFN5bnRoID0gbmV3IFNoYXJlZFN5bnRoKFxuICAgICAgICB0aGlzLnNoYXJlZFN5bnRoQ29uZmlnLFxuICAgICAgICB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlci5nZXQoJ3NoYXJlZC1zeW50aCcpLFxuICAgICAgICB0aGlzLmdyb3VwRmlsdGVyLFxuICAgICAgICB0aGlzLmdldEF1ZGlvRGVzdGluYXRpb24oKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5zaGFyZWRWaXN1YWxzID0gbmV3IFNoYXJlZFZpc3VhbHModGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzKTtcblxuICAgICAgdGhpcy52aWV3LmFkZFJlbmRlcmVyKHRoaXMuc2hhcmVkVmlzdWFscyk7XG5cbiAgICAgIC8vIEB0b2RvIC0gcmV2aXNlIGFsbCB0aGlzLCB0aGlzIGlzIGZhciBmcm9tIHJlYWxseSBlZmZpY2llbnRcbiAgICAgIHRoaXMucmVjZWl2ZSgnbm90ZTpvbicsIChwaXRjaCkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnNoYXJlZFN5bnRoLm5vdGVPbihwaXRjaCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMudHJpZ2dlcihyZXMuZ3JvdXAsIHJlcy5zdXN0YWluZWQsIHJlcy5kdXJhdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZWNlaXZlKCdub3RlOm9mZicsIChwaXRjaCkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnNoYXJlZFN5bnRoLm5vdGVPZmYocGl0Y2gpO1xuXG4gICAgICAgIGlmIChyZXMgIT09IG51bGwpXG4gICAgICAgICAgdGhpcy5zaGFyZWRWaXN1YWxzLnN0b3AocmVzLmdyb3VwKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFkZENvbXBhc3NMaXN0ZW5lcignZ3JvdXAnLCAoZ3JvdXApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5zaGFyZWRTeW50aC51cGRhdGVHcm91cChncm91cCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMudHJpZ2dlcihyZXMuZ3JvdXAsIHJlcy5zdXN0YWluZWQsIHJlcy5kdXJhdGlvbik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMua2lsbCgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvblxuICAgICAgdGhpcy5ncm91cEZpbHRlci5zdGFydExpc3RlbmluZygpO1xuICAgICAgdGhpcy5ncm91cEZpbHRlci5hZGRMaXN0ZW5lcih0aGlzLl9vbkNvbXBhc3NVcGRhdGUpO1xuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignZ2xvYmFsOnZvbHVtZScsIHRoaXMuX3NldFZvbHVtZSk7XG4gICAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdnbG9iYWw6c2hhcmVkLXZpc3VhbCcsIHRoaXMuX29uU2hhcmVkVmlzdWFsVHJpZ2dlcik7XG5cbiAgICAgIHRoaXMucmVjZWl2ZSgnZ2xvYmFsOnN0YXRlJywgKHN5bmNUaW1lLCBzdGF0ZSkgPT4ge1xuICAgICAgICB0aGlzLnNjaGVkdWxlci5kZWZlcigoKSA9PiB0aGlzLl9zZXRTdGF0ZShzdGF0ZSksIHN5bmNUaW1lKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0QXVkaW9EZXN0aW5hdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXN0ZXI7XG4gIH1cblxuICBfc2V0Vm9sdW1lKHZhbHVlKSB7XG4gICAgdGhpcy5tYXN0ZXIuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3NldFN0YXRlKG5hbWUpIHtcbiAgICBjb25zdCBjdG9yID0gc3RhdGVzW25hbWVdO1xuXG4gICAgaWYgKCFjdG9yKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHN0YXRlOiBcIiR7bmFtZX1cImApO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgY3Rvcih0aGlzLCBnbG9iYWxTdGF0ZSwgY2xpZW50KTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSlcbiAgICAgIHRoaXMuX3N0YXRlLmV4aXQoKTtcblxuICAgIHRoaXMuaGlkZVNoYXJlZFZpc3VhbCgpO1xuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgICB0aGlzLl9jdXJyZW50U3RhdGVOYW1lID0gbmFtZTtcbiAgfVxuXG4gIF9vblNoYXJlZFZpc3VhbFRyaWdnZXIodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdub25lJylcbiAgICAgIHRoaXMuaGlkZVNoYXJlZFZpc3VhbCgpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2hvd1NoYXJlZFZpc3VhbCh2YWx1ZSk7XG4gIH1cblxuICBzaG93U2hhcmVkVmlzdWFsKGlkKSB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuc2hhcmVkVmlzdWFsc0NvbmZpZ1tpZF07XG4gICAgdGhpcy52aWV3LnNob3dTaGFyZWRWaXN1YWwocGF0aCk7XG4gIH1cblxuICBoaWRlU2hhcmVkVmlzdWFsKCkge1xuICAgIHRoaXMudmlldy5oaWRlU2hhcmVkVmlzdWFsKCk7XG4gIH1cblxuICBhZGRDb21wYXNzTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXS5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ29tcGFzc0xpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICBfb25Db21wYXNzVXBkYXRlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyRXhwZXJpZW5jZTtcbiJdfQ==