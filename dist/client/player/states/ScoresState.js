'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="score-wrapper">\n      <div class="score red">\n        <p class="global"><%= showGlobalScore ? globalScore.red : \'\' %></p>\n        <p class="local"><%= localScore.red %></p>\n      </div>\n      <div class="score blue">\n        <p class="global"><%= showGlobalScore ? globalScore.blue : \'\' %></p>\n        <p class="local"><%= localScore.blue %></p>\n      </div>\n      <div class="score pink">\n        <p class="global"><%= showGlobalScore ? globalScore.pink : \'\' %></p>\n        <p class="local"><%= localScore.pink %></p>\n      </div>\n      <div class="score yellow">\n        <p class="global"><%= showGlobalScore ? globalScore.yellow : \'\' %></p>\n        <p class="local"><%= localScore.yellow %></p>\n      </div>\n    </div>\n  </div>\n';

var scoreOrder = ['red', 'blue', 'pink', 'yellow'];

var ScoresView = function (_CanvasView) {
  (0, _inherits3.default)(ScoresView, _CanvasView);

  function ScoresView() {
    (0, _classCallCheck3.default)(this, ScoresView);
    return (0, _possibleConstructorReturn3.default)(this, (ScoresView.__proto__ || (0, _getPrototypeOf2.default)(ScoresView)).apply(this, arguments));
  }

  (0, _createClass3.default)(ScoresView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get4.default)(ScoresView.prototype.__proto__ || (0, _getPrototypeOf2.default)(ScoresView.prototype), 'onRender', this).call(this);

      this.$scores = (0, _from2.default)(this.$el.querySelectorAll('.score'));
      this.$foreground = this.$el.querySelector('.foreground');
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight) {
      var _get2;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      (_get2 = (0, _get4.default)(ScoresView.prototype.__proto__ || (0, _getPrototypeOf2.default)(ScoresView.prototype), 'onResize', this)).call.apply(_get2, [this, viewportWidth, viewportHeight].concat(args));

      // resize foreground
      this.$foreground.style.width = viewportWidth + 'px';
      this.$foreground.style.height = viewportHeight + 'px';

      var hw = viewportWidth / 2;
      var hh = viewportHeight / 2;

      this.$scores.forEach(function ($score, index) {
        $score.style.width = hw + 'px';
        $score.style.height = hh + 'px';
        $score.style.lineHeight = hh + 'px';
        $score.style.left = index % 2 * hw + 'px';
        $score.style.top = Math.floor(index / 2) * hh + 'px';
      });
    }
  }]);
  return ScoresView;
}(_client.CanvasView);

var FadeInBalloon = function (_Balloon) {
  (0, _inherits3.default)(FadeInBalloon, _Balloon);

  function FadeInBalloon(fadeInTarget) {
    var _ref;

    (0, _classCallCheck3.default)(this, FadeInBalloon);

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (_ref = FadeInBalloon.__proto__ || (0, _getPrototypeOf2.default)(FadeInBalloon)).call.apply(_ref, [this].concat(args)));

    _this2.fadeInTarget = fadeInTarget;
    _this2.opacity = 0;
    _this2.fadeIn = true;
    return _this2;
  }

  (0, _createClass3.default)(FadeInBalloon, [{
    key: 'update',
    value: function update(dt) {
      (0, _get4.default)(FadeInBalloon.prototype.__proto__ || (0, _getPrototypeOf2.default)(FadeInBalloon.prototype), 'update', this).call(this, dt);

      if (this.fadeIn && this.opacity < this.fadeInTarget) {
        this.opacity = Math.min(1, this.opacity += 0.02);

        if (this.opacity === this.fadeInTarget) this.fadeIn = false;
      }
    }
  }]);
  return FadeInBalloon;
}(_Balloon3.default);

var ScoresRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(ScoresRenderer, _Canvas2dRenderer);

  function ScoresRenderer(spriteConfig, score) {
    (0, _classCallCheck3.default)(this, ScoresRenderer);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (ScoresRenderer.__proto__ || (0, _getPrototypeOf2.default)(ScoresRenderer)).call(this));

    _this3.spriteConfig = spriteConfig;
    _this3.localScore = score;
    _this3.globalScore = null;
    _this3.transferRatios = { red: 0, blue: 0, pink: 0, yellow: 0 };

    _this3.localBalloons = [];
    _this3.globalBalloons = [];

    _this3.globalBalloonsOffset = 20;
    // this.bars = [];
    _this3.exploded = [];
    _this3.showGlobalScore = false;
    return _this3;
  }

  (0, _createClass3.default)(ScoresRenderer, [{
    key: '_getLocalBalloonSize',
    value: function _getLocalBalloonSize(color) {
      var hw = this.canvasWidth / 2;
      var hh = this.canvasHeight / 2;
      var size = Math.min(hw, hh);
      var config = this.spriteConfig;
      var padding = 10;
      var maxSize = size - padding;
      var minSize = maxSize * config.minSizeScoreRatio;
      var localScore = this.localScore;

      var maxScore = -Infinity;
      var minScore = +Infinity;

      for (var _color in localScore) {
        if (localScore[_color] > maxScore) maxScore = localScore[_color];

        if (localScore[_color] < minScore) minScore = localScore[_color];
      }

      var score = localScore[color];
      var normScore = maxScore - minScore === 0 ? 0 : (score - minScore) / (maxScore - minScore);
      var remainingRatio = 1 - this.transferRatios[color];
      var remainingNormScore = normScore * remainingRatio;
      var displaySize = (maxSize - minSize) * remainingNormScore + minSize;

      return Math.floor(displaySize);
    }
  }, {
    key: '_getGlobalBalloonSize',
    value: function _getGlobalBalloonSize(color) {
      var config = this.spriteConfig;
      var w = this.canvasWidth;
      var h = this.canvasHeight;
      var maxSize = Math.min(h, w) * 2;
      var minSize = Math.min(h, w) * 0.3;
      var globalScore = this.globalScore;

      if (globalScore === null) return minSize;

      var maxPercent = -Infinity;

      for (var _color2 in globalScore) {
        if (globalScore[_color2] > maxPercent) maxPercent = globalScore[_color2];
      }

      // max percent is max size - 0 is min size
      var currentPercent = globalScore[color] * this.transferRatios[color];
      var normCurrentPercent = currentPercent / maxPercent;
      var displaySize = (maxSize - minSize) * normCurrentPercent + minSize;

      return Math.floor(displaySize);
    }
  }, {
    key: 'init',
    value: function init() {
      this.initLocalBalloons();
      this.initGlobalBalloons();
    }
  }, {
    key: 'initLocalBalloons',
    value: function initLocalBalloons() {
      var _this4 = this;

      var config = this.spriteConfig;
      var hh = this.canvasHeight / 2;
      var hw = this.canvasWidth / 2;

      scoreOrder.forEach(function (color, index) {
        var image = config.groups[color].image;
        var clipPositions = config.groups[color].clipPositions;
        var clipWidth = config.clipSize.width;
        var clipHeight = config.clipSize.height;
        var refreshRate = config.animationRate;
        var size = _this4._getGlobalBalloonSize(color);

        var x = hw / 2 + hw * (index % 2);
        var y = hh / 2 + hh * Math.floor(index / 2);

        var balloon = new FadeInBalloon(1, color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

        _this4.localBalloons.push(balloon);
      });
    }
  }, {
    key: 'initGlobalBalloons',
    value: function initGlobalBalloons() {
      var _this5 = this;

      var config = this.spriteConfig;
      var h = this.canvasHeight;
      var w = this.canvasWidth;
      var offset = this.globalBalloonsOffset;

      scoreOrder.forEach(function (color, index) {
        var image = config.groups[color].image;
        var clipPositions = config.groups[color].clipPositions;
        var clipWidth = config.clipSize.width;
        var clipHeight = config.clipSize.height;
        var refreshRate = config.animationRate;
        var size = _this5._getGlobalBalloonSize(color);

        var x = index % 2 === 0 ? offset : w - offset;
        var y = Math.floor(index / 2) === 0 ? offset : h - offset;

        var balloon = new _Balloon3.default(color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

        _this5.globalBalloons.push(balloon);
      });
    }
  }, {
    key: 'setTransfertRatio',
    value: function setTransfertRatio(color, value) {
      var _this6 = this;

      this.transferRatios[color] = value;

      this.localBalloons.forEach(function (balloon) {
        if (balloon.color === color) {
          var size = _this6._getLocalBalloonSize(color);
          balloon.width = size;
          balloon.height = size;

          if (!balloon.fadeIn) balloon.opacity = (1 - value) * 0.8 + 0.2;
        }
      });

      this.globalBalloons.forEach(function (balloon) {
        if (balloon.color === color) {
          var size = _this6._getGlobalBalloonSize(color);
          balloon.width = size;
          balloon.height = size;
          balloon.opacity = value * 0.8 + 0.2;
        }
      });
    }
  }, {
    key: 'explode',
    value: function explode(color) {
      this.localBalloons.forEach(function (balloon) {
        if (balloon.color === color) balloon.explode = true;
      });

      this.globalBalloons.forEach(function (balloon) {
        if (balloon.color === color) balloon.explode = true;
      });

      this.exploded.push(color);
    }
  }, {
    key: 'onResize',
    value: function onResize(width, height, orientation) {
      (0, _get4.default)(ScoresRenderer.prototype.__proto__ || (0, _getPrototypeOf2.default)(ScoresRenderer.prototype), 'onResize', this).call(this, width, height, orientation);

      var hw = width / 2;
      var hh = height / 2;
      var offset = this.globalBalloonsOffset;

      this.localBalloons.forEach(function (balloon, index) {
        balloon.x = hw / 2 + hw * (index % 2);
        balloon.y = hh / 2 + hh * Math.floor(index / 2);
      });

      this.globalBalloons.forEach(function (balloon, index) {
        balloon.x = index % 2 === 0 ? offset : width - offset;
        balloon.y = Math.floor(index / 2) === 0 ? offset : height - offset;
      });
    }
  }, {
    key: 'update',
    value: function update(dt) {
      this.localBalloons.forEach(function (balloon) {
        return balloon.update(dt);
      });

      if (this.showGlobalScore) this.globalBalloons.forEach(function (balloon) {
        return balloon.update(dt);
      });
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      this.localBalloons.forEach(function (balloon) {
        return balloon.render(ctx);
      });

      if (this.showGlobalScore) this.globalBalloons.forEach(function (balloon) {
        return balloon.render(ctx);
      });
    }
  }]);
  return ScoresRenderer;
}(_client.Canvas2dRenderer);

var ScoresState = function () {
  function ScoresState(experience, globalState) {
    (0, _classCallCheck3.default)(this, ScoresState);

    this.experience = experience;
    this.globalState = globalState;

    this.localScore = globalState.score;
    this.globalScore = null;
    this.transferRatios = { red: 0, blue: 0, pink: 0, yellow: 0 };
    // @debug
    // this.localScore = { red: -12, blue: 35, pink: 23, yellow: 18 };

    this._onGlobalScoreResponse = this._onGlobalScoreResponse.bind(this);
    //
    this._onShowGlobalScore = this._onShowGlobalScore.bind(this);
    this._onBlueTransfertRatioUpdate = this._onTransfertRatioUpdate('blue');
    this._onPinkTransfertRatioUpdate = this._onTransfertRatioUpdate('pink');
    this._onYellowTransfertRatioUpdate = this._onTransfertRatioUpdate('yellow');
    this._onRedTransfertRatioUpdate = this._onTransfertRatioUpdate('red');
    this._onExplode = this._onExplode.bind(this);

    this.renderer = new ScoresRenderer(this.experience.spriteConfig, this.localScore);
  }

  (0, _createClass3.default)(ScoresState, [{
    key: 'enter',
    value: function enter() {
      var displayedLocalScore = (0, _assign2.default)({}, this.localScore);
      var displayedGlobalScore = { red: '0.0%', blue: '0.0%', pink: '0.0%', yellow: '0.0%' };

      this.view = new ScoresView(template, {
        showGlobalScore: false,
        localScore: displayedLocalScore,
        globalScore: displayedGlobalScore
      }, {}, {
        className: ['scores-state', 'foreground'],
        ratios: { '.score-wrapper': 1 }
      });

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);
      });

      this.view.addRenderer(this.renderer);

      // send local and receive global score
      this.experience.send('player:score', this.localScore);
      this.experience.receive('global:score', this._onGlobalScoreResponse);

      var sharedParams = this.experience.sharedParams;
      sharedParams.addParamListener('score:showGlobalScore', this._onShowGlobalScore);
      sharedParams.addParamListener('score:blue:transfertRatio', this._onBlueTransfertRatioUpdate);
      sharedParams.addParamListener('score:pink:transfertRatio', this._onPinkTransfertRatioUpdate);
      sharedParams.addParamListener('score:yellow:transfertRatio', this._onYellowTransfertRatioUpdate);
      sharedParams.addParamListener('score:red:transfertRatio', this._onRedTransfertRatioUpdate);
      sharedParams.addParamListener('score:explode', this._onExplode);
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');

      this.view.removeRenderer(this.renderer);
      this.view.remove();

      var sharedParams = this.experience.sharedParams;
      sharedParams.removeParamListener('score:showGlobalScore', this._onShowGlobalScore);
      sharedParams.removeParamListener('score:blue:transfertRatio', this._onBlueTransfertRatioUpdate);
      sharedParams.removeParamListener('score:pink:transfertRatio', this._onPinkTransfertRatioUpdate);
      sharedParams.removeParamListener('score:yellow:transfertRatio', this._onYellowTransfertRatioUpdate);
      sharedParams.removeParamListener('score:red:transfertRatio', this._onRedTransfertRatioUpdate);
      sharedParams.removeParamListener('score:explode', this._onExplode);

      this.experience.removeListener('global:score', this._onGlobalScoreResponse);
    }
  }, {
    key: '_onGlobalScoreResponse',
    value: function _onGlobalScoreResponse(globalScore) {
      // populate renderer with globalScore
      this.globalScore = globalScore;
      this.renderer.globalScore = globalScore;

      this._onBlueTransfertRatioUpdate(this.transferRatios['blue']);
      this._onPinkTransfertRatioUpdate(this.transferRatios['pink']);
      this._onYellowTransfertRatioUpdate(this.transferRatios['yellow']);
      this._onRedTransfertRatioUpdate(this.transferRatios['red']);
    }
  }, {
    key: '_onShowGlobalScore',
    value: function _onShowGlobalScore(value) {
      if (value === 'show') {
        this.renderer.showGlobalScore = true;
        this.view.model.showGlobalScore = true;
        this.view.render('.score-wrapper');
      }
    }
  }, {
    key: '_onTransfertRatioUpdate',
    value: function _onTransfertRatioUpdate(color) {
      var _this7 = this;

      return function (value) {
        _this7.transferRatios[color] = value;
        _this7.renderer.setTransfertRatio(color, value);

        // update local score
        var remainValue = Math.round(_this7.localScore[color] * (1 - value));
        _this7.view.model.localScore[color] = remainValue;
        // update global score
        if (_this7.globalScore) {
          var percent = _this7.globalScore[color] * value;
          _this7.view.model.globalScore[color] = percent.toFixed(1) + '%';
        }

        _this7.view.render('.score.' + color + ' p.local');
        _this7.view.render('.score.' + color + ' p.global');
      };
    }
  }, {
    key: '_onExplode',
    value: function _onExplode(color) {
      if (color !== 'none') {
        this.renderer.explode(color);

        this.view.model.localScore[color] = '';
        this.view.render('.score-wrapper');
      }
    }
  }]);
  return ScoresState;
}();

