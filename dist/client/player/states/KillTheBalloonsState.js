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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktpbGxUaGVCYWxsb29uc1N0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwiS2lsbFRoZUJhbGxvb25zVmlldyIsIiRjYW52YXMiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiJHNjb3JlIiwiYXJncyIsInVwZGF0ZUJvdW5kaW5nUmVjdCIsImNhbnZhc0JvdW5kaW5nQ2xpZW50UmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsYXNzTGlzdCIsImFkZCIsIkNhbnZhc1ZpZXciLCJSaXNpbmdCYWxsb29uIiwidnkiLCJNYXRoIiwicmFuZG9tIiwiZHQiLCJ4IiwieSIsIkJhbGxvb24iLCJLaWxsVGhlQmFsbG9vbnNSZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsIm9uRXhwbG9kZWQiLCJpc0VuZGVkIiwic2l6ZURpdmVyc2l0eSIsIm51bVpJbmRleCIsImJhbGxvb25zIiwiQXJyYXkiLCJpIiwiY29uZmlnIiwiY29sb3JJbmRleCIsImZsb29yIiwiY29sb3JzIiwibGVuZ3RoIiwiY29sb3IiLCJpbWFnZSIsImdyb3VwcyIsImhhbGZTaXplSW1hZ2UiLCJjbGlwUG9zaXRpb25zIiwiY2xpcFdpZHRoIiwiY2xpcFNpemUiLCJ3aWR0aCIsImNsaXBIZWlnaHQiLCJoZWlnaHQiLCJyZWZyZXNoUmF0ZSIsImFuaW1hdGlvblJhdGUiLCJzaXplUmF0aW8iLCJzbWFsbFNpemVSYXRpbyIsInNpemUiLCJtaW4iLCJjYW52YXNXaWR0aCIsImNhbnZhc0hlaWdodCIsImJhbGxvb24iLCJ6SW5kZXgiLCJwdXNoIiwieiIsImxheWVyIiwibCIsImV4cGxvZGUiLCJpc0VtcHR5IiwidXBkYXRlIiwicmFkaXVzIiwiaXNEZWFkIiwic3BsaWNlIiwiY3R4IiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIktpbGxUaGVCYWxsb29uc1N0YXRlIiwiZXhwZXJpZW5jZSIsImdsb2JhbFN0YXRlIiwiX3NwYXduVGltZW91dCIsIl9tYXhTcGF3bkludGVydmFsIiwiX3NwYXduQmFsbG9vbiIsImJpbmQiLCJfdXBkYXRlTWF4U3Bhd24iLCJfdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkiLCJfb25FeHBsb2RlZCIsIl9vblRvdWNoU3RhcnQiLCJfb25TYW1wbGVzU2V0IiwiX29uU2hvd1RleHQiLCJfb25DbGlja0NvbG9yVGV4dCIsInJlbmRlcmVyIiwic3ludGgiLCJLaWxsVGhlQmFsbG9vbnNTeW50aCIsImtpbGxUaGVCYWxsb29uc0NvbmZpZyIsInNldHMiLCJhdWRpb0J1ZmZlck1hbmFnZXIiLCJnZXQiLCJnZXRBdWRpb0Rlc3RpbmF0aW9uIiwidmlldyIsInNob3dJbnN0cnVjdGlvbnMiLCJzY29yZSIsInNob3dUZXh0IiwiY2xpY2tDb2xvciIsInRvdWNoc3RhcnQiLCJjbGFzc05hbWUiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsImFkZFJlbmRlcmVyIiwic2hhcmVkUGFyYW1zIiwiYWRkUGFyYW1MaXN0ZW5lciIsImNsZWFyVGltZW91dCIsInJlbW92ZSIsImhpZGVTY29yZSIsImV4cGxvZGVBbGwiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwicmVtb3ZlUmVuZGVyZXIiLCJ2YWx1ZSIsIm1vZGVsIiwic2V0VGltZW91dCIsIl9nZXRTcGF3bkRlbGF5Iiwic3Bhd25CYWxsb29uIiwiaGFsZk1heFNwYXduIiwiZGVsYXkiLCJtYXgiLCJlIiwidG91Y2giLCJ0b3VjaGVzIiwiY2xpZW50WCIsImNsaWVudFkiLCJfdGVzdEhpdCIsImR4IiwiZHkiLCJkaXN0YW5jZSIsInNxcnQiLCJfdXBkYXRlU2NvcmUiLCJfdHJpZ2dlclNhbXBsZSIsInRyaWdnZXIiLCJzZXRTYW1wbGVzU2V0SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxxMkJBQU47O0lBNEJNQyxtQjs7Ozs7Ozs7OzsrQkFDTztBQUNUO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLEtBQUtDLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFmO0FBQ0EsV0FBS0MsTUFBTCxHQUFjLEtBQUtGLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFkO0FBQ0Q7OzsrQkFFaUI7QUFBQTs7QUFBQSx3Q0FBTkUsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQ2hCLDhMQUFrQkEsSUFBbEI7QUFDQSxXQUFLQyxrQkFBTDtBQUNEOzs7eUNBRW9CO0FBQ25CLFdBQUtDLHdCQUFMLEdBQWdDLEtBQUtOLE9BQUwsQ0FBYU8scUJBQWIsRUFBaEM7QUFDRDs7O2dDQUVXO0FBQ1YsV0FBS0osTUFBTCxDQUFZSyxTQUFaLENBQXNCQyxHQUF0QixDQUEwQixRQUExQjtBQUNEOzs7RUFsQitCQyxrQjs7SUFxQjVCQyxhOzs7QUFDSiwyQkFBcUI7QUFBQTs7QUFBQTs7QUFBQSx1Q0FBTlAsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUEsZ0xBQ1ZBLElBRFU7O0FBRW5CLFdBQUtRLEVBQUwsR0FBVSxFQUFHQyxLQUFLQyxNQUFMLEtBQWdCLEdBQWhCLEdBQXNCLEdBQXpCLElBQWdDLEdBQTFDO0FBRm1CO0FBR3BCOzs7OzJCQUVNQyxFLEVBQUk7QUFDVCxXQUFLSCxFQUFMLElBQVcsS0FBWDtBQUNBLFdBQUtJLENBQUwsSUFBVUgsS0FBS0MsTUFBTCxLQUFnQixHQUFoQixHQUFzQixHQUFoQztBQUNBLFdBQUtHLENBQUwsSUFBVyxLQUFLTCxFQUFMLEdBQVVHLEVBQXJCOztBQUVBLGlKQUFhQSxFQUFiO0FBQ0Q7OztFQVp5QkcsaUI7O0lBZXRCQyx1Qjs7O0FBQ0osbUNBQVlDLFlBQVosRUFBMEJDLFVBQTFCLEVBQXNDO0FBQUE7O0FBQUE7O0FBR3BDLFdBQUtELFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0EsV0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxXQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNBLFdBQUtDLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUEsV0FBS0MsU0FBTCxHQUFpQixDQUFqQjtBQUNBLFdBQUtDLFFBQUwsR0FBZ0IsSUFBSUMsS0FBSixDQUFVLENBQVYsQ0FBaEI7QUFDQTtBQUNBLFNBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLE9BQUtILFNBQXpCLEVBQW9DRyxHQUFwQztBQUNFLGFBQUtGLFFBQUwsQ0FBY0UsQ0FBZCxJQUFtQixFQUFuQjtBQURGLEtBWG9DO0FBYXJDOzs7O21DQUVjO0FBQ2IsVUFBTUMsU0FBUyxLQUFLUixZQUFwQjtBQUNBLFVBQU1TLGFBQWFoQixLQUFLaUIsS0FBTCxDQUFXakIsS0FBS0MsTUFBTCxLQUFnQmMsT0FBT0csTUFBUCxDQUFjQyxNQUF6QyxDQUFuQjtBQUNBLFVBQU1DLFFBQVFMLE9BQU9HLE1BQVAsQ0FBY0YsVUFBZCxDQUFkOztBQUVBLFVBQU1LLFFBQVFOLE9BQU9PLE1BQVAsQ0FBY0YsS0FBZCxFQUFxQkcsYUFBbkM7QUFDQSxVQUFNQyxnQkFBZ0JULE9BQU9PLE1BQVAsQ0FBY0YsS0FBZCxFQUFxQkksYUFBM0M7QUFDQSxVQUFNQyxZQUFZekIsS0FBS2lCLEtBQUwsQ0FBV0YsT0FBT1csUUFBUCxDQUFnQkMsS0FBaEIsR0FBd0IsQ0FBbkMsQ0FBbEI7QUFDQSxVQUFNQyxhQUFhNUIsS0FBS2lCLEtBQUwsQ0FBV0YsT0FBT1csUUFBUCxDQUFnQkcsTUFBaEIsR0FBeUIsQ0FBcEMsQ0FBbkI7QUFDQSxVQUFNQyxjQUFjZixPQUFPZ0IsYUFBM0I7O0FBRUEsVUFBTUMsWUFBWWpCLE9BQU9rQixjQUFQLEdBQXdCLENBQUNqQyxLQUFLQyxNQUFMLEtBQWdCLENBQWhCLEdBQW9CLENBQXJCLElBQTBCLElBQTFCLEdBQWlDLEtBQUtTLGFBQWhGO0FBQ0EsVUFBTXdCLE9BQU9sQyxLQUFLbUMsR0FBTCxDQUFTLEtBQUtDLFdBQWQsRUFBMkIsS0FBS0MsWUFBaEMsSUFBZ0RMLFNBQTdEO0FBQ0EsVUFBTTdCLElBQUlILEtBQUtDLE1BQUwsS0FBZ0IsS0FBS21DLFdBQS9CO0FBQ0EsVUFBTWhDLElBQUksS0FBS2lDLFlBQUwsR0FBb0JILElBQTlCOztBQUVBLFVBQU1JLFVBQVUsSUFBSXhDLGFBQUosQ0FBa0JzQixLQUFsQixFQUF5QkMsS0FBekIsRUFBZ0NHLGFBQWhDLEVBQStDQyxTQUEvQyxFQUEwREcsVUFBMUQsRUFBc0VFLFdBQXRFLEVBQW1GSSxJQUFuRixFQUF5RkEsSUFBekYsRUFBK0YvQixDQUEvRixFQUFrR0MsQ0FBbEcsQ0FBaEI7O0FBRUEsVUFBTW1DLFNBQVN2QyxLQUFLaUIsS0FBTCxDQUFXakIsS0FBS0MsTUFBTCxLQUFnQixLQUFLVSxTQUFoQyxDQUFmO0FBQ0EsV0FBS0MsUUFBTCxDQUFjMkIsTUFBZCxFQUFzQkMsSUFBdEIsQ0FBMkJGLE9BQTNCO0FBQ0Q7OztpQ0FFWTtBQUNYLFdBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUs3QixRQUFMLENBQWNPLE1BQWxDLEVBQTBDc0IsR0FBMUMsRUFBK0M7QUFDN0MsWUFBTUMsUUFBUSxLQUFLOUIsUUFBTCxDQUFjNkIsQ0FBZCxDQUFkOztBQUVBLGFBQUssSUFBSTNCLElBQUksQ0FBUixFQUFXNkIsSUFBSUQsTUFBTXZCLE1BQTFCLEVBQWtDTCxJQUFJNkIsQ0FBdEMsRUFBeUM3QixHQUF6QyxFQUE4QztBQUM1QyxjQUFNd0IsVUFBVUksTUFBTTVCLENBQU4sQ0FBaEI7QUFDQXdCLGtCQUFRTSxPQUFSLEdBQWtCLElBQWxCO0FBQ0Q7QUFDRjs7QUFFRCxXQUFLbkMsT0FBTCxHQUFlLElBQWY7QUFDRDs7OzJCQUVNUCxFLEVBQUk7QUFDVCxVQUFJMkMsVUFBVSxJQUFkOztBQUVBLFdBQUssSUFBSUosSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUs5QixTQUF6QixFQUFvQzhCLEdBQXBDLEVBQXlDO0FBQ3ZDLFlBQU1DLFFBQVEsS0FBSzlCLFFBQUwsQ0FBYzZCLENBQWQsQ0FBZDs7QUFFQSxhQUFLLElBQUkzQixJQUFJNEIsTUFBTXZCLE1BQU4sR0FBZSxDQUE1QixFQUErQkwsS0FBSyxDQUFwQyxFQUF1Q0EsR0FBdkMsRUFBNEM7QUFDMUMsY0FBTXdCLFVBQVVJLE1BQU01QixDQUFOLENBQWhCO0FBQ0F3QixrQkFBUVEsTUFBUixDQUFlNUMsRUFBZjs7QUFFQTtBQUNBLGNBQUlvQyxRQUFRbEMsQ0FBUixHQUFZLEVBQUdrQyxRQUFRUyxNQUFSLEdBQWlCLEVBQXBCLENBQWhCLEVBQ0VULFFBQVFVLE1BQVIsR0FBaUIsSUFBakI7O0FBRUYsY0FBSVYsUUFBUVUsTUFBWixFQUNFTixNQUFNTyxNQUFOLENBQWFuQyxDQUFiLEVBQWdCLENBQWhCO0FBQ0g7O0FBRUQsWUFBSTRCLE1BQU12QixNQUFOLEtBQWlCLENBQXJCLEVBQ0UwQixVQUFVLEtBQVY7QUFDSDs7QUFFRCxVQUFJLEtBQUtwQyxPQUFMLElBQWdCb0MsT0FBcEIsRUFDRSxLQUFLckMsVUFBTDtBQUNIOzs7MkJBRU0wQyxHLEVBQUs7QUFDVixXQUFLLElBQUlULElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLOUIsU0FBekIsRUFBb0M4QixHQUFwQyxFQUF5QztBQUN2QyxZQUFNQyxRQUFRLEtBQUs5QixRQUFMLENBQWM2QixDQUFkLENBQWQ7O0FBRUEsYUFBSyxJQUFJM0IsSUFBSSxDQUFSLEVBQVc2QixJQUFJRCxNQUFNdkIsTUFBMUIsRUFBa0NMLElBQUk2QixDQUF0QyxFQUF5QzdCLEdBQXpDO0FBQ0U0QixnQkFBTTVCLENBQU4sRUFBU3FDLE1BQVQsQ0FBZ0JELEdBQWhCO0FBREY7QUFFRDtBQUNGOzs7RUFwRm1DRSx3Qjs7SUF1RmhDQyxvQjtBQUNKLGdDQUFZQyxVQUFaLEVBQXdCQyxXQUF4QixFQUFxQztBQUFBOztBQUNuQyxTQUFLRCxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJBLFdBQW5COztBQUVBLFNBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxTQUFLQyxpQkFBTCxHQUF5QixJQUF6Qjs7QUFFQSxTQUFLQyxhQUFMLEdBQXFCLEtBQUtBLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QixLQUFLQSxlQUFMLENBQXFCRCxJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNBLFNBQUtFLDJCQUFMLEdBQW1DLEtBQUtBLDJCQUFMLENBQWlDRixJQUFqQyxDQUFzQyxJQUF0QyxDQUFuQztBQUNBLFNBQUtHLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxDQUFpQkgsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLSSxhQUFMLEdBQXFCLEtBQUtBLGFBQUwsQ0FBbUJKLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBS0ssYUFBTCxHQUFxQixLQUFLQSxhQUFMLENBQW1CTCxJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUtNLFdBQUwsR0FBbUIsS0FBS0EsV0FBTCxDQUFpQk4sSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLTyxpQkFBTCxHQUF5QixLQUFLQSxpQkFBTCxDQUF1QlAsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7O0FBRUEsU0FBS1EsUUFBTCxHQUFnQixJQUFJN0QsdUJBQUosQ0FBNEIsS0FBS2dELFVBQUwsQ0FBZ0IvQyxZQUE1QyxFQUEwRCxLQUFLdUQsV0FBL0QsQ0FBaEI7O0FBRUEsU0FBS00sS0FBTCxHQUFhLElBQUlDLDhCQUFKLENBQ1gsS0FBS2YsVUFBTCxDQUFnQmdCLHFCQUFoQixDQUFzQ0MsSUFEM0IsRUFFWCxLQUFLakIsVUFBTCxDQUFnQmtCLGtCQUFoQixDQUFtQ0MsR0FBbkMsQ0FBdUMsbUJBQXZDLENBRlcsRUFHWCxLQUFLbkIsVUFBTCxDQUFnQm9CLG1CQUFoQixFQUhXLENBQWI7QUFLRDs7Ozs0QkFFTztBQUNOLFdBQUtDLElBQUwsR0FBWSxJQUFJekYsbUJBQUosQ0FBd0JELFFBQXhCLEVBQWtDO0FBQzVDMkYsMEJBQWtCLElBRDBCO0FBRTVDQyxlQUFPLHNCQUFjLEVBQWQsRUFBa0IsS0FBS3RCLFdBQUwsQ0FBaUJzQixLQUFuQyxDQUZxQztBQUc1Q0Msa0JBQVUsTUFIa0M7QUFJNUNDLG9CQUFZO0FBSmdDLE9BQWxDLEVBS1Q7QUFDREMsb0JBQVksS0FBS2pCLGFBRGhCLENBQytCO0FBRC9CLE9BTFMsRUFPVDtBQUNEa0IsbUJBQVcsQ0FBQyx5QkFBRCxFQUE0QixZQUE1QjtBQURWLE9BUFMsQ0FBWjs7QUFXQSxXQUFLTixJQUFMLENBQVV4QixNQUFWO0FBQ0EsV0FBS3dCLElBQUwsQ0FBVU8sSUFBVjtBQUNBLFdBQUtQLElBQUwsQ0FBVVEsUUFBVixDQUFtQixLQUFLN0IsVUFBTCxDQUFnQnFCLElBQWhCLENBQXFCUyxpQkFBckIsRUFBbkI7O0FBRUEsV0FBS1QsSUFBTCxDQUFVVSxZQUFWLENBQXVCLFVBQUNuQyxHQUFELEVBQU1oRCxFQUFOLEVBQVV5QixLQUFWLEVBQWlCRSxNQUFqQixFQUE0QjtBQUNqRHFCLFlBQUlvQyxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQjNELEtBQXBCLEVBQTJCRSxNQUEzQjtBQUNELE9BRkQ7O0FBSUEsV0FBSzhDLElBQUwsQ0FBVVksV0FBVixDQUFzQixLQUFLcEIsUUFBM0I7O0FBRUE7QUFDQSxXQUFLVCxhQUFMOztBQUVBLFVBQU04QixlQUFlLEtBQUtsQyxVQUFMLENBQWdCa0MsWUFBckM7QUFDQUEsbUJBQWFDLGdCQUFiLENBQThCLDRCQUE5QixFQUE0RCxLQUFLekIsYUFBakU7QUFDQXdCLG1CQUFhQyxnQkFBYixDQUE4QiwrQkFBOUIsRUFBK0QsS0FBSzdCLGVBQXBFO0FBQ0E0QixtQkFBYUMsZ0JBQWIsQ0FBOEIsK0JBQTlCLEVBQStELEtBQUs1QiwyQkFBcEU7QUFDQTJCLG1CQUFhQyxnQkFBYixDQUE4QiwwQkFBOUIsRUFBMEQsS0FBS3hCLFdBQS9EO0FBQ0F1QixtQkFBYUMsZ0JBQWIsQ0FBOEIsZ0NBQTlCLEVBQWdFLEtBQUt2QixpQkFBckU7QUFDRDs7OzJCQUVNO0FBQ0x3QixtQkFBYSxLQUFLbEMsYUFBbEI7O0FBRUEsV0FBS21CLElBQUwsQ0FBVXZGLEdBQVYsQ0FBY08sU0FBZCxDQUF3QmdHLE1BQXhCLENBQStCLFlBQS9CO0FBQ0EsV0FBS2hCLElBQUwsQ0FBVXZGLEdBQVYsQ0FBY08sU0FBZCxDQUF3QkMsR0FBeEIsQ0FBNEIsWUFBNUI7QUFDQSxXQUFLK0UsSUFBTCxDQUFVaUIsU0FBVjs7QUFFQSxXQUFLekIsUUFBTCxDQUFjMEIsVUFBZDs7QUFFQSxVQUFNTCxlQUFlLEtBQUtsQyxVQUFMLENBQWdCa0MsWUFBckM7QUFDQUEsbUJBQWFNLG1CQUFiLENBQWlDLDRCQUFqQyxFQUErRCxLQUFLOUIsYUFBcEU7QUFDQXdCLG1CQUFhTSxtQkFBYixDQUFpQywrQkFBakMsRUFBa0UsS0FBS2xDLGVBQXZFO0FBQ0E0QixtQkFBYU0sbUJBQWIsQ0FBaUMsK0JBQWpDLEVBQWtFLEtBQUtqQywyQkFBdkU7QUFDQTJCLG1CQUFhTSxtQkFBYixDQUFpQywwQkFBakMsRUFBNkQsS0FBSzdCLFdBQWxFO0FBQ0F1QixtQkFBYU0sbUJBQWIsQ0FBaUMsZ0NBQWpDLEVBQW1FLEtBQUs1QixpQkFBeEU7QUFDRDs7O2tDQUVhO0FBQ1osV0FBS1MsSUFBTCxDQUFVb0IsY0FBVixDQUF5QixLQUFLNUIsUUFBOUI7QUFDQSxXQUFLUSxJQUFMLENBQVVnQixNQUFWO0FBQ0Q7OztnQ0FFV0ssSyxFQUFPO0FBQ2pCLFdBQUtyQixJQUFMLENBQVVzQixLQUFWLENBQWdCbkIsUUFBaEIsR0FBMkJrQixLQUEzQjtBQUNBLFdBQUtyQixJQUFMLENBQVV4QixNQUFWLENBQWlCLFlBQWpCO0FBQ0Q7OztzQ0FFaUI2QyxLLEVBQU87QUFDdkIsY0FBUUEsS0FBUjtBQUNFLGFBQUssTUFBTDtBQUNFLGVBQUtyQixJQUFMLENBQVVzQixLQUFWLENBQWdCbEIsVUFBaEIsR0FBNkIsRUFBN0I7QUFDQTtBQUNGLGFBQUssUUFBTDtBQUNFLGNBQU03RCxTQUFTLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsS0FBM0IsQ0FBZjtBQUNBLGNBQU1FLFFBQVFGLE9BQU9sQixLQUFLaUIsS0FBTCxDQUFXakIsS0FBS0MsTUFBTCxLQUFnQmlCLE9BQU9DLE1BQWxDLENBQVAsQ0FBZDtBQUNBLGVBQUt3RCxJQUFMLENBQVVzQixLQUFWLENBQWdCbEIsVUFBaEIsR0FBNkIzRCxLQUE3QjtBQUNBO0FBQ0Y7QUFDRSxlQUFLdUQsSUFBTCxDQUFVc0IsS0FBVixDQUFnQmxCLFVBQWhCLEdBQTZCaUIsS0FBN0I7QUFDQTtBQVhKOztBQWNBLFdBQUtyQixJQUFMLENBQVV4QixNQUFWLENBQWlCLFlBQWpCO0FBQ0Q7OztnREFFMkI2QyxLLEVBQU87QUFDakMsV0FBSzdCLFFBQUwsQ0FBY3pELGFBQWQsR0FBOEJzRixLQUE5QjtBQUNEOzs7b0NBRWVBLEssRUFBTztBQUNyQixXQUFLdkMsaUJBQUwsR0FBeUJ1QyxLQUF6Qjs7QUFFQU4sbUJBQWEsS0FBS2xDLGFBQWxCO0FBQ0EsV0FBS0EsYUFBTCxHQUFxQjBDLFdBQVcsS0FBS3hDLGFBQWhCLEVBQStCLEtBQUt5QyxjQUFMLEVBQS9CLENBQXJCO0FBQ0Q7OztvQ0FFZTtBQUNkLFdBQUtoQyxRQUFMLENBQWNpQyxZQUFkOztBQUVBVixtQkFBYSxLQUFLbEMsYUFBbEI7QUFDQSxXQUFLQSxhQUFMLEdBQXFCMEMsV0FBVyxLQUFLeEMsYUFBaEIsRUFBK0IsS0FBS3lDLGNBQUwsRUFBL0IsQ0FBckI7QUFDRDs7O3FDQUVnQjtBQUNmLFVBQU1FLGVBQWUsS0FBSzVDLGlCQUFMLEdBQXlCLENBQTlDO0FBQ0E7QUFDQSxVQUFNNkMsUUFBUXRHLEtBQUt1RyxHQUFMLENBQVMsSUFBVCxFQUFlRixlQUFlQSxlQUFlckcsS0FBS0MsTUFBTCxFQUE3QyxDQUFkLENBSGUsQ0FHNEQ7QUFDM0UsYUFBT3FHLFFBQVEsSUFBZjtBQUNEOzs7a0NBRWFFLEMsRUFBRztBQUNmLFVBQU1DLFFBQVFELEVBQUVFLE9BQUYsQ0FBVSxDQUFWLENBQWQ7QUFDQSxVQUFNdkcsSUFBSXNHLE1BQU1FLE9BQWhCO0FBQ0EsVUFBTXZHLElBQUlxRyxNQUFNRyxPQUFoQjs7QUFFQSxXQUFLQyxRQUFMLENBQWMsS0FBSzFDLFFBQUwsQ0FBY3ZELFFBQTVCLEVBQXNDVCxDQUF0QyxFQUF5Q0MsQ0FBekM7QUFDRDs7OzZCQUVRUSxRLEVBQVVULEMsRUFBR0MsQyxFQUFHO0FBQ3ZCO0FBQ0EsV0FBSyxJQUFJcUMsSUFBSTdCLFNBQVNPLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NzQixLQUFLLENBQXZDLEVBQTBDQSxHQUExQyxFQUErQztBQUM3QyxZQUFNQyxRQUFROUIsU0FBUzZCLENBQVQsQ0FBZDs7QUFFQSxhQUFLLElBQUkzQixJQUFJLENBQVIsRUFBVzZCLElBQUlELE1BQU12QixNQUExQixFQUFrQ0wsSUFBSTZCLENBQXRDLEVBQXlDN0IsR0FBekMsRUFBOEM7QUFDNUMsY0FBTXdCLFVBQVVJLE1BQU01QixDQUFOLENBQWhCO0FBQ0EsY0FBTWdHLEtBQUt4RSxRQUFRbkMsQ0FBUixHQUFZQSxDQUF2QjtBQUNBLGNBQU00RyxLQUFLekUsUUFBUWxDLENBQVIsR0FBWUEsQ0FBdkI7QUFDQSxjQUFNNEcsV0FBV2hILEtBQUtpSCxJQUFMLENBQVVILEtBQUtBLEVBQUwsR0FBVUMsS0FBS0EsRUFBekIsQ0FBakI7O0FBRUEsY0FBSUMsV0FBVzFFLFFBQVFTLE1BQXZCLEVBQStCO0FBQzdCVCxvQkFBUU0sT0FBUixHQUFrQixJQUFsQjtBQUNBLGlCQUFLc0UsWUFBTCxDQUFrQjVFLFFBQVFsQixLQUExQjtBQUNBLGlCQUFLK0YsY0FBTCxDQUFvQjdFLFFBQVFsQixLQUE1QixFQUFtQ2tCLFFBQVFuQyxDQUEzQyxFQUE4Q21DLFFBQVFsQyxDQUF0RDtBQUNBO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7OztpQ0FFWWdCLEssRUFBTztBQUNsQixVQUFJLEtBQUt1RCxJQUFMLENBQVVzQixLQUFWLENBQWdCckIsZ0JBQWhCLEtBQXFDLElBQXpDLEVBQStDO0FBQzdDLGFBQUtELElBQUwsQ0FBVXNCLEtBQVYsQ0FBZ0JyQixnQkFBaEIsR0FBbUMsS0FBbkM7QUFDQSxhQUFLRCxJQUFMLENBQVV4QixNQUFWLENBQWlCLGlCQUFqQjtBQUNEOztBQUVEO0FBQ0EsV0FBS0ksV0FBTCxDQUFpQnNCLEtBQWpCLENBQXVCekQsS0FBdkIsS0FBaUMsQ0FBakM7QUFDQTtBQUNBLFdBQUt1RCxJQUFMLENBQVVzQixLQUFWLENBQWdCcEIsS0FBaEIsQ0FBc0J6RCxLQUF0QixLQUFnQyxDQUFoQztBQUNBLFdBQUt1RCxJQUFMLENBQVV4QixNQUFWLENBQWlCLFFBQWpCO0FBQ0Q7OzttQ0FFYy9CLEssRUFBT2pCLEMsRUFBR0MsQyxFQUFHO0FBQzFCLFdBQUtnRSxLQUFMLENBQVdnRCxPQUFYLENBQW1CaEcsS0FBbkI7QUFDRDs7O2tDQUVhNEUsSyxFQUFPO0FBQ25CLFdBQUs1QixLQUFMLENBQVdpRCxrQkFBWCxDQUE4QnJCLEtBQTlCO0FBQ0Q7Ozs7O2tCQUdZM0Msb0IiLCJmaWxlIjoiS2lsbFRoZUJhbGxvb25zU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNWaWV3LCBDYW52YXMyZFJlbmRlcmVyIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IEJhbGxvb24gZnJvbSAnLi4vcmVuZGVyZXJzL0JhbGxvb24nO1xuaW1wb3J0IEtpbGxUaGVCYWxsb29uc1N5bnRoIGZyb20gJy4uL2F1ZGlvL0tpbGxUaGVCYWxsb29uc1N5bnRoJztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2NvcmVcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJibHVlXCI+PCU9IHNjb3JlLmJsdWUgJT48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwicGlua1wiPjwlPSBzY29yZS5waW5rICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInllbGxvd1wiPjwlPSBzY29yZS55ZWxsb3cgJT48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwicmVkXCI+PCU9IHNjb3JlLnJlZCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPlxuICAgICAgPCUgaWYgKHNob3dJbnN0cnVjdGlvbnMpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJhbGlnbi1jZW50ZXIgc29mdC1ibGlua1wiPkhpdCB0aGUgYmFsbG9vbnMhPC9wPlxuICAgICAgPCUgfSAlPlxuICAgICAgPGRpdiBjbGFzcz1cInNob3ctdGV4dFwiPlxuICAgICAgPCUgaWYgKHNob3dUZXh0ICE9PSAnbm9uZScpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJhbGlnbi1jZW50ZXIgc29mdC1ibGlua1wiPjwlPSBzaG93VGV4dCAlPjwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICAgIDwlIGlmIChjbGlja0NvbG9yICE9PSAnJykgeyAlPlxuICAgICAgICA8cCBjbGFzcz1cImFsaWduLWNlbnRlclwiPkNsaWNrIG9uIDwlPSBjbGlja0NvbG9yICU+ITwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbmNsYXNzIEtpbGxUaGVCYWxsb29uc1ZpZXcgZXh0ZW5kcyBDYW52YXNWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcbiAgICB0aGlzLiRjYW52YXMgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcbiAgICB0aGlzLiRzY29yZSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zY29yZScpO1xuICB9XG5cbiAgb25SZXNpemUoLi4uYXJncykge1xuICAgIHN1cGVyLm9uUmVzaXplKC4uLmFyZ3MpO1xuICAgIHRoaXMudXBkYXRlQm91bmRpbmdSZWN0KCk7XG4gIH1cblxuICB1cGRhdGVCb3VuZGluZ1JlY3QoKSB7XG4gICAgdGhpcy5jYW52YXNCb3VuZGluZ0NsaWVudFJlY3QgPSB0aGlzLiRjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH07XG5cbiAgaGlkZVNjb3JlKCkge1xuICAgIHRoaXMuJHNjb3JlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICB9XG59XG5cbmNsYXNzIFJpc2luZ0JhbGxvb24gZXh0ZW5kcyBCYWxsb29uIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMudnkgPSAtIChNYXRoLnJhbmRvbSgpICogMC40ICsgMC42KSAqIDIwMDtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIHRoaXMudnkgKj0gMS4wMDI7XG4gICAgdGhpcy54ICs9IE1hdGgucmFuZG9tKCkgKiAwLjIgLSAwLjE7XG4gICAgdGhpcy55ICs9ICh0aGlzLnZ5ICogZHQpO1xuXG4gICAgc3VwZXIudXBkYXRlKGR0KTtcbiAgfVxufVxuXG5jbGFzcyBLaWxsVGhlQmFsbG9vbnNSZW5kZXJlciBleHRlbmRzIENhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzcHJpdGVDb25maWcsIG9uRXhwbG9kZWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zcHJpdGVDb25maWcgPSBzcHJpdGVDb25maWc7XG4gICAgdGhpcy5vbkV4cGxvZGVkID0gb25FeHBsb2RlZDtcbiAgICB0aGlzLmlzRW5kZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNpemVEaXZlcnNpdHkgPSAwO1xuXG4gICAgdGhpcy5udW1aSW5kZXggPSAzO1xuICAgIHRoaXMuYmFsbG9vbnMgPSBuZXcgQXJyYXkoMyk7XG4gICAgLy8gcHJlcGFyZSBzdGFjayBmb3IgZWFjaCB6LWluZGV4ZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtWkluZGV4OyBpKyspXG4gICAgICB0aGlzLmJhbGxvb25zW2ldID0gW107XG4gIH1cblxuICBzcGF3bkJhbGxvb24oKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgY29uc3QgY29sb3JJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbmZpZy5jb2xvcnMubGVuZ3RoKTtcbiAgICBjb25zdCBjb2xvciA9IGNvbmZpZy5jb2xvcnNbY29sb3JJbmRleF07XG5cbiAgICBjb25zdCBpbWFnZSA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmhhbGZTaXplSW1hZ2U7XG4gICAgY29uc3QgY2xpcFBvc2l0aW9ucyA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmNsaXBQb3NpdGlvbnM7XG4gICAgY29uc3QgY2xpcFdpZHRoID0gTWF0aC5mbG9vcihjb25maWcuY2xpcFNpemUud2lkdGggLyAyKTtcbiAgICBjb25zdCBjbGlwSGVpZ2h0ID0gTWF0aC5mbG9vcihjb25maWcuY2xpcFNpemUuaGVpZ2h0IC8gMik7XG4gICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcblxuICAgIGNvbnN0IHNpemVSYXRpbyA9IGNvbmZpZy5zbWFsbFNpemVSYXRpbyArIChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogMC4xNSAqIHRoaXMuc2l6ZURpdmVyc2l0eTtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4odGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpICogc2l6ZVJhdGlvO1xuICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCB5ID0gdGhpcy5jYW52YXNIZWlnaHQgKyBzaXplO1xuXG4gICAgY29uc3QgYmFsbG9vbiA9IG5ldyBSaXNpbmdCYWxsb29uKGNvbG9yLCBpbWFnZSwgY2xpcFBvc2l0aW9ucywgY2xpcFdpZHRoLCBjbGlwSGVpZ2h0LCByZWZyZXNoUmF0ZSwgc2l6ZSwgc2l6ZSwgeCwgeSk7XG5cbiAgICBjb25zdCB6SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLm51bVpJbmRleCk7XG4gICAgdGhpcy5iYWxsb29uc1t6SW5kZXhdLnB1c2goYmFsbG9vbik7XG4gIH1cblxuICBleHBsb2RlQWxsKCkge1xuICAgIGZvciAobGV0IHogPSAwOyB6IDwgdGhpcy5iYWxsb29ucy5sZW5ndGg7IHorKykge1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmJhbGxvb25zW3pdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxheWVyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCBiYWxsb29uID0gbGF5ZXJbaV07XG4gICAgICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pc0VuZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIGxldCBpc0VtcHR5ID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IHogPSAwOyB6IDwgdGhpcy5udW1aSW5kZXg7IHorKykge1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmJhbGxvb25zW3pdO1xuXG4gICAgICBmb3IgKGxldCBpID0gbGF5ZXIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgYmFsbG9vbiA9IGxheWVyW2ldO1xuICAgICAgICBiYWxsb29uLnVwZGF0ZShkdCk7XG5cbiAgICAgICAgLy8gaWYgb3V0c2lkZSB0aGUgc2NyZWVuXG4gICAgICAgIGlmIChiYWxsb29uLnkgPCAtIChiYWxsb29uLnJhZGl1cyArIDEwKSlcbiAgICAgICAgICBiYWxsb29uLmlzRGVhZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGJhbGxvb24uaXNEZWFkKVxuICAgICAgICAgIGxheWVyLnNwbGljZShpLCAxKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxheWVyLmxlbmd0aCAhPT0gMClcbiAgICAgICAgaXNFbXB0eSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRW5kZWQgJiYgaXNFbXB0eSlcbiAgICAgIHRoaXMub25FeHBsb2RlZCgpO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGZvciAobGV0IHogPSAwOyB6IDwgdGhpcy5udW1aSW5kZXg7IHorKykge1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmJhbGxvb25zW3pdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxheWVyLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgICAgbGF5ZXJbaV0ucmVuZGVyKGN0eCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEtpbGxUaGVCYWxsb29uc1N0YXRlIHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgZ2xvYmFsU3RhdGUpIHtcbiAgICB0aGlzLmV4cGVyaWVuY2UgPSBleHBlcmllbmNlO1xuICAgIHRoaXMuZ2xvYmFsU3RhdGUgPSBnbG9iYWxTdGF0ZTtcblxuICAgIHRoaXMuX3NwYXduVGltZW91dCA9IG51bGw7XG4gICAgdGhpcy5fbWF4U3Bhd25JbnRlcnZhbCA9IG51bGw7XG5cbiAgICB0aGlzLl9zcGF3bkJhbGxvb24gPSB0aGlzLl9zcGF3bkJhbGxvb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl91cGRhdGVNYXhTcGF3biA9IHRoaXMuX3VwZGF0ZU1heFNwYXduLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkgPSB0aGlzLl91cGRhdGVCYWxsb29uU2l6ZURpdmVyc2l0eS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRXhwbG9kZWQgPSB0aGlzLl9vbkV4cGxvZGVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Ub3VjaFN0YXJ0ID0gdGhpcy5fb25Ub3VjaFN0YXJ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TYW1wbGVzU2V0ID0gdGhpcy5fb25TYW1wbGVzU2V0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25TaG93VGV4dCA9IHRoaXMuX29uU2hvd1RleHQuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWNrQ29sb3JUZXh0ID0gdGhpcy5fb25DbGlja0NvbG9yVGV4dC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBLaWxsVGhlQmFsbG9vbnNSZW5kZXJlcih0aGlzLmV4cGVyaWVuY2Uuc3ByaXRlQ29uZmlnLCB0aGlzLl9vbkV4cGxvZGVkKTtcblxuICAgIHRoaXMuc3ludGggPSBuZXcgS2lsbFRoZUJhbGxvb25zU3ludGgoXG4gICAgICB0aGlzLmV4cGVyaWVuY2Uua2lsbFRoZUJhbGxvb25zQ29uZmlnLnNldHMsXG4gICAgICB0aGlzLmV4cGVyaWVuY2UuYXVkaW9CdWZmZXJNYW5hZ2VyLmdldCgna2lsbC10aGUtYmFsbG9vbnMnKSxcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5nZXRBdWRpb0Rlc3RpbmF0aW9uKClcbiAgICApO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgdGhpcy52aWV3ID0gbmV3IEtpbGxUaGVCYWxsb29uc1ZpZXcodGVtcGxhdGUsIHtcbiAgICAgIHNob3dJbnN0cnVjdGlvbnM6IHRydWUsXG4gICAgICBzY29yZTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nbG9iYWxTdGF0ZS5zY29yZSksXG4gICAgICBzaG93VGV4dDogJ25vbmUnLFxuICAgICAgY2xpY2tDb2xvcjogJycsXG4gICAgfSwge1xuICAgICAgdG91Y2hzdGFydDogdGhpcy5fb25Ub3VjaFN0YXJ0LCAvLyBidWcgd2hlbiBjb21taW5nIGZyb20gYXZvaWQgdGhlIHJhaW5cbiAgICB9LCB7XG4gICAgICBjbGFzc05hbWU6IFsna2lsbC10aGUtYmFsbG9vbnMtc3RhdGUnLCAnZm9yZWdyb3VuZCddLFxuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHRoaXMudmlldy5zaG93KCk7XG4gICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuZXhwZXJpZW5jZS52aWV3LmdldFN0YXRlQ29udGFpbmVyKCkpO1xuXG4gICAgdGhpcy52aWV3LnNldFByZVJlbmRlcigoY3R4LCBkdCwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIC8vIGluaXQgc3Bhd25cbiAgICB0aGlzLl9zcGF3bkJhbGxvb24oKTtcblxuICAgIGNvbnN0IHNoYXJlZFBhcmFtcyA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXM7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzYW1wbGVzU2V0JywgdGhpcy5fb25TYW1wbGVzU2V0KTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOnNwYXduSW50ZXJ2YWwnLCB0aGlzLl91cGRhdGVNYXhTcGF3bik7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzaXplRGl2ZXJzaXR5JywgdGhpcy5fdXBkYXRlQmFsbG9vblNpemVEaXZlcnNpdHkpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2hvd1RleHQnLCB0aGlzLl9vblNob3dUZXh0KTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOmNsaWNrQ29sb3JUZXh0JywgdGhpcy5fb25DbGlja0NvbG9yVGV4dCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9zcGF3blRpbWVvdXQpO1xuXG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JlZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LmhpZGVTY29yZSgpO1xuXG4gICAgdGhpcy5yZW5kZXJlci5leHBsb2RlQWxsKCk7XG5cbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2FtcGxlc1NldCcsIHRoaXMuX29uU2FtcGxlc1NldCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpzcGF3bkludGVydmFsJywgdGhpcy5fdXBkYXRlTWF4U3Bhd24pO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdraWxsVGhlQmFsbG9vbnM6c2l6ZURpdmVyc2l0eScsIHRoaXMuX3VwZGF0ZUJhbGxvb25TaXplRGl2ZXJzaXR5KTtcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcigna2lsbFRoZUJhbGxvb25zOnNob3dUZXh0JywgdGhpcy5fb25TaG93VGV4dCk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2tpbGxUaGVCYWxsb29uczpjbGlja0NvbG9yVGV4dCcsIHRoaXMuX29uQ2xpY2tDb2xvclRleHQpO1xuICB9XG5cbiAgX29uRXhwbG9kZWQoKSB7XG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgfVxuXG4gIF9vblNob3dUZXh0KHZhbHVlKSB7XG4gICAgdGhpcy52aWV3Lm1vZGVsLnNob3dUZXh0ID0gdmFsdWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNob3ctdGV4dCcpO1xuICB9XG5cbiAgX29uQ2xpY2tDb2xvclRleHQodmFsdWUpIHtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVsLmNsaWNrQ29sb3IgPSAnJztcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3JhbmRvbSc6XG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IFsnYmx1ZScsICdwaW5rJywgJ3llbGxvdycsICdyZWQnXTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBjb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sb3JzLmxlbmd0aCldO1xuICAgICAgICB0aGlzLnZpZXcubW9kZWwuY2xpY2tDb2xvciA9IGNvbG9yO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMudmlldy5tb2RlbC5jbGlja0NvbG9yID0gdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zaG93LXRleHQnKTtcbiAgfVxuXG4gIF91cGRhdGVCYWxsb29uU2l6ZURpdmVyc2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucmVuZGVyZXIuc2l6ZURpdmVyc2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgX3VwZGF0ZU1heFNwYXduKHZhbHVlKSB7XG4gICAgdGhpcy5fbWF4U3Bhd25JbnRlcnZhbCA9IHZhbHVlO1xuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3NwYXduVGltZW91dCk7XG4gICAgdGhpcy5fc3Bhd25UaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLl9zcGF3bkJhbGxvb24sIHRoaXMuX2dldFNwYXduRGVsYXkoKSk7XG4gIH1cblxuICBfc3Bhd25CYWxsb29uKCkge1xuICAgIHRoaXMucmVuZGVyZXIuc3Bhd25CYWxsb29uKCk7XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fc3Bhd25UaW1lb3V0KTtcbiAgICB0aGlzLl9zcGF3blRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuX3NwYXduQmFsbG9vbiwgdGhpcy5fZ2V0U3Bhd25EZWxheSgpKTtcbiAgfVxuXG4gIF9nZXRTcGF3bkRlbGF5KCkge1xuICAgIGNvbnN0IGhhbGZNYXhTcGF3biA9IHRoaXMuX21heFNwYXduSW50ZXJ2YWwgLyAyO1xuICAgIC8vIG1pbiBkZWxheSB0byA1MG1zXG4gICAgY29uc3QgZGVsYXkgPSBNYXRoLm1heCgwLjA1LCBoYWxmTWF4U3Bhd24gKyBoYWxmTWF4U3Bhd24gKiBNYXRoLnJhbmRvbSgpKTsgLy8gc2Vjb25kc1xuICAgIHJldHVybiBkZWxheSAqIDEwMDA7XG4gIH1cblxuICBfb25Ub3VjaFN0YXJ0KGUpIHtcbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICBjb25zdCB4ID0gdG91Y2guY2xpZW50WDtcbiAgICBjb25zdCB5ID0gdG91Y2guY2xpZW50WTtcblxuICAgIHRoaXMuX3Rlc3RIaXQodGhpcy5yZW5kZXJlci5iYWxsb29ucywgeCwgeSk7XG4gIH1cblxuICBfdGVzdEhpdChiYWxsb29ucywgeCwgeSkge1xuICAgIC8vIHN0YXJ0IGZyb20gdG9wIHRvIGJvdHRvbSB6LWluZGV4ZXNcbiAgICBmb3IgKGxldCB6ID0gYmFsbG9vbnMubGVuZ3RoIC0gMTsgeiA+PSAwOyB6LS0pIHtcbiAgICAgIGNvbnN0IGxheWVyID0gYmFsbG9vbnNbel07XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGF5ZXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJhbGxvb24gPSBsYXllcltpXTtcbiAgICAgICAgY29uc3QgZHggPSBiYWxsb29uLnggLSB4O1xuICAgICAgICBjb25zdCBkeSA9IGJhbGxvb24ueSAtIHk7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgICAgICBpZiAoZGlzdGFuY2UgPCBiYWxsb29uLnJhZGl1cykge1xuICAgICAgICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlU2NvcmUoYmFsbG9vbi5jb2xvcik7XG4gICAgICAgICAgdGhpcy5fdHJpZ2dlclNhbXBsZShiYWxsb29uLmNvbG9yLCBiYWxsb29uLngsIGJhbGxvb24ueSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZVNjb3JlKGNvbG9yKSB7XG4gICAgaWYgKHRoaXMudmlldy5tb2RlbC5zaG93SW5zdHJ1Y3Rpb25zID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnZpZXcubW9kZWwuc2hvd0luc3RydWN0aW9ucyA9IGZhbHNlO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tY2VudGVyJyk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIG1vZGVsXG4gICAgdGhpcy5nbG9iYWxTdGF0ZS5zY29yZVtjb2xvcl0gKz0gMTtcbiAgICAvLyB1cGRhdGUgdmlldyBtb2RlbFxuICAgIHRoaXMudmlldy5tb2RlbC5zY29yZVtjb2xvcl0gKz0gMTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2NvcmUnKTtcbiAgfVxuXG4gIF90cmlnZ2VyU2FtcGxlKGNvbG9yLCB4LCB5KSB7XG4gICAgdGhpcy5zeW50aC50cmlnZ2VyKGNvbG9yKTtcbiAgfVxuXG4gIF9vblNhbXBsZXNTZXQodmFsdWUpIHtcbiAgICB0aGlzLnN5bnRoLnNldFNhbXBsZXNTZXRJbmRleCh2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgS2lsbFRoZUJhbGxvb25zU3RhdGU7XG4iXX0=