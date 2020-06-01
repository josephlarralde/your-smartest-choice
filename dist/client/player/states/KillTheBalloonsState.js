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
      this.view = new KillTheBalloonsView(template, {
        // showInstructions: true,
        showInstructions: false,
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

      // this hides "Hit the balloons !" text :

      // setTimeout(() => {
      //   this.view.model.showInstructions = false;
      //   this.view.render('.section-center');
      // }, 3000);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktpbGxUaGVCYWxsb29uc1N0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwiS2lsbFRoZUJhbGxvb25zVmlldyIsIiRjYW52YXMiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiJHNjb3JlIiwiYXJncyIsInVwZGF0ZUJvdW5kaW5nUmVjdCIsImNhbnZhc0JvdW5kaW5nQ2xpZW50UmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsYXNzTGlzdCIsImFkZCIsIkNhbnZhc1ZpZXciLCJSaXNpbmdCYWxsb29uIiwidnkiLCJNYXRoIiwicmFuZG9tIiwiZHQiLCJ4IiwieSIsIkJhbGxvb24iLCJLaWxsVGhlQmFsbG9vbnNSZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsIm9uRXhwbG9kZWQiLCJpc0VuZGVkIiwic2l6ZURpdmVyc2l0eSIsIm51bVpJbmRleCIsImJhbGxvb25zIiwiQXJyYXkiLCJpIiwiY29uZmlnIiwiY29sb3JJbmRleCIsImZsb29yIiwiY29sb3JzIiwibGVuZ3RoIiwiY29sb3IiLCJpbWFnZSIsImdyb3VwcyIsImhhbGZTaXplSW1hZ2UiLCJjbGlwUG9zaXRpb25zIiwiY2xpcFdpZHRoIiwiY2xpcFNpemUiLCJ3aWR0aCIsImNsaXBIZWlnaHQiLCJoZWlnaHQiLCJyZWZyZXNoUmF0ZSIsImFuaW1hdGlvblJhdGUiLCJzaXplUmF0aW8iLCJzbWFsbFNpemVSYXRpbyIsInNpemUiLCJtaW4iLCJjYW52YXNXaWR0aCIsImNhbnZhc0hlaWdodCIsImJhbGxvb24iLCJ6SW5kZXgiLCJwdXNoIiwieiIsImxheWVyIiwibCIsImV4cGxvZGUiLCJpc0VtcHR5IiwidXBkYXRlIiwicmFkaXVzIiwiaXNEZWFkIiwic3BsaWNlIiwiY3R4IiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIktpbGxUaGVCYWxsb29uc1N0YXRlIiwiZXhwZXJpZW5jZSIsImdsb2JhbFN0YXRlIiwiX3NwYXduVGltZW91dCIsIl9tYXhTcGF3bkludGVydmFsIiwiX3NwYXduQmFsbG9vbiIsImJpbmQiLCJfdXBkYXRlTWF4U3Bhd24iLCJfdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkiLCJfb25FeHBsb2RlZCIsIl9vblRvdWNoU3RhcnQiLCJfb25TYW1wbGVzU2V0IiwiX29uU2hvd1RleHQiLCJfb25DbGlja0NvbG9yVGV4dCIsInJlbmRlcmVyIiwic3ludGgiLCJLaWxsVGhlQmFsbG9vbnNTeW50aCIsImtpbGxUaGVCYWxsb29uc0NvbmZpZyIsInNldHMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJnZXQiLCJnZXRBdWRpb0Rlc3RpbmF0aW9uIiwidmlldyIsInNob3dJbnN0cnVjdGlvbnMiLCJzY29yZSIsInNob3dUZXh0IiwiY2xpY2tDb2xvciIsInRvdWNoc3RhcnQiLCJjbGFzc05hbWUiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsImFkZFJlbmRlcmVyIiwic2hhcmVkUGFyYW1zIiwiYWRkUGFyYW1MaXN0ZW5lciIsImNsZWFyVGltZW91dCIsInJlbW92ZSIsImhpZGVTY29yZSIsImV4cGxvZGVBbGwiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwicmVtb3ZlUmVuZGVyZXIiLCJ2YWx1ZSIsIm1vZGVsIiwic2V0VGltZW91dCIsIl9nZXRTcGF3bkRlbGF5Iiwic3Bhd25CYWxsb29uIiwiaGFsZk1heFNwYXduIiwiZGVsYXkiLCJtYXgiLCJlIiwidG91Y2giLCJ0b3VjaGVzIiwiY2xpZW50WCIsImNsaWVudFkiLCJfdGVzdEhpdCIsImR4IiwiZHkiLCJkaXN0YW5jZSIsInNxcnQiLCJfdXBkYXRlU2NvcmUiLCJfdHJpZ2dlclNhbXBsZSIsInRyaWdnZXIiLCJzZXRTYW1wbGVzU2V0SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxxMkJBQU47O0lBNEJNQyxtQjs7Ozs7Ozs7OzsrQkFDTztBQUNUO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLEtBQUtDLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFmO0FBQ0EsV0FBS0MsTUFBTCxHQUFjLEtBQUtGLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFkO0FBQ0Q7OzsrQkFFaUI7QUFBQTs7QUFBQSx3Q0FBTkUsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ2hCLDhMQUFrQkEsSUFBbEI7QUFDQSxXQUFLQyxrQkFBTDtBQUNEOzs7eUNBRW9CO0FBQ25CLFdBQUtDLHdCQUFMLEdBQWdDLEtBQUtOLE9BQUwsQ0FBYU8scUJBQWIsRUFBaEM7QUFDRDs7O2dDQUVXO0FBQ1YsV0FBS0osTUFBTCxDQUFZSyxTQUFaLENBQXNCQyxHQUF0QixDQUEwQixRQUExQjtBQUNEOzs7RUFsQitCQyxrQjs7SUFxQjVCQyxhOzs7QUFDSiwyQkFBcUI7QUFBQTs7QUFBQTs7QUFBQSx1Q0FBTlAsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUEsZ0xBQ1ZBLElBRFU7O0FBRW5CLFdBQUtRLEVBQUwsR0FBVSxFQUFHQyxLQUFLQyxNQUFMLEtBQWdCLEdBQWhCLEdBQXNCLEdBQXpCLElBQWdDLEdBQTFDO0FBRm1CO0FBR3BCOzs7OzJCQUVNQyxFLEVBQUk7QUFDVCxXQUFLSCxFQUFMLElBQVcsS0FBWDtBQUNBLFdBQUtJLENBQUwsSUFBVUgsS0FBS0MsTUFBTCxLQUFnQixHQUFoQixHQUFzQixHQUFoQztBQUNBLFdBQUtHLENBQUwsSUFBVyxLQUFLTCxFQUFMLEdBQVVHLEVBQXJCOztBQUVBLGlKQUFhQSxFQUFiO0FBQ0Q7OztFQVp5QkcsaUI7O0lBZXRCQyx1Qjs7O0FBQ0osbUNBQVlDLFlBQVosRUFBMEJDLFVBQTFCLEVBQXNDO0FBQUE7O0FBQUE7O0FBR3BDLFdBQUtELFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0EsV0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxXQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNBLFdBQUtDLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUEsV0FBS0MsU0FBTCxHQUFpQixDQUFqQjtBQUNBLFdBQUtDLFFBQUwsR0FBZ0IsSUFBSUMsS0FBSixDQUFVLENBQVYsQ0FBaEI7QUFDQTtBQUNBLFNBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLE9BQUtILFNBQXpCLEVBQW9DRyxHQUFwQztBQUNFLGFBQUtGLFFBQUwsQ0FBY0UsQ0FBZCxJQUFtQixFQUFuQjtBQURGLEtBWG9DO0FBYXJDOzs7O21DQUVjO0FBQ2IsVUFBTUMsU0FBUyxLQUFLUixZQUFwQjtBQUNBLFVBQU1TLGFBQWFoQixLQUFLaUIsS0FBTCxDQUFXakIsS0FBS0MsTUFBTCxLQUFnQmMsT0FBT0csTUFBUCxDQUFjQyxNQUF6QyxDQUFuQjtBQUNBLFVBQU1DLFFBQVFMLE9BQU9HLE1BQVAsQ0FBY0YsVUFBZCxDQUFkOztBQUVBLFVBQU1LLFFBQVFOLE9BQU9PLE1BQVAsQ0FBY0YsS0FBZCxFQUFxQkcsYUFBbkM7QUFDQSxVQUFNQyxnQkFBZ0JULE9BQU9PLE1BQVAsQ0FBY0YsS0FBZCxFQUFxQkksYUFBM0M7QUFDQSxVQUFNQyxZQUFZekIsS0FBS2lCLEtBQUwsQ0FBV0YsT0FBT1csUUFBUCxDQUFnQkMsS0FBaEIsR0FBd0IsQ0FBbkMsQ0FBbEI7QUFDQSxVQUFNQyxhQUFhNUIsS0FBS2lCLEtBQUwsQ0FBV0YsT0FBT1csUUFBUCxDQUFnQkcsTUFBaEIsR0FBeUIsQ0FBcEMsQ0FBbkI7QUFDQSxVQUFNQyxjQUFjZixPQUFPZ0IsYUFBM0I7O0FBRUEsVUFBTUMsWUFBWWpCLE9BQU9rQixjQUFQLEdBQXdCLENBQUNqQyxLQUFLQyxNQUFMLEtBQWdCLENBQWhCLEdBQW9CLENBQXJCLElBQTBCLElBQTFCLEdBQWlDLEtBQUtTLGFBQWhGO0FBQ0EsVUFBTXdCLE9BQU9sQyxLQUFLbUMsR0FBTCxDQUFTLEtBQUtDLFdBQWQsRUFBMkIsS0FBS0MsWUFBaEMsSUFBZ0RMLFNBQTdEO0FBQ0EsVUFBTTdCLElBQUlILEtBQUtDLE1BQUwsS0FBZ0IsS0FBS21DLFdBQS9CO0FBQ0EsVUFBTWhDLElBQUksS0FBS2lDLFlBQUwsR0FBb0JILElBQTlCOztBQUVBLFVBQU1JLFVBQVUsSUFBSXhDLGFBQUosQ0FBa0JzQixLQUFsQixFQUF5QkMsS0FBekIsRUFBZ0NHLGFBQWhDLEVBQStDQyxTQUEvQyxFQUEwREcsVUFBMUQsRUFBc0VFLFdBQXRFLEVBQW1GSSxJQUFuRixFQUF5RkEsSUFBekYsRUFBK0YvQixDQUEvRixFQUFrR0MsQ0FBbEcsQ0FBaEI7O0FBRUEsVUFBTW1DLFNBQVN2QyxLQUFLaUIsS0FBTCxDQUFXakIsS0FBS0MsTUFBTCxLQUFnQixLQUFLVSxTQUFoQyxDQUFmO0FBQ0EsV0FBS0MsUUFBTCxDQUFjMkIsTUFBZCxFQUFzQkMsSUFBdEIsQ0FBMkJGLE9BQTNCO0FBQ0Q7OztpQ0FFWTtBQUNYLFdBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUs3QixRQUFMLENBQWNPLE1BQWxDLEVBQTBDc0IsR0FBMUMsRUFBK0M7QUFDN0MsWUFBTUMsUUFBUSxLQUFLOUIsUUFBTCxDQUFjNkIsQ0FBZCxDQUFkOztBQUVBLGFBQUssSUFBSTNCLElBQUksQ0FBUixFQUFXNkIsSUFBSUQsTUFBTXZCLE1BQTFCLEVBQWtDTCxJQUFJNkIsQ0FBdEMsRUFBeUM3QixHQUF6QyxFQUE4QztBQUM1QyxjQUFNd0IsVUFBVUksTUFBTTVCLENBQU4sQ0FBaEI7QUFDQXdCLGtCQUFRTSxPQUFSLEdBQWtCLElBQWxCO0FBQ0Q7QUFDRjs7QUFFRCxXQUFLbkMsT0FBTCxHQUFlLElBQWY7QUFDRDs7OzJCQUVNUCxFLEVBQUk7QUFDVCxVQUFJMkMsVUFBVSxJQUFkOztBQUVBLFdBQUssSUFBSUosSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUs5QixTQUF6QixFQUFvQzhCLEdBQXBDLEVBQXlDO0FBQ3ZDLFlBQU1DLFFBQVEsS0FBSzlCLFFBQUwsQ0FBYzZCLENBQWQsQ0FBZDs7QUFFQSxhQUFLLElBQUkzQixJQUFJNEIsTUFBTXZCLE1BQU4sR0FBZSxDQUE1QixFQUErQkwsS0FBSyxDQUFwQyxFQUF1Q0EsR0FBdkMsRUFBNEM7QUFDMUMsY0FBTXdCLFVBQVVJLE1BQU01QixDQUFOLENBQWhCO0FBQ0F3QixrQkFBUVEsTUFBUixDQUFlNUMsRUFBZjs7QUFFQTtBQUNBLGNBQUlvQyxRQUFRbEMsQ0FBUixHQUFZLEVBQUdrQyxRQUFRUyxNQUFSLEdBQWlCLEVBQXBCLENBQWhCLEVBQ0VULFFBQVFVLE1BQVIsR0FBaUIsSUFBakI7O0FBRUYsY0FBSVYsUUFBUVUsTUFBWixFQUNFTixNQUFNTyxNQUFOLENBQWFuQyxDQUFiLEVBQWdCLENBQWhCO0FBQ0g7O0FBRUQsWUFBSTRCLE1BQU12QixNQUFOLEtBQWlCLENBQXJCLEVBQ0UwQixVQUFVLEtBQVY7QUFDSDs7QUFFRCxVQUFJLEtBQUtwQyxPQUFMLElBQWdCb0MsT0FBcEIsRUFDRSxLQUFLckMsVUFBTDtBQUNIOzs7MkJBRU0wQyxHLEVBQUs7QUFDVixXQUFLLElBQUlULElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLOUIsU0FBekIsRUFBb0M4QixHQUFwQyxFQUF5QztBQUN2QyxZQUFNQyxRQUFRLEtBQUs5QixRQUFMLENBQWM2QixDQUFkLENBQWQ7O0FBRUEsYUFBSyxJQUFJM0IsSUFBSSxDQUFSLEVBQVc2QixJQUFJRCxNQUFNdkIsTUFBMUIsRUFBa0NMLElBQUk2QixDQUF0QyxFQUF5QzdCLEdBQXpDO0FBQ0U0QixnQkFBTTVCLENBQU4sRUFBU3FDLE1BQVQsQ0FBZ0JELEdBQWhCO0FBREY7QUFFRDtBQUNGOzs7RUFwRm1DRSx3Qjs7SUF1RmhDQyxvQjtBQUNKLGdDQUFZQyxVQUFaLEVBQXdCQyxXQUF4QixFQUFxQztBQUFBOztBQUNuQyxTQUFLRCxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJBLFdBQW5COztBQUVBLFNBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxTQUFLQyxpQkFBTCxHQUF5QixJQUF6Qjs7QUFFQSxTQUFLQyxhQUFMLEdBQXFCLEtBQUtBLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QixLQUFLQSxlQUFMLENBQXFCRCxJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNBLFNBQUtFLDJCQUFMLEdBQW1DLEtBQUtBLDJCQUFMLENBQWlDRixJQUFqQyxDQUFzQyxJQUF0QyxDQUFuQztBQUNBLFNBQUtHLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxDQUFpQkgsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLSSxhQUFMLEdBQXFCLEtBQUtBLGFBQUwsQ0FBbUJKLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBS0ssYUFBTCxHQUFxQixLQUFLQSxhQUFMLENBQW1CTCxJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUtNLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxDQUFpQk4sSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLTyxpQkFBTCxHQUF5QixLQUFLQSxpQkFBTCxDQUF1QlAsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7O0FBRUEsU0FBS1EsUUFBTCxHQUFnQixJQUFJN0QsdUJBQUosQ0FBNEIsS0FBS2dELFVBQUwsQ0FBZ0IvQyxZQUE1QyxFQUEwRCxLQUFLdUQsV0FBL0QsQ0FBaEI7O0FBRUEsU0FBS00sS0FBTCxHQUFhLElBQUlDLDhCQUFKLENBQ1gsS0FBS2YsVUFBTCxDQUFnQmdCLHFCQUFoQixDQUFzQ0MsSUFEM0IsRUFFWCxLQUFLakIsVUFBTCxDQUFnQmtCLGtCQUFoQixDQUFtQ0MsR0FBbkMsQ0FBdUMsbUJBQXZDLENBRlcsRUFHWCxLQUFLbkIsVUFBTCxDQUFnQm9CLG1CQUFoQixFQUhXLENBQWI7QUFLRDs7Ozs0QkFFTztBQUNOLFdBQUtDLElBQUwsR0FBWSxJQUFJekYsbUJBQUosQ0FBd0JELFFBQXhCLEVBQWtDO0FBQzVDO0FBQ0EyRiwwQkFBa0IsS0FGMEI7QUFHNUNDLGVBQU8sc0JBQWMsRUFBZCxFQUFrQixLQUFLdEIsV0FBTCxDQUFpQnNCLEtBQW5DLENBSHFDO0FBSTVDQyxrQkFBVSxNQUprQztBQUs1Q0Msb0JBQVk7QUFMZ0MsT0FBbEMsRUFNVDtBQUNEQyxvQkFBWSxLQUFLakIsYUFEaEIsQ0FDK0I7QUFEL0IsT0FOUyxFQVFUO0FBQ0RrQixtQkFBVyxDQUFDLHlCQUFELEVBQTRCLFlBQTVCO0FBRFYsT0FSUyxDQUFaOztBQVlBLFdBQUtOLElBQUwsQ0FBVXhCLE1BQVY7QUFDQSxXQUFLd0IsSUFBTCxDQUFVTyxJQUFWO0FBQ0EsV0FBS1AsSUFBTCxDQUFVUSxRQUFWLENBQW1CLEtBQUs3QixVQUFMLENBQWdCcUIsSUFBaEIsQ0FBcUJTLGlCQUFyQixFQUFuQjs7QUFFQSxXQUFLVCxJQUFMLENBQVVVLFlBQVYsQ0FBdUIsVUFBQ25DLEdBQUQsRUFBTWhELEVBQU4sRUFBVXlCLEtBQVYsRUFBaUJFLE1BQWpCLEVBQTRCO0FBQ2pEcUIsWUFBSW9DLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CM0QsS0FBcEIsRUFBMkJFLE1BQTNCO0FBQ0QsT0FGRDs7QUFJQSxXQUFLOEMsSUFBTCxDQUFVWSxXQUFWLENBQXNCLEtBQUtwQixRQUEzQjs7QUFFQTtBQUNBLFdBQUtULGFBQUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBTThCLGVBQWUsS0FBS2xDLFVBQUwsQ0FBZ0JrQyxZQUFyQztBQUNBQSxtQkFBYUMsZ0JBQWIsQ0FBOEIsNEJBQTlCLEVBQTRELEtBQUt6QixhQUFqRTtBQUNBd0IsbUJBQWFDLGdCQUFiLENBQThCLCtCQUE5QixFQUErRCxLQUFLN0IsZUFBcEU7QUFDQTRCLG1CQUFhQyxnQkFBYixDQUE4QiwrQkFBOUIsRUFBK0QsS0FBSzVCLDJCQUFwRTtBQUNBMkIsbUJBQWFDLGdCQUFiLENBQThCLDBCQUE5QixFQUEwRCxLQUFLeEIsV0FBL0Q7QUFDQXVCLG1CQUFhQyxnQkFBYixDQUE4QixnQ0FBOUIsRUFBZ0UsS0FBS3ZCLGlCQUFyRTtBQUNEOzs7MkJBRU07QUFDTHdCLG1CQUFhLEtBQUtsQyxhQUFsQjs7QUFFQSxXQUFLbUIsSUFBTCxDQUFVdkYsR0FBVixDQUFjTyxTQUFkLENBQXdCZ0csTUFBeEIsQ0FBK0IsWUFBL0I7QUFDQSxXQUFLaEIsSUFBTCxDQUFVdkYsR0FBVixDQUFjTyxTQUFkLENBQXdCQyxHQUF4QixDQUE0QixZQUE1QjtBQUNBLFdBQUsrRSxJQUFMLENBQVVpQixTQUFWOztBQUVBLFdBQUt6QixRQUFMLENBQWMwQixVQUFkOztBQUVBLFVBQU1MLGVBQWUsS0FBS2xDLFVBQUwsQ0FBZ0JrQyxZQUFyQztBQUNBQSxtQkFBYU0sbUJBQWIsQ0FBaUMsNEJBQWpDLEVBQStELEtBQUs5QixhQUFwRTtBQUNBd0IsbUJBQWFNLG1CQUFiLENBQWlDLCtCQUFqQyxFQUFrRSxLQUFLbEMsZUFBdkU7QUFDQTRCLG1CQUFhTSxtQkFBYixDQUFpQywrQkFBakMsRUFBa0UsS0FBS2pDLDJCQUF2RTtBQUNBMkIsbUJBQWFNLG1CQUFiLENBQWlDLDBCQUFqQyxFQUE2RCxLQUFLN0IsV0FBbEU7QUFDQXVCLG1CQUFhTSxtQkFBYixDQUFpQyxnQ0FBakMsRUFBbUUsS0FBSzVCLGlCQUF4RTtBQUNEOzs7a0NBRWE7QUFDWixXQUFLUyxJQUFMLENBQVVvQixjQUFWLENBQXlCLEtBQUs1QixRQUE5QjtBQUNBLFdBQUtRLElBQUwsQ0FBVWdCLE1BQVY7QUFDRDs7O2dDQUVXSyxLLEVBQU87QUFDakIsV0FBS3JCLElBQUwsQ0FBVXNCLEtBQVYsQ0FBZ0JuQixRQUFoQixHQUEyQmtCLEtBQTNCO0FBQ0EsV0FBS3JCLElBQUwsQ0FBVXhCLE1BQVYsQ0FBaUIsWUFBakI7QUFDRDs7O3NDQUVpQjZDLEssRUFBTztBQUN2QixjQUFRQSxLQUFSO0FBQ0UsYUFBSyxNQUFMO0FBQ0UsZUFBS3JCLElBQUwsQ0FBVXNCLEtBQVYsQ0FBZ0JsQixVQUFoQixHQUE2QixFQUE3QjtBQUNBO0FBQ0YsYUFBSyxRQUFMO0FBQ0UsY0FBTTdELFNBQVMsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQixLQUEzQixDQUFmO0FBQ0EsY0FBTUUsUUFBUUYsT0FBT2xCLEtBQUtpQixLQUFMLENBQVdqQixLQUFLQyxNQUFMLEtBQWdCaUIsT0FBT0MsTUFBbEMsQ0FBUCxDQUFkO0FBQ0EsZUFBS3dELElBQUwsQ0FBVXNCLEtBQVYsQ0FBZ0JsQixVQUFoQixHQUE2QjNELEtBQTdCO0FBQ0E7QUFDRjtBQUNFLGVBQUt1RCxJQUFMLENBQVVzQixLQUFWLENBQWdCbEIsVUFBaEIsR0FBNkJpQixLQUE3QjtBQUNBO0FBWEo7O0FBY0EsV0FBS3JCLElBQUwsQ0FBVXhCLE1BQVYsQ0FBaUIsWUFBakI7QUFDRDs7O2dEQUUyQjZDLEssRUFBTztBQUNqQyxXQUFLN0IsUUFBTCxDQUFjekQsYUFBZCxHQUE4QnNGLEtBQTlCO0FBQ0Q7OztvQ0FFZUEsSyxFQUFPO0FBQ3JCLFdBQUt2QyxpQkFBTCxHQUF5QnVDLEtBQXpCOztBQUVBTixtQkFBYSxLQUFLbEMsYUFBbEI7QUFDQSxXQUFLQSxhQUFMLEdBQXFCMEMsV0FBVyxLQUFLeEMsYUFBaEIsRUFBK0IsS0FBS3lDLGNBQUwsRUFBL0IsQ0FBckI7QUFDRDs7O29DQUVlO0FBQ2QsV0FBS2hDLFFBQUwsQ0FBY2lDLFlBQWQ7O0FBRUFWLG1CQUFhLEtBQUtsQyxhQUFsQjtBQUNBLFdBQUtBLGFBQUwsR0FBcUIwQyxXQUFXLEtBQUt4QyxhQUFoQixFQUErQixLQUFLeUMsY0FBTCxFQUEvQixDQUFyQjtBQUNEOzs7cUNBRWdCO0FBQ2YsVUFBTUUsZUFBZSxLQUFLNUMsaUJBQUwsR0FBeUIsQ0FBOUM7QUFDQTtBQUNBLFVBQU02QyxRQUFRdEcsS0FBS3VHLEdBQUwsQ0FBUyxJQUFULEVBQWVGLGVBQWVBLGVBQWVyRyxLQUFLQyxNQUFMLEVBQTdDLENBQWQsQ0FIZSxDQUc0RDtBQUMzRSxhQUFPcUcsUUFBUSxJQUFmO0FBQ0Q7OztrQ0FFYUUsQyxFQUFHO0FBQ2YsVUFBTUMsUUFBUUQsRUFBRUUsT0FBRixDQUFVLENBQVYsQ0FBZDtBQUNBLFVBQU12RyxJQUFJc0csTUFBTUUsT0FBaEI7QUFDQSxVQUFNdkcsSUFBSXFHLE1BQU1HLE9BQWhCOztBQUVBLFdBQUtDLFFBQUwsQ0FBYyxLQUFLMUMsUUFBTCxDQUFjdkQsUUFBNUIsRUFBc0NULENBQXRDLEVBQXlDQyxDQUF6QztBQUNEOzs7NkJBRVFRLFEsRUFBVVQsQyxFQUFHQyxDLEVBQUc7QUFDdkI7QUFDQSxXQUFLLElBQUlxQyxJQUFJN0IsU0FBU08sTUFBVCxHQUFrQixDQUEvQixFQUFrQ3NCLEtBQUssQ0FBdkMsRUFBMENBLEdBQTFDLEVBQStDO0FBQzdDLFlBQU1DLFFBQVE5QixTQUFTNkIsQ0FBVCxDQUFkOztBQUVBLGFBQUssSUFBSTNCLElBQUksQ0FBUixFQUFXNkIsSUFBSUQsTUFBTXZCLE1BQTFCLEVBQWtDTCxJQUFJNkIsQ0FBdEMsRUFBeUM3QixHQUF6QyxFQUE4QztBQUM1QyxjQUFNd0IsVUFBVUksTUFBTTVCLENBQU4sQ0FBaEI7QUFDQSxjQUFNZ0csS0FBS3hFLFFBQVFuQyxDQUFSLEdBQVlBLENBQXZCO0FBQ0EsY0FBTTRHLEtBQUt6RSxRQUFRbEMsQ0FBUixHQUFZQSxDQUF2QjtBQUNBLGNBQU00RyxXQUFXaEgsS0FBS2lILElBQUwsQ0FBVUgsS0FBS0EsRUFBTCxHQUFVQyxLQUFLQSxFQUF6QixDQUFqQjs7QUFFQSxjQUFJQyxXQUFXMUUsUUFBUVMsTUFBdkIsRUFBK0I7QUFDN0JULG9CQUFRTSxPQUFSLEdBQWtCLElBQWxCO0FBQ0EsaUJBQUtzRSxZQUFMLENBQWtCNUUsUUFBUWxCLEtBQTFCO0FBQ0EsaUJBQUsrRixjQUFMLENBQW9CN0UsUUFBUWxCLEtBQTVCLEVBQW1Da0IsUUFBUW5DLENBQTNDLEVBQThDbUMsUUFBUWxDLENBQXREO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7O2lDQUVZZ0IsSyxFQUFPO0FBQ2xCLFVBQUksS0FBS3VELElBQUwsQ0FBVXNCLEtBQVYsQ0FBZ0JyQixnQkFBaEIsS0FBcUMsSUFBekMsRUFBK0M7QUFDN0MsYUFBS0QsSUFBTCxDQUFVc0IsS0FBVixDQUFnQnJCLGdCQUFoQixHQUFtQyxLQUFuQztBQUNBLGFBQUtELElBQUwsQ0FBVXhCLE1BQVYsQ0FBaUIsaUJBQWpCO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFLSSxXQUFMLENBQWlCc0IsS0FBakIsQ0FBdUJ6RCxLQUF2QixLQUFpQyxDQUFqQztBQUNBO0FBQ0EsV0FBS3VELElBQUwsQ0FBVXNCLEtBQVYsQ0FBZ0JwQixLQUFoQixDQUFzQnpELEtBQXRCLEtBQWdDLENBQWhDO0FBQ0EsV0FBS3VELElBQUwsQ0FBVXhCLE1BQVYsQ0FBaUIsUUFBakI7QUFDRDs7O21DQUVjL0IsSyxFQUFPakIsQyxFQUFHQyxDLEVBQUc7QUFDMUIsV0FBS2dFLEtBQUwsQ0FBV2dELE9BQVgsQ0FBbUJoRyxLQUFuQjtBQUNEOzs7a0NBRWE0RSxLLEVBQU87QUFDbkIsV0FBSzVCLEtBQUwsQ0FBV2lELGtCQUFYLENBQThCckIsS0FBOUI7QUFDRDs7Ozs7a0JBR1kzQyxvQiIsImZpbGUiOiJLaWxsVGhlQmFsbG9vbnNTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbnZhc1ZpZXcsIENhbnZhczJkUmVuZGVyZXIgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgQmFsbG9vbiBmcm9tICcuLi9yZW5kZXJlcnMvQmFsbG9vbic7XG5pbXBvcnQgS2lsbFRoZUJhbGxvb25zU3ludGggZnJvbSAnLi4vYXVkaW8vS2lsbFRoZUJhbGxvb25zU3ludGgnO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzY29yZVwiPlxuICAgICAgICA8cCBjbGFzcz1cImJsdWVcIj48JT0gc2NvcmUuYmx1ZSAlPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJwaW5rXCI+PCU9IHNjb3JlLnBpbmsgJT48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwieWVsbG93XCI+PCU9IHNjb3JlLnllbGxvdyAlPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJyZWRcIj48JT0gc2NvcmUucmVkICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyXCI+XG4gICAgICA8JSBpZiAoc2hvd0luc3RydWN0aW9ucykgeyAlPlxuICAgICAgICA8cCBjbGFzcz1cImFsaWduLWNlbnRlciBzb2Z0LWJsaW5rXCI+SGl0IHRoZSBiYWxsb29ucyE8L3A+XG4gICAgICA8JSB9ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2hvdy10ZXh0XCI+XG4gICAgICA8JSBpZiAoc2hvd1RleHQgIT09ICdub25lJykgeyAlPlxuICAgICAgICA8cCBjbGFzcz1cImFsaWduLWNlbnRlciBzb2Z0LWJsaW5rXCI+PCU9IHNob3dUZXh0ICU+PC9wPlxuICAgICAgPCUgfSAlPlxuICAgICAgPCUgaWYgKGNsaWNrQ29sb3IgIT09ICcnKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tY2VudGVyXCI+Q2xpY2sgb24gPCU9IGNsaWNrQ29sb3IgJT4hPC9wPlxuICAgICAgPCUgfSAlPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY2xhc3MgS2lsbFRoZUJhbGxvb25zVmlldyBleHRlbmRzIENhbnZhc1ZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuICAgIHRoaXMuJGNhbnZhcyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuICAgIHRoaXMuJHNjb3JlID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNjb3JlJyk7XG4gIH1cblxuICBvblJlc2l6ZSguLi5hcmdzKSB7XG4gICAgc3VwZXIub25SZXNpemUoLi4uYXJncyk7XG4gICAgdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QoKTtcbiAgfVxuXG4gIHVwZGF0ZUJvdW5kaW5nUmVjdCgpIHtcbiAgICB0aGlzLmNhbnZhc0JvdW5kaW5nQ2xpZW50UmVjdCA9IHRoaXMuJGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfTtcblxuICBoaWRlU2NvcmUoKSB7XG4gICAgdGhpcy4kc2NvcmUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gIH1cbn1cblxuY2xhc3MgUmlzaW5nQmFsbG9vbiBleHRlbmRzIEJhbGxvb24ge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gICAgdGhpcy52eSA9IC0gKE1hdGgucmFuZG9tKCkgKiAwLjQgKyAwLjYpICogMjAwO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgdGhpcy52eSAqPSAxLjAwMjtcbiAgICB0aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDAuMiAtIDAuMTtcbiAgICB0aGlzLnkgKz0gKHRoaXMudnkgKiBkdCk7XG5cbiAgICBzdXBlci51cGRhdGUoZHQpO1xuICB9XG59XG5cbmNsYXNzIEtpbGxUaGVCYWxsb29uc1JlbmRlcmVyIGV4dGVuZHMgQ2FudmFzMmRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHNwcml0ZUNvbmZpZywgb25FeHBsb2RlZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNwcml0ZUNvbmZpZyA9IHNwcml0ZUNvbmZpZztcbiAgICB0aGlzLm9uRXhwbG9kZWQgPSBvbkV4cGxvZGVkO1xuICAgIHRoaXMuaXNFbmRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2l6ZURpdmVyc2l0eSA9IDA7XG5cbiAgICB0aGlzLm51bVpJbmRleCA9IDM7XG4gICAgdGhpcy5iYWxsb29ucyA9IG5ldyBBcnJheSgzKTtcbiAgICAvLyBwcmVwYXJlIHN0YWNrIGZvciBlYWNoIHotaW5kZXhlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1aSW5kZXg7IGkrKylcbiAgICAgIHRoaXMuYmFsbG9vbnNbaV0gPSBbXTtcbiAgfVxuXG4gIHNwYXduQmFsbG9vbigpIHtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnNwcml0ZUNvbmZpZztcbiAgICBjb25zdCBjb2xvckluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29uZmlnLmNvbG9ycy5sZW5ndGgpO1xuICAgIGNvbnN0IGNvbG9yID0gY29uZmlnLmNvbG9yc1tjb2xvckluZGV4XTtcblxuICAgIGNvbnN0IGltYWdlID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uaGFsZlNpemVJbWFnZTtcbiAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICBjb25zdCBjbGlwV2lkdGggPSBNYXRoLmZsb29yKGNvbmZpZy5jbGlwU2l6ZS53aWR0aCAvIDIpO1xuICAgIGNvbnN0IGNsaXBIZWlnaHQgPSBNYXRoLmZsb29yKGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQgLyAyKTtcbiAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuXG4gICAgY29uc3Qgc2l6ZVJhdGlvID0gY29uZmlnLnNtYWxsU2l6ZVJhdGlvICsgKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiAwLjE1ICogdGhpcy5zaXplRGl2ZXJzaXR5O1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCkgKiBzaXplUmF0aW87XG4gICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IHkgPSB0aGlzLmNhbnZhc0hlaWdodCArIHNpemU7XG5cbiAgICBjb25zdCBiYWxsb29uID0gbmV3IFJpc2luZ0JhbGxvb24oY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCB4LCB5KTtcblxuICAgIGNvbnN0IHpJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMubnVtWkluZGV4KTtcbiAgICB0aGlzLmJhbGxvb25zW3pJbmRleF0ucHVzaChiYWxsb29uKTtcbiAgfVxuXG4gIGV4cGxvZGVBbGwoKSB7XG4gICAgZm9yIChsZXQgeiA9IDA7IHogPCB0aGlzLmJhbGxvb25zLmxlbmd0aDsgeisrKSB7XG4gICAgICBjb25zdCBsYXllciA9IHRoaXMuYmFsbG9vbnNbel07XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGF5ZXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJhbGxvb24gPSBsYXllcltpXTtcbiAgICAgICAgYmFsbG9vbi5leHBsb2RlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzRW5kZWQgPSB0cnVlO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgbGV0IGlzRW1wdHkgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgeiA9IDA7IHogPCB0aGlzLm51bVpJbmRleDsgeisrKSB7XG4gICAgICBjb25zdCBsYXllciA9IHRoaXMuYmFsbG9vbnNbel07XG5cbiAgICAgIGZvciAobGV0IGkgPSBsYXllci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBiYWxsb29uID0gbGF5ZXJbaV07XG4gICAgICAgIGJhbGxvb24udXBkYXRlKGR0KTtcblxuICAgICAgICAvLyBpZiBvdXRzaWRlIHRoZSBzY3JlZW5cbiAgICAgICAgaWYgKGJhbGxvb24ueSA8IC0gKGJhbGxvb24ucmFkaXVzICsgMTApKVxuICAgICAgICAgIGJhbGxvb24uaXNEZWFkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoYmFsbG9vbi5pc0RlYWQpXG4gICAgICAgICAgbGF5ZXIuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGF5ZXIubGVuZ3RoICE9PSAwKVxuICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNFbmRlZCAmJiBpc0VtcHR5KVxuICAgICAgdGhpcy5vbkV4cGxvZGVkKCk7XG4gIH1cblxuICByZW5kZXIoY3R4KSB7XG4gICAgZm9yIChsZXQgeiA9IDA7IHogPCB0aGlzLm51bVpJbmRleDsgeisrKSB7XG4gICAgICBjb25zdCBsYXllciA9IHRoaXMuYmFsbG9vbnNbel07XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGF5ZXIubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgICBsYXllcltpXS5yZW5kZXIoY3R4KTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgS2lsbFRoZUJhbGxvb25zU3RhdGUge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBnbG9iYWxTdGF0ZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5nbG9iYWxTdGF0ZSA9IGdsb2JhbFN0YXRlO1xuXG4gICAgdGhpcy5fc3Bhd25UaW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLl9tYXhTcGF3bkludGVydmFsID0gbnVsbDtcblxuICAgIHRoaXMuX3NwYXduQmFsbG9vbiA9IHRoaXMuX3NwYXduQmFsbG9vbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3VwZGF0ZU1heFNwYXduID0gdGhpcy5fdXBkYXRlTWF4U3Bhd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl91cGRhdGVCYWxsb29uU2l6ZURpdmVyc2l0eSA9IHRoaXMuX3VwZGF0ZUJhbGxvb25TaXplRGl2ZXJzaXR5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25FeHBsb2RlZCA9IHRoaXMuX29uRXhwbG9kZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblRvdWNoU3RhcnQgPSB0aGlzLl9vblRvdWNoU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNhbXBsZXNTZXQgPSB0aGlzLl9vblNhbXBsZXNTZXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblNob3dUZXh0ID0gdGhpcy5fb25TaG93VGV4dC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQ2xpY2tDb2xvclRleHQgPSB0aGlzLl9vbkNsaWNrQ29sb3JUZXh0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IEtpbGxUaGVCYWxsb29uc1JlbmRlcmVyKHRoaXMuZXhwZXJpZW5jZS5zcHJpdGVDb25maWcsIHRoaXMuX29uRXhwbG9kZWQpO1xuXG4gICAgdGhpcy5zeW50aCA9IG5ldyBLaWxsVGhlQmFsbG9vbnNTeW50aChcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5raWxsVGhlQmFsbG9vbnNDb25maWcuc2V0cyxcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5hdWRpb0J1ZmZlck1hbmFnZXIuZ2V0KCdraWxsLXRoZS1iYWxsb29ucycpLFxuICAgICAgdGhpcy5leHBlcmllbmNlLmdldEF1ZGlvRGVzdGluYXRpb24oKVxuICAgICk7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICB0aGlzLnZpZXcgPSBuZXcgS2lsbFRoZUJhbGxvb25zVmlldyh0ZW1wbGF0ZSwge1xuICAgICAgLy8gc2hvd0luc3RydWN0aW9uczogdHJ1ZSxcbiAgICAgIHNob3dJbnN0cnVjdGlvbnM6IGZhbHNlLFxuICAgICAgc2NvcmU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2xvYmFsU3RhdGUuc2NvcmUpLFxuICAgICAgc2hvd1RleHQ6ICdub25lJyxcbiAgICAgIGNsaWNrQ29sb3I6ICcnLFxuICAgIH0sIHtcbiAgICAgIHRvdWNoc3RhcnQ6IHRoaXMuX29uVG91Y2hTdGFydCwgLy8gYnVnIHdoZW4gY29tbWluZyBmcm9tIGF2b2lkIHRoZSByYWluXG4gICAgfSwge1xuICAgICAgY2xhc3NOYW1lOiBbJ2tpbGwtdGhlLWJhbGxvb25zLXN0YXRlJywgJ2ZvcmVncm91bmQnXSxcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgIHRoaXMudmlldy5hcHBlbmRUbyh0aGlzLmV4cGVyaWVuY2Uudmlldy5nZXRTdGF0ZUNvbnRhaW5lcigpKTtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG5cbiAgICAvLyBpbml0IHNwYXduXG4gICAgdGhpcy5fc3Bhd25CYWxsb29uKCk7XG5cbiAgICAvLyB0aGlzIGhpZGVzIFwiSGl0IHRoZSBiYWxsb29ucyAhXCIgdGV4dCA6XG5cbiAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAvLyAgIHRoaXMudmlldy5tb2RlbC5zaG93SW5zdHJ1Y3Rpb25zID0gZmFsc2U7XG4gICAgLy8gICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1jZW50ZXInKTtcbiAgICAvLyB9LCAzMDAwKTtcblxuICAgIGNvbnN0IHNoYXJlZFBhcmFtcyA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXM7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzYW1wbGVzU2V0JywgdGhpcy5fb25TYW1wbGVzU2V0KTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOnNwYXduSW50ZXJ2YWwnLCB0aGlzLl91cGRhdGVNYXhTcGF3bik7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzaXplRGl2ZXJzaXR5JywgdGhpcy5fdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2hvd1RleHQnLCB0aGlzLl9vblNob3dUZXh0KTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOmNsaWNrQ29sb3JUZXh0JywgdGhpcy5fb25DbGlja0NvbG9yVGV4dCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9zcGF3blRpbWVvdXQpO1xuXG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JlZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LmhpZGVTY29yZSgpO1xuXG4gICAgdGhpcy5yZW5kZXJlci5leHBsb2RlQWxsKCk7XG5cbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2FtcGxlc1NldCcsIHRoaXMuX29uU2FtcGxlc1NldCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzcGF3bkludGVydmFsJywgdGhpcy5fdXBkYXRlTWF4U3Bhd24pO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2l6ZURpdmVyc2l0eScsIHRoaXMuX3VwZGF0ZUJhbGxvb25TaXplRGl2ZXJzaXR5KTtcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOnNob3dUZXh0JywgdGhpcy5fb25TaG93VGV4dCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpjbGlja0NvbG9yVGV4dCcsIHRoaXMuX29uQ2xpY2tDb2xvclRleHQpO1xuICB9XG5cbiAgX29uRXhwbG9kZWQoKSB7XG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgfVxuXG4gIF9vblNob3dUZXh0KHZhbHVlKSB7XG4gICAgdGhpcy52aWV3Lm1vZGVsLnNob3dUZXh0ID0gdmFsdWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNob3ctdGV4dCcpO1xuICB9XG5cbiAgX29uQ2xpY2tDb2xvclRleHQodmFsdWUpIHtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVsLmNsaWNrQ29sb3IgPSAnJztcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3JhbmRvbSc6XG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IFsnYmx1ZScsICdwaW5rJywgJ3llbGxvdycsICdyZWQnXTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBjb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sb3JzLmxlbmd0aCldO1xuICAgICAgICB0aGlzLnZpZXcubW9kZWwuY2xpY2tDb2xvciA9IGNvbG9yO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMudmlldy5tb2RlbC5jbGlja0NvbG9yID0gdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zaG93LXRleHQnKTtcbiAgfVxuXG4gIF91cGRhdGVCYWxsb29uU2l6ZURpdmVyc2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucmVuZGVyZXIuc2l6ZURpdmVyc2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgX3VwZGF0ZU1heFNwYXduKHZhbHVlKSB7XG4gICAgdGhpcy5fbWF4U3Bhd25JbnRlcnZhbCA9IHZhbHVlO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3NwYXduVGltZW91dCk7XG4gICAgdGhpcy5fc3Bhd25UaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLl9zcGF3bkJhbGxvb24sIHRoaXMuX2dldFNwYXduRGVsYXkoKSk7XG4gIH1cblxuICBfc3Bhd25CYWxsb29uKCkge1xuICAgIHRoaXMucmVuZGVyZXIuc3Bhd25CYWxsb29uKCk7XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fc3Bhd25UaW1lb3V0KTtcbiAgICB0aGlzLl9zcGF3blRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuX3NwYXduQmFsbG9vbiwgdGhpcy5fZ2V0U3Bhd25EZWxheSgpKTtcbiAgfVxuXG4gIF9nZXRTcGF3bkRlbGF5KCkge1xuICAgIGNvbnN0IGhhbGZNYXhTcGF3biA9IHRoaXMuX21heFNwYXduSW50ZXJ2YWwgLyAyO1xuICAgIC8vIG1pbiBkZWxheSB0byA1MG1zXG4gICAgY29uc3QgZGVsYXkgPSBNYXRoLm1heCgwLjA1LCBoYWxmTWF4U3Bhd24gKyBoYWxmTWF4U3Bhd24gKiBNYXRoLnJhbmRvbSgpKTsgLy8gc2Vjb25kc1xuICAgIHJldHVybiBkZWxheSAqIDEwMDA7XG4gIH1cblxuICBfb25Ub3VjaFN0YXJ0KGUpIHtcbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICBjb25zdCB4ID0gdG91Y2guY2xpZW50WDtcbiAgICBjb25zdCB5ID0gdG91Y2guY2xpZW50WTtcblxuICAgIHRoaXMuX3Rlc3RIaXQodGhpcy5yZW5kZXJlci5iYWxsb29ucywgeCwgeSk7XG4gIH1cblxuICBfdGVzdEhpdChiYWxsb29ucywgeCwgeSkge1xuICAgIC8vIHN0YXJ0IGZyb20gdG9wIHRvIGJvdHRvbSB6LWluZGV4ZXNcbiAgICBmb3IgKGxldCB6ID0gYmFsbG9vbnMubGVuZ3RoIC0gMTsgeiA+PSAwOyB6LS0pIHtcbiAgICAgIGNvbnN0IGxheWVyID0gYmFsbG9vbnNbel07XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGF5ZXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJhbGxvb24gPSBsYXllcltpXTtcbiAgICAgICAgY29uc3QgZHggPSBiYWxsb29uLnggLSB4O1xuICAgICAgICBjb25zdCBkeSA9IGJhbGxvb24ueSAtIHk7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgICAgICBpZiAoZGlzdGFuY2UgPCBiYWxsb29uLnJhZGl1cykge1xuICAgICAgICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlU2NvcmUoYmFsbG9vbi5jb2xvcik7XG4gICAgICAgICAgdGhpcy5fdHJpZ2dlclNhbXBsZShiYWxsb29uLmNvbG9yLCBiYWxsb29uLngsIGJhbGxvb24ueSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZVNjb3JlKGNvbG9yKSB7XG4gICAgaWYgKHRoaXMudmlldy5tb2RlbC5zaG93SW5zdHJ1Y3Rpb25zID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnZpZXcubW9kZWwuc2hvd0luc3RydWN0aW9ucyA9IGZhbHNlO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tY2VudGVyJyk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIG1vZGVsXG4gICAgdGhpcy5nbG9iYWxTdGF0ZS5zY29yZVtjb2xvcl0gKz0gMTtcbiAgICAvLyB1cGRhdGUgdmlldyBtb2RlbFxuICAgIHRoaXMudmlldy5tb2RlbC5zY29yZVtjb2xvcl0gKz0gMTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2NvcmUnKTtcbiAgfVxuXG4gIF90cmlnZ2VyU2FtcGxlKGNvbG9yLCB4LCB5KSB7XG4gICAgdGhpcy5zeW50aC50cmlnZ2VyKGNvbG9yKTtcbiAgfVxuXG4gIF9vblNhbXBsZXNTZXQodmFsdWUpIHtcbiAgICB0aGlzLnN5bnRoLnNldFNhbXBsZXNTZXRJbmRleCh2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2lsbFRoZUJhbGxvb25zU3RhdGU7XG4iXX0=