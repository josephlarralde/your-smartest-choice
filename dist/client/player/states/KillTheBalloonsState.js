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

var _get3 = require('babel-runtime/helpers/get');

var _get4 = _interopRequireDefault(_get3);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('soundworks/client');

var _Balloon2 = require('../renderers/Balloon');

var _Balloon3 = _interopRequireDefault(_Balloon2);

var _KillTheBalloonsSynth = require('../audio/KillTheBalloonsSynth');

var _KillTheBalloonsSynth2 = _interopRequireDefault(_KillTheBalloonsSynth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top">\n      <div class="score">\n        <p class="blue"><%= score.blue %></p>\n        <p class="pink"><%= score.pink %></p>\n        <p class="yellow"><%= score.yellow %></p>\n        <p class="red"><%= score.red %></p>\n      </div>\n    </div>\n    <div class="section-center">\n      <% if (showInstructions) { %>\n        <p class="align-center soft-blink">Hit the balloons!</p>\n      <% } %>\n      <div class="show-text">\n      <% if (showText !== \'none\') { %>\n        <p class="align-center soft-blink"><%= showText %></p>\n      <% } %>\n      <% if (clickColor !== \'\') { %>\n        <p class="align-center">Click on <%= clickColor %>!</p>\n      <% } %>\n      </div>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var KillTheBalloonsView = function (_CanvasView) {
  (0, _inherits3.default)(KillTheBalloonsView, _CanvasView);

  function KillTheBalloonsView() {
    (0, _classCallCheck3.default)(this, KillTheBalloonsView);
    return (0, _possibleConstructorReturn3.default)(this, (KillTheBalloonsView.__proto__ || (0, _getPrototypeOf2.default)(KillTheBalloonsView)).apply(this, arguments));
  }

  (0, _createClass3.default)(KillTheBalloonsView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get4.default)(KillTheBalloonsView.prototype.__proto__ || (0, _getPrototypeOf2.default)(KillTheBalloonsView.prototype), 'onRender', this).call(this);
      this.$canvas = this.$el.querySelector('canvas');
      this.$score = this.$el.querySelector('.score');
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      var _get2;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_get2 = (0, _get4.default)(KillTheBalloonsView.prototype.__proto__ || (0, _getPrototypeOf2.default)(KillTheBalloonsView.prototype), 'onResize', this)).call.apply(_get2, [this].concat(args));
      this.updateBoundingRect();
    }
  }, {
    key: 'updateBoundingRect',
    value: function updateBoundingRect() {
      this.canvasBoundingClientRect = this.$canvas.getBoundingClientRect();
    }
  }, {
    key: 'hideScore',
    value: function hideScore() {
      this.$score.classList.add('hidden');
    }
  }]);
  return KillTheBalloonsView;
}(_client.CanvasView);

var RisingBalloon = function (_Balloon) {
  (0, _inherits3.default)(RisingBalloon, _Balloon);

  function RisingBalloon() {
    var _ref;

    (0, _classCallCheck3.default)(this, RisingBalloon);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (_ref = RisingBalloon.__proto__ || (0, _getPrototypeOf2.default)(RisingBalloon)).call.apply(_ref, [this].concat(args)));

    _this2.vy = -(Math.random() * 0.4 + 0.6) * 200;
    return _this2;
  }

  (0, _createClass3.default)(RisingBalloon, [{
    key: 'update',
    value: function update(dt) {
      this.vy *= 1.002;
      this.x += Math.random() * 0.2 - 0.1;
      this.y += this.vy * dt;

      (0, _get4.default)(RisingBalloon.prototype.__proto__ || (0, _getPrototypeOf2.default)(RisingBalloon.prototype), 'update', this).call(this, dt);
    }
  }]);
  return RisingBalloon;
}(_Balloon3.default);

var KillTheBalloonsRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(KillTheBalloonsRenderer, _Canvas2dRenderer);

  function KillTheBalloonsRenderer(spriteConfig, onExploded) {
    (0, _classCallCheck3.default)(this, KillTheBalloonsRenderer);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (KillTheBalloonsRenderer.__proto__ || (0, _getPrototypeOf2.default)(KillTheBalloonsRenderer)).call(this));

    _this3.spriteConfig = spriteConfig;
    _this3.onExploded = onExploded;
    _this3.isEnded = false;
    _this3.sizeDiversity = 0;

    _this3.numZIndex = 3;
    _this3.balloons = new Array(3);
    // prepare stack for each z-indexes
    for (var i = 0; i < _this3.numZIndex; i++) {
      _this3.balloons[i] = [];
    }return _this3;
  }

  (0, _createClass3.default)(KillTheBalloonsRenderer, [{
    key: 'spawnBalloon',
    value: function spawnBalloon() {
      var config = this.spriteConfig;
      var colorIndex = Math.floor(Math.random() * config.colors.length);
      var color = config.colors[colorIndex];

      var image = config.groups[color].halfSizeImage;
      var clipPositions = config.groups[color].clipPositions;
      var clipWidth = Math.floor(config.clipSize.width / 2);
      var clipHeight = Math.floor(config.clipSize.height / 2);
      var refreshRate = config.animationRate;

      var sizeRatio = config.smallSizeRatio + (Math.random() * 2 - 1) * 0.15 * this.sizeDiversity;
      var size = Math.min(this.canvasWidth, this.canvasHeight) * sizeRatio;
      var x = Math.random() * this.canvasWidth;
      var y = this.canvasHeight + size;

      var balloon = new RisingBalloon(color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

      var zIndex = Math.floor(Math.random() * this.numZIndex);
      this.balloons[zIndex].push(balloon);
    }
  }, {
    key: 'explodeAll',
    value: function explodeAll() {
      for (var z = 0; z < this.balloons.length; z++) {
        var layer = this.balloons[z];

        for (var i = 0, l = layer.length; i < l; i++) {
          var balloon = layer[i];
          balloon.explode = true;
        }
      }

      this.isEnded = true;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      var isEmpty = true;

      for (var z = 0; z < this.numZIndex; z++) {
        var layer = this.balloons[z];

        for (var i = layer.length - 1; i >= 0; i--) {
          var balloon = layer[i];
          balloon.update(dt);

          // if outside the screen
          if (balloon.y < -(balloon.radius + 10)) balloon.isDead = true;

          if (balloon.isDead) layer.splice(i, 1);
        }

        if (layer.length !== 0) isEmpty = false;
      }

      if (this.isEnded && isEmpty) this.onExploded();
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      for (var z = 0; z < this.numZIndex; z++) {
        var layer = this.balloons[z];

        for (var i = 0, l = layer.length; i < l; i++) {
          layer[i].render(ctx);
        }
      }
    }
  }]);
  return KillTheBalloonsRenderer;
}(_client.Canvas2dRenderer);

