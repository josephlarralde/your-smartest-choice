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

var _instrumentalConfig = require('../../../data/instrumental-config.json');

var _instrumentalConfig2 = _interopRequireDefault(_instrumentalConfig);

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
var audioContext = soundworks.audioContext;

// config

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
  score: { red: 0, blue: 0, pink: 0, yellow: 0 },
  mute: false
};

var viewTemplate = '\n  <canvas class="background"></canvas>\n  <div id="shared-visual-container" class="background"></div>\n  <div id="state-container" class="foreground"></div>\n  <div id="mute" class="mute-btn"></div>\n  <div id="shared-visual-container"></div>\n';

var PlayerView = function (_soundworks$CanvasVie) {
  (0, _inherits3.default)(PlayerView, _soundworks$CanvasVie);

  function PlayerView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, PlayerView);
    return (0, _possibleConstructorReturn3.default)(this, (PlayerView.__proto__ || (0, _getPrototypeOf2.default)(PlayerView)).call(this, template, content, events, options));
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

    // flag to allow waiting for next "wait" state
    var _this2 = (0, _possibleConstructorReturn3.default)(this, (PlayerExperience.__proto__ || (0, _getPrototypeOf2.default)(PlayerExperience)).call(this));

    _this2.joined = false;
    // THIS ALLOWS TO FORCE THE USERS TO WAIT FOR THE PIECE TO START TO BE ABLE TO JOIN :
    _this2.waitForStartToJoin = false;

    // configurations
    _this2.sharedSynthConfig = _sharedSynthConfig2.default;
    _this2.sharedVisualsConfig = _sharedVisualsConfig2.default;
    _this2.spriteConfig = _spriteConfig2.default;
    _this2.areaConfig = _areaConfig2.default;
    _this2.killTheBalloonsConfig = _killTheBalloonsConfig2.default;
    _this2.avoidTheRainConfig = _avoidTheRainConfig2.default;
    _this2.instrumentalConfig = _instrumentalConfig2.default;

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

    var instrumentalMusic = _instrumentalConfig2.default.files.map(function (filename) {
      return 'sounds/instrumental/' + filename;
    });

    // -------------------------------------------

    var audioFiles = {
      'shared-synth': sharedSynthFiles,
      'kill-the-balloons': killTheBalloonsFiles,
      'avoid-the-rain:sines': avoidTheRainSines,
      'avoid-the-rain:glitches': avoidTheRainGlitches,
      'instrumental-music': instrumentalMusic
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
    _this2._onTouchStart = _this2._onTouchStart.bind(_this2);

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
      this.view = new PlayerView(viewTemplate, {}, {
        // '#mute touchstart': (e) => { this._onTouchStart(e) },
      }, {
        preservePixelRatio: false,
        ratios: { '#state-container': 1 }
      });

      this.show().then(function () {
        // this allows mute btn to stay reactive through state changes
        // (don't ask why)
        _this3.$muteBtn = document.querySelector('#mute');
        _this3.$muteBtn.addEventListener('touchstart', function () {
          var active = _this3.$muteBtn.classList.contains('on');
          console.log('active : ' + (active ? 'yes' : 'no'));

          if (active) {
            _this3.$muteBtn.classList.remove('on');
            _this3.mute.gain.value = 1;
          } else {
            _this3.$muteBtn.classList.add('on');
            _this3.mute.gain.value = 0;
          }
        }, { passive: true });

        // audio api
        _this3.mute = audioContext.createGain();
        _this3.mute.gain.value = 1;
        _this3.mute.connect(audioContext.destination);

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

        _this3.receive('state:index', function (index) {
          if (index === 0) {
            _this3.joined = true;
          }

          _this3._playInstrumentalPart(index);
        });

        _this3.receive('global:state', function (syncTime, state) {
          if (_this3.waitForStartToJoin && _this3.joined || !_this3.waitForStartToJoin) {
            if (_this3.currentState !== state) {
              _this3.scheduler.defer(function () {
                return _this3._setState(state);
              }, syncTime);
              _this3.currentState = state;
            }
          }
        });

        _this3.currentState = 'wait';

        if (_this3.waitForStartToJoin) {
          _this3._setState(_this3.currentState);
        }
      });
    }
  }, {
    key: 'getAudioDestination',
    value: function getAudioDestination() {
      return this.master;
    }
  }, {
    key: '_playInstrumentalPart',
    value: function _playInstrumentalPart(index) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      console.log('playing part ' + index);
      // const index = Math.floor(Math.random() * this.backgroundBuffers.length);
      var buffer = this.audioBufferManager.get('instrumental-music')[index];
      // const buffer = this.backgroundBuffers[index];
      var duration = buffer.duration;
      var now = time || audioContext.currentTime;
      // const detune = (Math.random() * 2 - 1) * 1200;
      // const resampling = Math.random() * 1.5 + 0.5;

      var src = audioContext.createBufferSource();
      src.buffer = buffer;

      // const gain = audioContext.createGain();
      // gain.value = 1;

      src.connect(this.mute);
      // gain.connect(this.getAudioDestination());
      // src.playbackRate.value = resampling;
      src.start(now);
      src.stop(now + duration);
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(e) {
      console.log('touched !');
    }
  }, {
    key: '_setVolume',
    value: function _setVolume(value) {
      this.master.gain.value = value;
    }
  }, {
    key: '_setState',
    value: function _setState(name) {
      console.log('setting state ' + name);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvQ29udGV4dCIsImNsaWVudCIsInN0YXRlcyIsIndhaXQiLCJXYWl0U3RhdGUiLCJjb21wYXNzIiwiQ29tcGFzc1N0YXRlIiwiYmFsbG9vbnNDb3ZlciIsIkJhbGxvb25zQ292ZXJTdGF0ZSIsImtpbGxUaGVCYWxsb29ucyIsIktpbGxUaGVCYWxsb29uc1N0YXRlIiwiaW50ZXJtZXp6byIsIkludGVybWV6em9TdGF0ZSIsImF2b2lkVGhlUmFpbiIsIkF2b2lkVGhlUmFpblN0YXRlIiwic2NvcmVzIiwiU2NvcmVzU3RhdGUiLCJlbmQiLCJFbmRTdGF0ZSIsImdsb2JhbFN0YXRlIiwic2NvcmUiLCJyZWQiLCJibHVlIiwicGluayIsInllbGxvdyIsIm11dGUiLCJ2aWV3VGVtcGxhdGUiLCJQbGF5ZXJWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsIiRzdGF0ZUNvbnRhaW5lciIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCIkc2hhcmVkVmlzdWFsQ29udGFpbmVyIiwid2lkdGgiLCJoZWlnaHQiLCJvcmllbnRhdGlvbiIsInN0eWxlIiwicGF0aCIsIiRjb250YWluZXIiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kUmVwZWF0IiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFNpemUiLCJ2aWV3cG9ydFdpZHRoIiwic2V0VGltZW91dCIsIkNhbnZhc1ZpZXciLCJQbGF5ZXJFeHBlcmllbmNlIiwiYXNzZXRzRG9tYWluIiwiam9pbmVkIiwid2FpdEZvclN0YXJ0VG9Kb2luIiwic2hhcmVkU3ludGhDb25maWciLCJzaGFyZWRWaXN1YWxzQ29uZmlnIiwic3ByaXRlQ29uZmlnIiwiYXJlYUNvbmZpZyIsImtpbGxUaGVCYWxsb29uc0NvbmZpZyIsImF2b2lkVGhlUmFpbkNvbmZpZyIsImluc3RydW1lbnRhbENvbmZpZyIsInNoYXJlZFN5bnRoRmlsZXMiLCJtYXAiLCJlbnRyeSIsImZpbGVuYW1lIiwia2lsbFRoZUJhbGxvb25zRmlsZXMiLCJmaWxlcyIsImF2b2lkVGhlUmFpblNpbmVzIiwic2luZXMiLCJhdm9pZFRoZVJhaW5HbGl0Y2hlcyIsImdsaXRjaGVzIiwiaW5zdHJ1bWVudGFsTXVzaWMiLCJhdWRpb0ZpbGVzIiwicGxhdGZvcm0iLCJyZXF1aXJlIiwiZmVhdHVyZXMiLCJjaGVja2luIiwic2hvd0RpYWxvZyIsImF1ZGlvQnVmZmVyTWFuYWdlciIsImdyb3VwRmlsdGVyIiwiZGlyZWN0aW9ucyIsImltYWdlTWFuYWdlciIsImdyb3VwcyIsImZpbGUiLCJzaGFyZWRQYXJhbXMiLCJzeW5jIiwic2NoZWR1bGVyIiwiX3NldFN0YXRlIiwiYmluZCIsIl9vbkNvbXBhc3NVcGRhdGUiLCJfc2V0Vm9sdW1lIiwiX29uU2hhcmVkVmlzdWFsVHJpZ2dlciIsIl9vblRvdWNoU3RhcnQiLCJfYWNjZWxlcmF0aW9uTGlzdGVuZXJzIiwiX2NvbXBhc3NMaXN0ZW5lcnMiLCJpbWFnZSIsImdldEFzQ2FudmFzIiwiaGFsZlNpemVJbWFnZSIsImdldEFzSGFsZlNpemVDYW52YXMiLCJjb2xvcnMiLCJ2aWV3IiwicHJlc2VydmVQaXhlbFJhdGlvIiwicmF0aW9zIiwic2hvdyIsInRoZW4iLCIkbXV0ZUJ0biIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImFjdGl2ZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiY29uc29sZSIsImxvZyIsInJlbW92ZSIsImdhaW4iLCJ2YWx1ZSIsImFkZCIsInBhc3NpdmUiLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwibWFzdGVyIiwic2V0UHJlUmVuZGVyIiwiY3R4IiwiZHQiLCJjbGVhclJlY3QiLCJzaGFyZWRTeW50aCIsIlNoYXJlZFN5bnRoIiwiZ2V0IiwiZ2V0QXVkaW9EZXN0aW5hdGlvbiIsInNoYXJlZFZpc3VhbHMiLCJTaGFyZWRWaXN1YWxzIiwiYWRkUmVuZGVyZXIiLCJyZWNlaXZlIiwicGl0Y2giLCJyZXMiLCJub3RlT24iLCJ0cmlnZ2VyIiwiZ3JvdXAiLCJzdXN0YWluZWQiLCJkdXJhdGlvbiIsIm5vdGVPZmYiLCJzdG9wIiwiYWRkQ29tcGFzc0xpc3RlbmVyIiwidXBkYXRlR3JvdXAiLCJraWxsIiwic3RhcnRMaXN0ZW5pbmciLCJhZGRMaXN0ZW5lciIsImFkZFBhcmFtTGlzdGVuZXIiLCJpbmRleCIsIl9wbGF5SW5zdHJ1bWVudGFsUGFydCIsInN5bmNUaW1lIiwic3RhdGUiLCJjdXJyZW50U3RhdGUiLCJkZWZlciIsInRpbWUiLCJidWZmZXIiLCJub3ciLCJjdXJyZW50VGltZSIsInNyYyIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsInN0YXJ0IiwiZSIsIm5hbWUiLCJjdG9yIiwiRXJyb3IiLCJfc3RhdGUiLCJleGl0IiwiaGlkZVNoYXJlZFZpc3VhbCIsImVudGVyIiwiX2N1cnJlbnRTdGF0ZU5hbWUiLCJzaG93U2hhcmVkVmlzdWFsIiwiaWQiLCJjaGFubmVsIiwiY2FsbGJhY2siLCJkZWxldGUiLCJhcmdzIiwiZm9yRWFjaCIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBUkE7QUFVQSxJQUFNQyxlQUFlRCxXQUFXQyxZQUFoQzs7QUFuQkE7O0FBb0JBLElBQU1DLFNBQVNGLFdBQVdFLE1BQTFCOztBQUVBLElBQU1DLFNBQVM7QUFDYkMsUUFBTUMsbUJBRE87QUFFYkMsV0FBU0Msc0JBRkk7QUFHYkMsaUJBQWVDLDRCQUhGO0FBSWJDLG1CQUFpQkMsOEJBSko7QUFLYkMsY0FBWUMseUJBTEM7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RixpQkFBTCxDQUF1QitFLE9BQXZCLENBQUosRUFDRSxLQUFLL0UsaUJBQUwsQ0FBdUIrRSxPQUF2QixFQUFnQ0ksT0FBaEMsQ0FBd0M7QUFBQSxlQUFZSCwwQkFBWUUsSUFBWixDQUFaO0FBQUEsT0FBeEM7QUFDSDs7O0VBelM0QmhMLFdBQVdrTCxVOztrQkE0UzNCaEksZ0IiLCJmaWxlIjoiUGxheWVyRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IFNoYXJlZFN5bnRoIGZyb20gJy4vYXVkaW8vU2hhcmVkU3ludGgnO1xuaW1wb3J0IFNoYXJlZFZpc3VhbHMgZnJvbSAnLi9yZW5kZXJlcnMvU2hhcmVkVmlzdWFscyc7XG5cbi8vIGNvbmZpZ1xuaW1wb3J0IHNwcml0ZUNvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL3Nwcml0ZS1jb25maWcuanNvbic7XG5pbXBvcnQgc2hhcmVkVmlzdWFsc0NvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL3NoYXJlZC12aXN1YWxzLWNvbmZpZy5qc29uJztcbmltcG9ydCBzaGFyZWRTeW50aENvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL3NoYXJlZC1zeW50aC1jb25maWcuanNvbic7XG5pbXBvcnQgYXJlYUNvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL2FyZWEtY29uZmlnLmpzb24nO1xuaW1wb3J0IGtpbGxUaGVCYWxsb29uc0NvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL2tpbGwtdGhlLWJhbGxvb25zLWNvbmZpZy5qc29uJztcbmltcG9ydCBhdm9pZFRoZVJhaW5Db25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9hdm9pZC10aGUtcmFpbi1jb25maWcuanNvbic7XG5pbXBvcnQgaW5zdHJ1bWVudGFsQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEvaW5zdHJ1bWVudGFsLWNvbmZpZy5qc29uJztcblxuLy8gc3RhdGVzXG5pbXBvcnQgV2FpdFN0YXRlIGZyb20gJy4vc3RhdGVzL1dhaXRTdGF0ZSc7XG5pbXBvcnQgQ29tcGFzc1N0YXRlIGZyb20gJy4vc3RhdGVzL0NvbXBhc3NTdGF0ZSc7XG5pbXBvcnQgQmFsbG9vbnNDb3ZlclN0YXRlIGZyb20gJy4vc3RhdGVzL0JhbGxvb25zQ292ZXJTdGF0ZSc7XG5pbXBvcnQgS2lsbFRoZUJhbGxvb25zU3RhdGUgZnJvbSAnLi9zdGF0ZXMvS2lsbFRoZUJhbGxvb25zU3RhdGUnO1xuaW1wb3J0IEludGVybWV6em9TdGF0ZSBmcm9tICcuL3N0YXRlcy9JbnRlcm1lenpvU3RhdGUnO1xuaW1wb3J0IEF2b2lkVGhlUmFpblN0YXRlIGZyb20gJy4vc3RhdGVzL0F2b2lkVGhlUmFpblN0YXRlJztcbmltcG9ydCBTY29yZXNTdGF0ZSBmcm9tICcuL3N0YXRlcy9TY29yZXNTdGF0ZSc7XG5pbXBvcnQgRW5kU3RhdGUgZnJvbSAnLi9zdGF0ZXMvRW5kU3RhdGUnO1xuXG5jb25zdCBhdWRpb0NvbnRleHQgPSBzb3VuZHdvcmtzLmF1ZGlvQ29udGV4dDtcbmNvbnN0IGNsaWVudCA9IHNvdW5kd29ya3MuY2xpZW50O1xuXG5jb25zdCBzdGF0ZXMgPSB7XG4gIHdhaXQ6IFdhaXRTdGF0ZSxcbiAgY29tcGFzczogQ29tcGFzc1N0YXRlLFxuICBiYWxsb29uc0NvdmVyOiBCYWxsb29uc0NvdmVyU3RhdGUsXG4gIGtpbGxUaGVCYWxsb29uczogS2lsbFRoZUJhbGxvb25zU3RhdGUsXG4gIGludGVybWV6em86IEludGVybWV6em9TdGF0ZSxcbiAgYXZvaWRUaGVSYWluOiBBdm9pZFRoZVJhaW5TdGF0ZSxcbiAgc2NvcmVzOiBTY29yZXNTdGF0ZSxcbiAgZW5kOiBFbmRTdGF0ZSxcbn07XG5cbmNvbnN0IGdsb2JhbFN0YXRlID0ge1xuICBzY29yZTogeyByZWQ6IDAsIGJsdWU6IDAsIHBpbms6IDAsIHllbGxvdzogMCB9LFxuICBtdXRlOiBmYWxzZSxcbn07XG5cbmNvbnN0IHZpZXdUZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBpZD1cInNoYXJlZC12aXN1YWwtY29udGFpbmVyXCIgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9kaXY+XG4gIDxkaXYgaWQ9XCJzdGF0ZS1jb250YWluZXJcIiBjbGFzcz1cImZvcmVncm91bmRcIj48L2Rpdj5cbiAgPGRpdiBpZD1cIm11dGVcIiBjbGFzcz1cIm11dGUtYnRuXCI+PC9kaXY+XG4gIDxkaXYgaWQ9XCJzaGFyZWQtdmlzdWFsLWNvbnRhaW5lclwiPjwvZGl2PlxuYDtcblxuY2xhc3MgUGxheWVyVmlldyBleHRlbmRzIHNvdW5kd29ya3MuQ2FudmFzVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLiRzdGF0ZUNvbnRhaW5lciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJyNzdGF0ZS1jb250YWluZXInKTtcbiAgICB0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjc2hhcmVkLXZpc3VhbC1jb250YWluZXInKTtcbiAgfVxuXG4gIG9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgdGhpcy4kc2hhcmVkVmlzdWFsQ29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICB9XG5cbiAgc2hvd1NoYXJlZFZpc3VhbChwYXRoKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lcjtcbiAgICAkY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtwYXRofSlgO1xuICAgICRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG5cbiAgICAvLyBmb3JjZSByZS1yZW5kZXJpbmcgZm9yIGlPU1xuICAgICRjb250YWluZXIuc3R5bGUud2lkdGggPSAnMHB4JztcbiAgICBjb25zdCB3aWR0aCA9IGAke3RoaXMudmlld3BvcnRXaWR0aH1weGA7XG4gICAgc2V0VGltZW91dCgoKSA9PiAkY29udGFpbmVyLnN0eWxlLndpZHRoID0gd2lkdGgsIDApO1xuICB9XG5cbiAgaGlkZVNoYXJlZFZpc3VhbCgpIHtcbiAgICAvLyBpZiAodGhpcy4kc2hhcmVkVmlzdWFsQ29udGFpbmVyKVxuICAgICAgdGhpcy4kc2hhcmVkVmlzdWFsQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICcnO1xuICB9XG5cbiAgZ2V0U3RhdGVDb250YWluZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHN0YXRlQ29udGFpbmVyO1xuICB9XG59XG5cbmNsYXNzIFBsYXllckV4cGVyaWVuY2UgZXh0ZW5kcyBzb3VuZHdvcmtzLkV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3Rvcihhc3NldHNEb21haW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gZmxhZyB0byBhbGxvdyB3YWl0aW5nIGZvciBuZXh0IFwid2FpdFwiIHN0YXRlXG4gICAgdGhpcy5qb2luZWQgPSBmYWxzZTtcbiAgICAvLyBUSElTIEFMTE9XUyBUTyBGT1JDRSBUSEUgVVNFUlMgVE8gV0FJVCBGT1IgVEhFIFBJRUNFIFRPIFNUQVJUIFRPIEJFIEFCTEUgVE8gSk9JTiA6XG4gICAgdGhpcy53YWl0Rm9yU3RhcnRUb0pvaW4gPSBmYWxzZTtcblxuICAgIC8vIGNvbmZpZ3VyYXRpb25zXG4gICAgdGhpcy5zaGFyZWRTeW50aENvbmZpZyA9IHNoYXJlZFN5bnRoQ29uZmlnO1xuICAgIHRoaXMuc2hhcmVkVmlzdWFsc0NvbmZpZyA9IHNoYXJlZFZpc3VhbHNDb25maWc7XG4gICAgdGhpcy5zcHJpdGVDb25maWcgPSBzcHJpdGVDb25maWc7XG4gICAgdGhpcy5hcmVhQ29uZmlnID0gYXJlYUNvbmZpZztcbiAgICB0aGlzLmtpbGxUaGVCYWxsb29uc0NvbmZpZyA9IGtpbGxUaGVCYWxsb29uc0NvbmZpZztcbiAgICB0aGlzLmF2b2lkVGhlUmFpbkNvbmZpZyA9IGF2b2lkVGhlUmFpbkNvbmZpZztcbiAgICB0aGlzLmluc3RydW1lbnRhbENvbmZpZyA9IGluc3RydW1lbnRhbENvbmZpZztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBwcmVwYXJlIHBhdGhzIGZvciBhdWRpbyBmaWxlc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGNvbnN0IHNoYXJlZFN5bnRoRmlsZXMgPSBzaGFyZWRTeW50aENvbmZpZy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgICByZXR1cm4gYHNvdW5kcy9zaGFyZWQtc3ludGgvJHtlbnRyeS5maWxlbmFtZX1gO1xuICAgIH0pO1xuXG4gICAgY29uc3Qga2lsbFRoZUJhbGxvb25zRmlsZXMgPSBraWxsVGhlQmFsbG9vbnNDb25maWcuZmlsZXMubWFwKChmaWxlbmFtZSkgPT4ge1xuICAgICAgcmV0dXJuIGBzb3VuZHMva2lsbC10aGUtYmFsbG9vbnMvJHtmaWxlbmFtZX1gO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYXZvaWRUaGVSYWluU2luZXMgPSBhdm9pZFRoZVJhaW5Db25maWcuc2luZXMubWFwKGZpbGVuYW1lID0+IHtcbiAgICAgIHJldHVybiBgc291bmRzL2F2b2lkLXRoZS1yYWluLyR7ZmlsZW5hbWV9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGF2b2lkVGhlUmFpbkdsaXRjaGVzID0gYXZvaWRUaGVSYWluQ29uZmlnLmdsaXRjaGVzLm1hcChmaWxlbmFtZSA9PiB7XG4gICAgICByZXR1cm4gYHNvdW5kcy9hdm9pZC10aGUtcmFpbi8ke2ZpbGVuYW1lfWA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBpbnN0cnVtZW50YWxNdXNpYyA9IGluc3RydW1lbnRhbENvbmZpZy5maWxlcy5tYXAoKGZpbGVuYW1lKSA9PiB7XG4gICAgICByZXR1cm4gYHNvdW5kcy9pbnN0cnVtZW50YWwvJHtmaWxlbmFtZX1gO1xuICAgIH0pO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgY29uc3QgYXVkaW9GaWxlcyA9IHtcbiAgICAgICdzaGFyZWQtc3ludGgnOiBzaGFyZWRTeW50aEZpbGVzLFxuICAgICAgJ2tpbGwtdGhlLWJhbGxvb25zJzoga2lsbFRoZUJhbGxvb25zRmlsZXMsXG4gICAgICAnYXZvaWQtdGhlLXJhaW46c2luZXMnOiBhdm9pZFRoZVJhaW5TaW5lcyxcbiAgICAgICdhdm9pZC10aGUtcmFpbjpnbGl0Y2hlcyc6IGF2b2lkVGhlUmFpbkdsaXRjaGVzLFxuICAgICAgJ2luc3RydW1lbnRhbC1tdXNpYyc6IGluc3RydW1lbnRhbE11c2ljLFxuICAgIH07XG5cbiAgICB0aGlzLnBsYXRmb3JtID0gdGhpcy5yZXF1aXJlKCdwbGF0Zm9ybScsIHsgZmVhdHVyZXM6IFsnd2ViLWF1ZGlvJywgJ2RldmljZS1zZW5zb3InXSB9KTtcblxuICAgIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicsIHsgc2hvd0RpYWxvZzogZmFsc2UgfSk7XG4gICAgdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJywge1xuICAgICAgYXNzZXRzRG9tYWluOiBhc3NldHNEb21haW4sXG4gICAgICBmaWxlczogYXVkaW9GaWxlcyxcbiAgICB9KTtcblxuICAgIHRoaXMuZ3JvdXBGaWx0ZXIgPSB0aGlzLnJlcXVpcmUoJ2dyb3VwLWZpbHRlcicsIHtcbiAgICAgIGRpcmVjdGlvbnM6IGFyZWFDb25maWcuZGlyZWN0aW9ucyxcbiAgICB9KTtcblxuICAgIC8vIGxvYWQgaGVyZSBpbnN0ZWFkIG9mIHBsYXRmb3JtXG4gICAgdGhpcy5pbWFnZU1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2ltYWdlLW1hbmFnZXInLCB7XG4gICAgICBmaWxlczogT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICAnc3ByaXRlOmJsdWUnOiB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMuYmx1ZS5maWxlLFxuICAgICAgICAnc3ByaXRlOnBpbmsnOiB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucGluay5maWxlLFxuICAgICAgICAnc3ByaXRlOnllbGxvdyc6IHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy55ZWxsb3cuZmlsZSxcbiAgICAgICAgJ3Nwcml0ZTpyZWQnOiB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmZpbGUsXG4gICAgICB9LCB0aGlzLnNoYXJlZFZpc3VhbHNDb25maWcpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnc3luYy1zY2hlZHVsZXInKTtcblxuICAgIHRoaXMuX3NldFN0YXRlID0gdGhpcy5fc2V0U3RhdGUuYmluZCh0aGlzKTtcbiAgICAvLyB0aGlzLl9vbkFjY2VsZXJhdGlvbiA9IHRoaXMuX29uQWNjZWxlcmF0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Db21wYXNzVXBkYXRlID0gdGhpcy5fb25Db21wYXNzVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc2V0Vm9sdW1lID0gdGhpcy5fc2V0Vm9sdW1lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TaGFyZWRWaXN1YWxUcmlnZ2VyID0gdGhpcy5fb25TaGFyZWRWaXN1YWxUcmlnZ2VyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Ub3VjaFN0YXJ0ID0gdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9hY2NlbGVyYXRpb25MaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fY29tcGFzc0xpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgICAgICAvLyBwb3B1bGF0ZSBzcHJpdGVDb25maWcgd2l0aCB0aGUgc3ByaXRlIGltYWdlc1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5ibHVlLmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTpibHVlJyk7XG4gICAgdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnBpbmsuaW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0NhbnZhcygnc3ByaXRlOnBpbmsnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMueWVsbG93LmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTp5ZWxsb3cnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTpyZWQnKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5ibHVlLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6Ymx1ZScpO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5waW5rLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6cGluaycpO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy55ZWxsb3cuaGFsZlNpemVJbWFnZSA9IHRoaXMuaW1hZ2VNYW5hZ2VyLmdldEFzSGFsZlNpemVDYW52YXMoJ3Nwcml0ZTp5ZWxsb3cnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6cmVkJyk7XG5cbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5jb2xvcnMgPSBPYmplY3Qua2V5cyh0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aGUgdmlld1xuICAgIHRoaXMudmlldyA9IG5ldyBQbGF5ZXJWaWV3KHZpZXdUZW1wbGF0ZSwge30sIHtcbiAgICAgIC8vICcjbXV0ZSB0b3VjaHN0YXJ0JzogKGUpID0+IHsgdGhpcy5fb25Ub3VjaFN0YXJ0KGUpIH0sXG4gICAgfSwge1xuICAgICAgcHJlc2VydmVQaXhlbFJhdGlvOiBmYWxzZSxcbiAgICAgIHJhdGlvczogeyAnI3N0YXRlLWNvbnRhaW5lcic6IDEgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2hvdygpLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gdGhpcyBhbGxvd3MgbXV0ZSBidG4gdG8gc3RheSByZWFjdGl2ZSB0aHJvdWdoIHN0YXRlIGNoYW5nZXNcbiAgICAgIC8vIChkb24ndCBhc2sgd2h5KVxuICAgICAgdGhpcy4kbXV0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtdXRlJyk7XG4gICAgICB0aGlzLiRtdXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMuJG11dGVCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdvbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZlIDogJyArIChhY3RpdmUgPyAneWVzJyA6ICdubycpKTtcblxuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy4kbXV0ZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpO1xuICAgICAgICAgIHRoaXMubXV0ZS5nYWluLnZhbHVlID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLiRtdXRlQnRuLmNsYXNzTGlzdC5hZGQoJ29uJyk7XG4gICAgICAgICAgdGhpcy5tdXRlLmdhaW4udmFsdWUgPSAwO1xuICAgICAgICB9XG4gICAgICB9LCB7IHBhc3NpdmU6IHRydWUgfSk7XG5cbiAgICAgIC8vIGF1ZGlvIGFwaVxuICAgICAgdGhpcy5tdXRlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIHRoaXMubXV0ZS5nYWluLnZhbHVlID0gMTtcbiAgICAgIHRoaXMubXV0ZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cbiAgICAgIC8vIG1hc3RlciBhdWRpb1xuICAgICAgdGhpcy5tYXN0ZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgdGhpcy5tYXN0ZXIuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgdGhpcy5tYXN0ZXIuZ2Fpbi52YWx1ZSA9IDE7XG5cbiAgICAgIC8vIGdsb2JhbCB2aWV3XG4gICAgICB0aGlzLnZpZXcuc2V0UHJlUmVuZGVyKChjdHgsIGR0LCB3aWR0aCwgaGVpZ2h0KSA9PiB7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2xvYmFsIHN5bnRoIGFuZCB2aXN1YWxzIChIdWlodWkgY29udHJvbGxlZClcbiAgICAgIHRoaXMuc2hhcmVkU3ludGggPSBuZXcgU2hhcmVkU3ludGgoXG4gICAgICAgIHRoaXMuc2hhcmVkU3ludGhDb25maWcsXG4gICAgICAgIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyLmdldCgnc2hhcmVkLXN5bnRoJyksXG4gICAgICAgIHRoaXMuZ3JvdXBGaWx0ZXIsXG4gICAgICAgIHRoaXMuZ2V0QXVkaW9EZXN0aW5hdGlvbigpXG4gICAgICApO1xuXG4gICAgICB0aGlzLnNoYXJlZFZpc3VhbHMgPSBuZXcgU2hhcmVkVmlzdWFscyh0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMpO1xuXG4gICAgICB0aGlzLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5zaGFyZWRWaXN1YWxzKTtcblxuICAgICAgLy8gQHRvZG8gLSByZXZpc2UgYWxsIHRoaXMsIHRoaXMgaXMgZmFyIGZyb20gcmVhbGx5IGVmZmljaWVudFxuICAgICAgdGhpcy5yZWNlaXZlKCdub3RlOm9uJywgKHBpdGNoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuc2hhcmVkU3ludGgubm90ZU9uKHBpdGNoKTtcblxuICAgICAgICBpZiAocmVzICE9PSBudWxsKVxuICAgICAgICAgIHRoaXMuc2hhcmVkVmlzdWFscy50cmlnZ2VyKHJlcy5ncm91cCwgcmVzLnN1c3RhaW5lZCwgcmVzLmR1cmF0aW9uKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlY2VpdmUoJ25vdGU6b2ZmJywgKHBpdGNoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuc2hhcmVkU3ludGgubm90ZU9mZihwaXRjaCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMuc3RvcChyZXMuZ3JvdXApO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWRkQ29tcGFzc0xpc3RlbmVyKCdncm91cCcsIChncm91cCkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnNoYXJlZFN5bnRoLnVwZGF0ZUdyb3VwKGdyb3VwKTtcblxuICAgICAgICBpZiAocmVzICE9PSBudWxsKVxuICAgICAgICAgIHRoaXMuc2hhcmVkVmlzdWFscy50cmlnZ2VyKHJlcy5ncm91cCwgcmVzLnN1c3RhaW5lZCwgcmVzLmR1cmF0aW9uKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMuc2hhcmVkVmlzdWFscy5raWxsKCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gc3RhdGUgb2YgdGhlIGFwcGxpY2F0aW9uXG4gICAgICB0aGlzLmdyb3VwRmlsdGVyLnN0YXJ0TGlzdGVuaW5nKCk7XG4gICAgICB0aGlzLmdyb3VwRmlsdGVyLmFkZExpc3RlbmVyKHRoaXMuX29uQ29tcGFzc1VwZGF0ZSk7XG4gICAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdnbG9iYWw6dm9sdW1lJywgdGhpcy5fc2V0Vm9sdW1lKTtcbiAgICAgIHRoaXMuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2dsb2JhbDpzaGFyZWQtdmlzdWFsJywgdGhpcy5fb25TaGFyZWRWaXN1YWxUcmlnZ2VyKTtcblxuICAgICAgdGhpcy5yZWNlaXZlKCdzdGF0ZTppbmRleCcsIGluZGV4ID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5qb2luZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcGxheUluc3RydW1lbnRhbFBhcnQoaW5kZXgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVjZWl2ZSgnZ2xvYmFsOnN0YXRlJywgKHN5bmNUaW1lLCBzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoKHRoaXMud2FpdEZvclN0YXJ0VG9Kb2luICYmIHRoaXMuam9pbmVkKSB8fCAhdGhpcy53YWl0Rm9yU3RhcnRUb0pvaW4pIHtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUgIT09IHN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlci5kZWZlcigoKSA9PiB0aGlzLl9zZXRTdGF0ZShzdGF0ZSksIHN5bmNUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSAnd2FpdCc7XG5cbiAgICAgIGlmICh0aGlzLndhaXRGb3JTdGFydFRvSm9pbikge1xuICAgICAgICB0aGlzLl9zZXRTdGF0ZSh0aGlzLmN1cnJlbnRTdGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRBdWRpb0Rlc3RpbmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hc3RlcjtcbiAgfVxuXG4gIF9wbGF5SW5zdHJ1bWVudGFsUGFydChpbmRleCwgdGltZSA9IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZygncGxheWluZyBwYXJ0ICcgKyBpbmRleCk7XG4gICAgLy8gY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmJhY2tncm91bmRCdWZmZXJzLmxlbmd0aCk7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZ2V0KCdpbnN0cnVtZW50YWwtbXVzaWMnKVtpbmRleF07XG4gICAgLy8gY29uc3QgYnVmZmVyID0gdGhpcy5iYWNrZ3JvdW5kQnVmZmVyc1tpbmRleF07XG4gICAgY29uc3QgZHVyYXRpb24gPSBidWZmZXIuZHVyYXRpb247XG4gICAgY29uc3Qgbm93ID0gdGltZSB8fCBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy8gY29uc3QgZGV0dW5lID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiAxMjAwO1xuICAgIC8vIGNvbnN0IHJlc2FtcGxpbmcgPSBNYXRoLnJhbmRvbSgpICogMS41ICsgMC41O1xuXG4gICAgY29uc3Qgc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNyYy5idWZmZXIgPSBidWZmZXI7XG5cbiAgICAvLyBjb25zdCBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAvLyBnYWluLnZhbHVlID0gMTtcblxuICAgIHNyYy5jb25uZWN0KHRoaXMubXV0ZSk7XG4gICAgLy8gZ2Fpbi5jb25uZWN0KHRoaXMuZ2V0QXVkaW9EZXN0aW5hdGlvbigpKTtcbiAgICAvLyBzcmMucGxheWJhY2tSYXRlLnZhbHVlID0gcmVzYW1wbGluZztcbiAgICBzcmMuc3RhcnQobm93KTtcbiAgICBzcmMuc3RvcChub3cgKyBkdXJhdGlvbik7ICAgIFxuICB9XG5cbiAgX29uVG91Y2hTdGFydChlKSB7XG4gICAgY29uc29sZS5sb2coJ3RvdWNoZWQgIScpXG4gIH1cblxuICBfc2V0Vm9sdW1lKHZhbHVlKSB7XG4gICAgdGhpcy5tYXN0ZXIuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3NldFN0YXRlKG5hbWUpIHtcbiAgICBjb25zb2xlLmxvZygnc2V0dGluZyBzdGF0ZSAnICsgbmFtZSk7XG5cbiAgICBjb25zdCBjdG9yID0gc3RhdGVzW25hbWVdO1xuXG4gICAgaWYgKCFjdG9yKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHN0YXRlOiBcIiR7bmFtZX1cImApO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgY3Rvcih0aGlzLCBnbG9iYWxTdGF0ZSwgY2xpZW50KTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSlcbiAgICAgIHRoaXMuX3N0YXRlLmV4aXQoKTtcblxuICAgIHRoaXMuaGlkZVNoYXJlZFZpc3VhbCgpO1xuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgICB0aGlzLl9jdXJyZW50U3RhdGVOYW1lID0gbmFtZTtcbiAgfVxuXG4gIF9vblNoYXJlZFZpc3VhbFRyaWdnZXIodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdub25lJylcbiAgICAgIHRoaXMuaGlkZVNoYXJlZFZpc3VhbCgpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2hvd1NoYXJlZFZpc3VhbCh2YWx1ZSk7XG4gIH1cblxuICBzaG93U2hhcmVkVmlzdWFsKGlkKSB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuc2hhcmVkVmlzdWFsc0NvbmZpZ1tpZF07XG4gICAgdGhpcy52aWV3LnNob3dTaGFyZWRWaXN1YWwocGF0aCk7XG4gIH1cblxuICBoaWRlU2hhcmVkVmlzdWFsKCkge1xuICAgIHRoaXMudmlldy5oaWRlU2hhcmVkVmlzdWFsKCk7XG4gIH1cblxuICBhZGRDb21wYXNzTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXS5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ29tcGFzc0xpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICBfb25Db21wYXNzVXBkYXRlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyRXhwZXJpZW5jZTtcbiJdfQ==