exports.default = ScoresState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjb3Jlc1N0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwic2NvcmVPcmRlciIsIlNjb3Jlc1ZpZXciLCIkc2NvcmVzIiwiJGVsIiwicXVlcnlTZWxlY3RvckFsbCIsIiRmb3JlZ3JvdW5kIiwicXVlcnlTZWxlY3RvciIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImFyZ3MiLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiaHciLCJoaCIsImZvckVhY2giLCIkc2NvcmUiLCJpbmRleCIsImxpbmVIZWlnaHQiLCJsZWZ0IiwidG9wIiwiTWF0aCIsImZsb29yIiwiQ2FudmFzVmlldyIsIkZhZGVJbkJhbGxvb24iLCJmYWRlSW5UYXJnZXQiLCJvcGFjaXR5IiwiZmFkZUluIiwiZHQiLCJtaW4iLCJCYWxsb29uIiwiU2NvcmVzUmVuZGVyZXIiLCJzcHJpdGVDb25maWciLCJzY29yZSIsImxvY2FsU2NvcmUiLCJnbG9iYWxTY29yZSIsInRyYW5zZmVyUmF0aW9zIiwicmVkIiwiYmx1ZSIsInBpbmsiLCJ5ZWxsb3ciLCJsb2NhbEJhbGxvb25zIiwiZ2xvYmFsQmFsbG9vbnMiLCJnbG9iYWxCYWxsb29uc09mZnNldCIsImV4cGxvZGVkIiwic2hvd0dsb2JhbFNjb3JlIiwiY29sb3IiLCJjYW52YXNXaWR0aCIsImNhbnZhc0hlaWdodCIsInNpemUiLCJjb25maWciLCJwYWRkaW5nIiwibWF4U2l6ZSIsIm1pblNpemUiLCJtaW5TaXplU2NvcmVSYXRpbyIsIm1heFNjb3JlIiwiSW5maW5pdHkiLCJtaW5TY29yZSIsIm5vcm1TY29yZSIsInJlbWFpbmluZ1JhdGlvIiwicmVtYWluaW5nTm9ybVNjb3JlIiwiZGlzcGxheVNpemUiLCJ3IiwiaCIsIm1heFBlcmNlbnQiLCJjdXJyZW50UGVyY2VudCIsIm5vcm1DdXJyZW50UGVyY2VudCIsImluaXRMb2NhbEJhbGxvb25zIiwiaW5pdEdsb2JhbEJhbGxvb25zIiwiaW1hZ2UiLCJncm91cHMiLCJjbGlwUG9zaXRpb25zIiwiY2xpcFdpZHRoIiwiY2xpcFNpemUiLCJjbGlwSGVpZ2h0IiwicmVmcmVzaFJhdGUiLCJhbmltYXRpb25SYXRlIiwiX2dldEdsb2JhbEJhbGxvb25TaXplIiwieCIsInkiLCJiYWxsb29uIiwicHVzaCIsIm9mZnNldCIsInZhbHVlIiwiX2dldExvY2FsQmFsbG9vblNpemUiLCJleHBsb2RlIiwib3JpZW50YXRpb24iLCJ1cGRhdGUiLCJjdHgiLCJyZW5kZXIiLCJDYW52YXMyZFJlbmRlcmVyIiwiU2NvcmVzU3RhdGUiLCJleHBlcmllbmNlIiwiZ2xvYmFsU3RhdGUiLCJfb25HbG9iYWxTY29yZVJlc3BvbnNlIiwiYmluZCIsIl9vblNob3dHbG9iYWxTY29yZSIsIl9vbkJsdWVUcmFuc2ZlcnRSYXRpb1VwZGF0ZSIsIl9vblRyYW5zZmVydFJhdGlvVXBkYXRlIiwiX29uUGlua1RyYW5zZmVydFJhdGlvVXBkYXRlIiwiX29uWWVsbG93VHJhbnNmZXJ0UmF0aW9VcGRhdGUiLCJfb25SZWRUcmFuc2ZlcnRSYXRpb1VwZGF0ZSIsIl9vbkV4cGxvZGUiLCJyZW5kZXJlciIsImRpc3BsYXllZExvY2FsU2NvcmUiLCJkaXNwbGF5ZWRHbG9iYWxTY29yZSIsInZpZXciLCJjbGFzc05hbWUiLCJyYXRpb3MiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsImFkZFJlbmRlcmVyIiwic2VuZCIsInJlY2VpdmUiLCJzaGFyZWRQYXJhbXMiLCJhZGRQYXJhbUxpc3RlbmVyIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwicmVtb3ZlUmVuZGVyZXIiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJtb2RlbCIsInNldFRyYW5zZmVydFJhdGlvIiwicmVtYWluVmFsdWUiLCJyb3VuZCIsInBlcmNlbnQiLCJ0b0ZpeGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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MEJxQyxLQUExQztBQUNBLGlCQUFLdUIsSUFBTCxDQUFVbUIsS0FBVixDQUFnQjFGLFdBQWhCLENBQTRCVyxLQUE1QixJQUF3Q21GLFFBQVFDLE9BQVIsQ0FBZ0IsQ0FBaEIsQ0FBeEM7QUFDRDs7QUFFRCxlQUFLeEIsSUFBTCxDQUFVakIsTUFBVixhQUEyQjNDLEtBQTNCO0FBQ0EsZUFBSzRELElBQUwsQ0FBVWpCLE1BQVYsYUFBMkIzQyxLQUEzQjtBQUNELE9BZkQ7QUFnQkQ7OzsrQkFFVUEsSyxFQUFPO0FBQ2hCLFVBQUlBLFVBQVUsTUFBZCxFQUFzQjtBQUNwQixhQUFLeUQsUUFBTCxDQUFjbEIsT0FBZCxDQUFzQnZDLEtBQXRCOztBQUVBLGFBQUs0RCxJQUFMLENBQVVtQixLQUFWLENBQWdCM0YsVUFBaEIsQ0FBMkJZLEtBQTNCLElBQW9DLEVBQXBDO0FBQ0EsYUFBSzRELElBQUwsQ0FBVWpCLE1BQVYsQ0FBaUIsZ0JBQWpCO0FBQ0Q7QUFDRjs7Ozs7a0JBR1lFLFciLCJmaWxlIjoiU2NvcmVzU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNWaWV3LCBDYW52YXMyZFJlbmRlcmVyIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IEJhbGxvb24gZnJvbSAnLi4vcmVuZGVyZXJzL0JhbGxvb24nO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2NvcmUtd3JhcHBlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInNjb3JlIHJlZFwiPlxuICAgICAgICA8cCBjbGFzcz1cImdsb2JhbFwiPjwlPSBzaG93R2xvYmFsU2NvcmUgPyBnbG9iYWxTY29yZS5yZWQgOiAnJyAlPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJsb2NhbFwiPjwlPSBsb2NhbFNjb3JlLnJlZCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNjb3JlIGJsdWVcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJnbG9iYWxcIj48JT0gc2hvd0dsb2JhbFNjb3JlID8gZ2xvYmFsU2NvcmUuYmx1ZSA6ICcnICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImxvY2FsXCI+PCU9IGxvY2FsU2NvcmUuYmx1ZSAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNjb3JlIHBpbmtcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJnbG9iYWxcIj48JT0gc2hvd0dsb2JhbFNjb3JlID8gZ2xvYmFsU2NvcmUucGluayA6ICcnICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImxvY2FsXCI+PCU9IGxvY2FsU2NvcmUucGluayAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNjb3JlIHllbGxvd1wiPlxuICAgICAgICA8cCBjbGFzcz1cImdsb2JhbFwiPjwlPSBzaG93R2xvYmFsU2NvcmUgPyBnbG9iYWxTY29yZS55ZWxsb3cgOiAnJyAlPjwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJsb2NhbFwiPjwlPSBsb2NhbFNjb3JlLnllbGxvdyAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbmNvbnN0IHNjb3JlT3JkZXIgPSBbJ3JlZCcsICdibHVlJywgJ3BpbmsnLCAneWVsbG93J107XG5cbmNsYXNzIFNjb3Jlc1ZpZXcgZXh0ZW5kcyBDYW52YXNWaWV3IHtcbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgIHRoaXMuJHNjb3JlcyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLnNjb3JlJykpO1xuICAgIHRoaXMuJGZvcmVncm91bmQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuZm9yZWdyb3VuZCcpO1xuICB9XG5cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIC4uLmFyZ3MpIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgLi4uYXJncyk7XG5cbiAgICAvLyByZXNpemUgZm9yZWdyb3VuZFxuICAgIHRoaXMuJGZvcmVncm91bmQuc3R5bGUud2lkdGggPSBgJHt2aWV3cG9ydFdpZHRofXB4YDtcbiAgICB0aGlzLiRmb3JlZ3JvdW5kLnN0eWxlLmhlaWdodCA9IGAke3ZpZXdwb3J0SGVpZ2h0fXB4YDtcblxuICAgIGNvbnN0IGh3ID0gdmlld3BvcnRXaWR0aCAvIDI7XG4gICAgY29uc3QgaGggPSB2aWV3cG9ydEhlaWdodCAvIDI7XG5cbiAgICB0aGlzLiRzY29yZXMuZm9yRWFjaCgoJHNjb3JlLCBpbmRleCkgPT4ge1xuICAgICAgJHNjb3JlLnN0eWxlLndpZHRoID0gYCR7aHd9cHhgO1xuICAgICAgJHNjb3JlLnN0eWxlLmhlaWdodCA9IGAke2hofXB4YDtcbiAgICAgICRzY29yZS5zdHlsZS5saW5lSGVpZ2h0ID0gYCR7aGh9cHhgO1xuICAgICAgJHNjb3JlLnN0eWxlLmxlZnQgPSBgJHsoaW5kZXggJSAyKSAqIGh3fXB4YDtcbiAgICAgICRzY29yZS5zdHlsZS50b3AgPSBgJHtNYXRoLmZsb29yKGluZGV4IC8gMikgKiBoaH1weGA7XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgRmFkZUluQmFsbG9vbiBleHRlbmRzIEJhbGxvb24ge1xuICBjb25zdHJ1Y3RvcihmYWRlSW5UYXJnZXQsIC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuZmFkZUluVGFyZ2V0ID0gZmFkZUluVGFyZ2V0O1xuICAgIHRoaXMub3BhY2l0eSA9IDA7XG4gICAgdGhpcy5mYWRlSW4gPSB0cnVlO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgc3VwZXIudXBkYXRlKGR0KTtcblxuICAgIGlmICh0aGlzLmZhZGVJbiAmJiB0aGlzLm9wYWNpdHkgPCB0aGlzLmZhZGVJblRhcmdldCkge1xuICAgICAgdGhpcy5vcGFjaXR5ID0gTWF0aC5taW4oMSwgdGhpcy5vcGFjaXR5ICs9IDAuMDIpO1xuXG4gICAgICBpZiAodGhpcy5vcGFjaXR5ID09PSB0aGlzLmZhZGVJblRhcmdldClcbiAgICAgICAgdGhpcy5mYWRlSW4gPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU2NvcmVzUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3ByaXRlQ29uZmlnLCBzY29yZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNwcml0ZUNvbmZpZyA9IHNwcml0ZUNvbmZpZztcbiAgICB0aGlzLmxvY2FsU2NvcmUgPSBzY29yZTtcbiAgICB0aGlzLmdsb2JhbFNjb3JlID0gbnVsbDtcbiAgICB0aGlzLnRyYW5zZmVyUmF0aW9zID0geyByZWQ6IDAsIGJsdWU6IDAsIHBpbms6IDAsIHllbGxvdzogMCB9O1xuXG4gICAgdGhpcy5sb2NhbEJhbGxvb25zID0gW107XG4gICAgdGhpcy5nbG9iYWxCYWxsb29ucyA9IFtdO1xuXG4gICAgdGhpcy5nbG9iYWxCYWxsb29uc09mZnNldCA9IDIwO1xuICAgIC8vIHRoaXMuYmFycyA9IFtdO1xuICAgIHRoaXMuZXhwbG9kZWQgPSBbXTtcbiAgICB0aGlzLnNob3dHbG9iYWxTY29yZSA9IGZhbHNlO1xuICB9XG5cbiAgX2dldExvY2FsQmFsbG9vblNpemUoY29sb3IpIHtcbiAgICBjb25zdCBodyA9IHRoaXMuY2FudmFzV2lkdGggLyAyO1xuICAgIGNvbnN0IGhoID0gdGhpcy5jYW52YXNIZWlnaHQgLyAyO1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbihodywgaGgpO1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuc3ByaXRlQ29uZmlnO1xuICAgIGNvbnN0IHBhZGRpbmcgPSAxMDtcbiAgICBjb25zdCBtYXhTaXplID0gc2l6ZSAtIHBhZGRpbmc7XG4gICAgY29uc3QgbWluU2l6ZSA9IG1heFNpemUgKiBjb25maWcubWluU2l6ZVNjb3JlUmF0aW87XG4gICAgY29uc3QgbG9jYWxTY29yZSA9IHRoaXMubG9jYWxTY29yZTtcblxuICAgIGxldCBtYXhTY29yZSA9IC1JbmZpbml0eTtcbiAgICBsZXQgbWluU2NvcmUgPSArSW5maW5pdHk7XG5cbiAgICBmb3IgKGxldCBjb2xvciBpbiBsb2NhbFNjb3JlKSB7XG4gICAgICBpZiAobG9jYWxTY29yZVtjb2xvcl0gPiBtYXhTY29yZSlcbiAgICAgICAgbWF4U2NvcmUgPSBsb2NhbFNjb3JlW2NvbG9yXTtcblxuICAgICAgaWYgKGxvY2FsU2NvcmVbY29sb3JdIDwgbWluU2NvcmUpXG4gICAgICAgIG1pblNjb3JlID0gbG9jYWxTY29yZVtjb2xvcl07XG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcmUgPSBsb2NhbFNjb3JlW2NvbG9yXTtcbiAgICBjb25zdCBub3JtU2NvcmUgPSAobWF4U2NvcmUgLSBtaW5TY29yZSkgPT09IDAgP1xuICAgICAgMCA6IChzY29yZSAtIG1pblNjb3JlKSAvIChtYXhTY29yZSAtIG1pblNjb3JlKTtcbiAgICBjb25zdCByZW1haW5pbmdSYXRpbyA9IDEgLSB0aGlzLnRyYW5zZmVyUmF0aW9zW2NvbG9yXTtcbiAgICBjb25zdCByZW1haW5pbmdOb3JtU2NvcmUgPSBub3JtU2NvcmUgKiByZW1haW5pbmdSYXRpbztcbiAgICBjb25zdCBkaXNwbGF5U2l6ZSA9IChtYXhTaXplIC0gbWluU2l6ZSkgKiByZW1haW5pbmdOb3JtU2NvcmUgKyBtaW5TaXplO1xuXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoZGlzcGxheVNpemUpO1xuICB9XG5cbiAgX2dldEdsb2JhbEJhbGxvb25TaXplKGNvbG9yKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgY29uc3QgdyA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgaCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGNvbnN0IG1heFNpemUgPSBNYXRoLm1pbihoLCB3KSAqIDI7XG4gICAgY29uc3QgbWluU2l6ZSA9IE1hdGgubWluKGgsIHcpICogMC4zO1xuICAgIGNvbnN0IGdsb2JhbFNjb3JlID0gdGhpcy5nbG9iYWxTY29yZTtcblxuICAgIGlmIChnbG9iYWxTY29yZSA9PT0gbnVsbClcbiAgICAgIHJldHVybiBtaW5TaXplO1xuXG4gICAgbGV0IG1heFBlcmNlbnQgPSAtSW5maW5pdHk7XG5cbiAgICBmb3IgKGxldCBjb2xvciBpbiBnbG9iYWxTY29yZSkge1xuICAgICAgaWYgKGdsb2JhbFNjb3JlW2NvbG9yXSA+IG1heFBlcmNlbnQpXG4gICAgICAgIG1heFBlcmNlbnQgPSBnbG9iYWxTY29yZVtjb2xvcl07XG4gICAgfVxuXG4gICAgLy8gbWF4IHBlcmNlbnQgaXMgbWF4IHNpemUgLSAwIGlzIG1pbiBzaXplXG4gICAgY29uc3QgY3VycmVudFBlcmNlbnQgPSBnbG9iYWxTY29yZVtjb2xvcl0gKiB0aGlzLnRyYW5zZmVyUmF0aW9zW2NvbG9yXTtcbiAgICBjb25zdCBub3JtQ3VycmVudFBlcmNlbnQgPSBjdXJyZW50UGVyY2VudCAvIG1heFBlcmNlbnQ7XG4gICAgY29uc3QgZGlzcGxheVNpemUgPSAobWF4U2l6ZSAtIG1pblNpemUpICogbm9ybUN1cnJlbnRQZXJjZW50ICsgbWluU2l6ZTtcblxuICAgIHJldHVybiBNYXRoLmZsb29yKGRpc3BsYXlTaXplKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0TG9jYWxCYWxsb29ucygpO1xuICAgIHRoaXMuaW5pdEdsb2JhbEJhbGxvb25zKCk7XG4gIH1cblxuICBpbml0TG9jYWxCYWxsb29ucygpIHtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnNwcml0ZUNvbmZpZztcbiAgICBjb25zdCBoaCA9IHRoaXMuY2FudmFzSGVpZ2h0IC8gMjtcbiAgICBjb25zdCBodyA9IHRoaXMuY2FudmFzV2lkdGggLyAyO1xuXG4gICAgc2NvcmVPcmRlci5mb3JFYWNoKChjb2xvciwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGltYWdlID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uaW1hZ2U7XG4gICAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICAgIGNvbnN0IGNsaXBXaWR0aCA9IGNvbmZpZy5jbGlwU2l6ZS53aWR0aDtcbiAgICAgIGNvbnN0IGNsaXBIZWlnaHQgPSBjb25maWcuY2xpcFNpemUuaGVpZ2h0O1xuICAgICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLl9nZXRHbG9iYWxCYWxsb29uU2l6ZShjb2xvcik7XG5cbiAgICAgIGNvbnN0IHggPSBodyAvIDIgKyBodyAqIChpbmRleCAlIDIpO1xuICAgICAgY29uc3QgeSA9IGhoIC8gMiArIGhoICogTWF0aC5mbG9vcihpbmRleCAvIDIpO1xuXG4gICAgICBjb25zdCBiYWxsb29uID0gbmV3IEZhZGVJbkJhbGxvb24oMSwgY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCB4LCB5KTtcblxuICAgICAgdGhpcy5sb2NhbEJhbGxvb25zLnB1c2goYmFsbG9vbik7XG4gICAgfSk7XG4gIH1cblxuICBpbml0R2xvYmFsQmFsbG9vbnMoKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgY29uc3QgaCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGNvbnN0IHcgPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuZ2xvYmFsQmFsbG9vbnNPZmZzZXQ7XG5cbiAgICBzY29yZU9yZGVyLmZvckVhY2goKGNvbG9yLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgICAgY29uc3QgY2xpcFdpZHRoID0gY29uZmlnLmNsaXBTaXplLndpZHRoO1xuICAgICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2dldEdsb2JhbEJhbGxvb25TaXplKGNvbG9yKTtcblxuICAgICAgY29uc3QgeCA9IChpbmRleCAlIDIpID09PSAwID8gb2Zmc2V0IDogdyAtIG9mZnNldDtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKGluZGV4IC8gMikgPT09IDAgPyBvZmZzZXQgOiBoIC0gb2Zmc2V0O1xuXG4gICAgICBjb25zdCBiYWxsb29uID0gbmV3IEJhbGxvb24oY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCB4LCB5KTtcblxuICAgICAgdGhpcy5nbG9iYWxCYWxsb29ucy5wdXNoKGJhbGxvb24pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VHJhbnNmZXJ0UmF0aW8oY29sb3IsIHZhbHVlKSB7XG4gICAgdGhpcy50cmFuc2ZlclJhdGlvc1tjb2xvcl0gPSB2YWx1ZTtcblxuICAgIHRoaXMubG9jYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiB7XG4gICAgICBpZiAoYmFsbG9vbi5jb2xvciA9PT0gY29sb3IpIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2dldExvY2FsQmFsbG9vblNpemUoY29sb3IpO1xuICAgICAgICBiYWxsb29uLndpZHRoID0gc2l6ZTtcbiAgICAgICAgYmFsbG9vbi5oZWlnaHQgPSBzaXplO1xuXG4gICAgICAgIGlmICghYmFsbG9vbi5mYWRlSW4pXG4gICAgICAgICAgYmFsbG9vbi5vcGFjaXR5ID0gKDEgLSB2YWx1ZSkgKiAwLjggKyAwLjI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmdsb2JhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IHtcbiAgICAgIGlmIChiYWxsb29uLmNvbG9yID09PSBjb2xvcikge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5fZ2V0R2xvYmFsQmFsbG9vblNpemUoY29sb3IpO1xuICAgICAgICBiYWxsb29uLndpZHRoID0gc2l6ZTtcbiAgICAgICAgYmFsbG9vbi5oZWlnaHQgPSBzaXplO1xuICAgICAgICBiYWxsb29uLm9wYWNpdHkgPSB2YWx1ZSAqIDAuOCArIDAuMjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV4cGxvZGUoY29sb3IpIHtcbiAgICB0aGlzLmxvY2FsQmFsbG9vbnMuZm9yRWFjaCgoYmFsbG9vbikgPT4ge1xuICAgICAgaWYgKGJhbGxvb24uY29sb3IgPT09IGNvbG9yKVxuICAgICAgICBiYWxsb29uLmV4cGxvZGUgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5nbG9iYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiB7XG4gICAgICBpZiAoYmFsbG9vbi5jb2xvciA9PT0gY29sb3IpXG4gICAgICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmV4cGxvZGVkLnB1c2goY29sb3IpO1xuICB9XG5cbiAgb25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbik7XG5cbiAgICBjb25zdCBodyA9IHdpZHRoIC8gMjtcbiAgICBjb25zdCBoaCA9IGhlaWdodCAvIDI7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5nbG9iYWxCYWxsb29uc09mZnNldDtcblxuICAgIHRoaXMubG9jYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uLCBpbmRleCkgPT4ge1xuICAgICAgYmFsbG9vbi54ID0gaHcgLyAyICsgaHcgKiAoaW5kZXggJSAyKTtcbiAgICAgIGJhbGxvb24ueSA9IGhoIC8gMiArIGhoICogTWF0aC5mbG9vcihpbmRleCAvIDIpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5nbG9iYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uLCBpbmRleCkgPT4ge1xuICAgICAgYmFsbG9vbi54ID0gKGluZGV4ICUgMikgPT09IDAgPyBvZmZzZXQgOiB3aWR0aCAtIG9mZnNldDtcbiAgICAgIGJhbGxvb24ueSA9IE1hdGguZmxvb3IoaW5kZXggLyAyKSA9PT0gMCA/IG9mZnNldCA6IGhlaWdodCAtIG9mZnNldDtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIHRoaXMubG9jYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiBiYWxsb29uLnVwZGF0ZShkdCkpO1xuXG4gICAgaWYgKHRoaXMuc2hvd0dsb2JhbFNjb3JlKVxuICAgICAgdGhpcy5nbG9iYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiBiYWxsb29uLnVwZGF0ZShkdCkpO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIHRoaXMubG9jYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiBiYWxsb29uLnJlbmRlcihjdHgpKTtcblxuICAgIGlmICh0aGlzLnNob3dHbG9iYWxTY29yZSlcbiAgICAgIHRoaXMuZ2xvYmFsQmFsbG9vbnMuZm9yRWFjaCgoYmFsbG9vbikgPT4gYmFsbG9vbi5yZW5kZXIoY3R4KSk7XG4gIH1cbn1cblxuY2xhc3MgU2NvcmVzU3RhdGUge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBnbG9iYWxTdGF0ZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5nbG9iYWxTdGF0ZSA9IGdsb2JhbFN0YXRlO1xuXG4gICAgdGhpcy5sb2NhbFNjb3JlID0gZ2xvYmFsU3RhdGUuc2NvcmU7XG4gICAgdGhpcy5nbG9iYWxTY29yZSA9IG51bGw7XG4gICAgdGhpcy50cmFuc2ZlclJhdGlvcyA9IHsgcmVkOiAwLCBibHVlOiAwLCBwaW5rOiAwLCB5ZWxsb3c6IDAgfTtcbiAgICAvLyBAZGVidWdcbiAgICAvLyB0aGlzLmxvY2FsU2NvcmUgPSB7IHJlZDogLTEyLCBibHVlOiAzNSwgcGluazogMjMsIHllbGxvdzogMTggfTtcblxuICAgIHRoaXMuX29uR2xvYmFsU2NvcmVSZXNwb25zZSA9IHRoaXMuX29uR2xvYmFsU2NvcmVSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIC8vXG4gICAgdGhpcy5fb25TaG93R2xvYmFsU2NvcmUgPSB0aGlzLl9vblNob3dHbG9iYWxTY29yZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQmx1ZVRyYW5zZmVydFJhdGlvVXBkYXRlID0gdGhpcy5fb25UcmFuc2ZlcnRSYXRpb1VwZGF0ZSgnYmx1ZScpO1xuICAgIHRoaXMuX29uUGlua1RyYW5zZmVydFJhdGlvVXBkYXRlID0gdGhpcy5fb25UcmFuc2ZlcnRSYXRpb1VwZGF0ZSgncGluaycpO1xuICAgIHRoaXMuX29uWWVsbG93VHJhbnNmZXJ0UmF0aW9VcGRhdGUgPSB0aGlzLl9vblRyYW5zZmVydFJhdGlvVXBkYXRlKCd5ZWxsb3cnKTtcbiAgICB0aGlzLl9vblJlZFRyYW5zZmVydFJhdGlvVXBkYXRlID0gdGhpcy5fb25UcmFuc2ZlcnRSYXRpb1VwZGF0ZSgncmVkJyk7XG4gICAgdGhpcy5fb25FeHBsb2RlID0gdGhpcy5fb25FeHBsb2RlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFNjb3Jlc1JlbmRlcmVyKHRoaXMuZXhwZXJpZW5jZS5zcHJpdGVDb25maWcsIHRoaXMubG9jYWxTY29yZSk7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICBjb25zdCBkaXNwbGF5ZWRMb2NhbFNjb3JlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5sb2NhbFNjb3JlKTtcbiAgICBjb25zdCBkaXNwbGF5ZWRHbG9iYWxTY29yZSA9IHsgcmVkOiAnMC4wJScsIGJsdWU6ICcwLjAlJywgcGluazogJzAuMCUnLCB5ZWxsb3c6ICcwLjAlJyB9O1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IFNjb3Jlc1ZpZXcodGVtcGxhdGUsIHtcbiAgICAgIHNob3dHbG9iYWxTY29yZTogZmFsc2UsXG4gICAgICBsb2NhbFNjb3JlOiBkaXNwbGF5ZWRMb2NhbFNjb3JlLFxuICAgICAgZ2xvYmFsU2NvcmU6IGRpc3BsYXllZEdsb2JhbFNjb3JlLFxuICAgIH0sIHt9LCB7XG4gICAgICBjbGFzc05hbWU6IFsnc2NvcmVzLXN0YXRlJywgJ2ZvcmVncm91bmQnXSxcbiAgICAgIHJhdGlvczogeyAnLnNjb3JlLXdyYXBwZXInOiAxIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdGhpcy52aWV3LnNob3coKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy5leHBlcmllbmNlLnZpZXcuZ2V0U3RhdGVDb250YWluZXIoKSk7XG5cbiAgICB0aGlzLnZpZXcuc2V0UHJlUmVuZGVyKChjdHgsIGR0LCB3aWR0aCwgaGVpZ2h0KSA9PiB7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LmFkZFJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuXG4gICAgLy8gc2VuZCBsb2NhbCBhbmQgcmVjZWl2ZSBnbG9iYWwgc2NvcmVcbiAgICB0aGlzLmV4cGVyaWVuY2Uuc2VuZCgncGxheWVyOnNjb3JlJywgdGhpcy5sb2NhbFNjb3JlKTtcbiAgICB0aGlzLmV4cGVyaWVuY2UucmVjZWl2ZSgnZ2xvYmFsOnNjb3JlJywgdGhpcy5fb25HbG9iYWxTY29yZVJlc3BvbnNlKTtcblxuICAgIGNvbnN0IHNoYXJlZFBhcmFtcyA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXM7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ3Njb3JlOnNob3dHbG9iYWxTY29yZScsIHRoaXMuX29uU2hvd0dsb2JhbFNjb3JlKTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc2NvcmU6Ymx1ZTp0cmFuc2ZlcnRSYXRpbycsIHRoaXMuX29uQmx1ZVRyYW5zZmVydFJhdGlvVXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc2NvcmU6cGluazp0cmFuc2ZlcnRSYXRpbycsIHRoaXMuX29uUGlua1RyYW5zZmVydFJhdGlvVXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc2NvcmU6eWVsbG93OnRyYW5zZmVydFJhdGlvJywgdGhpcy5fb25ZZWxsb3dUcmFuc2ZlcnRSYXRpb1VwZGF0ZSk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ3Njb3JlOnJlZDp0cmFuc2ZlcnRSYXRpbycsIHRoaXMuX29uUmVkVHJhbnNmZXJ0UmF0aW9VcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdzY29yZTpleHBsb2RlJywgdGhpcy5fb25FeHBsb2RlKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JlZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG5cbiAgICB0aGlzLnZpZXcucmVtb3ZlUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy52aWV3LnJlbW92ZSgpO1xuXG4gICAgY29uc3Qgc2hhcmVkUGFyYW1zID0gdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcztcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcignc2NvcmU6c2hvd0dsb2JhbFNjb3JlJywgdGhpcy5fb25TaG93R2xvYmFsU2NvcmUpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdzY29yZTpibHVlOnRyYW5zZmVydFJhdGlvJywgdGhpcy5fb25CbHVlVHJhbnNmZXJ0UmF0aW9VcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdzY29yZTpwaW5rOnRyYW5zZmVydFJhdGlvJywgdGhpcy5fb25QaW5rVHJhbnNmZXJ0UmF0aW9VcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdzY29yZTp5ZWxsb3c6dHJhbnNmZXJ0UmF0aW8nLCB0aGlzLl9vblllbGxvd1RyYW5zZmVydFJhdGlvVXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcignc2NvcmU6cmVkOnRyYW5zZmVydFJhdGlvJywgdGhpcy5fb25SZWRUcmFuc2ZlcnRSYXRpb1VwZGF0ZSk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ3Njb3JlOmV4cGxvZGUnLCB0aGlzLl9vbkV4cGxvZGUpO1xuXG4gICAgdGhpcy5leHBlcmllbmNlLnJlbW92ZUxpc3RlbmVyKCdnbG9iYWw6c2NvcmUnLCB0aGlzLl9vbkdsb2JhbFNjb3JlUmVzcG9uc2UpO1xuICB9XG5cbiAgX29uR2xvYmFsU2NvcmVSZXNwb25zZShnbG9iYWxTY29yZSkge1xuICAgIC8vIHBvcHVsYXRlIHJlbmRlcmVyIHdpdGggZ2xvYmFsU2NvcmVcbiAgICB0aGlzLmdsb2JhbFNjb3JlID0gZ2xvYmFsU2NvcmU7XG4gICAgdGhpcy5yZW5kZXJlci5nbG9iYWxTY29yZSA9IGdsb2JhbFNjb3JlO1xuXG4gICAgdGhpcy5fb25CbHVlVHJhbnNmZXJ0UmF0aW9VcGRhdGUodGhpcy50cmFuc2ZlclJhdGlvc1snYmx1ZSddKTtcbiAgICB0aGlzLl9vblBpbmtUcmFuc2ZlcnRSYXRpb1VwZGF0ZSh0aGlzLnRyYW5zZmVyUmF0aW9zWydwaW5rJ10pO1xuICAgIHRoaXMuX29uWWVsbG93VHJhbnNmZXJ0UmF0aW9VcGRhdGUodGhpcy50cmFuc2ZlclJhdGlvc1sneWVsbG93J10pO1xuICAgIHRoaXMuX29uUmVkVHJhbnNmZXJ0UmF0aW9VcGRhdGUodGhpcy50cmFuc2ZlclJhdGlvc1sncmVkJ10pO1xuICB9XG5cbiAgX29uU2hvd0dsb2JhbFNjb3JlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnc2hvdycpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2hvd0dsb2JhbFNjb3JlID0gdHJ1ZTtcbiAgICAgIHRoaXMudmlldy5tb2RlbC5zaG93R2xvYmFsU2NvcmUgPSB0cnVlO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNjb3JlLXdyYXBwZXInKTtcbiAgICB9XG4gIH1cblxuICBfb25UcmFuc2ZlcnRSYXRpb1VwZGF0ZShjb2xvcikge1xuICAgIHJldHVybiAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMudHJhbnNmZXJSYXRpb3NbY29sb3JdID0gdmFsdWU7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFRyYW5zZmVydFJhdGlvKGNvbG9yLCB2YWx1ZSk7XG5cbiAgICAgIC8vIHVwZGF0ZSBsb2NhbCBzY29yZVxuICAgICAgY29uc3QgcmVtYWluVmFsdWUgPSBNYXRoLnJvdW5kKHRoaXMubG9jYWxTY29yZVtjb2xvcl0gKiAoMSAtIHZhbHVlKSk7XG4gICAgICB0aGlzLnZpZXcubW9kZWwubG9jYWxTY29yZVtjb2xvcl0gPSByZW1haW5WYWx1ZTtcbiAgICAgIC8vIHVwZGF0ZSBnbG9iYWwgc2NvcmVcbiAgICAgIGlmICh0aGlzLmdsb2JhbFNjb3JlKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnQgPSB0aGlzLmdsb2JhbFNjb3JlW2NvbG9yXSAqIHZhbHVlO1xuICAgICAgICB0aGlzLnZpZXcubW9kZWwuZ2xvYmFsU2NvcmVbY29sb3JdID0gYCR7cGVyY2VudC50b0ZpeGVkKDEpfSVgO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXcucmVuZGVyKGAuc2NvcmUuJHtjb2xvcn0gcC5sb2NhbGApO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcihgLnNjb3JlLiR7Y29sb3J9IHAuZ2xvYmFsYCk7XG4gICAgfVxuICB9XG5cbiAgX29uRXhwbG9kZShjb2xvcikge1xuICAgIGlmIChjb2xvciAhPT0gJ25vbmUnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmV4cGxvZGUoY29sb3IpO1xuXG4gICAgICB0aGlzLnZpZXcubW9kZWwubG9jYWxTY29yZVtjb2xvcl0gPSAnJztcbiAgICAgIHRoaXMudmlldy5yZW5kZXIoJy5zY29yZS13cmFwcGVyJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjb3Jlc1N0YXRlO1xuIl19