var KillTheBalloonsState = function () {
  function KillTheBalloonsState(experience, globalState) {
    (0, _classCallCheck3.default)(this, KillTheBalloonsState);

    this.experience = experience;
    this.globalState = globalState;

    this._spawnTimeout = null;
    this._maxSpawnInterval = null;

    this._spawnBalloon = this._spawnBalloon.bind(this);
    this._updateMaxSpawn = this._updateMaxSpawn.bind(this);
    this._updateBalloonSizeDiversity = this._updateBalloonSizeDiversity.bind(this);
    this._onExploded = this._onExploded.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onSamplesSet = this._onSamplesSet.bind(this);
    this._onShowText = this._onShowText.bind(this);
    this._onClickColorText = this._onClickColorText.bind(this);

    this.renderer = new KillTheBalloonsRenderer(this.experience.spriteConfig, this._onExploded);

    this.synth = new _KillTheBalloonsSynth2.default(this.experience.killTheBalloonsConfig.sets, this.experience.audioBufferManager.get('kill-the-balloons'), this.experience.getAudioDestination());
  }

  (0, _createClass3.default)(KillTheBalloonsState, [{
    key: 'enter',
    value: function enter() {
      var _this4 = this;

      this.view = new KillTheBalloonsView(template, {
        showInstructions: true,
        score: (0, _assign2.default)({}, this.globalState.score),
        showText: 'none',
        clickColor: ''
      }, {
        touchstart: this._onTouchStart // bug when comming from avoid the rain
      }, {
        className: ['kill-the-balloons-state', 'foreground']
      });

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);
      });

      this.view.addRenderer(this.renderer);

      // init spawn
      this._spawnBalloon();

      // this hides "Hit the balloons !" text
      setTimeout(function () {
        _this4.view.model.showInstructions = false;
        _this4.view.render('.section-center');
      }, 3000);

      var sharedParams = this.experience.sharedParams;
      sharedParams.addParamListener('killTheBalloons:samplesSet', this._onSamplesSet);
      sharedParams.addParamListener('killTheBalloons:spawnInterval', this._updateMaxSpawn);
      sharedParams.addParamListener('killTheBalloons:sizeDiversity', this._updateBalloonSizeDiversity);
      sharedParams.addParamListener('killTheBalloons:showText', this._onShowText);
      sharedParams.addParamListener('killTheBalloons:clickColorText', this._onClickColorText);
    }
  }, {
    key: 'exit',
    value: function exit() {
      clearTimeout(this._spawnTimeout);

      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');
      this.view.hideScore();

      this.renderer.explodeAll();

      var sharedParams = this.experience.sharedParams;
      sharedParams.removeParamListener('killTheBalloons:samplesSet', this._onSamplesSet);
      sharedParams.removeParamListener('killTheBalloons:spawnInterval', this._updateMaxSpawn);
      sharedParams.removeParamListener('killTheBalloons:sizeDiversity', this._updateBalloonSizeDiversity);
      sharedParams.removeParamListener('killTheBalloons:showText', this._onShowText);
      sharedParams.removeParamListener('killTheBalloons:clickColorText', this._onClickColorText);
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
    key: '_onClickColorText',
    value: function _onClickColorText(value) {
      switch (value) {
        case 'none':
          this.view.model.clickColor = '';
          break;
        case 'random':
          var colors = ['blue', 'pink', 'yellow', 'red'];
          var color = colors[Math.floor(Math.random() * colors.length)];
          this.view.model.clickColor = color;
          break;
        default:
          this.view.model.clickColor = value;
          break;
      }

      this.view.render('.show-text');
    }
  }, {
    key: '_updateBalloonSizeDiversity',
    value: function _updateBalloonSizeDiversity(value) {
      this.renderer.sizeDiversity = value;
    }
  }, {
    key: '_updateMaxSpawn',
    value: function _updateMaxSpawn(value) {
      this._maxSpawnInterval = value;

      clearTimeout(this._spawnTimeout);
      this._spawnTimeout = setTimeout(this._spawnBalloon, this._getSpawnDelay());
    }
  }, {
    key: '_spawnBalloon',
    value: function _spawnBalloon() {
      this.renderer.spawnBalloon();

      clearTimeout(this._spawnTimeout);
      this._spawnTimeout = setTimeout(this._spawnBalloon, this._getSpawnDelay());
    }
  }, {
    key: '_getSpawnDelay',
    value: function _getSpawnDelay() {
      var halfMaxSpawn = this._maxSpawnInterval / 2;
      // min delay to 50ms
      var delay = Math.max(0.05, halfMaxSpawn + halfMaxSpawn * Math.random()); // seconds
      return delay * 1000;
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(e) {
      var touch = e.touches[0];
      var x = touch.clientX;
      var y = touch.clientY;

      this._testHit(this.renderer.balloons, x, y);
    }
  }, {
    key: '_testHit',
    value: function _testHit(balloons, x, y) {
      // start from top to bottom z-indexes
      for (var z = balloons.length - 1; z >= 0; z--) {
        var layer = balloons[z];

        for (var i = 0, l = layer.length; i < l; i++) {
          var balloon = layer[i];
          var dx = balloon.x - x;
          var dy = balloon.y - y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < balloon.radius) {
            balloon.explode = true;
            this._updateScore(balloon.color);
            this._triggerSample(balloon.color, balloon.x, balloon.y);
            return;
          }
        }
      }
    }
  }, {
    key: '_updateScore',
    value: function _updateScore(color) {
      if (this.view.model.showInstructions === true) {
        this.view.model.showInstructions = false;
        this.view.render('.section-center');
      }

      // update model
      this.globalState.score[color] += 1;
      // update view model
      this.view.model.score[color] += 1;
      this.view.render('.score');
    }
  }, {
    key: '_triggerSample',
    value: function _triggerSample(color, x, y) {
      this.synth.trigger(color);
    }
  }, {
    key: '_onSamplesSet',
    value: function _onSamplesSet(value) {
      this.synth.setSamplesSetIndex(value);
    }
  }]);
  return KillTheBalloonsState;
}();

