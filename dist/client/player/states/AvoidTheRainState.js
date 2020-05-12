'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _AvoidTheRainSynth = require('../audio/AvoidTheRainSynth');

var _AvoidTheRainSynth2 = _interopRequireDefault(_AvoidTheRainSynth);

var _Balloon2 = require('../renderers/Balloon');

var _Balloon3 = _interopRequireDefault(_Balloon2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top">\n      <div class="score">\n        <p class="blue"><%= score.blue %></p>\n        <p class="pink"><%= score.pink %></p>\n        <p class="yellow"><%= score.yellow %></p>\n        <p class="red"><%= score.red %></p>\n      </div>\n    </div>\n    <div class="section-center">\n      <% if (showInstructions === true) { %>\n        <p class="align-center soft-blink">Tilt your phone to move the balloon!</p>\n      <% } %>\n      <div class="show-text">\n      <% if (showText === \'fly\') { %>\n        <p class="align-center soft-blink">Fly with the balloon<br />to avoid the rain!</p>\n      <% } %>\n      <% if (goToColor !== \'\') { %>\n        <p class="align-center">Go to <%= goToColor %>!</p>\n      <% } %>\n      </div>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var _2PI = Math.PI * 2;

var AvoidTheRainView = function (_CanvasView) {
  (0, _inherits3.default)(AvoidTheRainView, _CanvasView);

  function AvoidTheRainView() {
    (0, _classCallCheck3.default)(this, AvoidTheRainView);
    return (0, _possibleConstructorReturn3.default)(this, (AvoidTheRainView.__proto__ || (0, _getPrototypeOf2.default)(AvoidTheRainView)).apply(this, arguments));
  }

  (0, _createClass3.default)(AvoidTheRainView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)(AvoidTheRainView.prototype.__proto__ || (0, _getPrototypeOf2.default)(AvoidTheRainView.prototype), 'onRender', this).call(this);
      this.$score = this.$el.querySelector('.score');
    }
  }, {
    key: 'hideScore',
    value: function hideScore() {
      this.$score.classList.add('hidden');
    }
  }]);
  return AvoidTheRainView;
}(_client.CanvasView);

var FloatingBalloon = function (_Balloon) {
  (0, _inherits3.default)(FloatingBalloon, _Balloon);

  function FloatingBalloon(fadeInDuration) {
    var _ref;

    (0, _classCallCheck3.default)(this, FloatingBalloon);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (_ref = FloatingBalloon.__proto__ || (0, _getPrototypeOf2.default)(FloatingBalloon)).call.apply(_ref, [this].concat(args)));

    _this2.opacity = 0;
    _this2.fadeInDuration = fadeInDuration;
    _this2.timeFadeIn = 0;
    _this2.vx = 0;
    _this2.vy = 0;
    return _this2;
  }

  (0, _createClass3.default)(FloatingBalloon, [{
    key: 'setRadius',
    value: function setRadius(radius) {
      // this.radius = width / 2 - 4;
      var size = (radius + 4) * 2;
      this.width = size;
      this.height = size;
      this.radius = radius;
    }
  }, {
    key: 'update',
    value: function update(dt, width, height) {
      (0, _get3.default)(FloatingBalloon.prototype.__proto__ || (0, _getPrototypeOf2.default)(FloatingBalloon.prototype), 'update', this).call(this, dt);

      this.x += this.vx * dt;
      this.y += this.vy * dt;
      // clamp to screen
      this.x = Math.max(0, Math.min(width, this.x));
      this.y = Math.max(0, Math.min(height, this.y));

      if (this.timeFadeIn < this.fadeInDuration) {
        this.timeFadeIn += dt;
        this.opacity = Math.min(1, this.timeFadeIn / this.fadeInDuration);
      } else {
        this.opacity = 1;
      }
    }
  }]);
  return FloatingBalloon;
}(_Balloon3.default);

var RainDrop = function () {
  function RainDrop(x, y, vy) {
    (0, _classCallCheck3.default)(this, RainDrop);

    this.x = x;
    this.y = y;
    this.vy = vy;
    this.radius = Math.round(Math.random()) + 1;

    // rgb(153, 204, 255)
    var r = Math.round(Math.random() * (255 - 153) + 153);
    var g = Math.round(Math.random() * (255 - 204) + 204);
    var b = 255;
    this.color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }

  (0, _createClass3.default)(RainDrop, [{
    key: 'update',
    value: function update(dt) {
      this.y += this.vy * dt;
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, _2PI, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }]);
  return RainDrop;
}();

var AvoidTheRainRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(AvoidTheRainRenderer, _Canvas2dRenderer);

  function AvoidTheRainRenderer(spriteConfig, onRainHit, onExploded) {
    (0, _classCallCheck3.default)(this, AvoidTheRainRenderer);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (AvoidTheRainRenderer.__proto__ || (0, _getPrototypeOf2.default)(AvoidTheRainRenderer)).call(this));

    _this3.spriteConfig = spriteConfig;
    _this3.onRainHit = onRainHit;
    _this3.onExploded = onExploded;
    _this3.explodeState = false;

    _this3.rainDrops = [];
    _this3.balloon = null;

    _this3.getBalloonNormalizedPosition = _this3.getBalloonNormalizedPosition.bind(_this3);
    return _this3;
  }

  (0, _createClass3.default)(AvoidTheRainRenderer, [{
    key: 'createBalloon',
    value: function createBalloon(radius, fadeInDuration) {
      var emulateMotion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var config = this.spriteConfig;
      var colorIndex = Math.floor(Math.random() * config.colors.length);
      var color = config.colors[colorIndex];

      var image = config.groups[color].image;
      var clipPositions = config.groups[color].clipPositions;
      var clipWidth = config.clipSize.width;
      var clipHeight = config.clipSize.height;
      var refreshRate = config.animationRate;
      var size = radius * 2;
      var x = this.canvasWidth / 2;
      var y = this.canvasHeight * 3 / 5;

      // make ballon appear randomly
      if (emulateMotion) {
        x = Math.random() * this.canvasWidth;
        y = Math.random() * this.canvasHeight;
      }

      var balloon = new FloatingBalloon(fadeInDuration, color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

      this.balloon = balloon;
    }
  }, {
    key: 'createRainDrop',
    value: function createRainDrop() {
      var x = Math.random() * this.canvasWidth;
      var y = -10;
      var vy = 0.3 * this.canvasHeight * (Math.random() * 0.2 + 0.8);

      var rainDrop = new RainDrop(x, y, vy);
      this.rainDrops.push(rainDrop);
    }
  }, {
    key: 'updateBalloonRadius',
    value: function updateBalloonRadius(value) {
      if (this.balloon !== null) this.balloon.setRadius(value);
    }
  }, {
    key: 'setBalloonAcceleration',
    value: function setBalloonAcceleration(vx, vy) {
      if (this.balloon !== null) {
        this.balloon.vx = vx;
        this.balloon.vy = vy;
      }
    }
  }, {
    key: 'getBalloonNormalizedPosition',
    value: function getBalloonNormalizedPosition() {
      var pos = null;

      if (this.balloon) pos = [this.balloon.x / this.canvasWidth, this.balloon.y / this.canvasHeight];

      return pos;
    }
  }, {
    key: 'init',
    value: function init() {}
  }, {
    key: 'testRainHit',
    value: function testRainHit() {
      if (this.balloon !== null && this.balloon.explode !== true && this.balloon.opacity >= 1) {
        var x = this.balloon.x;
        var y = this.balloon.y;
        var radius = this.balloon.radius;
        var radiusSquared = radius * radius;

        for (var i = this.rainDrops.length - 1; i >= 0; i--) {
          var rainDrop = this.rainDrops[i];
          var dx = rainDrop.x - x;
          var dy = rainDrop.y - y;
          var distSquared = dx * dx + dy * dy;

          if (distSquared < radiusSquared) {
            // trigger
            this.onRainHit(this.balloon.color);
            this.balloon.explode = true;
            this.rainDrops.splice(i, 1);
            break;
          }
        }
      }
    }
  }, {
    key: 'explode',
    value: function explode() {
      if (this.balloon !== null) this.balloon.explode = true;
    }
  }, {
    key: 'exit',
    value: function exit() {
      if (this.balloon !== null) {
        this.balloon.explode = true;
        this.explodeState = true;
      } else {
        this.onExploded();
      }
    }
  }, {
    key: 'update',
    value: function update(dt) {
      var width = this.canvasWidth;
      var height = this.canvasHeight;

      if (this.balloon !== null) this.balloon.update(dt, width, height);

      if (this.balloon !== null && this.balloon.isDead === true) {
        this.balloon = null;

        if (this.explodeState === true) this.onExploded();
      }

      for (var i = this.rainDrops.length - 1; i >= 0; i--) {
        var rainDrop = this.rainDrops[i];
        rainDrop.update(dt, width, height);

        if (rainDrop.y > this.canvasHeight + 10) this.rainDrops.splice(i, 1);
      }

      this.testRainHit();
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      for (var i = this.rainDrops.length - 1; i >= 0; i--) {
        this.rainDrops[i].render(ctx);
      }if (this.balloon !== null) this.balloon.render(ctx);
    }
  }]);
  return AvoidTheRainRenderer;
}(_client.Canvas2dRenderer);

