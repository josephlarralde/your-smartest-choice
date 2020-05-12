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

var viewTemplate = '\n  <div id="menu">\n    <div id="mute" class="mute-btn"></div>\n    <div id="exit" class="exit-btn"></div>\n  </div>\n  <canvas class="background"></canvas>\n  <div class="credits-wrapper hidden">\n    <div id="credits-1" class="credits small hidden">\n      <div class="bold normal">\n        Huihui Cheng <br />\n        Your smartest choice\n      </div>\n      <br />\n      <span class="bold">Original application</span>\n      <ul style="padding: 0;">\n        <li>Benjamin Matuszewski</li>\n        <li>Norbert Schnell</li>\n        <li>(IRCAM)</li>\n      </ul>\n      <span class="bold">Online adaptation</span>\n      <ul style="padding: 0;"><li> Joseph Larralde </li></ul>\n    </div>\n    <div id="credits-2" class="credits small hidden">\n      <span class="bold normal"> Ensemble Mosaik </span> <br />\n      Chatschatur Kanajan, Violin <br />\n      Karen Lorenz, Viola <br />\n      Christian Vogel, Clarinet <br />\n      Ernst Surberg, Piano <br /><br />\n      <img src="/images/prod-logo.png" style="width: 250px;" />\n    </div>\n  </div>\n  <div id="shared-visual-container" class="background"></div>\n  <div id="state-container" class="foreground"></div>\n  <div id="shared-visual-container"></div>\n';

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
    _this2.index = 0;

    // THIS ALLOWS TO FORCE THE USERS TO WAIT FOR THE PIECE TO START TO BE ABLE TO JOIN :
    _this2.waitForStartToJoin = true;

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
      this.view = new PlayerView(viewTemplate, {}, {}, {
        preservePixelRatio: false,
        ratios: { '#state-container': 1 }
      });

      this.show().then(function () {

        _this3.$exitBtn = document.querySelector('#exit');
        _this3.$exitBtn.addEventListener('touchstart', function () {
          _this3.joined = false;
          _this3._setState('wait');
        });

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

        _this3.$creditsWrapper = document.querySelector('.credits-wrapper');
        _this3.$credits1 = document.querySelector('#credits-1');
        _this3.$credits2 = document.querySelector('#credits-2');

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

        _this3.receive('timeline:position', function (index, totalTime) {
          console.log(index);
          console.log(totalTime);
          _this3._playInstrumentalPart(index, totalTime);
        });

        _this3.receive('state:index', function (index) {
          if (index === 0) {
            _this3.joined = true;
            globalState.score = { red: 0, blue: 0, pink: 0, yellow: 0 };
          }

          // or uncomment this if and play current part from current position when clients join
          // like this, remains silent
          // if (this.joined) {
          _this3._playInstrumentalPart(index);
          // }
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
    key: 'showCreditsPage',
    value: function showCreditsPage() {
      var pageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (pageId === 1 && this.currentState === 'wait') {
        this.$credits2.classList.add('hidden');
        this.$credits1.classList.remove('hidden');
        this.$creditsWrapper.classList.remove('hidden');
      } else if (pageId === 2 && this.currentState === 'scores') {
        this.$credits1.classList.add('hidden');
        this.$credits2.classList.remove('hidden');
        this.$creditsWrapper.classList.remove('hidden');
      } else {
        this.$creditsWrapper.classList.add('hidden');
      }
    }
  }, {
    key: '_playInstrumentalPart',
    value: function _playInstrumentalPart(index) {
      var bufferOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      console.log('playing part ' + index);
      // const index = Math.floor(Math.random() * this.backgroundBuffers.length);
      var buffer = this.audioBufferManager.get('instrumental-music')[index];
      // const buffer = this.backgroundBuffers[index];
      var duration = buffer.duration - bufferOffset;
      var now = audioContext.currentTime;
      // const detune = (Math.random() * 2 - 1) * 1200;
      // const resampling = Math.random() * 1.5 + 0.5;

      var src = audioContext.createBufferSource();
      src.buffer = buffer;

      // const gain = audioContext.createGain();
      // gain.value = 1;

      src.connect(this.mute);
      // gain.connect(this.getAudioDestination());
      // src.playbackRate.value = resampling;
      src.start(now, bufferOffset, duration); // offset in seconds
      // src.stop(now + duration);    
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
      this.currentState = name;

      // display exit button when we are not waiting
      // NOPE ! this removes event listeners :(
      // this.view.model.showExitBtn = (name !== 'wait');
      // this.view.render('#menu');

      if (name === 'wait') {
        this.$exitBtn.classList.add('hidden');
      } else {
        this.$exitBtn.classList.remove('hidden');
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvQ29udGV4dCIsImNsaWVudCIsInN0YXRlcyIsIndhaXQiLCJXYWl0U3RhdGUiLCJjb21wYXNzIiwiQ29tcGFzc1N0YXRlIiwiYmFsbG9vbnNDb3ZlciIsIkJhbGxvb25zQ292ZXJTdGF0ZSIsImtpbGxUaGVCYWxsb29ucyIsIktpbGxUaGVCYWxsb29uc1N0YXRlIiwiaW50ZXJtZXp6byIsIkludGVybWV6em9TdGF0ZSIsImF2b2lkVGhlUmFpbiIsIkF2b2lkVGhlUmFpblN0YXRlIiwic2NvcmVzIiwiU2NvcmVzU3RhdGUiLCJlbmQiLCJFbmRTdGF0ZSIsImdsb2JhbFN0YXRlIiwic2NvcmUiLCJyZWQiLCJibHVlIiwicGluayIsInllbGxvdyIsIm11dGUiLCJ2aWV3VGVtcGxhdGUiLCJQbGF5ZXJWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsIiRzdGF0ZUNvbnRhaW5lciIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCIkc2hhcmVkVmlzdWFsQ29udGFpbmVyIiwid2lkdGgiLCJoZWlnaHQiLCJvcmllbnRhdGlvbiIsInN0eWxlIiwicGF0aCIsIiRjb250YWluZXIiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kUmVwZWF0IiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFNpemUiLCJ2aWV3cG9ydFdpZHRoIiwic2V0VGltZW91dCIsIkNhbnZhc1ZpZXciLCJQbGF5ZXJFeHBlcmllbmNlIiwiYXNzZXRzRG9tYWluIiwiam9pbmVkIiwiaW5kZXgiLCJ3YWl0Rm9yU3RhcnRUb0pvaW4iLCJzaGFyZWRTeW50aENvbmZpZyIsInNoYXJlZFZpc3VhbHNDb25maWciLCJzcHJpdGVDb25maWciLCJhcmVhQ29uZmlnIiwia2lsbFRoZUJhbGxvb25zQ29uZmlnIiwiYXZvaWRUaGVSYWluQ29uZmlnIiwiaW5zdHJ1bWVudGFsQ29uZmlnIiwic2hhcmVkU3ludGhGaWxlcyIsIm1hcCIsImVudHJ5IiwiZmlsZW5hbWUiLCJraWxsVGhlQmFsbG9vbnNGaWxlcyIsImZpbGVzIiwiYXZvaWRUaGVSYWluU2luZXMiLCJzaW5lcyIsImF2b2lkVGhlUmFpbkdsaXRjaGVzIiwiZ2xpdGNoZXMiLCJpbnN0cnVtZW50YWxNdXNpYyIsImF1ZGlvRmlsZXMiLCJwbGF0Zm9ybSIsInJlcXVpcmUiLCJmZWF0dXJlcyIsImNoZWNraW4iLCJzaG93RGlhbG9nIiwiYXVkaW9CdWZmZXJNYW5hZ2VyIiwiZ3JvdXBGaWx0ZXIiLCJkaXJlY3Rpb25zIiwiaW1hZ2VNYW5hZ2VyIiwiZ3JvdXBzIiwiZmlsZSIsInNoYXJlZFBhcmFtcyIsInN5bmMiLCJzY2hlZHVsZXIiLCJfc2V0U3RhdGUiLCJiaW5kIiwiX29uQ29tcGFzc1VwZGF0ZSIsIl9zZXRWb2x1bWUiLCJfb25TaGFyZWRWaXN1YWxUcmlnZ2VyIiwiX29uVG91Y2hTdGFydCIsIl9hY2NlbGVyYXRpb25MaXN0ZW5lcnMiLCJfY29tcGFzc0xpc3RlbmVycyIsImltYWdlIiwiZ2V0QXNDYW52YXMiLCJoYWxmU2l6ZUltYWdlIiwiZ2V0QXNIYWxmU2l6ZUNhbnZhcyIsImNvbG9ycyIsInZpZXciLCJwcmVzZXJ2ZVBpeGVsUmF0aW8iLCJyYXRpb3MiLCJzaG93IiwidGhlbiIsIiRleGl0QnRuIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiJG11dGVCdG4iLCJhY3RpdmUiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNvbnNvbGUiLCJsb2ciLCJyZW1vdmUiLCJnYWluIiwidmFsdWUiLCJhZGQiLCJwYXNzaXZlIiwiJGNyZWRpdHNXcmFwcGVyIiwiJGNyZWRpdHMxIiwiJGNyZWRpdHMyIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsIm1hc3RlciIsInNldFByZVJlbmRlciIsImN0eCIsImR0IiwiY2xlYXJSZWN0Iiwic2hhcmVkU3ludGgiLCJTaGFyZWRTeW50aCIsImdldCIsImdldEF1ZGlvRGVzdGluYXRpb24iLCJzaGFyZWRWaXN1YWxzIiwiU2hhcmVkVmlzdWFscyIsImFkZFJlbmRlcmVyIiwicmVjZWl2ZSIsInBpdGNoIiwicmVzIiwibm90ZU9uIiwidHJpZ2dlciIsImdyb3VwIiwic3VzdGFpbmVkIiwiZHVyYXRpb24iLCJub3RlT2ZmIiwic3RvcCIsImFkZENvbXBhc3NMaXN0ZW5lciIsInVwZGF0ZUdyb3VwIiwia2lsbCIsInN0YXJ0TGlzdGVuaW5nIiwiYWRkTGlzdGVuZXIiLCJhZGRQYXJhbUxpc3RlbmVyIiwidG90YWxUaW1lIiwiX3BsYXlJbnN0cnVtZW50YWxQYXJ0Iiwic3luY1RpbWUiLCJzdGF0ZSIsImN1cnJlbnRTdGF0ZSIsImRlZmVyIiwicGFnZUlkIiwiYnVmZmVyT2Zmc2V0IiwiYnVmZmVyIiwibm93IiwiY3VycmVudFRpbWUiLCJzcmMiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJzdGFydCIsImUiLCJuYW1lIiwiY3RvciIsIkVycm9yIiwiX3N0YXRlIiwiZXhpdCIsImhpZGVTaGFyZWRWaXN1YWwiLCJlbnRlciIsIl9jdXJyZW50U3RhdGVOYW1lIiwic2hvd1NoYXJlZFZpc3VhbCIsImlkIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiZGVsZXRlIiwiYXJncyIsImZvckVhY2giLCJFeHBlcmllbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFBWUEsVTs7QUFDWjs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQVJBO0FBVUEsSUFBTUMsZUFBZUQsV0FBV0MsWUFBaEM7O0FBbkJBOztBQW9CQSxJQUFNQyxTQUFTRixXQUFXRSxNQUExQjs7QUFFQSxJQUFNQyxTQUFTO0FBQ2JDLFFBQU1D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QUFPO0FBQzVCLFVBQUlBLFVBQVUsTUFBZCxFQUNFLEtBQUt5RCxnQkFBTCxHQURGLEtBR0UsS0FBS0csZ0JBQUwsQ0FBc0I1RCxLQUF0QjtBQUNIOzs7cUNBRWdCNkQsRSxFQUFJO0FBQ25CLFVBQU16SSxPQUFPLEtBQUtlLG1CQUFMLENBQXlCMEgsRUFBekIsQ0FBYjtBQUNBLFdBQUs3RSxJQUFMLENBQVU0RSxnQkFBVixDQUEyQnhJLElBQTNCO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsV0FBSzRELElBQUwsQ0FBVXlFLGdCQUFWO0FBQ0Q7Ozt1Q0FFa0JLLE8sRUFBU0MsUSxFQUFVO0FBQ3BDLFVBQUksQ0FBQyxLQUFLckYsaUJBQUwsQ0FBdUJvRixPQUF2QixDQUFMLEVBQ0UsS0FBS3BGLGlCQUFMLENBQXVCb0YsT0FBdkIsSUFBa0MsbUJBQWxDOztBQUVGLFdBQUtwRixpQkFBTCxDQUF1Qm9GLE9BQXZCLEVBQWdDN0QsR0FBaEMsQ0FBb0M4RCxRQUFwQztBQUNEOzs7MENBRXFCRCxPLEVBQVNDLFEsRUFBVTtBQUN2QyxVQUFJLEtBQUtyRixpQkFBTCxDQUF1Qm9GLE9BQXZCLENBQUosRUFDRSxLQUFLcEYsaUJBQUwsQ0FBdUJvRixPQUF2QixFQUFnQ0UsTUFBaEMsQ0FBdUNELFFBQXZDO0FBQ0g7OztxQ0FFZ0JELE8sRUFBa0I7QUFBQSx3Q0FBTkcsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ2pDLFVBQUksS0FBS3ZGLGlCQUFMLENBQXVCb0YsT0FBdkIsQ0FBSixFQUNFLEtBQUtwRixpQkFBTCxDQUF1Qm9GLE9BQXZCLEVBQWdDSSxPQUFoQyxDQUF3QztBQUFBLGVBQVlILDBCQUFZRSxJQUFaLENBQVo7QUFBQSxPQUF4QztBQUNIOzs7RUF4VjRCdEwsV0FBV3dMLFU7O2tCQTJWM0J0SSxnQiIsImZpbGUiOiJQbGF5ZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgU2hhcmVkU3ludGggZnJvbSAnLi9hdWRpby9TaGFyZWRTeW50aCc7XG5pbXBvcnQgU2hhcmVkVmlzdWFscyBmcm9tICcuL3JlbmRlcmVycy9TaGFyZWRWaXN1YWxzJztcblxuLy8gY29uZmlnXG5pbXBvcnQgc3ByaXRlQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEvc3ByaXRlLWNvbmZpZy5qc29uJztcbmltcG9ydCBzaGFyZWRWaXN1YWxzQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEvc2hhcmVkLXZpc3VhbHMtY29uZmlnLmpzb24nO1xuaW1wb3J0IHNoYXJlZFN5bnRoQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEvc2hhcmVkLXN5bnRoLWNvbmZpZy5qc29uJztcbmltcG9ydCBhcmVhQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEvYXJlYS1jb25maWcuanNvbic7XG5pbXBvcnQga2lsbFRoZUJhbGxvb25zQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEva2lsbC10aGUtYmFsbG9vbnMtY29uZmlnLmpzb24nO1xuaW1wb3J0IGF2b2lkVGhlUmFpbkNvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL2F2b2lkLXRoZS1yYWluLWNvbmZpZy5qc29uJztcbmltcG9ydCBpbnN0cnVtZW50YWxDb25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9pbnN0cnVtZW50YWwtY29uZmlnLmpzb24nO1xuXG4vLyBzdGF0ZXNcbmltcG9ydCBXYWl0U3RhdGUgZnJvbSAnLi9zdGF0ZXMvV2FpdFN0YXRlJztcbmltcG9ydCBDb21wYXNzU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQ29tcGFzc1N0YXRlJztcbmltcG9ydCBCYWxsb29uc0NvdmVyU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQmFsbG9vbnNDb3ZlclN0YXRlJztcbmltcG9ydCBLaWxsVGhlQmFsbG9vbnNTdGF0ZSBmcm9tICcuL3N0YXRlcy9LaWxsVGhlQmFsbG9vbnNTdGF0ZSc7XG5pbXBvcnQgSW50ZXJtZXp6b1N0YXRlIGZyb20gJy4vc3RhdGVzL0ludGVybWV6em9TdGF0ZSc7XG5pbXBvcnQgQXZvaWRUaGVSYWluU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQXZvaWRUaGVSYWluU3RhdGUnO1xuaW1wb3J0IFNjb3Jlc1N0YXRlIGZyb20gJy4vc3RhdGVzL1Njb3Jlc1N0YXRlJztcbmltcG9ydCBFbmRTdGF0ZSBmcm9tICcuL3N0YXRlcy9FbmRTdGF0ZSc7XG5cbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgY2xpZW50ID0gc291bmR3b3Jrcy5jbGllbnQ7XG5cbmNvbnN0IHN0YXRlcyA9IHtcbiAgd2FpdDogV2FpdFN0YXRlLFxuICBjb21wYXNzOiBDb21wYXNzU3RhdGUsXG4gIGJhbGxvb25zQ292ZXI6IEJhbGxvb25zQ292ZXJTdGF0ZSxcbiAga2lsbFRoZUJhbGxvb25zOiBLaWxsVGhlQmFsbG9vbnNTdGF0ZSxcbiAgaW50ZXJtZXp6bzogSW50ZXJtZXp6b1N0YXRlLFxuICBhdm9pZFRoZVJhaW46IEF2b2lkVGhlUmFpblN0YXRlLFxuICBzY29yZXM6IFNjb3Jlc1N0YXRlLFxuICBlbmQ6IEVuZFN0YXRlLFxufTtcblxuY29uc3QgZ2xvYmFsU3RhdGUgPSB7XG4gIHNjb3JlOiB7IHJlZDogMCwgYmx1ZTogMCwgcGluazogMCwgeWVsbG93OiAwIH0sXG4gIG11dGU6IGZhbHNlLFxufTtcblxuY29uc3Qgdmlld1RlbXBsYXRlID0gYFxuICA8ZGl2IGlkPVwibWVudVwiPlxuICAgIDxkaXYgaWQ9XCJtdXRlXCIgY2xhc3M9XCJtdXRlLWJ0blwiPjwvZGl2PlxuICAgIDxkaXYgaWQ9XCJleGl0XCIgY2xhc3M9XCJleGl0LWJ0blwiPjwvZGl2PlxuICA8L2Rpdj5cbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImNyZWRpdHMtd3JhcHBlciBoaWRkZW5cIj5cbiAgICA8ZGl2IGlkPVwiY3JlZGl0cy0xXCIgY2xhc3M9XCJjcmVkaXRzIHNtYWxsIGhpZGRlblwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJvbGQgbm9ybWFsXCI+XG4gICAgICAgIEh1aWh1aSBDaGVuZyA8YnIgLz5cbiAgICAgICAgWW91ciBzbWFydGVzdCBjaG9pY2VcbiAgICAgIDwvZGl2PlxuICAgICAgPGJyIC8+XG4gICAgICA8c3BhbiBjbGFzcz1cImJvbGRcIj5PcmlnaW5hbCBhcHBsaWNhdGlvbjwvc3Bhbj5cbiAgICAgIDx1bCBzdHlsZT1cInBhZGRpbmc6IDA7XCI+XG4gICAgICAgIDxsaT5CZW5qYW1pbiBNYXR1c3pld3NraTwvbGk+XG4gICAgICAgIDxsaT5Ob3JiZXJ0IFNjaG5lbGw8L2xpPlxuICAgICAgICA8bGk+KElSQ0FNKTwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHNwYW4gY2xhc3M9XCJib2xkXCI+T25saW5lIGFkYXB0YXRpb248L3NwYW4+XG4gICAgICA8dWwgc3R5bGU9XCJwYWRkaW5nOiAwO1wiPjxsaT4gSm9zZXBoIExhcnJhbGRlIDwvbGk+PC91bD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGlkPVwiY3JlZGl0cy0yXCIgY2xhc3M9XCJjcmVkaXRzIHNtYWxsIGhpZGRlblwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJib2xkIG5vcm1hbFwiPiBFbnNlbWJsZSBNb3NhaWsgPC9zcGFuPiA8YnIgLz5cbiAgICAgIENoYXRzY2hhdHVyIEthbmFqYW4sIFZpb2xpbiA8YnIgLz5cbiAgICAgIEthcmVuIExvcmVueiwgVmlvbGEgPGJyIC8+XG4gICAgICBDaHJpc3RpYW4gVm9nZWwsIENsYXJpbmV0IDxiciAvPlxuICAgICAgRXJuc3QgU3VyYmVyZywgUGlhbm8gPGJyIC8+PGJyIC8+XG4gICAgICA8aW1nIHNyYz1cIi9pbWFnZXMvcHJvZC1sb2dvLnBuZ1wiIHN0eWxlPVwid2lkdGg6IDI1MHB4O1wiIC8+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGlkPVwic2hhcmVkLXZpc3VhbC1jb250YWluZXJcIiBjbGFzcz1cImJhY2tncm91bmRcIj48L2Rpdj5cbiAgPGRpdiBpZD1cInN0YXRlLWNvbnRhaW5lclwiIGNsYXNzPVwiZm9yZWdyb3VuZFwiPjwvZGl2PlxuICA8ZGl2IGlkPVwic2hhcmVkLXZpc3VhbC1jb250YWluZXJcIj48L2Rpdj5cbmA7XG5cbmNsYXNzIFBsYXllclZpZXcgZXh0ZW5kcyBzb3VuZHdvcmtzLkNhbnZhc1ZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy4kc3RhdGVDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjc3RhdGUtY29udGFpbmVyJyk7XG4gICAgdGhpcy4kc2hhcmVkVmlzdWFsQ29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignI3NoYXJlZC12aXN1YWwtY29udGFpbmVyJyk7XG4gIH1cblxuICBvblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKTtcblxuICAgIHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgfVxuXG4gIHNob3dTaGFyZWRWaXN1YWwocGF0aCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXI7XG4gICAgJGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7cGF0aH0pYDtcbiAgICAkY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAkY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAkY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuXG4gICAgLy8gZm9yY2UgcmUtcmVuZGVyaW5nIGZvciBpT1NcbiAgICAkY29udGFpbmVyLnN0eWxlLndpZHRoID0gJzBweCc7XG4gICAgY29uc3Qgd2lkdGggPSBgJHt0aGlzLnZpZXdwb3J0V2lkdGh9cHhgO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoLCAwKTtcbiAgfVxuXG4gIGhpZGVTaGFyZWRWaXN1YWwoKSB7XG4gICAgLy8gaWYgKHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lcilcbiAgICAgIHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnJztcbiAgfVxuXG4gIGdldFN0YXRlQ29udGFpbmVyKCkge1xuICAgIHJldHVybiB0aGlzLiRzdGF0ZUNvbnRhaW5lcjtcbiAgfVxufVxuXG5jbGFzcyBQbGF5ZXJFeHBlcmllbmNlIGV4dGVuZHMgc291bmR3b3Jrcy5FeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3IoYXNzZXRzRG9tYWluKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIGZsYWcgdG8gYWxsb3cgd2FpdGluZyBmb3IgbmV4dCBcIndhaXRcIiBzdGF0ZVxuICAgIHRoaXMuam9pbmVkID0gZmFsc2U7XG4gICAgdGhpcy5pbmRleCA9IDA7XG5cbiAgICAvLyBUSElTIEFMTE9XUyBUTyBGT1JDRSBUSEUgVVNFUlMgVE8gV0FJVCBGT1IgVEhFIFBJRUNFIFRPIFNUQVJUIFRPIEJFIEFCTEUgVE8gSk9JTiA6XG4gICAgdGhpcy53YWl0Rm9yU3RhcnRUb0pvaW4gPSB0cnVlO1xuXG4gICAgLy8gY29uZmlndXJhdGlvbnNcbiAgICB0aGlzLnNoYXJlZFN5bnRoQ29uZmlnID0gc2hhcmVkU3ludGhDb25maWc7XG4gICAgdGhpcy5zaGFyZWRWaXN1YWxzQ29uZmlnID0gc2hhcmVkVmlzdWFsc0NvbmZpZztcbiAgICB0aGlzLnNwcml0ZUNvbmZpZyA9IHNwcml0ZUNvbmZpZztcbiAgICB0aGlzLmFyZWFDb25maWcgPSBhcmVhQ29uZmlnO1xuICAgIHRoaXMua2lsbFRoZUJhbGxvb25zQ29uZmlnID0ga2lsbFRoZUJhbGxvb25zQ29uZmlnO1xuICAgIHRoaXMuYXZvaWRUaGVSYWluQ29uZmlnID0gYXZvaWRUaGVSYWluQ29uZmlnO1xuICAgIHRoaXMuaW5zdHJ1bWVudGFsQ29uZmlnID0gaW5zdHJ1bWVudGFsQ29uZmlnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHByZXBhcmUgcGF0aHMgZm9yIGF1ZGlvIGZpbGVzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgY29uc3Qgc2hhcmVkU3ludGhGaWxlcyA9IHNoYXJlZFN5bnRoQ29uZmlnLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIHJldHVybiBgc291bmRzL3NoYXJlZC1zeW50aC8ke2VudHJ5LmZpbGVuYW1lfWA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBraWxsVGhlQmFsbG9vbnNGaWxlcyA9IGtpbGxUaGVCYWxsb29uc0NvbmZpZy5maWxlcy5tYXAoKGZpbGVuYW1lKSA9PiB7XG4gICAgICByZXR1cm4gYHNvdW5kcy9raWxsLXRoZS1iYWxsb29ucy8ke2ZpbGVuYW1lfWA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhdm9pZFRoZVJhaW5TaW5lcyA9IGF2b2lkVGhlUmFpbkNvbmZpZy5zaW5lcy5tYXAoZmlsZW5hbWUgPT4ge1xuICAgICAgcmV0dXJuIGBzb3VuZHMvYXZvaWQtdGhlLXJhaW4vJHtmaWxlbmFtZX1gO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYXZvaWRUaGVSYWluR2xpdGNoZXMgPSBhdm9pZFRoZVJhaW5Db25maWcuZ2xpdGNoZXMubWFwKGZpbGVuYW1lID0+IHtcbiAgICAgIHJldHVybiBgc291bmRzL2F2b2lkLXRoZS1yYWluLyR7ZmlsZW5hbWV9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGluc3RydW1lbnRhbE11c2ljID0gaW5zdHJ1bWVudGFsQ29uZmlnLmZpbGVzLm1hcCgoZmlsZW5hbWUpID0+IHtcbiAgICAgIHJldHVybiBgc291bmRzL2luc3RydW1lbnRhbC8ke2ZpbGVuYW1lfWA7XG4gICAgfSk7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBjb25zdCBhdWRpb0ZpbGVzID0ge1xuICAgICAgJ3NoYXJlZC1zeW50aCc6IHNoYXJlZFN5bnRoRmlsZXMsXG4gICAgICAna2lsbC10aGUtYmFsbG9vbnMnOiBraWxsVGhlQmFsbG9vbnNGaWxlcyxcbiAgICAgICdhdm9pZC10aGUtcmFpbjpzaW5lcyc6IGF2b2lkVGhlUmFpblNpbmVzLFxuICAgICAgJ2F2b2lkLXRoZS1yYWluOmdsaXRjaGVzJzogYXZvaWRUaGVSYWluR2xpdGNoZXMsXG4gICAgICAnaW5zdHJ1bWVudGFsLW11c2ljJzogaW5zdHJ1bWVudGFsTXVzaWMsXG4gICAgfTtcblxuICAgIHRoaXMucGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogWyd3ZWItYXVkaW8nLCAnZGV2aWNlLXNlbnNvciddIH0pO1xuXG4gICAgdGhpcy5jaGVja2luID0gdGhpcy5yZXF1aXJlKCdjaGVja2luJywgeyBzaG93RGlhbG9nOiBmYWxzZSB9KTtcbiAgICB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInLCB7XG4gICAgICBhc3NldHNEb21haW46IGFzc2V0c0RvbWFpbixcbiAgICAgIGZpbGVzOiBhdWRpb0ZpbGVzLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ncm91cEZpbHRlciA9IHRoaXMucmVxdWlyZSgnZ3JvdXAtZmlsdGVyJywge1xuICAgICAgZGlyZWN0aW9uczogYXJlYUNvbmZpZy5kaXJlY3Rpb25zLFxuICAgIH0pO1xuXG4gICAgLy8gbG9hZCBoZXJlIGluc3RlYWQgb2YgcGxhdGZvcm1cbiAgICB0aGlzLmltYWdlTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnaW1hZ2UtbWFuYWdlcicsIHtcbiAgICAgIGZpbGVzOiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgICdzcHJpdGU6Ymx1ZSc6IHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5ibHVlLmZpbGUsXG4gICAgICAgICdzcHJpdGU6cGluayc6IHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5waW5rLmZpbGUsXG4gICAgICAgICdzcHJpdGU6eWVsbG93JzogdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnllbGxvdy5maWxlLFxuICAgICAgICAnc3ByaXRlOnJlZCc6IHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5yZWQuZmlsZSxcbiAgICAgIH0sIHRoaXMuc2hhcmVkVmlzdWFsc0NvbmZpZyksXG4gICAgfSk7XG5cbiAgICB0aGlzLnNoYXJlZFBhcmFtcyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLXBhcmFtcycpO1xuICAgIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuXG4gICAgdGhpcy5fc2V0U3RhdGUgPSB0aGlzLl9zZXRTdGF0ZS5iaW5kKHRoaXMpO1xuICAgIC8vIHRoaXMuX29uQWNjZWxlcmF0aW9uID0gdGhpcy5fb25BY2NlbGVyYXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNvbXBhc3NVcGRhdGUgPSB0aGlzLl9vbkNvbXBhc3NVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZXRWb2x1bWUgPSB0aGlzLl9zZXRWb2x1bWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNoYXJlZFZpc3VhbFRyaWdnZXIgPSB0aGlzLl9vblNoYXJlZFZpc3VhbFRyaWdnZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblRvdWNoU3RhcnQgPSB0aGlzLl9vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2FjY2VsZXJhdGlvbkxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzID0ge307XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gcG9wdWxhdGUgc3ByaXRlQ29uZmlnIHdpdGggdGhlIHNwcml0ZSBpbWFnZXNcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMuYmx1ZS5pbWFnZSA9IHRoaXMuaW1hZ2VNYW5hZ2VyLmdldEFzQ2FudmFzKCdzcHJpdGU6Ymx1ZScpO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5waW5rLmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTpwaW5rJyk7XG4gICAgdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnllbGxvdy5pbWFnZSA9IHRoaXMuaW1hZ2VNYW5hZ2VyLmdldEFzQ2FudmFzKCdzcHJpdGU6eWVsbG93Jyk7XG4gICAgdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnJlZC5pbWFnZSA9IHRoaXMuaW1hZ2VNYW5hZ2VyLmdldEFzQ2FudmFzKCdzcHJpdGU6cmVkJyk7XG5cbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMuYmx1ZS5oYWxmU2l6ZUltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNIYWxmU2l6ZUNhbnZhcygnc3ByaXRlOmJsdWUnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucGluay5oYWxmU2l6ZUltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNIYWxmU2l6ZUNhbnZhcygnc3ByaXRlOnBpbmsnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMueWVsbG93LmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6eWVsbG93Jyk7XG4gICAgdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnJlZC5oYWxmU2l6ZUltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNIYWxmU2l6ZUNhbnZhcygnc3ByaXRlOnJlZCcpO1xuXG4gICAgdGhpcy5zcHJpdGVDb25maWcuY29sb3JzID0gT2JqZWN0LmtleXModGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzKTtcblxuICAgIC8vIGluaXRpYWxpemUgdGhlIHZpZXdcbiAgICB0aGlzLnZpZXcgPSBuZXcgUGxheWVyVmlldyh2aWV3VGVtcGxhdGUsIHt9LCB7fSwge1xuICAgICAgcHJlc2VydmVQaXhlbFJhdGlvOiBmYWxzZSxcbiAgICAgIHJhdGlvczogeyAnI3N0YXRlLWNvbnRhaW5lcic6IDEgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2hvdygpLnRoZW4oKCkgPT4ge1xuXG4gICAgICB0aGlzLiRleGl0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2V4aXQnKTtcbiAgICAgIHRoaXMuJGV4aXRCdG4uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5qb2luZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2V0U3RhdGUoJ3dhaXQnKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGlzIGFsbG93cyBtdXRlIGJ0biB0byBzdGF5IHJlYWN0aXZlIHRocm91Z2ggc3RhdGUgY2hhbmdlc1xuICAgICAgLy8gKGRvbid0IGFzayB3aHkpXG4gICAgICB0aGlzLiRtdXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI211dGUnKTtcbiAgICAgIHRoaXMuJG11dGVCdG4uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlID0gdGhpcy4kbXV0ZUJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ29uJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhY3RpdmUgOiAnICsgKGFjdGl2ZSA/ICd5ZXMnIDogJ25vJykpO1xuXG4gICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLiRtdXRlQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ29uJyk7XG4gICAgICAgICAgdGhpcy5tdXRlLmdhaW4udmFsdWUgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuJG11dGVCdG4uY2xhc3NMaXN0LmFkZCgnb24nKTtcbiAgICAgICAgICB0aGlzLm11dGUuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0sIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcblxuICAgICAgdGhpcy4kY3JlZGl0c1dyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3JlZGl0cy13cmFwcGVyJyk7XG4gICAgICB0aGlzLiRjcmVkaXRzMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjcmVkaXRzLTEnKTtcbiAgICAgIHRoaXMuJGNyZWRpdHMyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NyZWRpdHMtMicpO1xuXG4gICAgICAvLyBhdWRpbyBhcGlcbiAgICAgIHRoaXMubXV0ZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICB0aGlzLm11dGUuZ2Fpbi52YWx1ZSA9IDE7XG4gICAgICB0aGlzLm11dGUuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG4gICAgICAvLyBtYXN0ZXIgYXVkaW9cbiAgICAgIHRoaXMubWFzdGVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIHRoaXMubWFzdGVyLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgIHRoaXMubWFzdGVyLmdhaW4udmFsdWUgPSAxO1xuXG4gICAgICAvLyBnbG9iYWwgdmlld1xuICAgICAgdGhpcy52aWV3LnNldFByZVJlbmRlcigoY3R4LCBkdCwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGdsb2JhbCBzeW50aCBhbmQgdmlzdWFscyAoSHVpaHVpIGNvbnRyb2xsZWQpXG4gICAgICB0aGlzLnNoYXJlZFN5bnRoID0gbmV3IFNoYXJlZFN5bnRoKFxuICAgICAgICB0aGlzLnNoYXJlZFN5bnRoQ29uZmlnLFxuICAgICAgICB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlci5nZXQoJ3NoYXJlZC1zeW50aCcpLFxuICAgICAgICB0aGlzLmdyb3VwRmlsdGVyLFxuICAgICAgICB0aGlzLmdldEF1ZGlvRGVzdGluYXRpb24oKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5zaGFyZWRWaXN1YWxzID0gbmV3IFNoYXJlZFZpc3VhbHModGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzKTtcblxuICAgICAgdGhpcy52aWV3LmFkZFJlbmRlcmVyKHRoaXMuc2hhcmVkVmlzdWFscyk7XG5cbiAgICAgIC8vIEB0b2RvIC0gcmV2aXNlIGFsbCB0aGlzLCB0aGlzIGlzIGZhciBmcm9tIHJlYWxseSBlZmZpY2llbnRcbiAgICAgIHRoaXMucmVjZWl2ZSgnbm90ZTpvbicsIChwaXRjaCkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnNoYXJlZFN5bnRoLm5vdGVPbihwaXRjaCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMudHJpZ2dlcihyZXMuZ3JvdXAsIHJlcy5zdXN0YWluZWQsIHJlcy5kdXJhdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZWNlaXZlKCdub3RlOm9mZicsIChwaXRjaCkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnNoYXJlZFN5bnRoLm5vdGVPZmYocGl0Y2gpO1xuXG4gICAgICAgIGlmIChyZXMgIT09IG51bGwpXG4gICAgICAgICAgdGhpcy5zaGFyZWRWaXN1YWxzLnN0b3AocmVzLmdyb3VwKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFkZENvbXBhc3NMaXN0ZW5lcignZ3JvdXAnLCAoZ3JvdXApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5zaGFyZWRTeW50aC51cGRhdGVHcm91cChncm91cCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMudHJpZ2dlcihyZXMuZ3JvdXAsIHJlcy5zdXN0YWluZWQsIHJlcy5kdXJhdGlvbik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMua2lsbCgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvblxuICAgICAgdGhpcy5ncm91cEZpbHRlci5zdGFydExpc3RlbmluZygpO1xuICAgICAgdGhpcy5ncm91cEZpbHRlci5hZGRMaXN0ZW5lcih0aGlzLl9vbkNvbXBhc3NVcGRhdGUpO1xuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignZ2xvYmFsOnZvbHVtZScsIHRoaXMuX3NldFZvbHVtZSk7XG4gICAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdnbG9iYWw6c2hhcmVkLXZpc3VhbCcsIHRoaXMuX29uU2hhcmVkVmlzdWFsVHJpZ2dlcik7XG5cbiAgICAgIHRoaXMucmVjZWl2ZSgndGltZWxpbmU6cG9zaXRpb24nLCAoaW5kZXgsIHRvdGFsVGltZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRvdGFsVGltZSk7XG4gICAgICAgIHRoaXMuX3BsYXlJbnN0cnVtZW50YWxQYXJ0KGluZGV4LCB0b3RhbFRpbWUpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVjZWl2ZSgnc3RhdGU6aW5kZXgnLCBpbmRleCA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuam9pbmVkID0gdHJ1ZTtcbiAgICAgICAgICBnbG9iYWxTdGF0ZS5zY29yZSA9IHsgcmVkOiAwLCBibHVlOiAwLCBwaW5rOiAwLCB5ZWxsb3c6IDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9yIHVuY29tbWVudCB0aGlzIGlmIGFuZCBwbGF5IGN1cnJlbnQgcGFydCBmcm9tIGN1cnJlbnQgcG9zaXRpb24gd2hlbiBjbGllbnRzIGpvaW5cbiAgICAgICAgLy8gbGlrZSB0aGlzLCByZW1haW5zIHNpbGVudFxuICAgICAgICAvLyBpZiAodGhpcy5qb2luZWQpIHtcbiAgICAgICAgICB0aGlzLl9wbGF5SW5zdHJ1bWVudGFsUGFydChpbmRleCk7XG4gICAgICAgIC8vIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlY2VpdmUoJ2dsb2JhbDpzdGF0ZScsIChzeW5jVGltZSwgc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCh0aGlzLndhaXRGb3JTdGFydFRvSm9pbiAmJiB0aGlzLmpvaW5lZCkgfHwgIXRoaXMud2FpdEZvclN0YXJ0VG9Kb2luKSB7XG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuZGVmZXIoKCkgPT4gdGhpcy5fc2V0U3RhdGUoc3RhdGUpLCBzeW5jVGltZSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gJ3dhaXQnO1xuXG4gICAgICBpZiAodGhpcy53YWl0Rm9yU3RhcnRUb0pvaW4pIHtcbiAgICAgICAgdGhpcy5fc2V0U3RhdGUodGhpcy5jdXJyZW50U3RhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0QXVkaW9EZXN0aW5hdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXN0ZXI7XG4gIH1cblxuICBzaG93Q3JlZGl0c1BhZ2UocGFnZUlkID0gMCkge1xuICAgIGlmIChwYWdlSWQgPT09IDEgJiYgdGhpcy5jdXJyZW50U3RhdGUgPT09ICd3YWl0Jykge1xuICAgICAgdGhpcy4kY3JlZGl0czIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICB0aGlzLiRjcmVkaXRzMS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuJGNyZWRpdHNXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH0gZWxzZSBpZiAocGFnZUlkID09PSAyICYmIHRoaXMuY3VycmVudFN0YXRlID09PSAnc2NvcmVzJykge1xuICAgICAgdGhpcy4kY3JlZGl0czEuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICB0aGlzLiRjcmVkaXRzMi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuJGNyZWRpdHNXcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRjcmVkaXRzV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cblxuICBfcGxheUluc3RydW1lbnRhbFBhcnQoaW5kZXgsIGJ1ZmZlck9mZnNldCA9IDApIHtcbiAgICBjb25zb2xlLmxvZygncGxheWluZyBwYXJ0ICcgKyBpbmRleCk7XG4gICAgLy8gY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmJhY2tncm91bmRCdWZmZXJzLmxlbmd0aCk7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZ2V0KCdpbnN0cnVtZW50YWwtbXVzaWMnKVtpbmRleF07XG4gICAgLy8gY29uc3QgYnVmZmVyID0gdGhpcy5iYWNrZ3JvdW5kQnVmZmVyc1tpbmRleF07XG4gICAgY29uc3QgZHVyYXRpb24gPSBidWZmZXIuZHVyYXRpb24gLSBidWZmZXJPZmZzZXQ7XG4gICAgY29uc3Qgbm93ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIC8vIGNvbnN0IGRldHVuZSA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogMTIwMDtcbiAgICAvLyBjb25zdCByZXNhbXBsaW5nID0gTWF0aC5yYW5kb20oKSAqIDEuNSArIDAuNTtcblxuICAgIGNvbnN0IHNyYyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICBzcmMuYnVmZmVyID0gYnVmZmVyO1xuXG4gICAgLy8gY29uc3QgZ2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgLy8gZ2Fpbi52YWx1ZSA9IDE7XG5cbiAgICBzcmMuY29ubmVjdCh0aGlzLm11dGUpO1xuICAgIC8vIGdhaW4uY29ubmVjdCh0aGlzLmdldEF1ZGlvRGVzdGluYXRpb24oKSk7XG4gICAgLy8gc3JjLnBsYXliYWNrUmF0ZS52YWx1ZSA9IHJlc2FtcGxpbmc7XG4gICAgc3JjLnN0YXJ0KG5vdywgYnVmZmVyT2Zmc2V0LCBkdXJhdGlvbik7IC8vIG9mZnNldCBpbiBzZWNvbmRzXG4gICAgLy8gc3JjLnN0b3Aobm93ICsgZHVyYXRpb24pOyAgICBcbiAgfVxuXG4gIF9vblRvdWNoU3RhcnQoZSkge1xuICAgIGNvbnNvbGUubG9nKCd0b3VjaGVkICEnKVxuICB9XG5cbiAgX3NldFZvbHVtZSh2YWx1ZSkge1xuICAgIHRoaXMubWFzdGVyLmdhaW4udmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIF9zZXRTdGF0ZShuYW1lKSB7XG4gICAgY29uc29sZS5sb2coJ3NldHRpbmcgc3RhdGUgJyArIG5hbWUpO1xuICAgIGNvbnN0IGN0b3IgPSBzdGF0ZXNbbmFtZV07XG5cbiAgICBpZiAoIWN0b3IpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc3RhdGU6IFwiJHtuYW1lfVwiYCk7XG5cbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBjdG9yKHRoaXMsIGdsb2JhbFN0YXRlLCBjbGllbnQpO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlKVxuICAgICAgdGhpcy5fc3RhdGUuZXhpdCgpO1xuXG4gICAgdGhpcy5oaWRlU2hhcmVkVmlzdWFsKCk7XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLl9zdGF0ZS5lbnRlcigpO1xuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZU5hbWUgPSBuYW1lO1xuICAgIHRoaXMuY3VycmVudFN0YXRlID0gbmFtZTtcblxuICAgIC8vIGRpc3BsYXkgZXhpdCBidXR0b24gd2hlbiB3ZSBhcmUgbm90IHdhaXRpbmdcbiAgICAvLyBOT1BFICEgdGhpcyByZW1vdmVzIGV2ZW50IGxpc3RlbmVycyA6KFxuICAgIC8vIHRoaXMudmlldy5tb2RlbC5zaG93RXhpdEJ0biA9IChuYW1lICE9PSAnd2FpdCcpO1xuICAgIC8vIHRoaXMudmlldy5yZW5kZXIoJyNtZW51Jyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ3dhaXQnKSB7XG4gICAgICB0aGlzLiRleGl0QnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRleGl0QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIF9vblNoYXJlZFZpc3VhbFRyaWdnZXIodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdub25lJylcbiAgICAgIHRoaXMuaGlkZVNoYXJlZFZpc3VhbCgpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2hvd1NoYXJlZFZpc3VhbCh2YWx1ZSk7XG4gIH1cblxuICBzaG93U2hhcmVkVmlzdWFsKGlkKSB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuc2hhcmVkVmlzdWFsc0NvbmZpZ1tpZF07XG4gICAgdGhpcy52aWV3LnNob3dTaGFyZWRWaXN1YWwocGF0aCk7XG4gIH1cblxuICBoaWRlU2hhcmVkVmlzdWFsKCkge1xuICAgIHRoaXMudmlldy5oaWRlU2hhcmVkVmlzdWFsKCk7XG4gIH1cblxuICBhZGRDb21wYXNzTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXS5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ29tcGFzc0xpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICBfb25Db21wYXNzVXBkYXRlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyRXhwZXJpZW5jZTtcbiJdfQ==