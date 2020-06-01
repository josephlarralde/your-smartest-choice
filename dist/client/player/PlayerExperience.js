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

var _EmptyState = require('./states/EmptyState');

var _EmptyState2 = _interopRequireDefault(_EmptyState);

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

// config
var audioContext = soundworks.audioContext;

// states

var client = soundworks.client;

var states = {
  empty: _EmptyState2.default,
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

var viewTemplate = '\n  <div id="menu">\n    <div id="mute" class="mute-btn"></div>\n    <div id="exit" class="exit-btn"></div>\n  </div>\n  <canvas class="background"></canvas>\n  <div class="credits-wrapper hidden">\n\n    <div id="credits-1" class="credits small hidden">\n      <div class="bold big">\n        <a target="_blank" href="https://huihuicheng.com/">Huihui Cheng</a>\n      </div>\n      <br />\n      <div class="bold normal">\n        Your smartest choice\n      </div>\n      <br />\n      <div>\n        For 4 musicians, electronics and participating audience\n      </div>\n    </div>\n\n    <div id="credits-2" class="credits small hidden">\n      <span class="bold normal">Original application</span>\n      <ul style="padding: 0;">\n        <li>Benjamin Matuszewski</li>\n        <li>Norbert Schnell</li>\n        <li><a target="_blank" href="https://ismm.ircam.fr/">IRCAM</a></li>\n      </ul>\n      <span class="bold normal">Online adaptation</span>\n      <ul style="padding: 0;">\n      <li><a target="_blank" href="https://www.josephlarralde.fr">Joseph Larralde</a></li>\n      </ul>\n    </div>\n\n    <div id="credits-3" class="credits small hidden">\n      This game is a simulation of the performance situation with an extract of the original piece as background music.\n      <br /> <br />\n      All the phones are synchronized to the score and play the piece in loop, so one could play as single or in groups.\n      <br /> <br />\n      Enjoy!\n    </div>\n\n    <div id="credits-4" class="credits small hidden">\n      <span class="bold normal"> Ensemble Mosaik </span>\n      <br />\n      <br />\n      Chatschatur Kanajan, Violin\n      <br />\n      Karen Lorenz, Viola\n      <br />\n      Christian Vogel, Clarinet\n      <br />\n      Ernst Surberg, Piano\n      <br />\n      <br />\n      <br />\n      <img src="/images/prod-logo-1.png" style="width: 200px;" />\n      <br />\n      <br />\n      <img src="/images/prod-logo-2.png" style="width: 200px;" />\n    </div>\n\n  </div>\n  <div id="shared-visual-container" class="background"></div>\n  <div id="state-container" class="foreground"></div>\n  <div id="shared-visual-container"></div>\n';

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
    // this.waitForStartToJoin = false;

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
          // console.log('active : ' + (active ? 'yes' : 'no'));

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
        _this3.$credits3 = document.querySelector('#credits-3');
        _this3.$credits4 = document.querySelector('#credits-4');

        _this3.$credits = [_this3.$credits1, _this3.$credits2, _this3.$credits3, _this3.$credits4];

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
          if (_this3.currentState === 'wait') return;

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
          // console.log(index);
          // console.log(totalTime);
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

      this.$credits.forEach(function (c) {
        c.classList.add('hidden');
      });

      if (pageId === 1 && this.currentState === 'empty') {
        // this.$credits2.classList.add('hidden');
        this.$credits1.classList.remove('hidden');
        this.$creditsWrapper.classList.remove('hidden');
      } else if (pageId === 2 && this.currentState === 'empty') {
        this.$credits2.classList.remove('hidden');
        this.$creditsWrapper.classList.remove('hidden');
      } else if (pageId === 3 && this.currentState === 'empty') {
        this.$credits3.classList.remove('hidden');
        this.$creditsWrapper.classList.remove('hidden');
      } else if (pageId === 4 && this.currentState === 'scores') {
        // this.$credits1.classList.add('hidden');
        this.$credits4.classList.remove('hidden');
        this.$creditsWrapper.classList.remove('hidden');
      } else {
        // this.$credits1.classList.add('hidden');
        // this.$credits2.classList.add('hidden');
        this.$creditsWrapper.classList.add('hidden');
      }
    }
  }, {
    key: '_playInstrumentalPart',
    value: function _playInstrumentalPart(index) {
      var bufferOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (index < 1) return;
      // console.log('playing part ' + index);
      // index - 1 because first state doesn't have music
      var buffer = this.audioBufferManager.get('instrumental-music')[index - 1];
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
      // console.log('touched !')
    }
  }, {
    key: '_setVolume',
    value: function _setVolume(value) {
      this.master.gain.value = value;
    }
  }, {
    key: '_setState',
    value: function _setState(name) {
      // console.log('setting state ' + name);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsic291bmR3b3JrcyIsImF1ZGlvQ29udGV4dCIsImNsaWVudCIsInN0YXRlcyIsImVtcHR5IiwiRW1wdHlTdGF0ZSIsIndhaXQiLCJXYWl0U3RhdGUiLCJjb21wYXNzIiwiQ29tcGFzc1N0YXRlIiwiYmFsbG9vbnNDb3ZlciIsIkJhbGxvb25zQ292ZXJTdGF0ZSIsImtpbGxUaGVCYWxsb29ucyIsIktpbGxUaGVCYWxsb29uc1N0YXRlIiwiaW50ZXJtZXp6byIsIkludGVybWV6em9TdGF0ZSIsImF2b2lkVGhlUmFpbiIsIkF2b2lkVGhlUmFpblN0YXRlIiwic2NvcmVzIiwiU2NvcmVzU3RhdGUiLCJlbmQiLCJFbmRTdGF0ZSIsImdsb2JhbFN0YXRlIiwic2NvcmUiLCJyZWQiLCJibHVlIiwicGluayIsInllbGxvdyIsIm11dGUiLCJ2aWV3VGVtcGxhdGUiLCJQbGF5ZXJWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsIiRzdGF0ZUNvbnRhaW5lciIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCIkc2hhcmVkVmlzdWFsQ29udGFpbmVyIiwid2lkdGgiLCJoZWlnaHQiLCJvcmllbnRhdGlvbiIsInN0eWxlIiwicGF0aCIsIiRjb250YWluZXIiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kUmVwZWF0IiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFNpemUiLCJ2aWV3cG9ydFdpZHRoIiwic2V0VGltZW91dCIsIkNhbnZhc1ZpZXciLCJQbGF5ZXJFeHBlcmllbmNlIiwiYXNzZXRzRG9tYWluIiwiam9pbmVkIiwiaW5kZXgiLCJ3YWl0Rm9yU3RhcnRUb0pvaW4iLCJzaGFyZWRTeW50aENvbmZpZyIsInNoYXJlZFZpc3VhbHNDb25maWciLCJzcHJpdGVDb25maWciLCJhcmVhQ29uZmlnIiwia2lsbFRoZUJhbGxvb25zQ29uZmlnIiwiYXZvaWRUaGVSYWluQ29uZmlnIiwiaW5zdHJ1bWVudGFsQ29uZmlnIiwic2hhcmVkU3ludGhGaWxlcyIsIm1hcCIsImVudHJ5IiwiZmlsZW5hbWUiLCJraWxsVGhlQmFsbG9vbnNGaWxlcyIsImZpbGVzIiwiYXZvaWRUaGVSYWluU2luZXMiLCJzaW5lcyIsImF2b2lkVGhlUmFpbkdsaXRjaGVzIiwiZ2xpdGNoZXMiLCJpbnN0cnVtZW50YWxNdXNpYyIsImF1ZGlvRmlsZXMiLCJwbGF0Zm9ybSIsInJlcXVpcmUiLCJmZWF0dXJlcyIsImNoZWNraW4iLCJzaG93RGlhbG9nIiwiYXVkaW9CdWZmZXJNYW5hZ2VyIiwiZ3JvdXBGaWx0ZXIiLCJkaXJlY3Rpb25zIiwiaW1hZ2VNYW5hZ2VyIiwiZ3JvdXBzIiwiZmlsZSIsInNoYXJlZFBhcmFtcyIsInN5bmMiLCJzY2hlZHVsZXIiLCJfc2V0U3RhdGUiLCJiaW5kIiwiX29uQ29tcGFzc1VwZGF0ZSIsIl9zZXRWb2x1bWUiLCJfb25TaGFyZWRWaXN1YWxUcmlnZ2VyIiwiX29uVG91Y2hTdGFydCIsIl9hY2NlbGVyYXRpb25MaXN0ZW5lcnMiLCJfY29tcGFzc0xpc3RlbmVycyIsImltYWdlIiwiZ2V0QXNDYW52YXMiLCJoYWxmU2l6ZUltYWdlIiwiZ2V0QXNIYWxmU2l6ZUNhbnZhcyIsImNvbG9ycyIsInZpZXciLCJwcmVzZXJ2ZVBpeGVsUmF0aW8iLCJyYXRpb3MiLCJzaG93IiwidGhlbiIsIiRleGl0QnRuIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiJG11dGVCdG4iLCJhY3RpdmUiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInJlbW92ZSIsImdhaW4iLCJ2YWx1ZSIsImFkZCIsInBhc3NpdmUiLCIkY3JlZGl0c1dyYXBwZXIiLCIkY3JlZGl0czEiLCIkY3JlZGl0czIiLCIkY3JlZGl0czMiLCIkY3JlZGl0czQiLCIkY3JlZGl0cyIsImNyZWF0ZUdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJtYXN0ZXIiLCJzZXRQcmVSZW5kZXIiLCJjdHgiLCJkdCIsImNsZWFyUmVjdCIsInNoYXJlZFN5bnRoIiwiU2hhcmVkU3ludGgiLCJnZXQiLCJnZXRBdWRpb0Rlc3RpbmF0aW9uIiwic2hhcmVkVmlzdWFscyIsIlNoYXJlZFZpc3VhbHMiLCJhZGRSZW5kZXJlciIsInJlY2VpdmUiLCJwaXRjaCIsImN1cnJlbnRTdGF0ZSIsInJlcyIsIm5vdGVPbiIsInRyaWdnZXIiLCJncm91cCIsInN1c3RhaW5lZCIsImR1cmF0aW9uIiwibm90ZU9mZiIsInN0b3AiLCJhZGRDb21wYXNzTGlzdGVuZXIiLCJ1cGRhdGVHcm91cCIsImtpbGwiLCJzdGFydExpc3RlbmluZyIsImFkZExpc3RlbmVyIiwiYWRkUGFyYW1MaXN0ZW5lciIsInRvdGFsVGltZSIsIl9wbGF5SW5zdHJ1bWVudGFsUGFydCIsInN5bmNUaW1lIiwic3RhdGUiLCJkZWZlciIsInBhZ2VJZCIsImZvckVhY2giLCJjIiwiYnVmZmVyT2Zmc2V0IiwiYnVmZmVyIiwibm93IiwiY3VycmVudFRpbWUiLCJzcmMiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJzdGFydCIsImUiLCJuYW1lIiwiY3RvciIsIkVycm9yIiwiX3N0YXRlIiwiZXhpdCIsImhpZGVTaGFyZWRWaXN1YWwiLCJlbnRlciIsIl9jdXJyZW50U3RhdGVOYW1lIiwic2hvd1NoYXJlZFZpc3VhbCIsImlkIiwiY2hhbm5lbCIsImNhbGxiYWNrIiwiZGVsZXRlIiwiYXJncyIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFsQkE7QUFvQkEsSUFBTUMsZUFBZUQsV0FBV0MsWUFBaEM7O0FBWEE7O0FBWUEs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RUYsV0FBS3ZGLGlCQUFMLENBQXVCdUYsT0FBdkIsRUFBZ0NsRSxHQUFoQyxDQUFvQ21FLFFBQXBDO0FBQ0Q7OzswQ0FFcUJELE8sRUFBU0MsUSxFQUFVO0FBQ3ZDLFVBQUksS0FBS3hGLGlCQUFMLENBQXVCdUYsT0FBdkIsQ0FBSixFQUNFLEtBQUt2RixpQkFBTCxDQUF1QnVGLE9BQXZCLEVBQWdDRSxNQUFoQyxDQUF1Q0QsUUFBdkM7QUFDSDs7O3FDQUVnQkQsTyxFQUFrQjtBQUFBLHdDQUFORyxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFDakMsVUFBSSxLQUFLMUYsaUJBQUwsQ0FBdUJ1RixPQUF2QixDQUFKLEVBQ0UsS0FBS3ZGLGlCQUFMLENBQXVCdUYsT0FBdkIsRUFBZ0NwQixPQUFoQyxDQUF3QztBQUFBLGVBQVlxQiwwQkFBWUUsSUFBWixDQUFaO0FBQUEsT0FBeEM7QUFDSDs7O0VBL1c0QjNMLFdBQVc0TCxVOztrQkFrWDNCeEksZ0IiLCJmaWxlIjoiUGxheWVyRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IFNoYXJlZFN5bnRoIGZyb20gJy4vYXVkaW8vU2hhcmVkU3ludGgnO1xuaW1wb3J0IFNoYXJlZFZpc3VhbHMgZnJvbSAnLi9yZW5kZXJlcnMvU2hhcmVkVmlzdWFscyc7XG5cbi8vIGNvbmZpZ1xuaW1wb3J0IHNwcml0ZUNvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL3Nwcml0ZS1jb25maWcuanNvbic7XG5pbXBvcnQgc2hhcmVkVmlzdWFsc0NvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL3NoYXJlZC12aXN1YWxzLWNvbmZpZy5qc29uJztcbmltcG9ydCBzaGFyZWRTeW50aENvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL3NoYXJlZC1zeW50aC1jb25maWcuanNvbic7XG5pbXBvcnQgYXJlYUNvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL2FyZWEtY29uZmlnLmpzb24nO1xuaW1wb3J0IGtpbGxUaGVCYWxsb29uc0NvbmZpZyBmcm9tICcuLi8uLi8uLi9kYXRhL2tpbGwtdGhlLWJhbGxvb25zLWNvbmZpZy5qc29uJztcbmltcG9ydCBhdm9pZFRoZVJhaW5Db25maWcgZnJvbSAnLi4vLi4vLi4vZGF0YS9hdm9pZC10aGUtcmFpbi1jb25maWcuanNvbic7XG5pbXBvcnQgaW5zdHJ1bWVudGFsQ29uZmlnIGZyb20gJy4uLy4uLy4uL2RhdGEvaW5zdHJ1bWVudGFsLWNvbmZpZy5qc29uJztcblxuLy8gc3RhdGVzXG5pbXBvcnQgRW1wdHlTdGF0ZSBmcm9tICcuL3N0YXRlcy9FbXB0eVN0YXRlJztcbmltcG9ydCBXYWl0U3RhdGUgZnJvbSAnLi9zdGF0ZXMvV2FpdFN0YXRlJztcbmltcG9ydCBDb21wYXNzU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQ29tcGFzc1N0YXRlJztcbmltcG9ydCBCYWxsb29uc0NvdmVyU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQmFsbG9vbnNDb3ZlclN0YXRlJztcbmltcG9ydCBLaWxsVGhlQmFsbG9vbnNTdGF0ZSBmcm9tICcuL3N0YXRlcy9LaWxsVGhlQmFsbG9vbnNTdGF0ZSc7XG5pbXBvcnQgSW50ZXJtZXp6b1N0YXRlIGZyb20gJy4vc3RhdGVzL0ludGVybWV6em9TdGF0ZSc7XG5pbXBvcnQgQXZvaWRUaGVSYWluU3RhdGUgZnJvbSAnLi9zdGF0ZXMvQXZvaWRUaGVSYWluU3RhdGUnO1xuaW1wb3J0IFNjb3Jlc1N0YXRlIGZyb20gJy4vc3RhdGVzL1Njb3Jlc1N0YXRlJztcbmltcG9ydCBFbmRTdGF0ZSBmcm9tICcuL3N0YXRlcy9FbmRTdGF0ZSc7XG5cbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHNvdW5kd29ya3MuYXVkaW9Db250ZXh0O1xuY29uc3QgY2xpZW50ID0gc291bmR3b3Jrcy5jbGllbnQ7XG5cbmNvbnN0IHN0YXRlcyA9IHtcbiAgZW1wdHk6IEVtcHR5U3RhdGUsXG4gIHdhaXQ6IFdhaXRTdGF0ZSxcbiAgY29tcGFzczogQ29tcGFzc1N0YXRlLFxuICBiYWxsb29uc0NvdmVyOiBCYWxsb29uc0NvdmVyU3RhdGUsXG4gIGtpbGxUaGVCYWxsb29uczogS2lsbFRoZUJhbGxvb25zU3RhdGUsXG4gIGludGVybWV6em86IEludGVybWV6em9TdGF0ZSxcbiAgYXZvaWRUaGVSYWluOiBBdm9pZFRoZVJhaW5TdGF0ZSxcbiAgc2NvcmVzOiBTY29yZXNTdGF0ZSxcbiAgZW5kOiBFbmRTdGF0ZSxcbn07XG5cbmNvbnN0IGdsb2JhbFN0YXRlID0ge1xuICBzY29yZTogeyByZWQ6IDAsIGJsdWU6IDAsIHBpbms6IDAsIHllbGxvdzogMCB9LFxuICBtdXRlOiBmYWxzZSxcbn07XG5cbmNvbnN0IHZpZXdUZW1wbGF0ZSA9IGBcbiAgPGRpdiBpZD1cIm1lbnVcIj5cbiAgICA8ZGl2IGlkPVwibXV0ZVwiIGNsYXNzPVwibXV0ZS1idG5cIj48L2Rpdj5cbiAgICA8ZGl2IGlkPVwiZXhpdFwiIGNsYXNzPVwiZXhpdC1idG5cIj48L2Rpdj5cbiAgPC9kaXY+XG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJjcmVkaXRzLXdyYXBwZXIgaGlkZGVuXCI+XG5cbiAgICA8ZGl2IGlkPVwiY3JlZGl0cy0xXCIgY2xhc3M9XCJjcmVkaXRzIHNtYWxsIGhpZGRlblwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJvbGQgYmlnXCI+XG4gICAgICAgIDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwczovL2h1aWh1aWNoZW5nLmNvbS9cIj5IdWlodWkgQ2hlbmc8L2E+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxiciAvPlxuICAgICAgPGRpdiBjbGFzcz1cImJvbGQgbm9ybWFsXCI+XG4gICAgICAgIFlvdXIgc21hcnRlc3QgY2hvaWNlXG4gICAgICA8L2Rpdj5cbiAgICAgIDxiciAvPlxuICAgICAgPGRpdj5cbiAgICAgICAgRm9yIDQgbXVzaWNpYW5zLCBlbGVjdHJvbmljcyBhbmQgcGFydGljaXBhdGluZyBhdWRpZW5jZVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGlkPVwiY3JlZGl0cy0yXCIgY2xhc3M9XCJjcmVkaXRzIHNtYWxsIGhpZGRlblwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJib2xkIG5vcm1hbFwiPk9yaWdpbmFsIGFwcGxpY2F0aW9uPC9zcGFuPlxuICAgICAgPHVsIHN0eWxlPVwicGFkZGluZzogMDtcIj5cbiAgICAgICAgPGxpPkJlbmphbWluIE1hdHVzemV3c2tpPC9saT5cbiAgICAgICAgPGxpPk5vcmJlcnQgU2NobmVsbDwvbGk+XG4gICAgICAgIDxsaT48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly9pc21tLmlyY2FtLmZyL1wiPklSQ0FNPC9hPjwvbGk+XG4gICAgICA8L3VsPlxuICAgICAgPHNwYW4gY2xhc3M9XCJib2xkIG5vcm1hbFwiPk9ubGluZSBhZGFwdGF0aW9uPC9zcGFuPlxuICAgICAgPHVsIHN0eWxlPVwicGFkZGluZzogMDtcIj5cbiAgICAgIDxsaT48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly93d3cuam9zZXBobGFycmFsZGUuZnJcIj5Kb3NlcGggTGFycmFsZGU8L2E+PC9saT5cbiAgICAgIDwvdWw+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGlkPVwiY3JlZGl0cy0zXCIgY2xhc3M9XCJjcmVkaXRzIHNtYWxsIGhpZGRlblwiPlxuICAgICAgVGhpcyBnYW1lIGlzIGEgc2ltdWxhdGlvbiBvZiB0aGUgcGVyZm9ybWFuY2Ugc2l0dWF0aW9uIHdpdGggYW4gZXh0cmFjdCBvZiB0aGUgb3JpZ2luYWwgcGllY2UgYXMgYmFja2dyb3VuZCBtdXNpYy5cbiAgICAgIDxiciAvPiA8YnIgLz5cbiAgICAgIEFsbCB0aGUgcGhvbmVzIGFyZSBzeW5jaHJvbml6ZWQgdG8gdGhlIHNjb3JlIGFuZCBwbGF5IHRoZSBwaWVjZSBpbiBsb29wLCBzbyBvbmUgY291bGQgcGxheSBhcyBzaW5nbGUgb3IgaW4gZ3JvdXBzLlxuICAgICAgPGJyIC8+IDxiciAvPlxuICAgICAgRW5qb3khXG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGlkPVwiY3JlZGl0cy00XCIgY2xhc3M9XCJjcmVkaXRzIHNtYWxsIGhpZGRlblwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJib2xkIG5vcm1hbFwiPiBFbnNlbWJsZSBNb3NhaWsgPC9zcGFuPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIENoYXRzY2hhdHVyIEthbmFqYW4sIFZpb2xpblxuICAgICAgPGJyIC8+XG4gICAgICBLYXJlbiBMb3JlbnosIFZpb2xhXG4gICAgICA8YnIgLz5cbiAgICAgIENocmlzdGlhbiBWb2dlbCwgQ2xhcmluZXRcbiAgICAgIDxiciAvPlxuICAgICAgRXJuc3QgU3VyYmVyZywgUGlhbm9cbiAgICAgIDxiciAvPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxpbWcgc3JjPVwiL2ltYWdlcy9wcm9kLWxvZ28tMS5wbmdcIiBzdHlsZT1cIndpZHRoOiAyMDBweDtcIiAvPlxuICAgICAgPGJyIC8+XG4gICAgICA8YnIgLz5cbiAgICAgIDxpbWcgc3JjPVwiL2ltYWdlcy9wcm9kLWxvZ28tMi5wbmdcIiBzdHlsZT1cIndpZHRoOiAyMDBweDtcIiAvPlxuICAgIDwvZGl2PlxuXG4gIDwvZGl2PlxuICA8ZGl2IGlkPVwic2hhcmVkLXZpc3VhbC1jb250YWluZXJcIiBjbGFzcz1cImJhY2tncm91bmRcIj48L2Rpdj5cbiAgPGRpdiBpZD1cInN0YXRlLWNvbnRhaW5lclwiIGNsYXNzPVwiZm9yZWdyb3VuZFwiPjwvZGl2PlxuICA8ZGl2IGlkPVwic2hhcmVkLXZpc3VhbC1jb250YWluZXJcIj48L2Rpdj5cbmA7XG5cbmNsYXNzIFBsYXllclZpZXcgZXh0ZW5kcyBzb3VuZHdvcmtzLkNhbnZhc1ZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy4kc3RhdGVDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjc3RhdGUtY29udGFpbmVyJyk7XG4gICAgdGhpcy4kc2hhcmVkVmlzdWFsQ29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignI3NoYXJlZC12aXN1YWwtY29udGFpbmVyJyk7XG4gIH1cblxuICBvblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKTtcblxuICAgIHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgfVxuXG4gIHNob3dTaGFyZWRWaXN1YWwocGF0aCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLiRzaGFyZWRWaXN1YWxDb250YWluZXI7XG4gICAgJGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7cGF0aH0pYDtcbiAgICAkY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAkY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAkY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuXG4gICAgLy8gZm9yY2UgcmUtcmVuZGVyaW5nIGZvciBpT1NcbiAgICAkY29udGFpbmVyLnN0eWxlLndpZHRoID0gJzBweCc7XG4gICAgY29uc3Qgd2lkdGggPSBgJHt0aGlzLnZpZXdwb3J0V2lkdGh9cHhgO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gJGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoLCAwKTtcbiAgfVxuXG4gIGhpZGVTaGFyZWRWaXN1YWwoKSB7XG4gICAgLy8gaWYgKHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lcilcbiAgICAgIHRoaXMuJHNoYXJlZFZpc3VhbENvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnJztcbiAgfVxuXG4gIGdldFN0YXRlQ29udGFpbmVyKCkge1xuICAgIHJldHVybiB0aGlzLiRzdGF0ZUNvbnRhaW5lcjtcbiAgfVxufVxuXG5jbGFzcyBQbGF5ZXJFeHBlcmllbmNlIGV4dGVuZHMgc291bmR3b3Jrcy5FeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3IoYXNzZXRzRG9tYWluKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIGZsYWcgdG8gYWxsb3cgd2FpdGluZyBmb3IgbmV4dCBcIndhaXRcIiBzdGF0ZVxuICAgIHRoaXMuam9pbmVkID0gZmFsc2U7XG4gICAgdGhpcy5pbmRleCA9IDA7XG5cbiAgICAvLyBUSElTIEFMTE9XUyBUTyBGT1JDRSBUSEUgVVNFUlMgVE8gV0FJVCBGT1IgVEhFIFBJRUNFIFRPIFNUQVJUIFRPIEJFIEFCTEUgVE8gSk9JTiA6XG4gICAgdGhpcy53YWl0Rm9yU3RhcnRUb0pvaW4gPSB0cnVlO1xuICAgIC8vIHRoaXMud2FpdEZvclN0YXJ0VG9Kb2luID0gZmFsc2U7XG5cbiAgICAvLyBjb25maWd1cmF0aW9uc1xuICAgIHRoaXMuc2hhcmVkU3ludGhDb25maWcgPSBzaGFyZWRTeW50aENvbmZpZztcbiAgICB0aGlzLnNoYXJlZFZpc3VhbHNDb25maWcgPSBzaGFyZWRWaXN1YWxzQ29uZmlnO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMuYXJlYUNvbmZpZyA9IGFyZWFDb25maWc7XG4gICAgdGhpcy5raWxsVGhlQmFsbG9vbnNDb25maWcgPSBraWxsVGhlQmFsbG9vbnNDb25maWc7XG4gICAgdGhpcy5hdm9pZFRoZVJhaW5Db25maWcgPSBhdm9pZFRoZVJhaW5Db25maWc7XG4gICAgdGhpcy5pbnN0cnVtZW50YWxDb25maWcgPSBpbnN0cnVtZW50YWxDb25maWc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gcHJlcGFyZSBwYXRocyBmb3IgYXVkaW8gZmlsZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBjb25zdCBzaGFyZWRTeW50aEZpbGVzID0gc2hhcmVkU3ludGhDb25maWcubWFwKChlbnRyeSkgPT4ge1xuICAgICAgcmV0dXJuIGBzb3VuZHMvc2hhcmVkLXN5bnRoLyR7ZW50cnkuZmlsZW5hbWV9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGtpbGxUaGVCYWxsb29uc0ZpbGVzID0ga2lsbFRoZUJhbGxvb25zQ29uZmlnLmZpbGVzLm1hcCgoZmlsZW5hbWUpID0+IHtcbiAgICAgIHJldHVybiBgc291bmRzL2tpbGwtdGhlLWJhbGxvb25zLyR7ZmlsZW5hbWV9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGF2b2lkVGhlUmFpblNpbmVzID0gYXZvaWRUaGVSYWluQ29uZmlnLnNpbmVzLm1hcChmaWxlbmFtZSA9PiB7XG4gICAgICByZXR1cm4gYHNvdW5kcy9hdm9pZC10aGUtcmFpbi8ke2ZpbGVuYW1lfWA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhdm9pZFRoZVJhaW5HbGl0Y2hlcyA9IGF2b2lkVGhlUmFpbkNvbmZpZy5nbGl0Y2hlcy5tYXAoZmlsZW5hbWUgPT4ge1xuICAgICAgcmV0dXJuIGBzb3VuZHMvYXZvaWQtdGhlLXJhaW4vJHtmaWxlbmFtZX1gO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaW5zdHJ1bWVudGFsTXVzaWMgPSBpbnN0cnVtZW50YWxDb25maWcuZmlsZXMubWFwKChmaWxlbmFtZSkgPT4ge1xuICAgICAgcmV0dXJuIGBzb3VuZHMvaW5zdHJ1bWVudGFsLyR7ZmlsZW5hbWV9YDtcbiAgICB9KTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGNvbnN0IGF1ZGlvRmlsZXMgPSB7XG4gICAgICAnc2hhcmVkLXN5bnRoJzogc2hhcmVkU3ludGhGaWxlcyxcbiAgICAgICdraWxsLXRoZS1iYWxsb29ucyc6IGtpbGxUaGVCYWxsb29uc0ZpbGVzLFxuICAgICAgJ2F2b2lkLXRoZS1yYWluOnNpbmVzJzogYXZvaWRUaGVSYWluU2luZXMsXG4gICAgICAnYXZvaWQtdGhlLXJhaW46Z2xpdGNoZXMnOiBhdm9pZFRoZVJhaW5HbGl0Y2hlcyxcbiAgICAgICdpbnN0cnVtZW50YWwtbXVzaWMnOiBpbnN0cnVtZW50YWxNdXNpYyxcbiAgICB9O1xuXG4gICAgdGhpcy5wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiBbJ3dlYi1hdWRpbycsICdkZXZpY2Utc2Vuc29yJ10gfSk7XG5cbiAgICB0aGlzLmNoZWNraW4gPSB0aGlzLnJlcXVpcmUoJ2NoZWNraW4nLCB7IHNob3dEaWFsb2c6IGZhbHNlIH0pO1xuICAgIHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicsIHtcbiAgICAgIGFzc2V0c0RvbWFpbjogYXNzZXRzRG9tYWluLFxuICAgICAgZmlsZXM6IGF1ZGlvRmlsZXMsXG4gICAgfSk7XG5cbiAgICB0aGlzLmdyb3VwRmlsdGVyID0gdGhpcy5yZXF1aXJlKCdncm91cC1maWx0ZXInLCB7XG4gICAgICBkaXJlY3Rpb25zOiBhcmVhQ29uZmlnLmRpcmVjdGlvbnMsXG4gICAgfSk7XG5cbiAgICAvLyBsb2FkIGhlcmUgaW5zdGVhZCBvZiBwbGF0Zm9ybVxuICAgIHRoaXMuaW1hZ2VNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdpbWFnZS1tYW5hZ2VyJywge1xuICAgICAgZmlsZXM6IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgJ3Nwcml0ZTpibHVlJzogdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLmJsdWUuZmlsZSxcbiAgICAgICAgJ3Nwcml0ZTpwaW5rJzogdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnBpbmsuZmlsZSxcbiAgICAgICAgJ3Nwcml0ZTp5ZWxsb3cnOiB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMueWVsbG93LmZpbGUsXG4gICAgICAgICdzcHJpdGU6cmVkJzogdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnJlZC5maWxlLFxuICAgICAgfSwgdGhpcy5zaGFyZWRWaXN1YWxzQ29uZmlnKSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gICAgdGhpcy5zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSB0aGlzLnJlcXVpcmUoJ3N5bmMtc2NoZWR1bGVyJyk7XG5cbiAgICB0aGlzLl9zZXRTdGF0ZSA9IHRoaXMuX3NldFN0YXRlLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5fb25BY2NlbGVyYXRpb24gPSB0aGlzLl9vbkFjY2VsZXJhdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ29tcGFzc1VwZGF0ZSA9IHRoaXMuX29uQ29tcGFzc1VwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NldFZvbHVtZSA9IHRoaXMuX3NldFZvbHVtZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2hhcmVkVmlzdWFsVHJpZ2dlciA9IHRoaXMuX29uU2hhcmVkVmlzdWFsVHJpZ2dlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVG91Y2hTdGFydCA9IHRoaXMuX29uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fYWNjZWxlcmF0aW9uTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBwb3B1bGF0ZSBzcHJpdGVDb25maWcgd2l0aCB0aGUgc3ByaXRlIGltYWdlc1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5ibHVlLmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTpibHVlJyk7XG4gICAgdGhpcy5zcHJpdGVDb25maWcuZ3JvdXBzLnBpbmsuaW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0NhbnZhcygnc3ByaXRlOnBpbmsnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMueWVsbG93LmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTp5ZWxsb3cnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmltYWdlID0gdGhpcy5pbWFnZU1hbmFnZXIuZ2V0QXNDYW52YXMoJ3Nwcml0ZTpyZWQnKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5ibHVlLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6Ymx1ZScpO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy5waW5rLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6cGluaycpO1xuICAgIHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcy55ZWxsb3cuaGFsZlNpemVJbWFnZSA9IHRoaXMuaW1hZ2VNYW5hZ2VyLmdldEFzSGFsZlNpemVDYW52YXMoJ3Nwcml0ZTp5ZWxsb3cnKTtcbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMucmVkLmhhbGZTaXplSW1hZ2UgPSB0aGlzLmltYWdlTWFuYWdlci5nZXRBc0hhbGZTaXplQ2FudmFzKCdzcHJpdGU6cmVkJyk7XG5cbiAgICB0aGlzLnNwcml0ZUNvbmZpZy5jb2xvcnMgPSBPYmplY3Qua2V5cyh0aGlzLnNwcml0ZUNvbmZpZy5ncm91cHMpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aGUgdmlld1xuICAgIHRoaXMudmlldyA9IG5ldyBQbGF5ZXJWaWV3KHZpZXdUZW1wbGF0ZSwge30sIHt9LCB7XG4gICAgICBwcmVzZXJ2ZVBpeGVsUmF0aW86IGZhbHNlLFxuICAgICAgcmF0aW9zOiB7ICcjc3RhdGUtY29udGFpbmVyJzogMSB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zaG93KCkudGhlbigoKSA9PiB7XG5cbiAgICAgIHRoaXMuJGV4aXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZXhpdCcpO1xuICAgICAgdGhpcy4kZXhpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xuICAgICAgICB0aGlzLmpvaW5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zZXRTdGF0ZSgnd2FpdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoaXMgYWxsb3dzIG11dGUgYnRuIHRvIHN0YXkgcmVhY3RpdmUgdGhyb3VnaCBzdGF0ZSBjaGFuZ2VzXG4gICAgICAvLyAoZG9uJ3QgYXNrIHdoeSlcbiAgICAgIHRoaXMuJG11dGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXV0ZScpO1xuICAgICAgdGhpcy4kbXV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhY3RpdmUgPSB0aGlzLiRtdXRlQnRuLmNsYXNzTGlzdC5jb250YWlucygnb24nKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2FjdGl2ZSA6ICcgKyAoYWN0aXZlID8gJ3llcycgOiAnbm8nKSk7XG5cbiAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuJG11dGVCdG4uY2xhc3NMaXN0LnJlbW92ZSgnb24nKTtcbiAgICAgICAgICB0aGlzLm11dGUuZ2Fpbi52YWx1ZSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy4kbXV0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdvbicpO1xuICAgICAgICAgIHRoaXMubXV0ZS5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgfVxuICAgICAgfSwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuXG4gICAgICB0aGlzLiRjcmVkaXRzV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcmVkaXRzLXdyYXBwZXInKTtcbiAgICAgIHRoaXMuJGNyZWRpdHMxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NyZWRpdHMtMScpO1xuICAgICAgdGhpcy4kY3JlZGl0czIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY3JlZGl0cy0yJyk7XG4gICAgICB0aGlzLiRjcmVkaXRzMyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjcmVkaXRzLTMnKTtcbiAgICAgIHRoaXMuJGNyZWRpdHM0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NyZWRpdHMtNCcpO1xuXG4gICAgICB0aGlzLiRjcmVkaXRzID0gW1xuICAgICAgICB0aGlzLiRjcmVkaXRzMSxcbiAgICAgICAgdGhpcy4kY3JlZGl0czIsXG4gICAgICAgIHRoaXMuJGNyZWRpdHMzLFxuICAgICAgICB0aGlzLiRjcmVkaXRzNFxuICAgICAgXTtcblxuICAgICAgLy8gYXVkaW8gYXBpXG4gICAgICB0aGlzLm11dGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgdGhpcy5tdXRlLmdhaW4udmFsdWUgPSAxO1xuICAgICAgdGhpcy5tdXRlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuICAgICAgLy8gbWFzdGVyIGF1ZGlvXG4gICAgICB0aGlzLm1hc3RlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICB0aGlzLm1hc3Rlci5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICB0aGlzLm1hc3Rlci5nYWluLnZhbHVlID0gMTtcblxuICAgICAgLy8gZ2xvYmFsIHZpZXdcbiAgICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBnbG9iYWwgc3ludGggYW5kIHZpc3VhbHMgKEh1aWh1aSBjb250cm9sbGVkKVxuICAgICAgdGhpcy5zaGFyZWRTeW50aCA9IG5ldyBTaGFyZWRTeW50aChcbiAgICAgICAgdGhpcy5zaGFyZWRTeW50aENvbmZpZyxcbiAgICAgICAgdGhpcy5hdWRpb0J1ZmZlck1hbmFnZXIuZ2V0KCdzaGFyZWQtc3ludGgnKSxcbiAgICAgICAgdGhpcy5ncm91cEZpbHRlcixcbiAgICAgICAgdGhpcy5nZXRBdWRpb0Rlc3RpbmF0aW9uKClcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuc2hhcmVkVmlzdWFscyA9IG5ldyBTaGFyZWRWaXN1YWxzKHRoaXMuc3ByaXRlQ29uZmlnLmdyb3Vwcyk7XG5cbiAgICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnNoYXJlZFZpc3VhbHMpO1xuXG4gICAgICAvLyBAdG9kbyAtIHJldmlzZSBhbGwgdGhpcywgdGhpcyBpcyBmYXIgZnJvbSByZWFsbHkgZWZmaWNpZW50XG4gICAgICB0aGlzLnJlY2VpdmUoJ25vdGU6b24nLCAocGl0Y2gpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlID09PSAnd2FpdCcpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnNoYXJlZFN5bnRoLm5vdGVPbihwaXRjaCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMudHJpZ2dlcihyZXMuZ3JvdXAsIHJlcy5zdXN0YWluZWQsIHJlcy5kdXJhdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZWNlaXZlKCdub3RlOm9mZicsIChwaXRjaCkgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnNoYXJlZFN5bnRoLm5vdGVPZmYocGl0Y2gpO1xuXG4gICAgICAgIGlmIChyZXMgIT09IG51bGwpXG4gICAgICAgICAgdGhpcy5zaGFyZWRWaXN1YWxzLnN0b3AocmVzLmdyb3VwKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFkZENvbXBhc3NMaXN0ZW5lcignZ3JvdXAnLCAoZ3JvdXApID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5zaGFyZWRTeW50aC51cGRhdGVHcm91cChncm91cCk7XG5cbiAgICAgICAgaWYgKHJlcyAhPT0gbnVsbClcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMudHJpZ2dlcihyZXMuZ3JvdXAsIHJlcy5zdXN0YWluZWQsIHJlcy5kdXJhdGlvbik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLnNoYXJlZFZpc3VhbHMua2lsbCgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvblxuICAgICAgdGhpcy5ncm91cEZpbHRlci5zdGFydExpc3RlbmluZygpO1xuICAgICAgdGhpcy5ncm91cEZpbHRlci5hZGRMaXN0ZW5lcih0aGlzLl9vbkNvbXBhc3NVcGRhdGUpO1xuICAgICAgdGhpcy5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignZ2xvYmFsOnZvbHVtZScsIHRoaXMuX3NldFZvbHVtZSk7XG4gICAgICB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdnbG9iYWw6c2hhcmVkLXZpc3VhbCcsIHRoaXMuX29uU2hhcmVkVmlzdWFsVHJpZ2dlcik7XG5cbiAgICAgIHRoaXMucmVjZWl2ZSgndGltZWxpbmU6cG9zaXRpb24nLCAoaW5kZXgsIHRvdGFsVGltZSkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpbmRleCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRvdGFsVGltZSk7XG4gICAgICAgIHRoaXMuX3BsYXlJbnN0cnVtZW50YWxQYXJ0KGluZGV4LCB0b3RhbFRpbWUpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVjZWl2ZSgnc3RhdGU6aW5kZXgnLCBpbmRleCA9PiB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuam9pbmVkID0gdHJ1ZTtcbiAgICAgICAgICBnbG9iYWxTdGF0ZS5zY29yZSA9IHsgcmVkOiAwLCBibHVlOiAwLCBwaW5rOiAwLCB5ZWxsb3c6IDAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9yIHVuY29tbWVudCB0aGlzIGlmIGFuZCBwbGF5IGN1cnJlbnQgcGFydCBmcm9tIGN1cnJlbnQgcG9zaXRpb24gd2hlbiBjbGllbnRzIGpvaW5cbiAgICAgICAgLy8gbGlrZSB0aGlzLCByZW1haW5zIHNpbGVudFxuICAgICAgICAvLyBpZiAodGhpcy5qb2luZWQpIHtcbiAgICAgICAgICB0aGlzLl9wbGF5SW5zdHJ1bWVudGFsUGFydChpbmRleCk7XG4gICAgICAgIC8vIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlY2VpdmUoJ2dsb2JhbDpzdGF0ZScsIChzeW5jVGltZSwgc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCh0aGlzLndhaXRGb3JTdGFydFRvSm9pbiAmJiB0aGlzLmpvaW5lZCkgfHwgIXRoaXMud2FpdEZvclN0YXJ0VG9Kb2luKSB7XG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZXIuZGVmZXIoKCkgPT4gdGhpcy5fc2V0U3RhdGUoc3RhdGUpLCBzeW5jVGltZSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gJ3dhaXQnO1xuXG4gICAgICBpZiAodGhpcy53YWl0Rm9yU3RhcnRUb0pvaW4pIHtcbiAgICAgICAgdGhpcy5fc2V0U3RhdGUodGhpcy5jdXJyZW50U3RhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0QXVkaW9EZXN0aW5hdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXN0ZXI7XG4gIH1cblxuICBzaG93Q3JlZGl0c1BhZ2UocGFnZUlkID0gMCkge1xuICAgIHRoaXMuJGNyZWRpdHMuZm9yRWFjaChjID0+IHsgYy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTsgfSk7XG5cbiAgICBpZiAocGFnZUlkID09PSAxICYmIHRoaXMuY3VycmVudFN0YXRlID09PSAnZW1wdHknKSB7XG4gICAgICAvLyB0aGlzLiRjcmVkaXRzMi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuJGNyZWRpdHMxLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy4kY3JlZGl0c1dyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIGlmIChwYWdlSWQgPT09IDIgJiYgdGhpcy5jdXJyZW50U3RhdGUgPT09ICdlbXB0eScpIHtcbiAgICAgIHRoaXMuJGNyZWRpdHMyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy4kY3JlZGl0c1dyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIGlmIChwYWdlSWQgPT09IDMgJiYgdGhpcy5jdXJyZW50U3RhdGUgPT09ICdlbXB0eScpIHtcbiAgICAgIHRoaXMuJGNyZWRpdHMzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy4kY3JlZGl0c1dyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIGlmIChwYWdlSWQgPT09IDQgJiYgdGhpcy5jdXJyZW50U3RhdGUgPT09ICdzY29yZXMnKSB7XG4gICAgICAvLyB0aGlzLiRjcmVkaXRzMS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgIHRoaXMuJGNyZWRpdHM0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy4kY3JlZGl0c1dyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoaXMuJGNyZWRpdHMxLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgLy8gdGhpcy4kY3JlZGl0czIuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICB0aGlzLiRjcmVkaXRzV3JhcHBlci5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cblxuICBfcGxheUluc3RydW1lbnRhbFBhcnQoaW5kZXgsIGJ1ZmZlck9mZnNldCA9IDApIHtcbiAgICBpZiAoaW5kZXggPCAxKSByZXR1cm47XG4gICAgLy8gY29uc29sZS5sb2coJ3BsYXlpbmcgcGFydCAnICsgaW5kZXgpO1xuICAgIC8vIGluZGV4IC0gMSBiZWNhdXNlIGZpcnN0IHN0YXRlIGRvZXNuJ3QgaGF2ZSBtdXNpY1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJNYW5hZ2VyLmdldCgnaW5zdHJ1bWVudGFsLW11c2ljJylbaW5kZXggLSAxXTtcbiAgICAvLyBjb25zdCBidWZmZXIgPSB0aGlzLmJhY2tncm91bmRCdWZmZXJzW2luZGV4XTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGJ1ZmZlci5kdXJhdGlvbiAtIGJ1ZmZlck9mZnNldDtcbiAgICBjb25zdCBub3cgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy8gY29uc3QgZGV0dW5lID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiAxMjAwO1xuICAgIC8vIGNvbnN0IHJlc2FtcGxpbmcgPSBNYXRoLnJhbmRvbSgpICogMS41ICsgMC41O1xuXG4gICAgY29uc3Qgc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNyYy5idWZmZXIgPSBidWZmZXI7XG5cbiAgICAvLyBjb25zdCBnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAvLyBnYWluLnZhbHVlID0gMTtcblxuICAgIHNyYy5jb25uZWN0KHRoaXMubXV0ZSk7XG4gICAgLy8gZ2Fpbi5jb25uZWN0KHRoaXMuZ2V0QXVkaW9EZXN0aW5hdGlvbigpKTtcbiAgICAvLyBzcmMucGxheWJhY2tSYXRlLnZhbHVlID0gcmVzYW1wbGluZztcbiAgICBzcmMuc3RhcnQobm93LCBidWZmZXJPZmZzZXQsIGR1cmF0aW9uKTsgLy8gb2Zmc2V0IGluIHNlY29uZHNcbiAgICAvLyBzcmMuc3RvcChub3cgKyBkdXJhdGlvbik7ICAgIFxuICB9XG5cbiAgX29uVG91Y2hTdGFydChlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3RvdWNoZWQgIScpXG4gIH1cblxuICBfc2V0Vm9sdW1lKHZhbHVlKSB7XG4gICAgdGhpcy5tYXN0ZXIuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgX3NldFN0YXRlKG5hbWUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnc2V0dGluZyBzdGF0ZSAnICsgbmFtZSk7XG4gICAgY29uc3QgY3RvciA9IHN0YXRlc1tuYW1lXTtcblxuICAgIGlmICghY3RvcilcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzdGF0ZTogXCIke25hbWV9XCJgKTtcblxuICAgIGNvbnN0IHN0YXRlID0gbmV3IGN0b3IodGhpcywgZ2xvYmFsU3RhdGUsIGNsaWVudCk7XG5cbiAgICBpZiAodGhpcy5fc3RhdGUpXG4gICAgICB0aGlzLl9zdGF0ZS5leGl0KCk7XG5cbiAgICB0aGlzLmhpZGVTaGFyZWRWaXN1YWwoKTtcbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuX3N0YXRlLmVudGVyKCk7XG4gICAgdGhpcy5fY3VycmVudFN0YXRlTmFtZSA9IG5hbWU7XG4gICAgdGhpcy5jdXJyZW50U3RhdGUgPSBuYW1lO1xuXG4gICAgLy8gZGlzcGxheSBleGl0IGJ1dHRvbiB3aGVuIHdlIGFyZSBub3Qgd2FpdGluZ1xuICAgIC8vIE5PUEUgISB0aGlzIHJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzIDooXG4gICAgLy8gdGhpcy52aWV3Lm1vZGVsLnNob3dFeGl0QnRuID0gKG5hbWUgIT09ICd3YWl0Jyk7XG4gICAgLy8gdGhpcy52aWV3LnJlbmRlcignI21lbnUnKTtcblxuICAgIGlmIChuYW1lID09PSAnd2FpdCcpIHtcbiAgICAgIHRoaXMuJGV4aXRCdG4uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGV4aXRCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgX29uU2hhcmVkVmlzdWFsVHJpZ2dlcih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJ25vbmUnKVxuICAgICAgdGhpcy5oaWRlU2hhcmVkVmlzdWFsKCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zaG93U2hhcmVkVmlzdWFsKHZhbHVlKTtcbiAgfVxuXG4gIHNob3dTaGFyZWRWaXN1YWwoaWQpIHtcbiAgICBjb25zdCBwYXRoID0gdGhpcy5zaGFyZWRWaXN1YWxzQ29uZmlnW2lkXTtcbiAgICB0aGlzLnZpZXcuc2hvd1NoYXJlZFZpc3VhbChwYXRoKTtcbiAgfVxuXG4gIGhpZGVTaGFyZWRWaXN1YWwoKSB7XG4gICAgdGhpcy52aWV3LmhpZGVTaGFyZWRWaXN1YWwoKTtcbiAgfVxuXG4gIGFkZENvbXBhc3NMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0gPSBuZXcgU2V0KCk7XG5cbiAgICB0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVDb21wYXNzTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIHRoaXMuX2NvbXBhc3NMaXN0ZW5lcnNbY2hhbm5lbF0uZGVsZXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIF9vbkNvbXBhc3NVcGRhdGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGlmICh0aGlzLl9jb21wYXNzTGlzdGVuZXJzW2NoYW5uZWxdKVxuICAgICAgdGhpcy5fY29tcGFzc0xpc3RlbmVyc1tjaGFubmVsXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJFeHBlcmllbmNlO1xuIl19