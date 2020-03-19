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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF2b2lkVGhlUmFpblN0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwiXzJQSSIsIk1hdGgiLCJQSSIsIkF2b2lkVGhlUmFpblZpZXciLCIkc2NvcmUiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiY2xhc3NMaXN0IiwiYWRkIiwiQ2FudmFzVmlldyIsIkZsb2F0aW5nQmFsbG9vbiIsImZhZGVJbkR1cmF0aW9uIiwiYXJncyIsIm9wYWNpdHkiLCJ0aW1lRmFkZUluIiwidngiLCJ2eSIsInJhZGl1cyIsInNpemUiLCJ3aWR0aCIsImhlaWdodCIsImR0IiwieCIsInkiLCJtYXgiLCJtaW4iLCJCYWxsb29uIiwiUmFpbkRyb3AiLCJyb3VuZCIsInJhbmRvbSIsInIiLCJnIiwiYiIsImNvbG9yIiwiY3R4Iiwic2F2ZSIsImJlZ2luUGF0aCIsImZpbGxTdHlsZSIsImFyYyIsImZpbGwiLCJjbG9zZVBhdGgiLCJyZXN0b3JlIiwiQXZvaWRUaGVSYWluUmVuZGVyZXIiLCJzcHJpdGVDb25maWciLCJvblJhaW5IaXQiLCJvbkV4cGxvZGVkIiwiZXhwbG9kZVN0YXRlIiwicmFpbkRyb3BzIiwiYmFsbG9vbiIsImdldEJhbGxvb25Ob3JtYWxpemVkUG9zaXRpb24iLCJiaW5kIiwiZW11bGF0ZU1vdGlvbiIsImNvbmZpZyIsImNvbG9ySW5kZXgiLCJmbG9vciIsImNvbG9ycyIsImxlbmd0aCIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwiY2xpcEhlaWdodCIsInJlZnJlc2hSYXRlIiwiYW5pbWF0aW9uUmF0ZSIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwicmFpbkRyb3AiLCJwdXNoIiwidmFsdWUiLCJzZXRSYWRpdXMiLCJwb3MiLCJleHBsb2RlIiwicmFkaXVzU3F1YXJlZCIsImkiLCJkeCIsImR5IiwiZGlzdFNxdWFyZWQiLCJzcGxpY2UiLCJ1cGRhdGUiLCJpc0RlYWQiLCJ0ZXN0UmFpbkhpdCIsInJlbmRlciIsIkNhbnZhczJkUmVuZGVyZXIiLCJBdm9pZFRoZVJhaW5TdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsImNsaWVudCIsIm9yaWVudGF0aW9uIiwiY3VycmVudEJhbGxvb25SYWRpdXMiLCJzcGF3bkludGVydmFsIiwic3Bhd25UaW1lb3V0IiwiY3JlYXRlQmFsbG9vblRpbWVvdXQiLCJoYXJtb255VXBkYXRlVGltZW91dCIsIl9vblJlc2l6ZSIsIl9zcGF3bkJhbGxvb24iLCJfdXBkYXRlQmFsbG9vblJhZGl1cyIsIl9vbkFjY2VsZXJhdGlvbklucHV0IiwiX3RvZ2dsZVJhaW4iLCJfdXBkYXRlU3Bhd25JbnRlcnZhbCIsIl9vblJhaW5IaXQiLCJfb25FeHBsb2RlZCIsIl9vbkhhcm1vbnlVcGRhdGUiLCJfb25TaW5lVm9sdW1lVXBkYXRlIiwiX29uU2hvd1RleHQiLCJfb25Hb1RvVGV4dCIsInJlbmRlcmVyIiwic3ludGgiLCJBdm9pZFRoZVJhaW5TeW50aCIsImF1ZGlvQnVmZmVyTWFuYWdlciIsImdldCIsImF2b2lkVGhlUmFpbkNvbmZpZyIsImdldEF1ZGlvRGVzdGluYXRpb24iLCJ2aWV3cG9ydCIsImFkZFJlc2l6ZUxpc3RlbmVyIiwidmlldyIsInNob3dJbnN0cnVjdGlvbnMiLCJzY29yZSIsInNob3dUZXh0IiwiZ29Ub0NvbG9yIiwiY2xhc3NOYW1lIiwic2hvdyIsImFwcGVuZFRvIiwiZ2V0U3RhdGVDb250YWluZXIiLCJpbnN0cnVjdGlvbnNEdXJhdGlvbiIsImluc3RydWN0aW9uc1RpbWUiLCJzZXRQcmVSZW5kZXIiLCJjbGVhclJlY3QiLCJtb2RlbCIsImNvbnRyb2xQb3NpdGlvbiIsIm9uQ29udHJvbFVwZGF0ZSIsImFkZFJlbmRlcmVyIiwic2hhcmVkUGFyYW1zIiwiYWRkUGFyYW1MaXN0ZW5lciIsImdyb3VwRmlsdGVyIiwic3RvcExpc3RlbmluZyIsIndpbmRvdyIsIkRldmljZU1vdGlvbkV2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImZhbGxiYWNrVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVSZXNpemVMaXN0ZW5lciIsImhpZGVTY29yZSIsInJlbW92ZSIsInJlbW92ZVBhcmFtTGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3RhcnRMaXN0ZW5pbmciLCJjbGVhclRpbWVvdXQiLCJleGl0Iiwic3RvcFNpbmUiLCJ0cmlnZ2VyR2xpdGNoIiwicmVtb3ZlUmVuZGVyZXIiLCJzZXRTaW5lTWFzdGVyIiwidXBkYXRlQmFsbG9vblJhZGl1cyIsImUiLCJkYXRhIiwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSIsInBsYXRmb3JtIiwib3MiLCJrIiwic2V0QmFsbG9vbkFjY2VsZXJhdGlvbiIsImNyZWF0ZUJhbGxvb24iLCJzdGFydFNpbmUiLCJzdGF0ZSIsIl9zcGF3blJhaW5Ecm9wIiwiY3JlYXRlUmFpbkRyb3AiLCJkZWxheSIsInNldE5leHRIYXJtb255Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsdzVCQUFOOztBQTRCQSxJQUFNQyxPQUFPQyxLQUFLQyxFQUFMLEdBQVUsQ0FBdkI7O0lBRU1DLGdCOzs7Ozs7Ozs7OytCQUNPO0FBQ1Q7QUFDQSxXQUFLQyxNQUFMLEdBQWMsS0FBS0MsR0FBTCxDQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQWQ7QUFDRDs7O2dDQUVXO0FBQ1YsV0FBS0YsTUFBTCxDQUFZRyxTQUFaLENBQXNCQyxHQUF0QixDQUEwQixRQUExQjtBQUNEOzs7RUFSNEJDLGtCOztJQVd6QkMsZTs7O0FBQ0osMkJBQVlDLGNBQVosRUFBcUM7QUFBQTs7QUFBQTs7QUFBQSxzQ0FBTkMsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUEsb0xBQzFCQSxJQUQwQjs7QUFHbkMsV0FBS0MsT0FBTCxHQUFlLENBQWY7QUFDQSxXQUFLRixjQUFMLEdBQXNCQSxjQUF0QjtBQUNBLFdBQUtHLFVBQUwsR0FBa0IsQ0FBbEI7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QUwsQ0FBVzRELGNBQVgsQ0FBMEJsRyxLQUExQjtBQUNBLGVBQUtxQyxRQUFMLENBQWNsQyxPQUFkO0FBQ0EsZUFBS21DLEtBQUwsQ0FBVzBDLFFBQVg7QUFDQTtBQUNBO0FBQ0FGLHFCQUFhLE9BQUt2RCxvQkFBbEI7QUFDQSxlQUFLQSxvQkFBTCxHQUE0QmdELFdBQVcsT0FBSzdDLGFBQWhCLEVBQStCLENBQS9CLENBQTVCO0FBQ0QsT0FSMkIsRUFRekIsT0FBTzlGLEtBQUs0QixNQUFMLEVBUmtCLENBQTVCO0FBU0Q7Ozs7O2tCQUdZdUQsaUIiLCJmaWxlIjoiQXZvaWRUaGVSYWluU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNWaWV3LCBDYW52YXMyZFJlbmRlcmVyLCB2aWV3cG9ydCB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBBdm9pZFRoZVJhaW5TeW50aCBmcm9tICcuLi9hdWRpby9Bdm9pZFRoZVJhaW5TeW50aCc7XG5pbXBvcnQgQmFsbG9vbiBmcm9tICcuLi9yZW5kZXJlcnMvQmFsbG9vbic7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPlxuICAgICAgPGRpdiBjbGFzcz1cInNjb3JlXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiYmx1ZVwiPjwlPSBzY29yZS5ibHVlICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInBpbmtcIj48JT0gc2NvcmUucGluayAlPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJ5ZWxsb3dcIj48JT0gc2NvcmUueWVsbG93ICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInJlZFwiPjwlPSBzY29yZS5yZWQgJT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXJcIj5cbiAgICAgIDwlIGlmIChzaG93SW5zdHJ1Y3Rpb25zID09PSB0cnVlKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tY2VudGVyIHNvZnQtYmxpbmtcIj5UaWx0IHlvdXIgcGhvbmUgdG8gbW92ZSB0aGUgYmFsbG9vbiE8L3A+XG4gICAgICA8JSB9ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2hvdy10ZXh0XCI+XG4gICAgICA8JSBpZiAoc2hvd1RleHQgPT09ICdmbHknKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tY2VudGVyIHNvZnQtYmxpbmtcIj5GbHkgd2l0aCB0aGUgYmFsbG9vbjxiciAvPnRvIGF2b2lkIHRoZSByYWluITwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICAgIDwlIGlmIChnb1RvQ29sb3IgIT09ICcnKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tY2VudGVyXCI+R28gdG8gPCU9IGdvVG9Db2xvciAlPiE8L3A+XG4gICAgICA8JSB9ICU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jb25zdCBfMlBJID0gTWF0aC5QSSAqIDI7XG5cbmNsYXNzIEF2b2lkVGhlUmFpblZpZXcgZXh0ZW5kcyBDYW52YXNWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRzY29yZSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zY29yZScpO1xuICB9XG5cbiAgaGlkZVNjb3JlKCkge1xuICAgIHRoaXMuJHNjb3JlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICB9XG59XG5cbmNsYXNzIEZsb2F0aW5nQmFsbG9vbiBleHRlbmRzIEJhbGxvb24ge1xuICBjb25zdHJ1Y3RvcihmYWRlSW5EdXJhdGlvbiwgLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5vcGFjaXR5ID0gMDtcbiAgICB0aGlzLmZhZGVJbkR1cmF0aW9uID0gZmFkZUluRHVyYXRpb247XG4gICAgdGhpcy50aW1lRmFkZUluID0gMDtcbiAgICB0aGlzLnZ4ID0gMDtcbiAgICB0aGlzLnZ5ID0gMDtcbiAgfVxuXG4gIHNldFJhZGl1cyhyYWRpdXMpIHtcbiAgICAvLyB0aGlzLnJhZGl1cyA9IHdpZHRoIC8gMiAtIDQ7XG4gICAgY29uc3Qgc2l6ZSA9IChyYWRpdXMgKyA0KSAqIDI7XG4gICAgdGhpcy53aWR0aCA9IHNpemU7XG4gICAgdGhpcy5oZWlnaHQgPSBzaXplO1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICB9XG5cbiAgdXBkYXRlKGR0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgc3VwZXIudXBkYXRlKGR0KTtcblxuICAgIHRoaXMueCArPSB0aGlzLnZ4ICogZHQ7XG4gICAgdGhpcy55ICs9IHRoaXMudnkgKiBkdDtcbiAgICAvLyBjbGFtcCB0byBzY3JlZW5cbiAgICB0aGlzLnggPSBNYXRoLm1heCgwLCBNYXRoLm1pbih3aWR0aCwgdGhpcy54KSk7XG4gICAgdGhpcy55ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oaGVpZ2h0LCB0aGlzLnkpKTtcblxuICAgIGlmICh0aGlzLnRpbWVGYWRlSW4gPCB0aGlzLmZhZGVJbkR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnRpbWVGYWRlSW4gKz0gZHQ7XG4gICAgICB0aGlzLm9wYWNpdHkgPSBNYXRoLm1pbigxLCB0aGlzLnRpbWVGYWRlSW4gLyB0aGlzLmZhZGVJbkR1cmF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGFjaXR5ID0gMTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmFpbkRyb3Age1xuICBjb25zdHJ1Y3Rvcih4LCB5LCB2eSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnZ5ID0gdnk7XG4gICAgdGhpcy5yYWRpdXMgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpICsgMTtcblxuICAgIC8vIHJnYigxNTMsIDIwNCwgMjU1KVxuICAgIGNvbnN0IHIgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAoMjU1IC0gMTUzKSArIDE1Myk7XG4gICAgY29uc3QgZyA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICgyNTUgLSAyMDQpICsgMjA0KTtcbiAgICBjb25zdCBiID0gMjU1O1xuICAgIHRoaXMuY29sb3IgPSBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYDtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIHRoaXMueSArPSAodGhpcy52eSAqIGR0KTtcbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgXzJQSSwgZmFsc2UpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cblxuY2xhc3MgQXZvaWRUaGVSYWluUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3ByaXRlQ29uZmlnLCBvblJhaW5IaXQsIG9uRXhwbG9kZWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zcHJpdGVDb25maWcgPSBzcHJpdGVDb25maWc7XG4gICAgdGhpcy5vblJhaW5IaXQgPSBvblJhaW5IaXQ7XG4gICAgdGhpcy5vbkV4cGxvZGVkID0gb25FeHBsb2RlZDtcbiAgICB0aGlzLmV4cGxvZGVTdGF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5yYWluRHJvcHMgPSBbXTtcbiAgICB0aGlzLmJhbGxvb24gPSBudWxsO1xuXG4gICAgdGhpcy5nZXRCYWxsb29uTm9ybWFsaXplZFBvc2l0aW9uID0gdGhpcy5nZXRCYWxsb29uTm9ybWFsaXplZFBvc2l0aW9uLmJpbmQodGhpcyk7XG4gIH1cblxuICBjcmVhdGVCYWxsb29uKHJhZGl1cywgZmFkZUluRHVyYXRpb24sIGVtdWxhdGVNb3Rpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuc3ByaXRlQ29uZmlnO1xuICAgIGNvbnN0IGNvbG9ySW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb25maWcuY29sb3JzLmxlbmd0aCk7XG4gICAgY29uc3QgY29sb3IgPSBjb25maWcuY29sb3JzW2NvbG9ySW5kZXhdO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICBjb25zdCBjbGlwV2lkdGggPSBjb25maWcuY2xpcFNpemUud2lkdGg7XG4gICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcbiAgICBjb25zdCBzaXplID0gcmFkaXVzICogMjtcbiAgICBsZXQgeCA9IHRoaXMuY2FudmFzV2lkdGggLyAyO1xuICAgIGxldCB5ID0gdGhpcy5jYW52YXNIZWlnaHQgKiAzIC8gNTtcblxuICAgIC8vIG1ha2UgYmFsbG9uIGFwcGVhciByYW5kb21seVxuICAgIGlmIChlbXVsYXRlTW90aW9uKSB7XG4gICAgICB4ID0gTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzV2lkdGg7XG4gICAgICB5ID0gTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnN0IGJhbGxvb24gPSBuZXcgRmxvYXRpbmdCYWxsb29uKGZhZGVJbkR1cmF0aW9uLCBjb2xvciwgaW1hZ2UsIGNsaXBQb3NpdGlvbnMsIGNsaXBXaWR0aCwgY2xpcEhlaWdodCwgcmVmcmVzaFJhdGUsIHNpemUsIHNpemUsIHgsIHkpO1xuXG4gICAgdGhpcy5iYWxsb29uID0gYmFsbG9vbjtcbiAgfVxuXG4gIGNyZWF0ZVJhaW5Ecm9wKCkge1xuICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCB5ID0gLTEwO1xuICAgIGNvbnN0IHZ5ID0gMC4zICogdGhpcy5jYW52YXNIZWlnaHQgKiAoTWF0aC5yYW5kb20oKSAqIDAuMiArIDAuOCk7XG5cbiAgICBjb25zdCByYWluRHJvcCA9IG5ldyBSYWluRHJvcCh4LCB5LCB2eSk7XG4gICAgdGhpcy5yYWluRHJvcHMucHVzaChyYWluRHJvcCk7XG4gIH1cblxuICB1cGRhdGVCYWxsb29uUmFkaXVzKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuYmFsbG9vbiAhPT0gbnVsbClcbiAgICAgIHRoaXMuYmFsbG9vbi5zZXRSYWRpdXModmFsdWUpO1xuICB9XG5cbiAgc2V0QmFsbG9vbkFjY2VsZXJhdGlvbih2eCwgdnkpIHtcbiAgICBpZiAodGhpcy5iYWxsb29uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmJhbGxvb24udnggPSB2eDtcbiAgICAgIHRoaXMuYmFsbG9vbi52eSA9IHZ5O1xuICAgIH1cbiAgfVxuXG4gIGdldEJhbGxvb25Ob3JtYWxpemVkUG9zaXRpb24oKSB7XG4gICAgbGV0IHBvcyA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uKVxuICAgICAgcG9zID0gW3RoaXMuYmFsbG9vbi54IC8gdGhpcy5jYW52YXNXaWR0aCwgdGhpcy5iYWxsb29uLnkgLyB0aGlzLmNhbnZhc0hlaWdodF07XG5cbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgdGVzdFJhaW5IaXQoKSB7XG4gICAgaWYgKHRoaXMuYmFsbG9vbiAhPT0gbnVsbCAmJlxuICAgICAgICB0aGlzLmJhbGxvb24uZXhwbG9kZSAhPT0gdHJ1ZSAmJlxuICAgICAgICB0aGlzLmJhbGxvb24ub3BhY2l0eSA+PSAxXG4gICAgKSB7XG4gICAgICBjb25zdCB4ID0gdGhpcy5iYWxsb29uLng7XG4gICAgICBjb25zdCB5ID0gdGhpcy5iYWxsb29uLnk7XG4gICAgICBjb25zdCByYWRpdXMgPSB0aGlzLmJhbGxvb24ucmFkaXVzO1xuICAgICAgY29uc3QgcmFkaXVzU3F1YXJlZCA9IHJhZGl1cyAqIHJhZGl1cztcblxuICAgICAgZm9yIChsZXQgaSA9IHRoaXMucmFpbkRyb3BzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IHJhaW5Ecm9wID0gdGhpcy5yYWluRHJvcHNbaV07XG4gICAgICAgIGNvbnN0IGR4ID0gcmFpbkRyb3AueCAtIHg7XG4gICAgICAgIGNvbnN0IGR5ID0gcmFpbkRyb3AueSAtIHk7XG4gICAgICAgIGNvbnN0IGRpc3RTcXVhcmVkID0gZHggKiBkeCArIGR5ICogZHk7XG5cbiAgICAgICAgaWYgKGRpc3RTcXVhcmVkIDwgcmFkaXVzU3F1YXJlZCkge1xuICAgICAgICAgIC8vIHRyaWdnZXJcbiAgICAgICAgICB0aGlzLm9uUmFpbkhpdCh0aGlzLmJhbGxvb24uY29sb3IpO1xuICAgICAgICAgIHRoaXMuYmFsbG9vbi5leHBsb2RlID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJhaW5Ecm9wcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBleHBsb2RlKCkge1xuICAgIGlmICh0aGlzLmJhbGxvb24gIT09IG51bGwpXG4gICAgICB0aGlzLmJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gIH1cblxuICBleGl0KCkge1xuICAgIGlmICh0aGlzLmJhbGxvb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFsbG9vbi5leHBsb2RlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZXhwbG9kZVN0YXRlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkV4cGxvZGVkKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbiAhPT0gbnVsbClcbiAgICAgIHRoaXMuYmFsbG9vbi51cGRhdGUoZHQsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbiAhPT0gbnVsbCAmJiB0aGlzLmJhbGxvb24uaXNEZWFkID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmJhbGxvb24gPSBudWxsO1xuXG4gICAgICBpZiAodGhpcy5leHBsb2RlU3RhdGUgPT09IHRydWUpXG4gICAgICAgIHRoaXMub25FeHBsb2RlZCgpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSB0aGlzLnJhaW5Ecm9wcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgcmFpbkRyb3AgPSB0aGlzLnJhaW5Ecm9wc1tpXTtcbiAgICAgIHJhaW5Ecm9wLnVwZGF0ZShkdCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgIGlmIChyYWluRHJvcC55ID4gdGhpcy5jYW52YXNIZWlnaHQgKyAxMClcbiAgICAgICAgdGhpcy5yYWluRHJvcHMuc3BsaWNlKGksIDEpO1xuICAgIH1cblxuICAgIHRoaXMudGVzdFJhaW5IaXQoKTtcbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5yYWluRHJvcHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICB0aGlzLnJhaW5Ecm9wc1tpXS5yZW5kZXIoY3R4KTtcblxuICAgIGlmICh0aGlzLmJhbGxvb24gIT09IG51bGwpXG4gICAgICB0aGlzLmJhbGxvb24ucmVuZGVyKGN0eCk7XG4gIH1cbn1cblxuY2xhc3MgQXZvaWRUaGVSYWluU3RhdGUge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBnbG9iYWxTdGF0ZSwgY2xpZW50KSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRCYWxsb29uUmFkaXVzID0gMDtcbiAgICB0aGlzLnNwYXduSW50ZXJ2YWwgPSBudWxsO1xuICAgIHRoaXMuc3Bhd25UaW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLmNyZWF0ZUJhbGxvb25UaW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLmhhcm1vbnlVcGRhdGVUaW1lb3V0ID0gbnVsbDtcbiAgICAvLyBpZiB0cnVlLCBhY2NlbGVyYXRpb24gaXMgbm90IGF2YWlsYWJsZSBzbyBkbyBzb21ldGhpbmcuLi5cbiAgICB0aGlzLmVtdWxhdGVNb3Rpb24gPSBmYWxzZTtcblxuXG4gICAgdGhpcy5fb25SZXNpemUgPSB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NwYXduQmFsbG9vbiA9IHRoaXMuX3NwYXduQmFsbG9vbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VwZGF0ZUJhbGxvb25SYWRpdXMgPSB0aGlzLl91cGRhdGVCYWxsb29uUmFkaXVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BY2NlbGVyYXRpb25JbnB1dCA9IHRoaXMuX29uQWNjZWxlcmF0aW9uSW5wdXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl90b2dnbGVSYWluID0gdGhpcy5fdG9nZ2xlUmFpbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VwZGF0ZVNwYXduSW50ZXJ2YWwgPSB0aGlzLl91cGRhdGVTcGF3bkludGVydmFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25SYWluSGl0ID0gdGhpcy5fb25SYWluSGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25FeHBsb2RlZCA9IHRoaXMuX29uRXhwbG9kZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkhhcm1vbnlVcGRhdGUgPSB0aGlzLl9vbkhhcm1vbnlVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNpbmVWb2x1bWVVcGRhdGUgPSB0aGlzLl9vblNpbmVWb2x1bWVVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNob3dUZXh0ID0gdGhpcy5fb25TaG93VGV4dC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uR29Ub1RleHQgPSB0aGlzLl9vbkdvVG9UZXh0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IEF2b2lkVGhlUmFpblJlbmRlcmVyKHRoaXMuZXhwZXJpZW5jZS5zcHJpdGVDb25maWcsIHRoaXMuX29uUmFpbkhpdCwgdGhpcy5fb25FeHBsb2RlZCk7XG5cbiAgICB0aGlzLnN5bnRoID0gbmV3IEF2b2lkVGhlUmFpblN5bnRoKFxuICAgICAgdGhpcy5leHBlcmllbmNlLmF1ZGlvQnVmZmVyTWFuYWdlci5nZXQoJ2F2b2lkLXRoZS1yYWluOnNpbmVzJyksXG4gICAgICB0aGlzLmV4cGVyaWVuY2UuYXVkaW9CdWZmZXJNYW5hZ2VyLmdldCgnYXZvaWQtdGhlLXJhaW46Z2xpdGNoZXMnKSxcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5hdm9pZFRoZVJhaW5Db25maWcsXG4gICAgICB0aGlzLmV4cGVyaWVuY2UuZ2V0QXVkaW9EZXN0aW5hdGlvbigpXG4gICAgKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHZpZXdwb3J0LmFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMuX29uUmVzaXplKTtcblxuICAgIHRoaXMudmlldyA9IG5ldyBBdm9pZFRoZVJhaW5WaWV3KHRlbXBsYXRlLCB7XG4gICAgICBzaG93SW5zdHJ1Y3Rpb25zOiB0cnVlLFxuICAgICAgc2NvcmU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2xvYmFsU3RhdGUuc2NvcmUpLFxuICAgICAgc2hvd1RleHQ6ICdub25lJyxcbiAgICAgIGdvVG9Db2xvcjogJycsXG4gICAgfSwge30sIHtcbiAgICAgIGNsYXNzTmFtZTogWydhdm9pZC10aGUtcmFpbi1zdGF0ZScsICdmb3JlZ3JvdW5kJ10sXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdGhpcy52aWV3LnNob3coKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy5leHBlcmllbmNlLnZpZXcuZ2V0U3RhdGVDb250YWluZXIoKSk7XG5cbiAgICBjb25zdCBpbnN0cnVjdGlvbnNEdXJhdGlvbiA9IDEwO1xuICAgIGxldCBpbnN0cnVjdGlvbnNUaW1lID0gMDtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgIGlmICh0aGlzLnZpZXcubW9kZWwuc2hvd0luc3RydWN0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICBpbnN0cnVjdGlvbnNUaW1lICs9IGR0O1xuXG4gICAgICAgIGlmIChpbnN0cnVjdGlvbnNUaW1lID4gaW5zdHJ1Y3Rpb25zRHVyYXRpb24pIHtcbiAgICAgICAgICB0aGlzLnZpZXcubW9kZWwuc2hvd0luc3RydWN0aW9ucyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWNlbnRlcicpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBzeW50aCBub3JtYWxpemVkIHBvc2l0aW9uIC0gbGFnIG9mIG9uZSBmcmFtZS4uLlxuICAgICAgY29uc3QgcG9zID0gdGhpcy5yZW5kZXJlci5nZXRCYWxsb29uTm9ybWFsaXplZFBvc2l0aW9uKCk7XG4gICAgICBpZiAocG9zICE9PSBudWxsKSB7IC8vIGRvbid0IHVwZGF0ZSBzeW50aCBjb250cm9sIHZhbHVlcyBpZiBubyBiYWxsb29uXG4gICAgICAgIHRoaXMuc3ludGguY29udHJvbFBvc2l0aW9uWzBdID0gcG9zWzBdO1xuICAgICAgICB0aGlzLnN5bnRoLmNvbnRyb2xQb3NpdGlvblsxXSA9IHBvc1sxXTtcbiAgICAgICAgdGhpcy5zeW50aC5vbkNvbnRyb2xVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIGNvbnN0IHNoYXJlZFBhcmFtcyA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXM7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpiYWxsb29uUmFkaXVzJywgdGhpcy5fdXBkYXRlQmFsbG9vblJhZGl1cyk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpzcGF3bkludGVydmFsJywgdGhpcy5fdXBkYXRlU3Bhd25JbnRlcnZhbCk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpoYXJtb255JywgdGhpcy5fb25IYXJtb255VXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignYXZvaWRUaGVSYWluOnNpbmVWb2x1bWUnLCB0aGlzLl9vblNpbmVWb2x1bWVVcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46c2hvd1RleHQnLCB0aGlzLl9vblNob3dUZXh0KTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignYXZvaWRUaGVSYWluOmdvVG9UZXh0JywgdGhpcy5fb25Hb1RvVGV4dCk7XG4gICAgLy8gY2FsbCB0aGlzIGF0IHRoZSBlbmQgdG8gYmUgc3VyZSBhbGwgb3RoZXIgcGFyYW1zIGFyZSByZWFkeVxuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46dG9nZ2xlUmFpbicsIHRoaXMuX3RvZ2dsZVJhaW4pO1xuXG4gICAgLy8gdGhpcy5leHBlcmllbmNlLmFkZEFjY2VsZXJhdGlvbkxpc3RlbmVyKHRoaXMuX29uQWNjZWxlcmF0aW9uSW5wdXQpO1xuICAgIC8vIHN0b3AgbGlzdGVuaW5nIGZvciBvcmllbnRhdGlvblxuICAgIHRoaXMuZXhwZXJpZW5jZS5ncm91cEZpbHRlci5zdG9wTGlzdGVuaW5nKCk7XG5cbiAgICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlbW90aW9uJywgdGhpcy5fb25BY2NlbGVyYXRpb25JbnB1dCwgZmFsc2UpO1xuICAgICAgLy8gaWYgbm8gYWNjZWxlcmF0aW9uIGV2ZW50IGNvbWUgZmFsbGJhY2sgb24gZW11bGF0aW9uXG4gICAgICB0aGlzLmZhbGxiYWNrVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbXVsYXRlTW90aW9uID0gdHJ1ZSwgNDAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW11bGF0ZU1vdGlvbiA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB2aWV3cG9ydC5yZW1vdmVSZXNpemVMaXN0ZW5lcih0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICB0aGlzLnZpZXcuaGlkZVNjb3JlKCk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdmb3JlZ3JvdW5kJyk7XG5cbiAgICAvLyBzdG9wIGxpc3RlbmluZyBzaGFyZWRQYXJhbXNcbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46aGFybW9ueScsIHRoaXMuX29uSGFybW9ueVVwZGF0ZSk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpiYWxsb29uUmFkaXVzJywgdGhpcy5fdXBkYXRlQmFsbG9vblJhZGl1cyk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpzcGF3bkludGVydmFsJywgdGhpcy5fdXBkYXRlU3Bhd25JbnRlcnZhbCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpzaW5lVm9sdW1lJywgdGhpcy5fb25TaW5lVm9sdW1lVXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcignYXZvaWRUaGVSYWluOnNob3dUZXh0JywgdGhpcy5fb25TaG93VGV4dCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2F2b2lkVGhlUmFpbjpnb1RvVGV4dCcsIHRoaXMuX29uR29Ub1RleHQpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdhdm9pZFRoZVJhaW46dG9nZ2xlUmFpbicsIHRoaXMuX3RvZ2dsZVJhaW4pO1xuXG4gICAgaWYgKHdpbmRvdy5EZXZpY2VNb3Rpb25FdmVudClcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdkZXZpY2Vtb3Rpb24nLCB0aGlzLl9vbkFjY2VsZXJhdGlvbklucHV0LCBmYWxzZSk7XG5cbiAgICAvLyByZXN0YXJ0IGxpc3RlbmluZyBvcmllbnRhdGlvblxuICAgIHRoaXMuZXhwZXJpZW5jZS5ncm91cEZpbHRlci5zdGFydExpc3RlbmluZygpO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuc3Bhd25UaW1lb3V0KTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oYXJtb255VXBkYXRlVGltZW91dCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY3JlYXRlQmFsbG9vblRpbWVvdXQpO1xuXG4gICAgdGhpcy5yZW5kZXJlci5leGl0KCk7XG4gICAgdGhpcy5zeW50aC5zdG9wU2luZSgpO1xuICAgIHRoaXMuc3ludGgudHJpZ2dlckdsaXRjaCgpO1xuICB9XG5cbiAgX29uRXhwbG9kZWQoKSB7XG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgfVxuXG4gIF9vblNob3dUZXh0KHZhbHVlKSB7XG4gICAgdGhpcy52aWV3Lm1vZGVsLnNob3dUZXh0ID0gdmFsdWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNob3ctdGV4dCcpO1xuICB9XG5cbiAgX29uR29Ub1RleHQodmFsdWUpIHtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVsLmdvVG9Db2xvciA9ICcnO1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAncmFuZG9tJzpcbiAgICAgICAgY29uc3QgY29sb3JzID0gWydibHVlJywgJ3BpbmsnLCAneWVsbG93JywgJ3JlZCddO1xuICAgICAgICBjb25zdCBjb2xvciA9IGNvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvcnMubGVuZ3RoKV07XG4gICAgICAgIHRoaXMudmlldy5tb2RlbC5nb1RvQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNob3ctdGV4dCcpO1xuICB9XG5cbiAgX29uU2luZVZvbHVtZVVwZGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuc3ludGguc2V0U2luZU1hc3Rlcih2YWx1ZSk7XG4gIH1cblxuICBfdXBkYXRlQmFsbG9vblJhZGl1cyh2YWx1ZSkge1xuICAgIHRoaXMucmVuZGVyZXIudXBkYXRlQmFsbG9vblJhZGl1cyh2YWx1ZSk7XG4gICAgdGhpcy5jdXJyZW50QmFsbG9vblJhZGl1cyA9IHZhbHVlO1xuICB9XG5cbiAgX29uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICB9XG5cbiAgX29uQWNjZWxlcmF0aW9uSW5wdXQoZSkge1xuICAgIGlmICh0aGlzLmZhbGxiYWNrVGltZW91dCkgeyAvLyB3ZSBoYXZlIHZhbHVlcywgcHJldmVudCBmYWxsYmFjayB0byBleGVjdXRlXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mYWxsYmFja1RpbWVvdXQpO1xuICAgICAgdGhpcy5mYWxsYmFja1RpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBbXTtcbiAgICBkYXRhWzBdID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG4gICAgZGF0YVsxXSA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuXG4gICAgaWYgKHRoaXMuY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJykge1xuICAgICAgZGF0YVswXSAqPSAtMTtcbiAgICAgIGRhdGFbMV0gKj0gLTE7XG4gICAgfVxuXG4gICAgbGV0IHZ4O1xuICAgIGxldCB2eTtcblxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XG4gICAgICB2eCA9IC0gZGF0YVswXSAvIDkuODE7XG4gICAgICB2eSA9IChkYXRhWzFdIC0gNSkgLyA5LjgxO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcbiAgICAgIHZ4ID0gLSBkYXRhWzFdIC8gOS44MTtcbiAgICAgIHZ5ID0gLSAoZGF0YVswXSArIDUpIC8gOS44MTtcbiAgICB9XG5cbiAgICBjb25zdCBrID0gNTAwO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QmFsbG9vbkFjY2VsZXJhdGlvbih2eCAqIGssIHZ5ICogayk7XG4gIH1cblxuICBfb25SYWluSGl0KGNvbG9yKSB7XG4gICAgdGhpcy5nbG9iYWxTdGF0ZS5zY29yZVtjb2xvcl0gLT0gMTtcbiAgICB0aGlzLnZpZXcubW9kZWwuc2NvcmVbY29sb3JdIC09IDE7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNjb3JlJyk7XG5cbiAgICB0aGlzLnN5bnRoLnN0b3BTaW5lKCk7XG4gICAgdGhpcy5zeW50aC50cmlnZ2VyR2xpdGNoKCk7XG4gICAgLy8gcmVzcGF3biBiYWxsb24gaW4gb25lIHNlY29uZCAoc2hvdWxkIGJlIGJpZ2dlciB0aGFuIGdyYWluIGR1cmF0aW9uKVxuICAgIHRoaXMuY3JlYXRlQmFsbG9vblRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuX3NwYXduQmFsbG9vbiwgMTAwMCk7XG4gIH1cblxuICBfc3Bhd25CYWxsb29uKCkge1xuICAgIGNvbnN0IGZhZGVJbkR1cmF0aW9uID0gMTtcbiAgICB0aGlzLnJlbmRlcmVyLmNyZWF0ZUJhbGxvb24odGhpcy5jdXJyZW50QmFsbG9vblJhZGl1cywgZmFkZUluRHVyYXRpb24sIHRoaXMuZW11bGF0ZU1vdGlvbik7XG4gICAgdGhpcy5zeW50aC5zdGFydFNpbmUoZmFkZUluRHVyYXRpb24pO1xuICB9XG5cbiAgX3RvZ2dsZVJhaW4odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdzdGFydCcgJiZcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVsLnN0YXRlICE9PSAnaW50cm8nICYmXG4gICAgICAgIHRoaXMuc3Bhd25UaW1lb3V0ID09PSBudWxsXG4gICAgKSB7XG4gICAgICB0aGlzLl9zcGF3blJhaW5Ecm9wKCk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3N0b3AnKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zcGF3blRpbWVvdXQpO1xuICAgICAgdGhpcy5zcGF3blRpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVTcGF3bkludGVydmFsKHZhbHVlKSB7XG4gICAgdGhpcy5zcGF3bkludGVydmFsID0gdmFsdWU7XG4gIH1cblxuICBfc3Bhd25SYWluRHJvcCgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmNyZWF0ZVJhaW5Ecm9wKCk7XG4gICAgLy8gbWluIGRlbGF5IHRvIDUwbXNcbiAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDAuMDUsIE1hdGgucmFuZG9tKCkgKiB0aGlzLnNwYXduSW50ZXJ2YWwgKiAwLjUgKyB0aGlzLnNwYXduSW50ZXJ2YWwgKiAwLjUpO1xuICAgIHRoaXMuc3Bhd25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLl9zcGF3blJhaW5Ecm9wKCksIGRlbGF5ICogMTAwMCk7XG4gIH1cblxuICBfb25IYXJtb255VXBkYXRlKHZhbHVlKSB7XG4gICAgLy8gaWYgYSByZXNwYXduIHdhcyBzY2hlZHVsZWRcbiAgICBjbGVhclRpbWVvdXQodGhpcy5jcmVhdGVCYWxsb29uVGltZW91dCk7XG5cbiAgICB0aGlzLmhhcm1vbnlVcGRhdGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnN5bnRoLnNldE5leHRIYXJtb255KHZhbHVlKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZSgpO1xuICAgICAgdGhpcy5zeW50aC5zdG9wU2luZSgpO1xuICAgICAgLy8gdGhpcy5zeW50aC50cmlnZ2VyR2xpdGNoKCk7XG4gICAgICAvLyByZXNwYXduIGJhbGxvbiBpbiBvbmUgc2Vjb25kIChzaG91bGQgYmUgYmlnZ2VyIHRoYW4gZ3JhaW4gZHVyYXRpb24pXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jcmVhdGVCYWxsb29uVGltZW91dCk7XG4gICAgICB0aGlzLmNyZWF0ZUJhbGxvb25UaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLl9zcGF3bkJhbGxvb24sIDApO1xuICAgIH0sIDMwMDAgKiBNYXRoLnJhbmRvbSgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdm9pZFRoZVJhaW5TdGF0ZTtcbiJdfQ==