exports.default = KillTheBalloonsState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktpbGxUaGVCYWxsb29uc1N0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwiS2lsbFRoZUJhbGxvb25zVmlldyIsIiRjYW52YXMiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiJHNjb3JlIiwiYXJncyIsInVwZGF0ZUJvdW5kaW5nUmVjdCIsImNhbnZhc0JvdW5kaW5nQ2xpZW50UmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsYXNzTGlzdCIsImFkZCIsIkNhbnZhc1ZpZXciLCJSaXNpbmdCYWxsb29uIiwidnkiLCJNYXRoIiwicmFuZG9tIiwiZHQiLCJ4IiwieSIsIkJhbGxvb24iLCJLaWxsVGhlQmFsbG9vbnNSZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsIm9uRXhwbG9kZWQiLCJpc0VuZGVkIiwic2l6ZURpdmVyc2l0eSIsIm51bVpJbmRleCIsImJhbGxvb25zIiwiQXJyYXkiLCJpIiwiY29uZmlnIiwiY29sb3JJbmRleCIsImZsb29yIiwiY29sb3JzIiwibGVuZ3RoIiwiY29sb3IiLCJpbWFnZSIsImdyb3VwcyIsImhhbGZTaXplSW1hZ2UiLCJjbGlwUG9zaXRpb25zIiwiY2xpcFdpZHRoIiwiY2xpcFNpemUiLCJ3aWR0aCIsImNsaXBIZWlnaHQiLCJoZWlnaHQiLCJyZWZyZXNoUmF0ZSIsImFuaW1hdGlvblJhdGUiLCJzaXplUmF0aW8iLCJzbWFsbFNpemVSYXRpbyIsInNpemUiLCJtaW4iLCJjYW52YXNXaWR0aCIsImNhbnZhc0hlaWdodCIsImJhbGxvb24iLCJ6SW5kZXgiLCJwdXNoIiwieiIsImxheWVyIiwibCIsImV4cGxvZGUiLCJpc0VtcHR5IiwidXBkYXRlIiwicmFkaXVzIiwiaXNEZWFkIiwic3BsaWNlIiwiY3R4IiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIktpbGxUaGVCYWxsb29uc1N0YXRlIiwiZXhwZXJpZW5jZSIsImdsb2JhbFN0YXRlIiwiX3NwYXduVGltZW91dCIsIl9tYXhTcGF3bkludGVydmFsIiwiX3NwYXduQmFsbG9vbiIsImJpbmQiLCJfdXBkYXRlTWF4U3Bhd24iLCJfdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkiLCJfb25FeHBsb2RlZCIsIl9vblRvdWNoU3RhcnQiLCJfb25TYW1wbGVzU2V0IiwiX29uU2hvd1RleHQiLCJfb25DbGlja0NvbG9yVGV4dCIsInJlbmRlcmVyIiwic3ludGgiLCJLaWxsVGhlQmFsbG9vbnNTeW50aCIsImtpbGxUaGVCYWxsb29uc0NvbmZpZyIsInNldHMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJnZXQiLCJnZXRBdWRpb0Rlc3RpbmF0aW9uIiwidmlldyIsInNob3dJbnN0cnVjdGlvbnMiLCJzY29yZSIsInNob3dUZXh0IiwiY2xpY2tDb2xvciIsInRvdWNoc3RhcnQiLCJjbGFzc05hbWUiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsImFkZFJlbmRlcmVyIiwic2V0VGltZW91dCIsIm1vZGVsIiwic2hhcmVkUGFyYW1zIiwiYWRkUGFyYW1MaXN0ZW5lciIsImNsZWFyVGltZW91dCIsInJlbW92ZSIsImhpZGVTY29yZSIsImV4cGxvZGVBbGwiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwicmVtb3ZlUmVuZGVyZXIiLCJ2YWx1ZSIsIl9nZXRTcGF3bkRlbGF5Iiwic3Bhd25CYWxsb29uIiwiaGFsZk1heFNwYXduIiwiZGVsYXkiLCJtYXgiLCJlIiwidG91Y2giLCJ0b3VjaGVzIiwiY2xpZW50WCIsImNsaWVudFkiLCJfdGVzdEhpdCIsImR4IiwiZHkiLCJkaXN0YW5jZSIsInNxcnQiLCJfdXBkYXRlU2NvcmUiLCJfdHJpZ2dlclNhbXBsZSIsInRyaWdnZXIiLCJzZXRTYW1wbGVzU2V0SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxxMkJBQU47O0lBNEJNQyxtQjs7Ozs7Ozs7OzsrQkFD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aEIsS0FBcUMsSUFBekMsRUFBK0M7QUFDN0MsYUFBS0QsSUFBTCxDQUFVYyxLQUFWLENBQWdCYixnQkFBaEIsR0FBbUMsS0FBbkM7QUFDQSxhQUFLRCxJQUFMLENBQVV4QixNQUFWLENBQWlCLGlCQUFqQjtBQUNEOztBQUVEO0FBQ0EsV0FBS0ksV0FBTCxDQUFpQnNCLEtBQWpCLENBQXVCekQsS0FBdkIsS0FBaUMsQ0FBakM7QUFDQTtBQUNBLFdBQUt1RCxJQUFMLENBQVVjLEtBQVYsQ0FBZ0JaLEtBQWhCLENBQXNCekQsS0FBdEIsS0FBZ0MsQ0FBaEM7QUFDQSxXQUFLdUQsSUFBTCxDQUFVeEIsTUFBVixDQUFpQixRQUFqQjtBQUNEOzs7bUNBRWMvQixLLEVBQU9qQixDLEVBQUdDLEMsRUFBRztBQUMxQixXQUFLZ0UsS0FBTCxDQUFXZ0QsT0FBWCxDQUFtQmhHLEtBQW5CO0FBQ0Q7OztrQ0FFYThFLEssRUFBTztBQUNuQixXQUFLOUIsS0FBTCxDQUFXaUQsa0JBQVgsQ0FBOEJuQixLQUE5QjtBQUNEOzs7OztrQkFHWTdDLG9CIiwiZmlsZSI6IktpbGxUaGVCYWxsb29uc1N0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzVmlldywgQ2FudmFzMmRSZW5kZXJlciB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBCYWxsb29uIGZyb20gJy4uL3JlbmRlcmVycy9CYWxsb29uJztcbmltcG9ydCBLaWxsVGhlQmFsbG9vbnNTeW50aCBmcm9tICcuLi9hdWRpby9LaWxsVGhlQmFsbG9vbnNTeW50aCc7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPlxuICAgICAgPGRpdiBjbGFzcz1cInNjb3JlXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiYmx1ZVwiPjwlPSBzY29yZS5ibHVlICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInBpbmtcIj48JT0gc2NvcmUucGluayAlPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJ5ZWxsb3dcIj48JT0gc2NvcmUueWVsbG93ICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInJlZFwiPjwlPSBzY29yZS5yZWQgJT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXJcIj5cbiAgICAgIDwlIGlmIChzaG93SW5zdHJ1Y3Rpb25zKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tY2VudGVyIHNvZnQtYmxpbmtcIj5IaXQgdGhlIGJhbGxvb25zITwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzaG93LXRleHRcIj5cbiAgICAgIDwlIGlmIChzaG93VGV4dCAhPT0gJ25vbmUnKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tY2VudGVyIHNvZnQtYmxpbmtcIj48JT0gc2hvd1RleHQgJT48L3A+XG4gICAgICA8JSB9ICU+XG4gICAgICA8JSBpZiAoY2xpY2tDb2xvciAhPT0gJycpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJhbGlnbi1jZW50ZXJcIj5DbGljayBvbiA8JT0gY2xpY2tDb2xvciAlPiE8L3A+XG4gICAgICA8JSB9ICU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jbGFzcyBLaWxsVGhlQmFsbG9vbnNWaWV3IGV4dGVuZHMgQ2FudmFzVmlldyB7XG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG4gICAgdGhpcy4kY2FudmFzID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG4gICAgdGhpcy4kc2NvcmUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2NvcmUnKTtcbiAgfVxuXG4gIG9uUmVzaXplKC4uLmFyZ3MpIHtcbiAgICBzdXBlci5vblJlc2l6ZSguLi5hcmdzKTtcbiAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCgpO1xuICB9XG5cbiAgdXBkYXRlQm91bmRpbmdSZWN0KCkge1xuICAgIHRoaXMuY2FudmFzQm91bmRpbmdDbGllbnRSZWN0ID0gdGhpcy4kY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9O1xuXG4gIGhpZGVTY29yZSgpIHtcbiAgICB0aGlzLiRzY29yZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgfVxufVxuXG5jbGFzcyBSaXNpbmdCYWxsb29uIGV4dGVuZHMgQmFsbG9vbiB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgICB0aGlzLnZ5ID0gLSAoTWF0aC5yYW5kb20oKSAqIDAuNCArIDAuNikgKiAyMDA7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICB0aGlzLnZ5ICo9IDEuMDAyO1xuICAgIHRoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMC4yIC0gMC4xO1xuICAgIHRoaXMueSArPSAodGhpcy52eSAqIGR0KTtcblxuICAgIHN1cGVyLnVwZGF0ZShkdCk7XG4gIH1cbn1cblxuY2xhc3MgS2lsbFRoZUJhbGxvb25zUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3ByaXRlQ29uZmlnLCBvbkV4cGxvZGVkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMub25FeHBsb2RlZCA9IG9uRXhwbG9kZWQ7XG4gICAgdGhpcy5pc0VuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5zaXplRGl2ZXJzaXR5ID0gMDtcblxuICAgIHRoaXMubnVtWkluZGV4ID0gMztcbiAgICB0aGlzLmJhbGxvb25zID0gbmV3IEFycmF5KDMpO1xuICAgIC8vIHByZXBhcmUgc3RhY2sgZm9yIGVhY2ggei1pbmRleGVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bVpJbmRleDsgaSsrKVxuICAgICAgdGhpcy5iYWxsb29uc1tpXSA9IFtdO1xuICB9XG5cbiAgc3Bhd25CYWxsb29uKCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuc3ByaXRlQ29uZmlnO1xuICAgIGNvbnN0IGNvbG9ySW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb25maWcuY29sb3JzLmxlbmd0aCk7XG4gICAgY29uc3QgY29sb3IgPSBjb25maWcuY29sb3JzW2NvbG9ySW5kZXhdO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5oYWxmU2l6ZUltYWdlO1xuICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9IE1hdGguZmxvb3IoY29uZmlnLmNsaXBTaXplLndpZHRoIC8gMik7XG4gICAgY29uc3QgY2xpcEhlaWdodCA9IE1hdGguZmxvb3IoY29uZmlnLmNsaXBTaXplLmhlaWdodCAvIDIpO1xuICAgIGNvbnN0IHJlZnJlc2hSYXRlID0gY29uZmlnLmFuaW1hdGlvblJhdGU7XG5cbiAgICBjb25zdCBzaXplUmF0aW8gPSBjb25maWcuc21hbGxTaXplUmF0aW8gKyAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDAuMTUgKiB0aGlzLnNpemVEaXZlcnNpdHk7XG4gICAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KSAqIHNpemVSYXRpbztcbiAgICBjb25zdCB4ID0gTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgeSA9IHRoaXMuY2FudmFzSGVpZ2h0ICsgc2l6ZTtcblxuICAgIGNvbnN0IGJhbGxvb24gPSBuZXcgUmlzaW5nQmFsbG9vbihjb2xvciwgaW1hZ2UsIGNsaXBQb3NpdGlvbnMsIGNsaXBXaWR0aCwgY2xpcEhlaWdodCwgcmVmcmVzaFJhdGUsIHNpemUsIHNpemUsIHgsIHkpO1xuXG4gICAgY29uc3QgekluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5udW1aSW5kZXgpO1xuICAgIHRoaXMuYmFsbG9vbnNbekluZGV4XS5wdXNoKGJhbGxvb24pO1xuICB9XG5cbiAgZXhwbG9kZUFsbCgpIHtcbiAgICBmb3IgKGxldCB6ID0gMDsgeiA8IHRoaXMuYmFsbG9vbnMubGVuZ3RoOyB6KyspIHtcbiAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5iYWxsb29uc1t6XTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsYXllci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgYmFsbG9vbiA9IGxheWVyW2ldO1xuICAgICAgICBiYWxsb29uLmV4cGxvZGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNFbmRlZCA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBsZXQgaXNFbXB0eSA9IHRydWU7XG5cbiAgICBmb3IgKGxldCB6ID0gMDsgeiA8IHRoaXMubnVtWkluZGV4OyB6KyspIHtcbiAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5iYWxsb29uc1t6XTtcblxuICAgICAgZm9yIChsZXQgaSA9IGxheWVyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGJhbGxvb24gPSBsYXllcltpXTtcbiAgICAgICAgYmFsbG9vbi51cGRhdGUoZHQpO1xuXG4gICAgICAgIC8vIGlmIG91dHNpZGUgdGhlIHNjcmVlblxuICAgICAgICBpZiAoYmFsbG9vbi55IDwgLSAoYmFsbG9vbi5yYWRpdXMgKyAxMCkpXG4gICAgICAgICAgYmFsbG9vbi5pc0RlYWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChiYWxsb29uLmlzRGVhZClcbiAgICAgICAgICBsYXllci5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYXllci5sZW5ndGggIT09IDApXG4gICAgICAgIGlzRW1wdHkgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0VuZGVkICYmIGlzRW1wdHkpXG4gICAgICB0aGlzLm9uRXhwbG9kZWQoKTtcbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBmb3IgKGxldCB6ID0gMDsgeiA8IHRoaXMubnVtWkluZGV4OyB6KyspIHtcbiAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5iYWxsb29uc1t6XTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsYXllci5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICAgIGxheWVyW2ldLnJlbmRlcihjdHgpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBLaWxsVGhlQmFsbG9vbnNTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG5cbiAgICB0aGlzLl9zcGF3blRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuX21heFNwYXduSW50ZXJ2YWwgPSBudWxsO1xuXG4gICAgdGhpcy5fc3Bhd25CYWxsb29uID0gdGhpcy5fc3Bhd25CYWxsb29uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdXBkYXRlTWF4U3Bhd24gPSB0aGlzLl91cGRhdGVNYXhTcGF3bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VwZGF0ZUJhbGxvb25TaXplRGl2ZXJzaXR5ID0gdGhpcy5fdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkV4cGxvZGVkID0gdGhpcy5fb25FeHBsb2RlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVG91Y2hTdGFydCA9IHRoaXMuX29uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2FtcGxlc1NldCA9IHRoaXMuX29uU2FtcGxlc1NldC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uU2hvd1RleHQgPSB0aGlzLl9vblNob3dUZXh0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGlja0NvbG9yVGV4dCA9IHRoaXMuX29uQ2xpY2tDb2xvclRleHQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgS2lsbFRoZUJhbGxvb25zUmVuZGVyZXIodGhpcy5leHBlcmllbmNlLnNwcml0ZUNvbmZpZywgdGhpcy5fb25FeHBsb2RlZCk7XG5cbiAgICB0aGlzLnN5bnRoID0gbmV3IEtpbGxUaGVCYWxsb29uc1N5bnRoKFxuICAgICAgdGhpcy5leHBlcmllbmNlLmtpbGxUaGVCYWxsb29uc0NvbmZpZy5zZXRzLFxuICAgICAgdGhpcy5leHBlcmllbmNlLmF1ZGlvQnVmZmVyTWFuYWdlci5nZXQoJ2tpbGwtdGhlLWJhbGxvb25zJyksXG4gICAgICB0aGlzLmV4cGVyaWVuY2UuZ2V0QXVkaW9EZXN0aW5hdGlvbigpXG4gICAgKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHRoaXMudmlldyA9IG5ldyBLaWxsVGhlQmFsbG9vbnNWaWV3KHRlbXBsYXRlLCB7XG4gICAgICBzaG93SW5zdHJ1Y3Rpb25zOiB0cnVlLFxuICAgICAgc2NvcmU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2xvYmFsU3RhdGUuc2NvcmUpLFxuICAgICAgc2hvd1RleHQ6ICdub25lJyxcbiAgICAgIGNsaWNrQ29sb3I6ICcnLFxuICAgIH0sIHtcbiAgICAgIHRvdWNoc3RhcnQ6IHRoaXMuX29uVG91Y2hTdGFydCwgLy8gYnVnIHdoZW4gY29tbWluZyBmcm9tIGF2b2lkIHRoZSByYWluXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lOiBbJ2tpbGwtdGhlLWJhbGxvb25zLXN0YXRlJywgJ2ZvcmVncm91bmQnXSxcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgIHRoaXMudmlldy5hcHBlbmRUbyh0aGlzLmV4cGVyaWVuY2Uudmlldy5nZXRTdGF0ZUNvbnRhaW5lcigpKTtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG5cbiAgICAvLyBpbml0IHNwYXduXG4gICAgdGhpcy5fc3Bhd25CYWxsb29uKCk7XG5cbiAgICAvLyB0aGlzIGhpZGVzIFwiSGl0IHRoZSBiYWxsb29ucyAhXCIgdGV4dFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy52aWV3Lm1vZGVsLnNob3dJbnN0cnVjdGlvbnMgPSBmYWxzZTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWNlbnRlcicpO1xuICAgIH0sIDMwMDApO1xuXG5cbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2FtcGxlc1NldCcsIHRoaXMuX29uU2FtcGxlc1NldCk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzcGF3bkludGVydmFsJywgdGhpcy5fdXBkYXRlTWF4U3Bhd24pO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2l6ZURpdmVyc2l0eScsIHRoaXMuX3VwZGF0ZUJhbGxvb25TaXplRGl2ZXJzaXR5KTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOnNob3dUZXh0JywgdGhpcy5fb25TaG93VGV4dCk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpjbGlja0NvbG9yVGV4dCcsIHRoaXMuX29uQ2xpY2tDb2xvclRleHQpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fc3Bhd25UaW1lb3V0KTtcblxuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9yZWdyb3VuZCcpO1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuICAgIHRoaXMudmlldy5oaWRlU2NvcmUoKTtcblxuICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZUFsbCgpO1xuXG4gICAgY29uc3Qgc2hhcmVkUGFyYW1zID0gdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcztcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOnNhbXBsZXNTZXQnLCB0aGlzLl9vblNhbXBsZXNTZXQpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c3Bhd25JbnRlcnZhbCcsIHRoaXMuX3VwZGF0ZU1heFNwYXduKTtcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOnNpemVEaXZlcnNpdHknLCB0aGlzLl91cGRhdGVCYWxsb29uU2l6ZURpdmVyc2l0eSk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzaG93VGV4dCcsIHRoaXMuX29uU2hvd1RleHQpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6Y2xpY2tDb2xvclRleHQnLCB0aGlzLl9vbkNsaWNrQ29sb3JUZXh0KTtcbiAgfVxuXG4gIF9vbkV4cGxvZGVkKCkge1xuICAgIHRoaXMudmlldy5yZW1vdmVSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG4gIH1cblxuICBfb25TaG93VGV4dCh2YWx1ZSkge1xuICAgIHRoaXMudmlldy5tb2RlbC5zaG93VGV4dCA9IHZhbHVlO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zaG93LXRleHQnKTtcbiAgfVxuXG4gIF9vbkNsaWNrQ29sb3JUZXh0KHZhbHVlKSB7XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgIHRoaXMudmlldy5tb2RlbC5jbGlja0NvbG9yID0gJyc7XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdyYW5kb20nOlxuICAgICAgICBjb25zdCBjb2xvcnMgPSBbJ2JsdWUnLCAncGluaycsICd5ZWxsb3cnLCAncmVkJ107XG4gICAgICAgIGNvbnN0IGNvbG9yID0gY29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbG9ycy5sZW5ndGgpXTtcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVsLmNsaWNrQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnZpZXcubW9kZWwuY2xpY2tDb2xvciA9IHZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2hvdy10ZXh0Jyk7XG4gIH1cblxuICBfdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkodmFsdWUpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNpemVEaXZlcnNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIF91cGRhdGVNYXhTcGF3bih2YWx1ZSkge1xuICAgIHRoaXMuX21heFNwYXduSW50ZXJ2YWwgPSB2YWx1ZTtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLl9zcGF3blRpbWVvdXQpO1xuICAgIHRoaXMuX3NwYXduVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5fc3Bhd25CYWxsb29uLCB0aGlzLl9nZXRTcGF3bkRlbGF5KCkpO1xuICB9XG5cbiAgX3NwYXduQmFsbG9vbigpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNwYXduQmFsbG9vbigpO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3NwYXduVGltZW91dCk7XG4gICAgdGhpcy5fc3Bhd25UaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLl9zcGF3bkJhbGxvb24sIHRoaXMuX2dldFNwYXduRGVsYXkoKSk7XG4gIH1cblxuICBfZ2V0U3Bhd25EZWxheSgpIHtcbiAgICBjb25zdCBoYWxmTWF4U3Bhd24gPSB0aGlzLl9tYXhTcGF3bkludGVydmFsIC8gMjtcbiAgICAvLyBtaW4gZGVsYXkgdG8gNTBtc1xuICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5tYXgoMC4wNSwgaGFsZk1heFNwYXduICsgaGFsZk1heFNwYXduICogTWF0aC5yYW5kb20oKSk7IC8vIHNlY29uZHNcbiAgICByZXR1cm4gZGVsYXkgKiAxMDAwO1xuICB9XG5cbiAgX29uVG91Y2hTdGFydChlKSB7XG4gICAgY29uc3QgdG91Y2ggPSBlLnRvdWNoZXNbMF07XG4gICAgY29uc3QgeCA9IHRvdWNoLmNsaWVudFg7XG4gICAgY29uc3QgeSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICB0aGlzLl90ZXN0SGl0KHRoaXMucmVuZGVyZXIuYmFsbG9vbnMsIHgsIHkpO1xuICB9XG5cbiAgX3Rlc3RIaXQoYmFsbG9vbnMsIHgsIHkpIHtcbiAgICAvLyBzdGFydCBmcm9tIHRvcCB0byBib3R0b20gei1pbmRleGVzXG4gICAgZm9yIChsZXQgeiA9IGJhbGxvb25zLmxlbmd0aCAtIDE7IHogPj0gMDsgei0tKSB7XG4gICAgICBjb25zdCBsYXllciA9IGJhbGxvb25zW3pdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxheWVyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCBiYWxsb29uID0gbGF5ZXJbaV07XG4gICAgICAgIGNvbnN0IGR4ID0gYmFsbG9vbi54IC0geDtcbiAgICAgICAgY29uc3QgZHkgPSBiYWxsb29uLnkgLSB5O1xuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgYmFsbG9vbi5yYWRpdXMpIHtcbiAgICAgICAgICBiYWxsb29uLmV4cGxvZGUgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZVNjb3JlKGJhbGxvb24uY29sb3IpO1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJTYW1wbGUoYmFsbG9vbi5jb2xvciwgYmFsbG9vbi54LCBiYWxsb29uLnkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF91cGRhdGVTY29yZShjb2xvcikge1xuICAgIGlmICh0aGlzLnZpZXcubW9kZWwuc2hvd0luc3RydWN0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy52aWV3Lm1vZGVsLnNob3dJbnN0cnVjdGlvbnMgPSBmYWxzZTtcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWNlbnRlcicpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBtb2RlbFxuICAgIHRoaXMuZ2xvYmFsU3RhdGUuc2NvcmVbY29sb3JdICs9IDE7XG4gICAgLy8gdXBkYXRlIHZpZXcgbW9kZWxcbiAgICB0aGlzLnZpZXcubW9kZWwuc2NvcmVbY29sb3JdICs9IDE7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNjb3JlJyk7XG4gIH1cblxuICBfdHJpZ2dlclNhbXBsZShjb2xvciwgeCwgeSkge1xuICAgIHRoaXMuc3ludGgudHJpZ2dlcihjb2xvcik7XG4gIH1cblxuICBfb25TYW1wbGVzU2V0KHZhbHVlKSB7XG4gICAgdGhpcy5zeW50aC5zZXRTYW1wbGVzU2V0SW5kZXgodmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtpbGxUaGVCYWxsb29uc1N0YXRlO1xuIl19