var AvoidTheRainState = function () {
  function AvoidTheRainState(experience, globalState, client) {
    (0, _classCallCheck3.default)(this, AvoidTheRainState);

    this.experience = experience;
    this.globalState = globalState;
    this.client = client;

    this.orientation = null;
    this.currentBalloonRadius = 0;
    this.spawnInterval = null;
    this.spawnTimeout = null;
    this.createBalloonTimeout = null;
    this.harmonyUpdateTimeout = null;
    // if true, acceleration is not available so do something...
    this.emulateMotion = false;

    this._onResize = this._onResize.bind(this);
    this._spawnBalloon = this._spawnBalloon.bind(this);
    this._updateBalloonRadius = this._updateBalloonRadius.bind(this);
    this._onAccelerationInput = this._onAccelerationInput.bind(this);
    this._toggleRain = this._toggleRain.bind(this);
    this._updateSpawnInterval = this._updateSpawnInterval.bind(this);
    this._onRainHit = this._onRainHit.bind(this);
    this._onExploded = this._onExploded.bind(this);
    this._onHarmonyUpdate = this._onHarmonyUpdate.bind(this);
    this._onSineVolumeUpdate = this._onSineVolumeUpdate.bind(this);
    this._onShowText = this._onShowText.bind(this);
    this._onGoToText = this._onGoToText.bind(this);

    this.renderer = new AvoidTheRainRenderer(this.experience.spriteConfig, this._onRainHit, this._onExploded);

    this.synth = new _AvoidTheRainSynth2.default(this.experience.audioBufferManager.get('avoid-the-rain:sines'), this.experience.audioBufferManager.get('avoid-the-rain:glitches'), this.experience.avoidTheRainConfig, this.experience.getAudioDestination());
  }

  (0, _createClass3.default)(AvoidTheRainState, [{
    key: 'enter',
    value: function enter() {
      var _this4 = this;

      _client.viewport.addResizeListener(this._onResize);

      this.view = new AvoidTheRainView(template, {
        showInstructions: true,
        score: (0, _assign2.default)({}, this.globalState.score),
        showText: 'none',
        goToColor: ''
      }, {}, {
        className: ['avoid-the-rain-state', 'foreground']
      });

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      // uncomment this to hide score permanently from "avoid the rain"
      // this.view.hideScore();

      var instructionsDuration = 10;
      var instructionsTime = 0;

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);

        if (_this4.view.model.showInstructions === true) {
          instructionsTime += dt;

          if (instructionsTime > instructionsDuration) {
            _this4.view.model.showInstructions = false;
            _this4.view.render('.section-center');
          }
        }

        // update synth normalized position - lag of one frame...
        var pos = _this4.renderer.getBalloonNormalizedPosition();
        if (pos !== null) {
          // don't update synth control values if no balloon
          _this4.synth.controlPosition[0] = pos[0];
          _this4.synth.controlPosition[1] = pos[1];
          _this4.synth.onControlUpdate();
        }
      });

      this.view.addRenderer(this.renderer);

      var sharedParams = this.experience.sharedParams;
      sharedParams.addParamListener('avoidTheRain:balloonRadius', this._updateBalloonRadius);
      sharedParams.addParamListener('avoidTheRain:spawnInterval', this._updateSpawnInterval);
      sharedParams.addParamListener('avoidTheRain:harmony', this._onHarmonyUpdate);
      sharedParams.addParamListener('avoidTheRain:sineVolume', this._onSineVolumeUpdate);
      sharedParams.addParamListener('avoidTheRain:showText', this._onShowText);
      sharedParams.addParamListener('avoidTheRain:goToText', this._onGoToText);
      // call this at the end to be sure all other params are ready
      sharedParams.addParamListener('avoidTheRain:toggleRain', this._toggleRain);

      // this.experience.addAccelerationListener(this._onAccelerationInput);
      // stop listening for orientation
      this.experience.groupFilter.stopListening();

      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', this._onAccelerationInput, false);
        // if no acceleration event come fallback on emulation
        this.fallbackTimeout = setTimeout(function () {
          return _this4.emulateMotion = true;
        }, 4000);
      } else {
        this.emulateMotion = true;
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      _client.viewport.removeResizeListener(this._onResize);

      this.view.hideScore();
      this.view.$el.classList.remove('background');
      this.view.$el.classList.add('foreground');

      // stop listening sharedParams
      var sharedParams = this.experience.sharedParams;
      sharedParams.removeParamListener('avoidTheRain:harmony', this._onHarmonyUpdate);
      sharedParams.removeParamListener('avoidTheRain:balloonRadius', this._updateBalloonRadius);
      sharedParams.removeParamListener('avoidTheRain:spawnInterval', this._updateSpawnInterval);
      sharedParams.removeParamListener('avoidTheRain:sineVolume', this._onSineVolumeUpdate);
      sharedParams.removeParamListener('avoidTheRain:showText', this._onShowText);
      sharedParams.removeParamListener('avoidTheRain:goToText', this._onGoToText);
      sharedParams.removeParamListener('avoidTheRain:toggleRain', this._toggleRain);

      if (window.DeviceMotionEvent) window.removeEventListener('devicemotion', this._onAccelerationInput, false);

      // restart listening orientation
      this.experience.groupFilter.startListening();

      clearTimeout(this.spawnTimeout);
      clearTimeout(this.harmonyUpdateTimeout);
      clearTimeout(this.createBalloonTimeout);

      this.renderer.exit();
      this.synth.stopSine();
      this.synth.triggerGlitch();
    }
  }, {
    key: '_onExploded',
    value: function _onExploded() {
      this.view.removeRenderer(this.renderer);
      this.view.remove();
    }
  }, {
    key: '_onShowText',
    value: function _onShowText(value) {
      this.view.model.showText = value;
      this.view.render('.show-text');
    }
  }, {
    key: '_onGoToText',
    value: function _onGoToText(value) {
      switch (value) {
        case 'none':
          this.view.model.goToColor = '';
          break;
        case 'random':
          var colors = ['blue', 'pink', 'yellow', 'red'];
          var color = colors[Math.floor(Math.random() * colors.length)];
          this.view.model.goToColor = color;
          break;
      }

      this.view.render('.show-text');
    }
  }, {
    key: '_onSineVolumeUpdate',
    value: function _onSineVolumeUpdate(value) {
      this.synth.setSineMaster(value);
    }
  }, {
    key: '_updateBalloonRadius',
    value: function _updateBalloonRadius(value) {
      this.renderer.updateBalloonRadius(value);
      this.currentBalloonRadius = value;
    }
  }, {
    key: '_onResize',
    value: function _onResize(width, height, orientation) {
      this.orientation = orientation;
    }
  }, {
    key: '_onAccelerationInput',
    value: function _onAccelerationInput(e) {
      if (this.fallbackTimeout) {
        // we have values, prevent fallback to execute
        clearTimeout(this.fallbackTimeout);
        this.fallbackTimeout = null;
      }

      var data = [];
      data[0] = e.accelerationIncludingGravity.x;
      data[1] = e.accelerationIncludingGravity.y;

      if (this.client.platform.os === 'ios') {
        data[0] *= -1;
        data[1] *= -1;
      }

      var vx = void 0;
      var vy = void 0;

      if (this.orientation === 'portrait') {
        vx = -data[0] / 9.81;
        vy = (data[1] - 5) / 9.81;
      } else if (this.orientation === 'landscape') {
        vx = -data[1] / 9.81;
        vy = -(data[0] + 5) / 9.81;
      }

      var k = 500;
      this.renderer.setBalloonAcceleration(vx * k, vy * k);
    }
  }, {
    key: '_onRainHit',
    value: function _onRainHit(color) {
      this.globalState.score[color] -= 1;
      this.view.model.score[color] -= 1;
      this.view.render('.score');

      this.synth.stopSine();
      this.synth.triggerGlitch();
      // respawn ballon in one second (should be bigger than grain duration)
      this.createBalloonTimeout = setTimeout(this._spawnBalloon, 1000);
    }
  }, {
    key: '_spawnBalloon',
    value: function _spawnBalloon() {
      var fadeInDuration = 1;
      this.renderer.createBalloon(this.currentBalloonRadius, fadeInDuration, this.emulateMotion);
      this.synth.startSine(fadeInDuration);
    }
  }, {
    key: '_toggleRain',
    value: function _toggleRain(value) {
      if (value === 'start' && this.view.model.state !== 'intro' && this.spawnTimeout === null) {
        this._spawnRainDrop();
      } else if (value === 'stop') {
        clearTimeout(this.spawnTimeout);
        this.spawnTimeout = null;
      }
    }
  }, {
    key: '_updateSpawnInterval',
    value: function _updateSpawnInterval(value) {
      this.spawnInterval = value;
    }
  }, {
    key: '_spawnRainDrop',
    value: function _spawnRainDrop() {
      var _this5 = this;

      this.renderer.createRainDrop();
      // min delay to 50ms
      var delay = Math.max(0.05, Math.random() * this.spawnInterval * 0.5 + this.spawnInterval * 0.5);
      this.spawnTimeout = setTimeout(function () {
        return _this5._spawnRainDrop();
      }, delay * 1000);
    }
  }, {
    key: '_onHarmonyUpdate',
    value: function _onHarmonyUpdate(value) {
      var _this6 = this;

      // if a respawn was scheduled
      clearTimeout(this.createBalloonTimeout);

      this.harmonyUpdateTimeout = setTimeout(function () {
        _this6.synth.setNextHarmony(value);
        _this6.renderer.explode();
        _this6.synth.stopSine();
        // this.synth.triggerGlitch();
        // respawn ballon in one second (should be bigger than grain duration)
        clearTimeout(_this6.createBalloonTimeout);
        _this6.createBalloonTimeout = setTimeout(_this6._spawnBalloon, 0);
      }, 3000 * Math.random());
    }
  }]);
  return AvoidTheRainState;
}();

exports.default = AvoidTheRainState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF2b2lkVGhlUmFpblN0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwiXzJQSSIsIk1hdGgiLCJQSSIsIkF2b2lkVGhlUmFpblZpZXciLCIkc2NvcmUiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiY2xhc3NMaXN0IiwiYWRkIiwiQ2FudmFzVmlldyIsIkZsb2F0aW5nQmFsbG9vbiIsImZhZGVJbkR1cmF0aW9uIiwiYXJncyIsIm9wYWNpdHkiLCJ0aW1lRmFkZUluIiwidngiLCJ2eSIsInJhZGl1cyIsInNpemUiLCJ3aWR0aCIsImhlaWdodCIsImR0IiwieCIsInkiLCJtYXgiLCJtaW4iLCJCYWxsb29uIiwiUmFpbkRyb3AiLCJyb3VuZCIsInJhbmRvbSIsInIiLCJnIiwiYiIsImNvbG9yIiwiY3R4Iiwic2F2ZSIsImJlZ2luUGF0aCIsImZpbGxTdHlsZSIsImFyYyIsImZpbGwiLCJjbG9zZVBhdGgiLCJyZXN0b3JlIiwiQXZvaWRUaGVSYWluUmVuZGVyZXIiLCJzcHJpdGVDb25maWciLCJvblJhaW5IaXQiLCJvbkV4cGxvZGVkIiwiZXhwbG9kZVN0YXRlIiwicmFpbkRyb3BzIiwiYmFsbG9vbiIsImdldEJhbGxvb25Ob3JtYWxpemVkUG9zaXRpb24iLCJiaW5kIiwiZW11bGF0ZU1vdGlvbiIsImNvbmZpZyIsImNvbG9ySW5kZXgiLCJmbG9vciIsImNvbG9ycyIsImxlbmd0aCIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwiY2xpcEhlaWdodCIsInJlZnJlc2hSYXRlIiwiYW5pbWF0aW9uUmF0ZSIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwicmFpbkRyb3AiLCJwdXNoIiwidmFsdWUiLCJzZXRSYWRpdXMiLCJwb3MiLCJleHBsb2RlIiwicmFkaXVzU3F1YXJlZCIsImkiLCJkeCIsImR5IiwiZGlzdFNxdWFyZWQiLCJzcGxpY2UiLCJ1cGRhdGUiLCJpc0RlYWQiLCJ0ZXN0UmFpbkhpdCIsInJlbmRlciIsIkNhbnZhczJkUmVuZGVyZXIiLCJBdm9pZFRoZVJhaW5TdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsImNsaWVudCIsIm9yaWVudGF0aW9uIiwiY3VycmVudEJhbGxvb25SYWRpdXMiLCJzcGF3bkludGVydmFsIiwic3Bhd25UaW1lb3V0IiwiY3JlYXRlQmFsbG9vblRpbWVvdXQiLCJoYXJtb255VXBkYXRlVGltZW91dCIsIl9vblJlc2l6ZSIsIl9zcGF3bkJhbGxvb24iLCJfdXBkYXRlQmFsbG9vblJhZGl1cyIsIl9vbkFjY2VsZXJhdGlvbklucHV0IiwiX3RvZ2dsZVJhaW4iLCJfdXBkYXRlU3Bhd25JbnRlcnZhbCIsIl9vblJhaW5IaXQiLCJfb25FeHBsb2RlZCIsIl9vbkhhcm1vbnlVcGRhdGUiLCJfb25TaW5lVm9sdW1lVXBkYXRlIiwiX29uU2hvd1RleHQiLCJfb25Hb1RvVGV4dCIsInJlbmRlcmVyIiwic3ludGgiLCJBdm9pZFRoZVJhaW5TeW50aCIsImF1ZGlvQnVmZmVyTWFuYWdlciIsImdldCIsImF2b2lkVGhlUmFpbkNvbmZpZyIsImdldEF1ZGlvRGVzdGluYXRpb24iLCJ2aWV3cG9ydCIsImFkZFJlc2l6ZUxpc3RlbmVyIiwidmlldyIsInNob3dJbnN0cnVjdGlvbnMiLCJzY29yZSIsInNob3dUZXh0IiwiZ29Ub0NvbG9yIiwiY2xhc3NOYW1lIiwic2hvdyIsImFwcGVuZFRvIiwiZ2V0U3RhdGVDb250YWluZXIiLCJpbnN0cnVjdGlvbnNEdXJhdGlvbiIsImluc3RydWN0aW9uc1RpbWUiLCJzZXRQcmVSZW5kZXIiLCJjbGVhclJlY3QiLCJtb2RlbCIsImNvbnRyb2xQb3NpdGlvbiIsIm9uQ29udHJvbFVwZGF0ZSIsImFkZFJlbmRlcmVyIiwic2hhcmVkUGFyYW1zIiwiYWRkUGFyYW1MaXN0ZW5lciIsImdyb3VwRmlsdGVyIiwic3RvcExpc3RlbmluZyIsIndpbmRvdyIsIkRldmljZU1vdGlvbkV2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImZhbGxiYWNrVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVSZXNpemVMaXN0ZW5lciIsImhpZGVTY29yZSIsInJlbW92ZSIsInJlbW92ZVBhcmFtTGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3RhcnRMaXN0ZW5pbmciLCJjbGVhclRpbWVvdXQiLCJleGl0Iiwic3RvcFNpbmUiLCJ0cmlnZ2VyR2xpdGNoIiwicmVtb3ZlUmVuZGVyZXIiLCJzZXRTaW5lTWFzdGVyIiwidXBkYXRlQmFsbG9vblJhZGl1cyIsImUiLCJkYXRhIiwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsInBsYXRmb3JtIiwib3MiLCJrIiwic2V0QmFsbG9vbkFjY2VsZXJhdGlvbiIsImNyZWF0ZUJhbGxvb24iLCJzdGFydFNpbmUiLCJzdGF0ZSIsIl9zcGF3blJhaW5Ecm9wIiwiY3JlYXRlUmFpbkRyb3AiLCJkZWxheSIsInNldE5leHRIYXJtb255Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsdzVCQUFOOztBQTRCQSxJQUFNQyxPQUFPQyxLQUFLQyxFQUFMLEdBQVUsQ0FBdkI7O0lBRU1DLGdCOzs7Ozs7Ozs7OytCQUNPO0FBQ1Q7QUFDQSxXQUFLQyxNQUFMLEdBQWMsS0FBS0MsR0FBTCxDQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQWQ7QUFDRDs7O2dDQUVXO0FBQ1YsV0FBS0YsTUFBTCxDQUFZRyxTQUFaLENBQXNCQyxHQUF0QixDQUEwQixRQUExQjtBQUNEOzs7RUFSNEJDLGtCOztJQVd6QkMsZTs7O0FBQ0osMkJBQVlDLGNBQVosRUFBcUM7QUFBQTs7QUFBQTs7QUFBQSxzQ0FBTkMsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUEsb0xBQzFCQSxJQUQwQjs7QUFHbkMsV0FBS0MsT0FBTCxHQUFlLENBQWY7QUFDQSxXQUFLRixjQUFMLEdBQXNCQSxjQUF0QjtBQUNBLFdBQUtHLFVBQUwsR0FBa0IsQ0FBbEI7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QyxlQUFLakMsS0FBTCxDQUFXNEQsY0FBWCxDQUEwQmxHLEtBQTFCO0FBQ0EsZUFBS3FDLFFBQUwsQ0FBY2xDLE9BQWQ7QUFDQSxlQUFLbUMsS0FBTCxDQUFXMEMsUUFBWDtBQUNBO0FBQ0E7QUFDQUYscUJBQWEsT0FBS3ZELG9CQUFsQjtBQUNBLGVBQUtBLG9CQUFMLEdBQTRCZ0QsV0FBVyxPQUFLN0MsYUFBaEIsRUFBK0IsQ0FBL0IsQ0FBNUI7QUFDRCxPQVIyQixFQVF6QixPQUFPOUYsS0FBSzRCLE1BQUwsRUFSa0IsQ0FBNUI7QUFTRDs7Ozs7a0JBR1l1RCxpQiIsImZpbGUiOiJBdm9pZFRoZVJhaW5TdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbnZhc1ZpZXcsIENhbnZhczJkUmVuZGVyZXIsIHZpZXdwb3J0IH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IEF2b2lkVGhlUmFpblN5bnRoIGZyb20gJy4uL2F1ZGlvL0F2b2lkVGhlUmFpblN5bnRoJztcbmltcG9ydCBCYWxsb29uIGZyb20gJy4uL3JlbmRlcmVycy9CYWxsb29uJztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2NvcmVcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJibHVlXCI+PCU9IHNjb3JlLmJsdWUgJT48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwicGlua1wiPjwlPSBzY29yZS5waW5rICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInllbGxvd1wiPjwlPSBzY29yZS55ZWxsb3cgJT48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwicmVkXCI+PCU9IHNjb3JlLnJlZCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPlxuICAgICAgPCUgaWYgKHNob3dJbnN0cnVjdGlvbnMgPT09IHRydWUpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJhbGlnbi1jZW50ZXIgc29mdC1ibGlua1wiPlRpbHQgeW91ciBwaG9uZSB0byBtb3ZlIHRoZSBiYWxsb29uITwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzaG93LXRleHRcIj5cbiAgICAgIDwlIGlmIChzaG93VGV4dCA9PT0gJ2ZseScpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJhbGlnbi1jZW50ZXIgc29mdC1ibGlua1wiPkZseSB3aXRoIHRoZSBiYWxsb29uPGJyIC8+dG8gYXZvaWQgdGhlIHJhaW4hPC9wPlxuICAgICAgPCUgfSAlPlxuICAgICAgPCUgaWYgKGdvVG9Db2xvciAhPT0gJycpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJhbGlnbi1jZW50ZXJcIj5HbyB0byA8JT0gZ29Ub0NvbG9yICU+ITwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbmNvbnN0IF8yUEkgPSBNYXRoLlBJICogMjtcblxuY2xhc3MgQXZvaWRUaGVSYWluVmlldyBleHRlbmRzIENhbnZhc1ZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJHNjb3JlID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNjb3JlJyk7XG4gIH1cblxuICBoaWRlU2NvcmUoKSB7XG4gICAgdGhpcy4kc2NvcmUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gIH1cbn1cblxuY2xhc3MgRmxvYXRpbmdCYWxsb29uIGV4dGVuZHMgQmFsbG9vbiB7XG4gIGNvbnN0cnVjdG9yKGZhZGVJbkR1cmF0aW9uLCAuLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICB0aGlzLm9wYWNpdHkgPSAwO1xuICAgIHRoaXMuZmFkZUluRHVyYXRpb24gPSBmYWRlSW5EdXJhdGlvbjtcbiAgICB0aGlzLnRpbWVGYWRlSW4gPSAwO1xuICAgIHRoaXMudnggPSAwO1xuICAgIHRoaXMudnkgPSAwO1xuICB9XG5cbiAgc2V0UmFkaXVzKHJhZGl1cykge1xuICAgIC8vIHRoaXMucmFkaXVzID0gd2lkdGggLyAyIC0gNDtcbiAgICBjb25zdCBzaXplID0gKHJhZGl1cyArIDQpICogMjtcbiAgICB0aGlzLndpZHRoID0gc2l6ZTtcbiAgICB0aGlzLmhlaWdodCA9IHNpemU7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gIH1cblxuICB1cGRhdGUoZHQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlci51cGRhdGUoZHQpO1xuXG4gICAgdGhpcy54ICs9IHRoaXMudnggKiBkdDtcbiAgICB0aGlzLnkgKz0gdGhpcy52eSAqIGR0O1xuICAgIC8vIGNsYW1wIHRvIHNjcmVlblxuICAgIHRoaXMueCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHdpZHRoLCB0aGlzLngpKTtcbiAgICB0aGlzLnkgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihoZWlnaHQsIHRoaXMueSkpO1xuXG4gICAgaWYgKHRoaXMudGltZUZhZGVJbiA8IHRoaXMuZmFkZUluRHVyYXRpb24pIHtcbiAgICAgIHRoaXMudGltZUZhZGVJbiArPSBkdDtcbiAgICAgIHRoaXMub3BhY2l0eSA9IE1hdGgubWluKDEsIHRoaXMudGltZUZhZGVJbiAvIHRoaXMuZmFkZUluRHVyYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wYWNpdHkgPSAxO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBSYWluRHJvcCB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIHZ5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMudnkgPSB2eTtcbiAgICB0aGlzLnJhZGl1cyA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgKyAxO1xuXG4gICAgLy8gcmdiKDE1MywgMjA0LCAyNTUpXG4gICAgY29uc3QgciA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICgyNTUgLSAxNTMpICsgMTUzKTtcbiAgICBjb25zdCBnID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKDI1NSAtIDIwNCkgKyAyMDQpO1xuICAgIGNvbnN0IGIgPSAyNTU7XG4gICAgdGhpcy5jb2xvciA9IGByZ2IoJHtyfSwgJHtnfSwgJHtifSlgO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgdGhpcy55ICs9ICh0aGlzLnZ5ICogZHQpO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBfMlBJLCBmYWxzZSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG5jbGFzcyBBdm9pZFRoZVJhaW5SZW5kZXJlciBleHRlbmRzIENhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzcHJpdGVDb25maWcsIG9uUmFpbkhpdCwgb25FeHBsb2RlZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNwcml0ZUNvbmZpZyA9IHNwcml0ZUNvbmZpZztcbiAgICB0aGlzLm9uUmFpbkhpdCA9IG9uUmFpbkhpdDtcbiAgICB0aGlzLm9uRXhwbG9kZWQgPSBvbkV4cGxvZGVkO1xuICAgIHRoaXMuZXhwbG9kZVN0YXRlID0gZmFsc2U7XG5cbiAgICB0aGlzLnJhaW5Ecm9wcyA9IFtdO1xuICAgIHRoaXMuYmFsbG9vbiA9IG51bGw7XG5cbiAgICB0aGlzLmdldEJhbGxvb25Ob3JtYWxpemVkUG9zaXRpb24gPSB0aGlzLmdldEJhbGxvb25Ob3JtYWxpemVkUG9zaXRpb24uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNyZWF0ZUJhbGxvb24ocmFkaXVzLCBmYWRlSW5EdXJhdGlvbiwgZW11bGF0ZU1vdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgY29uc3QgY29sb3JJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbmZpZy5jb2xvcnMubGVuZ3RoKTtcbiAgICBjb25zdCBjb2xvciA9IGNvbmZpZy5jb2xvcnNbY29sb3JJbmRleF07XG5cbiAgICBjb25zdCBpbWFnZSA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmltYWdlO1xuICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9IGNvbmZpZy5jbGlwU2l6ZS53aWR0aDtcbiAgICBjb25zdCBjbGlwSGVpZ2h0ID0gY29uZmlnLmNsaXBTaXplLmhlaWdodDtcbiAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuICAgIGNvbnN0IHNpemUgPSByYWRpdXMgKiAyO1xuICAgIGxldCB4ID0gdGhpcy5jYW52YXNXaWR0aCAvIDI7XG4gICAgbGV0IHkgPSB0aGlzLmNhbnZhc0hlaWdodCAqIDMgLyA1O1xuXG4gICAgLy8gbWFrZSBiYWxsb24gYXBwZWFyIHJhbmRvbWx5XG4gICAgaWYgKGVtdWxhdGVNb3Rpb24pIHtcbiAgICAgIHggPSBNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXNXaWR0aDtcbiAgICAgIHkgPSBNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgfVxuXG4gICAgY29uc3QgYmFsbG9vbiA9IG5ldyBGbG9hdGluZ0JhbGxvb24oZmFkZUluRHVyYXRpb24sIGNvbG9yLCBpbWFnZSwgY2xpcFBvc2l0aW9ucywgY2xpcFdpZHRoLCBjbGlwSGVpZ2h0LCByZWZyZXNoUmF0ZSwgc2l6ZSwgc2l6ZSwgeCwgeSk7XG5cbiAgICB0aGlzLmJhbGxvb24gPSBiYWxsb29uO1xuICB9XG5cbiAgY3JlYXRlUmFpbkRyb3AoKSB7XG4gICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IHkgPSAtMTA7XG4gICAgY29uc3QgdnkgPSAwLjMgKiB0aGlzLmNhbnZhc0hlaWdodCAqIChNYXRoLnJhbmRvbSgpICogMC4yICsgMC44KTtcblxuICAgIGNvbnN0IHJhaW5Ecm9wID0gbmV3IFJhaW5Ecm9wKHgsIHksIHZ5KTtcbiAgICB0aGlzLnJhaW5Ecm9wcy5wdXNoKHJhaW5Ecm9wKTtcbiAgfVxuXG4gIHVwZGF0ZUJhbGxvb25SYWRpdXModmFsdWUpIHtcbiAgICBpZiAodGhpcy5iYWxsb29uICE9PSBudWxsKVxuICAgICAgdGhpcy5iYWxsb29uLnNldFJhZGl1cyh2YWx1ZSk7XG4gIH1cblxuICBzZXRCYWxsb29uQWNjZWxlcmF0aW9uKHZ4LCB2eSkge1xuICAgIGlmICh0aGlzLmJhbGxvb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFsbG9vbi52eCA9IHZ4O1xuICAgICAgdGhpcy5iYWxsb29uLnZ5ID0gdnk7XG4gICAgfVxuICB9XG5cbiAgZ2V0QmFsbG9vbk5vcm1hbGl6ZWRQb3NpdGlvbigpIHtcbiAgICBsZXQgcG9zID0gbnVsbDtcblxuICAgIGlmICh0aGlzLmJhbGxvb24pXG4gICAgICBwb3MgPSBbdGhpcy5iYWxsb29uLnggLyB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmJhbGxvb24ueSAvIHRoaXMuY2FudmFzSGVpZ2h0XTtcblxuICAgIHJldHVybiBwb3M7XG4gIH1cblxuICBpbml0KCkge31cblxuICB0ZXN0UmFpbkhpdCgpIHtcbiAgICBpZiAodGhpcy5iYWxsb29uICE9PSBudWxsICYmXG4gICAgICAgIHRoaXMuYmFsbG9vbi5leHBsb2RlICE9PSB0cnVlICYmXG4gICAgICAgIHRoaXMuYmFsbG9vbi5vcGFjaXR5ID49IDFcbiAgICApIHtcbiAgICAgIGNvbnN0IHggPSB0aGlzLmJhbGxvb24ueDtcbiAgICAgIGNvbnN0IHkgPSB0aGlzLmJhbGxvb24ueTtcbiAgICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMuYmFsbG9vbi5yYWRpdXM7XG4gICAgICBjb25zdCByYWRpdXNTcXVhcmVkID0gcmFkaXVzICogcmFkaXVzO1xuXG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5yYWluRHJvcHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgcmFpbkRyb3AgPSB0aGlzLnJhaW5Ecm9wc1tpXTtcbiAgICAgICAgY29uc3QgZHggPSByYWluRHJvcC54IC0geDtcbiAgICAgICAgY29uc3QgZHkgPSByYWluRHJvcC55IC0geTtcbiAgICAgICAgY29uc3QgZGlzdFNxdWFyZWQgPSBkeCAqIGR4ICsgZHkgKiBkeTtcblxuICAgICAgICBpZiAoZGlzdFNxdWFyZWQgPCByYWRpdXNTcXVhcmVkKSB7XG4gICAgICAgICAgLy8gdHJpZ2dlclxuICAgICAgICAgIHRoaXMub25SYWluSGl0KHRoaXMuYmFsbG9vbi5jb2xvcik7XG4gICAgICAgICAgdGhpcy5iYWxsb29uLmV4cGxvZGUgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmFpbkRyb3BzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV4cGxvZGUoKSB7XG4gICAgaWYgKHRoaXMuYmFsbG9vbiAhPT0gbnVsbClcbiAgICAgIHRoaXMuYmFsbG9vbi5leHBsb2RlID0gdHJ1ZTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgaWYgKHRoaXMuYmFsbG9vbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5iYWxsb29uLmV4cGxvZGUgPSB0cnVlO1xuICAgICAgdGhpcy5leHBsb2RlU3RhdGUgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uRXhwbG9kZWQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uICE9PSBudWxsKVxuICAgICAgdGhpcy5iYWxsb29uLnVwZGF0ZShkdCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uICE9PSBudWxsICYmIHRoaXMuYmFsbG9vbi5pc0RlYWQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuYmFsbG9vbiA9IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLmV4cGxvZGVTdGF0ZSA9PT0gdHJ1ZSlcbiAgICAgICAgdGhpcy5vbkV4cGxvZGVkKCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHRoaXMucmFpbkRyb3BzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCByYWluRHJvcCA9IHRoaXMucmFpbkRyb3BzW2ldO1xuICAgICAgcmFpbkRyb3AudXBkYXRlKGR0LCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgaWYgKHJhaW5Ecm9wLnkgPiB0aGlzLmNhbnZhc0hlaWdodCArIDEwKVxuICAgICAgICB0aGlzLnJhaW5Ecm9wcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy50ZXN0UmFpbkhpdCgpO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLnJhaW5Ecm9wcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgIHRoaXMucmFpbkRyb3BzW2ldLnJlbmRlcihjdHgpO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbiAhPT0gbnVsbClcbiAgICAgIHRoaXMuYmFsbG9vbi5yZW5kZXIoY3R4KTtcbiAgfVxufVxuXG5jbGFzcyBBdm9pZFRoZVJhaW5TdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlLCBjbGllbnQpIHtcbiAgICB0aGlzLmV4cGVyaWVuY2UgPSBleHBlcmllbmNlO1xuICAgIHRoaXMuZ2xvYmFsU3RhdGUgPSBnbG9iYWxTdGF0ZTtcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcblxuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuICAgIHRoaXMuY3VycmVudEJhbGxvb25SYWRpdXMgPSAwO1xuICAgIHRoaXMuc3Bhd25JbnRlcnZhbCA9IG51bGw7XG4gICAgdGhpcy5zcGF3blRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuY3JlYXRlQmFsbG9vblRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuaGFybW9ueVVwZGF0ZVRpbWVvdXQgPSBudWxsO1xuICAgIC8vIGlmIHRydWUsIGFjY2VsZXJhdGlvbiBpcyBub3QgYXZhaWxhYmxlIHNvIGRvIHNvbWV0aGluZy4uLlxuICAgIHRoaXMuZW11bGF0ZU1vdGlvbiA9IGZhbHNlO1xuXG5cbiAgICB0aGlzLl9vblJlc2l6ZSA9IHRoaXMuX29uUmVzaXplLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc3Bhd25CYWxsb29uID0gdGhpcy5fc3Bhd25CYWxsb29uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdXBkYXRlQmFsbG9vblJhZGl1cyA9IHRoaXMuX3VwZGF0ZUJhbGxvb25SYWRpdXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFjY2VsZXJhdGlvbklucHV0ID0gdGhpcy5fb25BY2NlbGVyYXRpb25JbnB1dC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3RvZ2dsZVJhaW4gPSB0aGlzLl90b2dnbGVSYWluLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdXBkYXRlU3Bhd25JbnRlcnZhbCA9IHRoaXMuX3VwZGF0ZVNwYXduSW50ZXJ2YWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJhaW5IaXQgPSB0aGlzLl9vblJhaW5IaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkV4cGxvZGVkID0gdGhpcy5fb25FeHBsb2RlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uSGFybW9ueVVwZGF0ZSA9IHRoaXMuX29uSGFybW9ueVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2luZVZvbHVtZVVwZGF0ZSA9IHRoaXMuX29uU2luZVZvbHVtZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2hvd1RleHQgPSB0aGlzLl9vblNob3dUZXh0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Hb1RvVGV4dCA9IHRoaXMuX29uR29Ub1RleHQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgQXZvaWRUaGVSYWluUmVuZGVyZXIodGhpcy5leHBlcmllbmNlLnNwcml0ZUNvbmZpZywgdGhpcy5fb25SYWluSGl0LCB0aGlzLl9vbkV4cGxvZGVkKTtcblxuICAgIHRoaXMuc3ludGggPSBuZXcgQXZvaWRUaGVSYWluU3ludGgoXG4gICAgICB0aGlzLmV4cGVyaWVuY2UuYXVkaW9CdWZmZXJNYW5hZ2VyLmdldCgnYXZvaWQtdGhlLXJhaW46c2luZXMnKSxcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5hdWRpb0J1ZmZlck1hbmFnZXIuZ2V0KCdhdm9pZC10aGUtcmFpbjpnbGl0Y2hlcycpLFxuICAgICAgdGhpcy5leHBlcmllbmNlLmF2b2lkVGhlUmFpbkNvbmZpZyxcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5nZXRBdWRpb0Rlc3RpbmF0aW9uKClcbiAgICApO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgdmlld3BvcnQuYWRkUmVzaXplTGlzdGVuZXIodGhpcy5fb25SZXNpemUpO1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IEF2b2lkVGhlUmFpblZpZXcodGVtcGxhdGUsIHtcbiAgICAgIHNob3dJbnN0cnVjdGlvbnM6IHRydWUsXG4gICAgICBzY29yZTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nbG9iYWxTdGF0ZS5zY29yZSksXG4gICAgICBzaG93VGV4dDogJ25vbmUnLFxuICAgICAgZ29Ub0NvbG9yOiAnJyxcbiAgICB9LCB7fSwge1xuICAgICAgY2xhc3NOYW1lOiBbJ2F2b2lkLXRoZS1yYWluLXN0YXRlJywgJ2ZvcmVncm91bmQnXSxcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgIHRoaXMudmlldy5hcHBlbmRUbyh0aGlzLmV4cGVyaWVuY2Uudmlldy5nZXRTdGF0ZUNvbnRhaW5lcigpKTtcblxuICAgIC8vIHVuY29tbWVudCB0aGlzIHRvIGhpZGUgc2NvcmUgcGVybWFuZW50bHkgZnJvbSBcImF2b2lkIHRoZSByYWluXCJcbiAgICAvLyB0aGlzLnZpZXcuaGlkZVNjb3JlKCk7XG5cbiAgICBjb25zdCBpbnN0cnVjdGlvbnNEdXJhdGlvbiA9IDEwO1xuICAgIGxldCBpbnN0cnVjdGlvbnNUaW1lID0gMDtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgIGlmICh0aGlzLnZpZXcubW9kZWwuc2hvd0luc3RydWN0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICBpbnN0cnVjdGlvbnNUaW1lICs9IGR0O1xuXG4gICAgICAgIGlmIChpbnN0cnVjdGlvbnNUaW1lID4gaW5zdHJ1Y3Rpb25zRHVyYXRpb24pIHtcbiAgICAgICAgICB0aGlzLnZpZXcubW9kZWwuc2hvd0luc3RydWN0aW9ucyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWNlbnRlcicpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBzeW50aCBub3JtYWxpemVkIHBvc2l0aW9uIC0gbGFnIG9mIG9uZSBmcmFtZS4uLlxuICAgICAgY29uc3QgcG9zID0gdGhpcy5yZW5kZXJlci5nZXRCYWxsb29uTm9ybWFsaXplZFBvc2l0aW9uKCk7XG4gICAgICBpZiAocG9zICE9PSBudWxsKSB7IC8vIGRvbid0IHVwZGF0ZSBzeW50aCBjb250cm9sIHZhbHVlcyBpZiBubyBiYWxsb29uXG4gICAgICAgIHRoaXMuc3ludGguY29udHJvbFBvc2l0aW9uWzBdID0gcG9zWzBdO1xuICAgICAgICB0aGlzLnN5bnRoLmNvbnRyb2xQb3NpdGlvblsxXSA9IHBvc1sxXTtcbiAgICAgICAgdGhpcy5zeW50aC5vbkNvbnRyb2xVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIGNvbnN0IHNoYXJlZFBhcmFtcyA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXM7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpiYWxsb29uUmFkaXVzJywgdGhpcy5fdXBkYXRlQmFsbG9vblJhZGl1cyk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpzcGF3bkludGVydmFsJywgdGhpcy5fdXBkYXRlU3Bhd25JbnRlcnZhbCk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpoYXJtb255JywgdGhpcy5fb25IYXJtb255VXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignYXZvaWRUaGVSYWluOnNpbmVWb2x1bWUnLCB0aGlzLl9vblNpbmVWb2x1bWVVcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46c2hvd1RleHQnLCB0aGlzLl9vblNob3dUZXh0KTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignYXZvaWRUaGVSYWluOmdvVG9UZXh0JywgdGhpcy5fb25Hb1RvVGV4dCk7XG4gICAgLy8gY2FsbCB0aGlzIGF0IHRoZSBlbmQgdG8gYmUgc3VyZSBhbGwgb3RoZXIgcGFyYW1zIGFyZSByZWFkeVxuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46dG9nZ2xlUmFpbicsIHRoaXMuX3RvZ2dsZVJhaW4pO1xuXG4gICAgLy8gdGhpcy5leHBlcmllbmNlLmFkZEFjY2VsZXJhdGlvbkxpc3RlbmVyKHRoaXMuX29uQWNjZWxlcmF0aW9uSW5wdXQpO1xuICAgIC8vIHN0b3AgbGlzdGVuaW5nIGZvciBvcmllbnRhdGlvblxuICAgIHRoaXMuZXhwZXJpZW5jZS5ncm91cEZpbHRlci5zdG9wTGlzdGVuaW5nKCk7XG5cbiAgICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fb25BY2NlbGVyYXRpb25JbnB1dCwgZmFsc2UpO1xuICAgICAgLy8gaWYgbm8gYWNjZWxlcmF0aW9uIGV2ZW50IGNvbWUgZmFsbGJhY2sgb24gZW11bGF0aW9uXG4gICAgICB0aGlzLmZhbGxiYWNrVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbXVsYXRlTW90aW9uID0gdHJ1ZSwgNDAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW11bGF0ZU1vdGlvbiA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB2aWV3cG9ydC5yZW1vdmVSZXNpemVMaXN0ZW5lcih0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICB0aGlzLnZpZXcuaGlkZVNjb3JlKCk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdmb3JlZ3JvdW5kJyk7XG5cbiAgICAvLyBzdG9wIGxpc3RlbmluZyBzaGFyZWRQYXJhbXNcbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46aGFybW9ueScsIHRoaXMuX29uSGFybW9ueVVwZGF0ZSk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpiYWxsb29uUmFkaXVzJywgdGhpcy5fdXBkYXRlQmFsbG9vblJhZGl1cyk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpzcGF3bkludGVydmFsJywgdGhpcy5fdXBkYXRlU3Bhd25JbnRlcnZhbCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpzaW5lVm9sdW1lJywgdGhpcy5fb25TaW5lVm9sdW1lVXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcignYXZvaWRUaGVSYWluOnNob3dUZXh0JywgdGhpcy5fb25TaG93VGV4dCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpnb1RvVGV4dCcsIHRoaXMuX29uR29Ub1RleHQpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46dG9nZ2xlUmFpbicsIHRoaXMuX3RvZ2dsZVJhaW4pO1xuXG4gICAgaWYgKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudClcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9vbkFjY2VsZXJhdGlvbklucHV0LCBmYWxzZSk7XG5cbiAgICAvLyByZXN0YXJ0IGxpc3RlbmluZyBvcmllbnRhdGlvblxuICAgIHRoaXMuZXhwZXJpZW5jZS5ncm91cEZpbHRlci5zdGFydExpc3RlbmluZygpO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuc3Bhd25UaW1lb3V0KTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oYXJtb255VXBkYXRlVGltZW91dCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY3JlYXRlQmFsbG9vblRpbWVvdXQpO1xuXG4gICAgdGhpcy5yZW5kZXJlci5leGl0KCk7XG4gICAgdGhpcy5zeW50aC5zdG9wU2luZSgpO1xuICAgIHRoaXMuc3ludGgudHJpZ2dlckdsaXRjaCgpO1xuICB9XG5cbiAgX29uRXhwbG9kZWQoKSB7XG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgfVxuXG4gIF9vblNob3dUZXh0KHZhbHVlKSB7XG4gICAgdGhpcy52aWV3Lm1vZGVsLnNob3dUZXh0ID0gdmFsdWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNob3ctdGV4dCcpO1xuICB9XG5cbiAgX29uR29Ub1RleHQodmFsdWUpIHtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVsLmdvVG9Db2xvciA9ICcnO1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAncmFuZG9tJzpcbiAgICAgICAgY29uc3QgY29sb3JzID0gWydibHVlJywgJ3BpbmsnLCAneWVsbG93JywgJ3JlZCddO1xuICAgICAgICBjb25zdCBjb2xvciA9IGNvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvcnMubGVuZ3RoKV07XG4gICAgICAgIHRoaXMudmlldy5tb2RlbC5nb1RvQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNob3ctdGV4dCcpO1xuICB9XG5cbiAgX29uU2luZVZvbHVtZVVwZGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuc3ludGguc2V0U2luZU1hc3Rlcih2YWx1ZSk7XG4gIH1cblxuICBfdXBkYXRlQmFsbG9vblJhZGl1cyh2YWx1ZSkge1xuICAgIHRoaXMucmVuZGVyZXIudXBkYXRlQmFsbG9vblJhZGl1cyh2YWx1ZSk7XG4gICAgdGhpcy5jdXJyZW50QmFsbG9vblJhZGl1cyA9IHZhbHVlO1xuICB9XG5cbiAgX29uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICB9XG5cbiAgX29uQWNjZWxlcmF0aW9uSW5wdXQoZSkge1xuICAgIGlmICh0aGlzLmZhbGxiYWNrVGltZW91dCkgeyAvLyB3ZSBoYXZlIHZhbHVlcywgcHJldmVudCBmYWxsYmFjayB0byBleGVjdXRlXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVvdXQpO1xuICAgICAgdGhpcy5mYWxsYmFja1RpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBbXTtcbiAgICBkYXRhWzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4gICAgZGF0YVsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuXG4gICAgaWYgKHRoaXMuY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJykge1xuICAgICAgZGF0YVswXSAqPSAtMTtcbiAgICAgIGRhdGFbMV0gKj0gLTE7XG4gICAgfVxuXG4gICAgbGV0IHZ4O1xuICAgIGxldCB2eTtcblxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XG4gICAgICB2eCA9IC0gZGF0YVswXSAvIDkuODE7XG4gICAgICB2eSA9IChkYXRhWzFdIC0gNSkgLyA5LjgxO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcbiAgICAgIHZ4ID0gLSBkYXRhWzFdIC8gOS44MTtcbiAgICAgIHZ5ID0gLSAoZGF0YVswXSArIDUpIC8gOS44MTtcbiAgICB9XG5cbiAgICBjb25zdCBrID0gNTAwO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QmFsbG9vbkFjY2VsZXJhdGlvbih2eCAqIGssIHZ5ICogayk7XG4gIH1cblxuICBfb25SYWluSGl0KGNvbG9yKSB7XG4gICAgdGhpcy5nbG9iYWxTdGF0ZS5zY29yZVtjb2xvcl0gLT0gMTtcbiAgICB0aGlzLnZpZXcubW9kZWwuc2NvcmVbY29sb3JdIC09IDE7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNjb3JlJyk7XG5cbiAgICB0aGlzLnN5bnRoLnN0b3BTaW5lKCk7XG4gICAgdGhpcy5zeW50aC50cmlnZ2VyR2xpdGNoKCk7XG4gICAgLy8gcmVzcGF3biBiYWxsb24gaW4gb25lIHNlY29uZCAoc2hvdWxkIGJlIGJpZ2dlciB0aGFuIGdyYWluIGR1cmF0aW9uKVxuICAgIHRoaXMuY3JlYXRlQmFsbG9vblRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuX3NwYXduQmFsbG9vbiwgMTAwMCk7XG4gIH1cblxuICBfc3Bhd25CYWxsb29uKCkge1xuICAgIGNvbnN0IGZhZGVJbkR1cmF0aW9uID0gMTtcbiAgICB0aGlzLnJlbmRlcmVyLmNyZWF0ZUJhbGxvb24odGhpcy5jdXJyZW50QmFsbG9vblJhZGl1cywgZmFkZUluRHVyYXRpb24sIHRoaXMuZW11bGF0ZU1vdGlvbik7XG4gICAgdGhpcy5zeW50aC5zdGFydFNpbmUoZmFkZUluRHVyYXRpb24pO1xuICB9XG5cbiAgX3RvZ2dsZVJhaW4odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdzdGFydCcgJiZcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVsLnN0YXRlICE9PSAnaW50cm8nICYmXG4gICAgICAgIHRoaXMuc3Bhd25UaW1lb3V0ID09PSBudWxsXG4gICAgKSB7XG4gICAgICB0aGlzLl9zcGF3blJhaW5Ecm9wKCk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3N0b3AnKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zcGF3blRpbWVvdXQpO1xuICAgICAgdGhpcy5zcGF3blRpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVTcGF3bkludGVydmFsKHZhbHVlKSB7XG4gICAgdGhpcy5zcGF3bkludGVydmFsID0gdmFsdWU7XG4gIH1cblxuICBfc3Bhd25SYWluRHJvcCgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmNyZWF0ZVJhaW5Ecm9wKCk7XG4gICAgLy8gbWluIGRlbGF5IHRvIDUwbXNcbiAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDAuMDUsIE1hdGgucmFuZG9tKCkgKiB0aGlzLnNwYXduSW50ZXJ2YWwgKiAwLjUgKyB0aGlzLnNwYXduSW50ZXJ2YWwgKiAwLjUpO1xuICAgIHRoaXMuc3Bhd25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLl9zcGF3blJhaW5Ecm9wKCksIGRlbGF5ICogMTAwMCk7XG4gIH1cblxuICBfb25IYXJtb255VXBkYXRlKHZhbHVlKSB7XG4gICAgLy8gaWYgYSByZXNwYXduIHdhcyBzY2hlZHVsZWRcbiAgICBjbGVhclRpbWVvdXQodGhpcy5jcmVhdGVCYWxsb29uVGltZW91dCk7XG5cbiAgICB0aGlzLmhhcm1vbnlVcGRhdGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnN5bnRoLnNldE5leHRIYXJtb255KHZhbHVlKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZSgpO1xuICAgICAgdGhpcy5zeW50aC5zdG9wU2luZSgpO1xuICAgICAgLy8gdGhpcy5zeW50aC50cmlnZ2VyR2xpdGNoKCk7XG4gICAgICAvLyByZXNwYXduIGJhbGxvbiBpbiBvbmUgc2Vjb25kIChzaG91bGQgYmUgYmlnZ2VyIHRoYW4gZ3JhaW4gZHVyYXRpb24pXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jcmVhdGVCYWxsb29uVGltZW91dCk7XG4gICAgICB0aGlzLmNyZWF0ZUJhbGxvb25UaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLl9zcGF3bkJhbGxvb24sIDApO1xuICAgIH0sIDMwMDAgKiBNYXRoLnJhbmRvbSgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdm9pZFRoZVJhaW5TdGF0ZTtcbiJdfQ==