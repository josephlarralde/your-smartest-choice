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
      var _this7 = this;

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

      this.creditsTimeout = setTimeout(function () {
        _this7.experience.showCreditsPage(4);
      }, 7000);
    }
  }, {
    key: 'exit',
    value: function exit() {
      clearTimeout(this.creditsTimeout);
      this.experience.showCreditsPage(0);

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
      var _this8 = this;

      return function (value) {
        _this8.transferRatios[color] = value;
        _this8.renderer.setTransfertRatio(color, value);

        // update local score
        var remainValue = Math.round(_this8.localScore[color] * (1 - value));
        _this8.view.model.localScore[color] = remainValue;
        // update global score
        if (_this8.globalScore) {
          var percent = _this8.globalScore[color] * value;
          _this8.view.model.globalScore[color] = percent.toFixed(1) + '%';
        }

        _this8.view.render('.score.' + color + ' p.local');
        _this8.view.render('.score.' + color + ' p.global');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjb3Jlc1N0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwic2NvcmVPcmRlciIsIlNjb3Jlc1ZpZXciLCIkc2NvcmVzIiwiJGVsIiwicXVlcnlTZWxlY3RvckFsbCIsIiRmb3JlZ3JvdW5kIiwicXVlcnlTZWxlY3RvciIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImFyZ3MiLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiaHciLCJoaCIsImZvckVhY2giLCIkc2NvcmUiLCJpbmRleCIsImxpbmVIZWlnaHQiLCJsZWZ0IiwidG9wIiwiTWF0aCIsImZsb29yIiwiQ2FudmFzVmlldyIsIkZhZGVJbkJhbGxvb24iLCJmYWRlSW5UYXJnZXQiLCJvcGFjaXR5IiwiZmFkZUluIiwiZHQiLCJtaW4iLCJCYWxsb29uIiwiU2NvcmVzUmVuZGVyZXIiLCJzcHJpdGVDb25maWciLCJzY29yZSIsImxvY2FsU2NvcmUiLCJnbG9iYWxTY29yZSIsInRyYW5zZmVyUmF0aW9zIiwicmVkIiwiYmx1ZSIsInBpbmsiLCJ5ZWxsb3ciLCJsb2NhbEJhbGxvb25zIiwiZ2xvYmFsQmFsbG9vbnMiLCJnbG9iYWxCYWxsb29uc09mZnNldCIsImV4cGxvZGVkIiwic2hvd0dsb2JhbFNjb3JlIiwiY29sb3IiLCJjYW52YXNXaWR0aCIsImNhbnZhc0hlaWdodCIsInNpemUiLCJjb25maWciLCJwYWRkaW5nIiwibWF4U2l6ZSIsIm1pblNpemUiLCJtaW5TaXplU2NvcmVSYXRpbyIsIm1heFNjb3JlIiwiSW5maW5pdHkiLCJtaW5TY29yZSIsIm5vcm1TY29yZSIsInJlbWFpbmluZ1JhdGlvIiwicmVtYWluaW5nTm9ybVNjb3JlIiwiZGlzcGxheVNpemUiLCJ3IiwiaCIsIm1heFBlcmNlbnQiLCJjdXJyZW50UGVyY2VudCIsIm5vcm1DdXJyZW50UGVyY2VudCIsImluaXRMb2NhbEJhbGxvb25zIiwiaW5pdEdsb2JhbEJhbGxvb25zIiwiaW1hZ2UiLCJncm91cHMiLCJjbGlwUG9zaXRpb25zIiwiY2xpcFdpZHRoIiwiY2xpcFNpemUiLCJjbGlwSGVpZ2h0IiwicmVmcmVzaFJhdGUiLCJhbmltYXRpb25SYXRlIiwiX2dldEdsb2JhbEJhbGxvb25TaXplIiwieCIsInkiLCJiYWxsb29uIiwicHVzaCIsIm9mZnNldCIsInZhbHVlIiwiX2dldExvY2FsQmFsbG9vblNpemUiLCJleHBsb2RlIiwib3JpZW50YXRpb24iLCJ1cGRhdGUiLCJjdHgiLCJyZW5kZXIiLCJDYW52YXMyZFJlbmRlcmVyIiwiU2NvcmVzU3RhdGUiLCJleHBlcmllbmNlIiwiZ2xvYmFsU3RhdGUiLCJfb25HbG9iYWxTY29yZVJlc3BvbnNlIiwiYmluZCIsIl9vblNob3dHbG9iYWxTY29yZSIsIl9vbkJsdWVUcmFuc2ZlcnRSYXRpb1VwZGF0ZSIsIl9vblRyYW5zZmVydFJhdGlvVXBkYXRlIiwiX29uUGlua1RyYW5zZmVydFJhdGlvVXBkYXRlIiwiX29uWWVsbG93VHJhbnNmZXJ0UmF0aW9VcGRhdGUiLCJfb25SZWRUcmFuc2ZlcnRSYXRpb1VwZGF0ZSIsIl9vbkV4cGxvZGUiLCJyZW5kZXJlciIsImRpc3BsYXllZExvY2FsU2NvcmUiLCJkaXNwbGF5ZWRHbG9iYWxTY29yZSIsInZpZXciLCJjbGFzc05hbWUiLCJyYXRpb3MiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsImFkZFJlbmRlcmVyIiwic2VuZCIsInJlY2VpdmUiLCJzaGFyZWRQYXJhbXMiLCJhZGRQYXJhbUxpc3RlbmVyIiwiY3JlZGl0c1RpbWVvdXQiLCJzZXRUaW1lb3V0Iiwic2hvd0NyZWRpdHNQYWdlIiwiY2xlYXJUaW1lb3V0IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwicmVtb3ZlUmVuZGVyZXIiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJtb2RlbCIsInNldFRyYW5zZmVydFJhdGlvIiwicmVtYWluVmFsdWUiLCJyb3VuZCIsInBl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Qzs7QUFFQTtBQUNBLFlBQU1nRCxjQUFjOUcsS0FBSytHLEtBQUwsQ0FBVyxPQUFLbEcsVUFBTCxDQUFnQlksS0FBaEIsS0FBMEIsSUFBSXFDLEtBQTlCLENBQVgsQ0FBcEI7QUFDQSxlQUFLdUIsSUFBTCxDQUFVdUIsS0FBVixDQUFnQi9GLFVBQWhCLENBQTJCWSxLQUEzQixJQUFvQ3FGLFdBQXBDO0FBQ0E7QUFDQSxZQUFJLE9BQUtoRyxXQUFULEVBQXNCO0FBQ3BCLGNBQU1rRyxVQUFVLE9BQUtsRyxXQUFMLENBQWlCVyxLQUFqQixJQUEwQnFDLEtBQTFDO0FBQ0EsaUJBQUt1QixJQUFMLENBQVV1QixLQUFWLENBQWdCOUYsV0FBaEIsQ0FBNEJXLEtBQTVCLElBQXdDdUYsUUFBUUMsT0FBUixDQUFnQixDQUFoQixDQUF4QztBQUNEOztBQUVELGVBQUs1QixJQUFMLENBQVVqQixNQUFWLGFBQTJCM0MsS0FBM0I7QUFDQSxlQUFLNEQsSUFBTCxDQUFVakIsTUFBVixhQUEyQjNDLEtBQTNCO0FBQ0QsT0FmRDtBQWdCRDs7OytCQUVVQSxLLEVBQU87QUFDaEIsVUFBSUEsVUFBVSxNQUFkLEVBQXNCO0FBQ3BCLGFBQUt5RCxRQUFMLENBQWNsQixPQUFkLENBQXNCdkMsS0FBdEI7O0FBRUEsYUFBSzRELElBQUwsQ0FBVXVCLEtBQVYsQ0FBZ0IvRixVQUFoQixDQUEyQlksS0FBM0IsSUFBb0MsRUFBcEM7QUFDQSxhQUFLNEQsSUFBTCxDQUFVakIsTUFBVixDQUFpQixnQkFBakI7QUFDRDtBQUNGOzs7OztrQkFHWUUsVyIsImZpbGUiOiJTY29yZXNTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbnZhc1ZpZXcsIENhbnZhczJkUmVuZGVyZXIgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgQmFsbG9vbiBmcm9tICcuLi9yZW5kZXJlcnMvQmFsbG9vbic7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzY29yZS13cmFwcGVyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2NvcmUgcmVkXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiZ2xvYmFsXCI+PCU9IHNob3dHbG9iYWxTY29yZSA/IGdsb2JhbFNjb3JlLnJlZCA6ICcnICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImxvY2FsXCI+PCU9IGxvY2FsU2NvcmUucmVkICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2NvcmUgYmx1ZVwiPlxuICAgICAgICA8cCBjbGFzcz1cImdsb2JhbFwiPjwlPSBzaG93R2xvYmFsU2NvcmUgPyBnbG9iYWxTY29yZS5ibHVlIDogJycgJT48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibG9jYWxcIj48JT0gbG9jYWxTY29yZS5ibHVlICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2NvcmUgcGlua1wiPlxuICAgICAgICA8cCBjbGFzcz1cImdsb2JhbFwiPjwlPSBzaG93R2xvYmFsU2NvcmUgPyBnbG9iYWxTY29yZS5waW5rIDogJycgJT48L3A+XG4gICAgICAgIDxwIGNsYXNzPVwibG9jYWxcIj48JT0gbG9jYWxTY29yZS5waW5rICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2NvcmUgeWVsbG93XCI+XG4gICAgICAgIDxwIGNsYXNzPVwiZ2xvYmFsXCI+PCU9IHNob3dHbG9iYWxTY29yZSA/IGdsb2JhbFNjb3JlLnllbGxvdyA6ICcnICU+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImxvY2FsXCI+PCU9IGxvY2FsU2NvcmUueWVsbG93ICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY29uc3Qgc2NvcmVPcmRlciA9IFsncmVkJywgJ2JsdWUnLCAncGluaycsICd5ZWxsb3cnXTtcblxuY2xhc3MgU2NvcmVzVmlldyBleHRlbmRzIENhbnZhc1ZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy4kc2NvcmVzID0gQXJyYXkuZnJvbSh0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKCcuc2NvcmUnKSk7XG4gICAgdGhpcy4kZm9yZWdyb3VuZCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5mb3JlZ3JvdW5kJyk7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgLi4uYXJncykge1xuICAgIHN1cGVyLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCAuLi5hcmdzKTtcblxuICAgIC8vIHJlc2l6ZSBmb3JlZ3JvdW5kXG4gICAgdGhpcy4kZm9yZWdyb3VuZC5zdHlsZS53aWR0aCA9IGAke3ZpZXdwb3J0V2lkdGh9cHhgO1xuICAgIHRoaXMuJGZvcmVncm91bmQuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuXG4gICAgY29uc3QgaHcgPSB2aWV3cG9ydFdpZHRoIC8gMjtcbiAgICBjb25zdCBoaCA9IHZpZXdwb3J0SGVpZ2h0IC8gMjtcblxuICAgIHRoaXMuJHNjb3Jlcy5mb3JFYWNoKCgkc2NvcmUsIGluZGV4KSA9PiB7XG4gICAgICAkc2NvcmUuc3R5bGUud2lkdGggPSBgJHtod31weGA7XG4gICAgICAkc2NvcmUuc3R5bGUuaGVpZ2h0ID0gYCR7aGh9cHhgO1xuICAgICAgJHNjb3JlLnN0eWxlLmxpbmVIZWlnaHQgPSBgJHtoaH1weGA7XG4gICAgICAkc2NvcmUuc3R5bGUubGVmdCA9IGAkeyhpbmRleCAlIDIpICogaHd9cHhgO1xuICAgICAgJHNjb3JlLnN0eWxlLnRvcCA9IGAke01hdGguZmxvb3IoaW5kZXggLyAyKSAqIGhofXB4YDtcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBGYWRlSW5CYWxsb29uIGV4dGVuZHMgQmFsbG9vbiB7XG4gIGNvbnN0cnVjdG9yKGZhZGVJblRhcmdldCwgLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5mYWRlSW5UYXJnZXQgPSBmYWRlSW5UYXJnZXQ7XG4gICAgdGhpcy5vcGFjaXR5ID0gMDtcbiAgICB0aGlzLmZhZGVJbiA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBzdXBlci51cGRhdGUoZHQpO1xuXG4gICAgaWYgKHRoaXMuZmFkZUluICYmIHRoaXMub3BhY2l0eSA8IHRoaXMuZmFkZUluVGFyZ2V0KSB7XG4gICAgICB0aGlzLm9wYWNpdHkgPSBNYXRoLm1pbigxLCB0aGlzLm9wYWNpdHkgKz0gMC4wMik7XG5cbiAgICAgIGlmICh0aGlzLm9wYWNpdHkgPT09IHRoaXMuZmFkZUluVGFyZ2V0KVxuICAgICAgICB0aGlzLmZhZGVJbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBTY29yZXNSZW5kZXJlciBleHRlbmRzIENhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzcHJpdGVDb25maWcsIHNjb3JlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMubG9jYWxTY29yZSA9IHNjb3JlO1xuICAgIHRoaXMuZ2xvYmFsU2NvcmUgPSBudWxsO1xuICAgIHRoaXMudHJhbnNmZXJSYXRpb3MgPSB7IHJlZDogMCwgYmx1ZTogMCwgcGluazogMCwgeWVsbG93OiAwIH07XG5cbiAgICB0aGlzLmxvY2FsQmFsbG9vbnMgPSBbXTtcbiAgICB0aGlzLmdsb2JhbEJhbGxvb25zID0gW107XG5cbiAgICB0aGlzLmdsb2JhbEJhbGxvb25zT2Zmc2V0ID0gMjA7XG4gICAgLy8gdGhpcy5iYXJzID0gW107XG4gICAgdGhpcy5leHBsb2RlZCA9IFtdO1xuICAgIHRoaXMuc2hvd0dsb2JhbFNjb3JlID0gZmFsc2U7XG4gIH1cblxuICBfZ2V0TG9jYWxCYWxsb29uU2l6ZShjb2xvcikge1xuICAgIGNvbnN0IGh3ID0gdGhpcy5jYW52YXNXaWR0aCAvIDI7XG4gICAgY29uc3QgaGggPSB0aGlzLmNhbnZhc0hlaWdodCAvIDI7XG4gICAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKGh3LCBoaCk7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgY29uc3QgcGFkZGluZyA9IDEwO1xuICAgIGNvbnN0IG1heFNpemUgPSBzaXplIC0gcGFkZGluZztcbiAgICBjb25zdCBtaW5TaXplID0gbWF4U2l6ZSAqIGNvbmZpZy5taW5TaXplU2NvcmVSYXRpbztcbiAgICBjb25zdCBsb2NhbFNjb3JlID0gdGhpcy5sb2NhbFNjb3JlO1xuXG4gICAgbGV0IG1heFNjb3JlID0gLUluZmluaXR5O1xuICAgIGxldCBtaW5TY29yZSA9ICtJbmZpbml0eTtcblxuICAgIGZvciAobGV0IGNvbG9yIGluIGxvY2FsU2NvcmUpIHtcbiAgICAgIGlmIChsb2NhbFNjb3JlW2NvbG9yXSA+IG1heFNjb3JlKVxuICAgICAgICBtYXhTY29yZSA9IGxvY2FsU2NvcmVbY29sb3JdO1xuXG4gICAgICBpZiAobG9jYWxTY29yZVtjb2xvcl0gPCBtaW5TY29yZSlcbiAgICAgICAgbWluU2NvcmUgPSBsb2NhbFNjb3JlW2NvbG9yXTtcbiAgICB9XG5cbiAgICBjb25zdCBzY29yZSA9IGxvY2FsU2NvcmVbY29sb3JdO1xuICAgIGNvbnN0IG5vcm1TY29yZSA9IChtYXhTY29yZSAtIG1pblNjb3JlKSA9PT0gMCA/XG4gICAgICAwIDogKHNjb3JlIC0gbWluU2NvcmUpIC8gKG1heFNjb3JlIC0gbWluU2NvcmUpO1xuICAgIGNvbnN0IHJlbWFpbmluZ1JhdGlvID0gMSAtIHRoaXMudHJhbnNmZXJSYXRpb3NbY29sb3JdO1xuICAgIGNvbnN0IHJlbWFpbmluZ05vcm1TY29yZSA9IG5vcm1TY29yZSAqIHJlbWFpbmluZ1JhdGlvO1xuICAgIGNvbnN0IGRpc3BsYXlTaXplID0gKG1heFNpemUgLSBtaW5TaXplKSAqIHJlbWFpbmluZ05vcm1TY29yZSArIG1pblNpemU7XG5cbiAgICByZXR1cm4gTWF0aC5mbG9vcihkaXNwbGF5U2l6ZSk7XG4gIH1cblxuICBfZ2V0R2xvYmFsQmFsbG9vblNpemUoY29sb3IpIHtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnNwcml0ZUNvbmZpZztcbiAgICBjb25zdCB3ID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoID0gdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgY29uc3QgbWF4U2l6ZSA9IE1hdGgubWluKGgsIHcpICogMjtcbiAgICBjb25zdCBtaW5TaXplID0gTWF0aC5taW4oaCwgdykgKiAwLjM7XG4gICAgY29uc3QgZ2xvYmFsU2NvcmUgPSB0aGlzLmdsb2JhbFNjb3JlO1xuXG4gICAgaWYgKGdsb2JhbFNjb3JlID09PSBudWxsKVxuICAgICAgcmV0dXJuIG1pblNpemU7XG5cbiAgICBsZXQgbWF4UGVyY2VudCA9IC1JbmZpbml0eTtcblxuICAgIGZvciAobGV0IGNvbG9yIGluIGdsb2JhbFNjb3JlKSB7XG4gICAgICBpZiAoZ2xvYmFsU2NvcmVbY29sb3JdID4gbWF4UGVyY2VudClcbiAgICAgICAgbWF4UGVyY2VudCA9IGdsb2JhbFNjb3JlW2NvbG9yXTtcbiAgICB9XG5cbiAgICAvLyBtYXggcGVyY2VudCBpcyBtYXggc2l6ZSAtIDAgaXMgbWluIHNpemVcbiAgICBjb25zdCBjdXJyZW50UGVyY2VudCA9IGdsb2JhbFNjb3JlW2NvbG9yXSAqIHRoaXMudHJhbnNmZXJSYXRpb3NbY29sb3JdO1xuICAgIGNvbnN0IG5vcm1DdXJyZW50UGVyY2VudCA9IGN1cnJlbnRQZXJjZW50IC8gbWF4UGVyY2VudDtcbiAgICBjb25zdCBkaXNwbGF5U2l6ZSA9IChtYXhTaXplIC0gbWluU2l6ZSkgKiBub3JtQ3VycmVudFBlcmNlbnQgKyBtaW5TaXplO1xuXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoZGlzcGxheVNpemUpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRMb2NhbEJhbGxvb25zKCk7XG4gICAgdGhpcy5pbml0R2xvYmFsQmFsbG9vbnMoKTtcbiAgfVxuXG4gIGluaXRMb2NhbEJhbGxvb25zKCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuc3ByaXRlQ29uZmlnO1xuICAgIGNvbnN0IGhoID0gdGhpcy5jYW52YXNIZWlnaHQgLyAyO1xuICAgIGNvbnN0IGh3ID0gdGhpcy5jYW52YXNXaWR0aCAvIDI7XG5cbiAgICBzY29yZU9yZGVyLmZvckVhY2goKGNvbG9yLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgICAgY29uc3QgY2xpcFdpZHRoID0gY29uZmlnLmNsaXBTaXplLndpZHRoO1xuICAgICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2dldEdsb2JhbEJhbGxvb25TaXplKGNvbG9yKTtcblxuICAgICAgY29uc3QgeCA9IGh3IC8gMiArIGh3ICogKGluZGV4ICUgMik7XG4gICAgICBjb25zdCB5ID0gaGggLyAyICsgaGggKiBNYXRoLmZsb29yKGluZGV4IC8gMik7XG5cbiAgICAgIGNvbnN0IGJhbGxvb24gPSBuZXcgRmFkZUluQmFsbG9vbigxLCBjb2xvciwgaW1hZ2UsIGNsaXBQb3NpdGlvbnMsIGNsaXBXaWR0aCwgY2xpcEhlaWdodCwgcmVmcmVzaFJhdGUsIHNpemUsIHNpemUsIHgsIHkpO1xuXG4gICAgICB0aGlzLmxvY2FsQmFsbG9vbnMucHVzaChiYWxsb29uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRHbG9iYWxCYWxsb29ucygpIHtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnNwcml0ZUNvbmZpZztcbiAgICBjb25zdCBoID0gdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgY29uc3QgdyA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5nbG9iYWxCYWxsb29uc09mZnNldDtcblxuICAgIHNjb3JlT3JkZXIuZm9yRWFjaCgoY29sb3IsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpbWFnZSA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmltYWdlO1xuICAgICAgY29uc3QgY2xpcFBvc2l0aW9ucyA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmNsaXBQb3NpdGlvbnM7XG4gICAgICBjb25zdCBjbGlwV2lkdGggPSBjb25maWcuY2xpcFNpemUud2lkdGg7XG4gICAgICBjb25zdCBjbGlwSGVpZ2h0ID0gY29uZmlnLmNsaXBTaXplLmhlaWdodDtcbiAgICAgIGNvbnN0IHJlZnJlc2hSYXRlID0gY29uZmlnLmFuaW1hdGlvblJhdGU7XG4gICAgICBjb25zdCBzaXplID0gdGhpcy5fZ2V0R2xvYmFsQmFsbG9vblNpemUoY29sb3IpO1xuXG4gICAgICBjb25zdCB4ID0gKGluZGV4ICUgMikgPT09IDAgPyBvZmZzZXQgOiB3IC0gb2Zmc2V0O1xuICAgICAgY29uc3QgeSA9IE1hdGguZmxvb3IoaW5kZXggLyAyKSA9PT0gMCA/IG9mZnNldCA6IGggLSBvZmZzZXQ7XG5cbiAgICAgIGNvbnN0IGJhbGxvb24gPSBuZXcgQmFsbG9vbihjb2xvciwgaW1hZ2UsIGNsaXBQb3NpdGlvbnMsIGNsaXBXaWR0aCwgY2xpcEhlaWdodCwgcmVmcmVzaFJhdGUsIHNpemUsIHNpemUsIHgsIHkpO1xuXG4gICAgICB0aGlzLmdsb2JhbEJhbGxvb25zLnB1c2goYmFsbG9vbik7XG4gICAgfSk7XG4gIH1cblxuICBzZXRUcmFuc2ZlcnRSYXRpbyhjb2xvciwgdmFsdWUpIHtcbiAgICB0aGlzLnRyYW5zZmVyUmF0aW9zW2NvbG9yXSA9IHZhbHVlO1xuXG4gICAgdGhpcy5sb2NhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IHtcbiAgICAgIGlmIChiYWxsb29uLmNvbG9yID09PSBjb2xvcikge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5fZ2V0TG9jYWxCYWxsb29uU2l6ZShjb2xvcik7XG4gICAgICAgIGJhbGxvb24ud2lkdGggPSBzaXplO1xuICAgICAgICBiYWxsb29uLmhlaWdodCA9IHNpemU7XG5cbiAgICAgICAgaWYgKCFiYWxsb29uLmZhZGVJbilcbiAgICAgICAgICBiYWxsb29uLm9wYWNpdHkgPSAoMSAtIHZhbHVlKSAqIDAuOCArIDAuMjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZ2xvYmFsQmFsbG9vbnMuZm9yRWFjaCgoYmFsbG9vbikgPT4ge1xuICAgICAgaWYgKGJhbGxvb24uY29sb3IgPT09IGNvbG9yKSB7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLl9nZXRHbG9iYWxCYWxsb29uU2l6ZShjb2xvcik7XG4gICAgICAgIGJhbGxvb24ud2lkdGggPSBzaXplO1xuICAgICAgICBiYWxsb29uLmhlaWdodCA9IHNpemU7XG4gICAgICAgIGJhbGxvb24ub3BhY2l0eSA9IHZhbHVlICogMC44ICsgMC4yO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXhwbG9kZShjb2xvcikge1xuICAgIHRoaXMubG9jYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiB7XG4gICAgICBpZiAoYmFsbG9vbi5jb2xvciA9PT0gY29sb3IpXG4gICAgICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmdsb2JhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IHtcbiAgICAgIGlmIChiYWxsb29uLmNvbG9yID09PSBjb2xvcilcbiAgICAgICAgYmFsbG9vbi5leHBsb2RlID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuZXhwbG9kZWQucHVzaChjb2xvcik7XG4gIH1cblxuICBvblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKTtcblxuICAgIGNvbnN0IGh3ID0gd2lkdGggLyAyO1xuICAgIGNvbnN0IGhoID0gaGVpZ2h0IC8gMjtcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLmdsb2JhbEJhbGxvb25zT2Zmc2V0O1xuXG4gICAgdGhpcy5sb2NhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24sIGluZGV4KSA9PiB7XG4gICAgICBiYWxsb29uLnggPSBodyAvIDIgKyBodyAqIChpbmRleCAlIDIpO1xuICAgICAgYmFsbG9vbi55ID0gaGggLyAyICsgaGggKiBNYXRoLmZsb29yKGluZGV4IC8gMik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmdsb2JhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24sIGluZGV4KSA9PiB7XG4gICAgICBiYWxsb29uLnggPSAoaW5kZXggJSAyKSA9PT0gMCA/IG9mZnNldCA6IHdpZHRoIC0gb2Zmc2V0O1xuICAgICAgYmFsbG9vbi55ID0gTWF0aC5mbG9vcihpbmRleCAvIDIpID09PSAwID8gb2Zmc2V0IDogaGVpZ2h0IC0gb2Zmc2V0O1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgdGhpcy5sb2NhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IGJhbGxvb24udXBkYXRlKGR0KSk7XG5cbiAgICBpZiAodGhpcy5zaG93R2xvYmFsU2NvcmUpXG4gICAgICB0aGlzLmdsb2JhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IGJhbGxvb24udXBkYXRlKGR0KSk7XG4gIH1cblxuICByZW5kZXIoY3R4KSB7XG4gICAgdGhpcy5sb2NhbEJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IGJhbGxvb24ucmVuZGVyKGN0eCkpO1xuXG4gICAgaWYgKHRoaXMuc2hvd0dsb2JhbFNjb3JlKVxuICAgICAgdGhpcy5nbG9iYWxCYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiBiYWxsb29uLnJlbmRlcihjdHgpKTtcbiAgfVxufVxuXG5jbGFzcyBTY29yZXNTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG5cbiAgICB0aGlzLmxvY2FsU2NvcmUgPSBnbG9iYWxTdGF0ZS5zY29yZTtcbiAgICB0aGlzLmdsb2JhbFNjb3JlID0gbnVsbDtcbiAgICB0aGlzLnRyYW5zZmVyUmF0aW9zID0geyByZWQ6IDAsIGJsdWU6IDAsIHBpbms6IDAsIHllbGxvdzogMCB9O1xuICAgIC8vIEBkZWJ1Z1xuICAgIC8vIHRoaXMubG9jYWxTY29yZSA9IHsgcmVkOiAtMTIsIGJsdWU6IDM1LCBwaW5rOiAyMywgeWVsbG93OiAxOCB9O1xuXG4gICAgdGhpcy5fb25HbG9iYWxTY29yZVJlc3BvbnNlID0gdGhpcy5fb25HbG9iYWxTY29yZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgLy9cbiAgICB0aGlzLl9vblNob3dHbG9iYWxTY29yZSA9IHRoaXMuX29uU2hvd0dsb2JhbFNjb3JlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25CbHVlVHJhbnNmZXJ0UmF0aW9VcGRhdGUgPSB0aGlzLl9vblRyYW5zZmVydFJhdGlvVXBkYXRlKCdibHVlJyk7XG4gICAgdGhpcy5fb25QaW5rVHJhbnNmZXJ0UmF0aW9VcGRhdGUgPSB0aGlzLl9vblRyYW5zZmVydFJhdGlvVXBkYXRlKCdwaW5rJyk7XG4gICAgdGhpcy5fb25ZZWxsb3dUcmFuc2ZlcnRSYXRpb1VwZGF0ZSA9IHRoaXMuX29uVHJhbnNmZXJ0UmF0aW9VcGRhdGUoJ3llbGxvdycpO1xuICAgIHRoaXMuX29uUmVkVHJhbnNmZXJ0UmF0aW9VcGRhdGUgPSB0aGlzLl9vblRyYW5zZmVydFJhdGlvVXBkYXRlKCdyZWQnKTtcbiAgICB0aGlzLl9vbkV4cGxvZGUgPSB0aGlzLl9vbkV4cGxvZGUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgU2NvcmVzUmVuZGVyZXIodGhpcy5leHBlcmllbmNlLnNwcml0ZUNvbmZpZywgdGhpcy5sb2NhbFNjb3JlKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIGNvbnN0IGRpc3BsYXllZExvY2FsU2NvcmUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmxvY2FsU2NvcmUpO1xuICAgIGNvbnN0IGRpc3BsYXllZEdsb2JhbFNjb3JlID0geyByZWQ6ICcwLjAlJywgYmx1ZTogJzAuMCUnLCBwaW5rOiAnMC4wJScsIHllbGxvdzogJzAuMCUnIH07XG5cbiAgICB0aGlzLnZpZXcgPSBuZXcgU2NvcmVzVmlldyh0ZW1wbGF0ZSwge1xuICAgICAgc2hvd0dsb2JhbFNjb3JlOiBmYWxzZSxcbiAgICAgIGxvY2FsU2NvcmU6IGRpc3BsYXllZExvY2FsU2NvcmUsXG4gICAgICBnbG9iYWxTY29yZTogZGlzcGxheWVkR2xvYmFsU2NvcmUsXG4gICAgfSwge30sIHtcbiAgICAgIGNsYXNzTmFtZTogWydzY29yZXMtc3RhdGUnLCAnZm9yZWdyb3VuZCddLFxuICAgICAgcmF0aW9zOiB7ICcuc2NvcmUtd3JhcHBlcic6IDEgfSxcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgIHRoaXMudmlldy5hcHBlbmRUbyh0aGlzLmV4cGVyaWVuY2Uudmlldy5nZXRTdGF0ZUNvbnRhaW5lcigpKTtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG5cbiAgICAvLyBzZW5kIGxvY2FsIGFuZCByZWNlaXZlIGdsb2JhbCBzY29yZVxuICAgIHRoaXMuZXhwZXJpZW5jZS5zZW5kKCdwbGF5ZXI6c2NvcmUnLCB0aGlzLmxvY2FsU2NvcmUpO1xuICAgIHRoaXMuZXhwZXJpZW5jZS5yZWNlaXZlKCdnbG9iYWw6c2NvcmUnLCB0aGlzLl9vbkdsb2JhbFNjb3JlUmVzcG9uc2UpO1xuXG4gICAgY29uc3Qgc2hhcmVkUGFyYW1zID0gdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcztcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc2NvcmU6c2hvd0dsb2JhbFNjb3JlJywgdGhpcy5fb25TaG93R2xvYmFsU2NvcmUpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdzY29yZTpibHVlOnRyYW5zZmVydFJhdGlvJywgdGhpcy5fb25CbHVlVHJhbnNmZXJ0UmF0aW9VcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdzY29yZTpwaW5rOnRyYW5zZmVydFJhdGlvJywgdGhpcy5fb25QaW5rVHJhbnNmZXJ0UmF0aW9VcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdzY29yZTp5ZWxsb3c6dHJhbnNmZXJ0UmF0aW8nLCB0aGlzLl9vblllbGxvd1RyYW5zZmVydFJhdGlvVXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignc2NvcmU6cmVkOnRyYW5zZmVydFJhdGlvJywgdGhpcy5fb25SZWRUcmFuc2ZlcnRSYXRpb1VwZGF0ZSk7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ3Njb3JlOmV4cGxvZGUnLCB0aGlzLl9vbkV4cGxvZGUpO1xuXG4gICAgdGhpcy5jcmVkaXRzVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5leHBlcmllbmNlLnNob3dDcmVkaXRzUGFnZSg0KTtcbiAgICB9LCA3MDAwKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY3JlZGl0c1RpbWVvdXQpO1xuICAgIHRoaXMuZXhwZXJpZW5jZS5zaG93Q3JlZGl0c1BhZ2UoMCk7XG5cbiAgICB0aGlzLnZpZXcuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvcmVncm91bmQnKTtcbiAgICB0aGlzLnZpZXcuJGVsLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcblxuICAgIHRoaXMudmlldy5yZW1vdmVSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG5cbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdzY29yZTpzaG93R2xvYmFsU2NvcmUnLCB0aGlzLl9vblNob3dHbG9iYWxTY29yZSk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ3Njb3JlOmJsdWU6dHJhbnNmZXJ0UmF0aW8nLCB0aGlzLl9vbkJsdWVUcmFuc2ZlcnRSYXRpb1VwZGF0ZSk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ3Njb3JlOnBpbms6dHJhbnNmZXJ0UmF0aW8nLCB0aGlzLl9vblBpbmtUcmFuc2ZlcnRSYXRpb1VwZGF0ZSk7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ3Njb3JlOnllbGxvdzp0cmFuc2ZlcnRSYXRpbycsIHRoaXMuX29uWWVsbG93VHJhbnNmZXJ0UmF0aW9VcGRhdGUpO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdzY29yZTpyZWQ6dHJhbnNmZXJ0UmF0aW8nLCB0aGlzLl9vblJlZFRyYW5zZmVydFJhdGlvVXBkYXRlKTtcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcignc2NvcmU6ZXhwbG9kZScsIHRoaXMuX29uRXhwbG9kZSk7XG5cbiAgICB0aGlzLmV4cGVyaWVuY2UucmVtb3ZlTGlzdGVuZXIoJ2dsb2JhbDpzY29yZScsIHRoaXMuX29uR2xvYmFsU2NvcmVSZXNwb25zZSk7XG4gIH1cblxuICBfb25HbG9iYWxTY29yZVJlc3BvbnNlKGdsb2JhbFNjb3JlKSB7XG4gICAgLy8gcG9wdWxhdGUgcmVuZGVyZXIgd2l0aCBnbG9iYWxTY29yZVxuICAgIHRoaXMuZ2xvYmFsU2NvcmUgPSBnbG9iYWxTY29yZTtcbiAgICB0aGlzLnJlbmRlcmVyLmdsb2JhbFNjb3JlID0gZ2xvYmFsU2NvcmU7XG5cbiAgICB0aGlzLl9vbkJsdWVUcmFuc2ZlcnRSYXRpb1VwZGF0ZSh0aGlzLnRyYW5zZmVyUmF0aW9zWydibHVlJ10pO1xuICAgIHRoaXMuX29uUGlua1RyYW5zZmVydFJhdGlvVXBkYXRlKHRoaXMudHJhbnNmZXJSYXRpb3NbJ3BpbmsnXSk7XG4gICAgdGhpcy5fb25ZZWxsb3dUcmFuc2ZlcnRSYXRpb1VwZGF0ZSh0aGlzLnRyYW5zZmVyUmF0aW9zWyd5ZWxsb3cnXSk7XG4gICAgdGhpcy5fb25SZWRUcmFuc2ZlcnRSYXRpb1VwZGF0ZSh0aGlzLnRyYW5zZmVyUmF0aW9zWydyZWQnXSk7XG4gIH1cblxuICBfb25TaG93R2xvYmFsU2NvcmUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdzaG93Jykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zaG93R2xvYmFsU2NvcmUgPSB0cnVlO1xuICAgICAgdGhpcy52aWV3Lm1vZGVsLnNob3dHbG9iYWxTY29yZSA9IHRydWU7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2NvcmUtd3JhcHBlcicpO1xuICAgIH1cbiAgfVxuXG4gIF9vblRyYW5zZmVydFJhdGlvVXBkYXRlKGNvbG9yKSB7XG4gICAgcmV0dXJuICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy50cmFuc2ZlclJhdGlvc1tjb2xvcl0gPSB2YWx1ZTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0VHJhbnNmZXJ0UmF0aW8oY29sb3IsIHZhbHVlKTtcblxuICAgICAgLy8gdXBkYXRlIGxvY2FsIHNjb3JlXG4gICAgICBjb25zdCByZW1haW5WYWx1ZSA9IE1hdGgucm91bmQodGhpcy5sb2NhbFNjb3JlW2NvbG9yXSAqICgxIC0gdmFsdWUpKTtcbiAgICAgIHRoaXMudmlldy5tb2RlbC5sb2NhbFNjb3JlW2NvbG9yXSA9IHJlbWFpblZhbHVlO1xuICAgICAgLy8gdXBkYXRlIGdsb2JhbCBzY29yZVxuICAgICAgaWYgKHRoaXMuZ2xvYmFsU2NvcmUpIHtcbiAgICAgICAgY29uc3QgcGVyY2VudCA9IHRoaXMuZ2xvYmFsU2NvcmVbY29sb3JdICogdmFsdWU7XG4gICAgICAgIHRoaXMudmlldy5tb2RlbC5nbG9iYWxTY29yZVtjb2xvcl0gPSBgJHtwZXJjZW50LnRvRml4ZWQoMSl9JWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmlldy5yZW5kZXIoYC5zY29yZS4ke2NvbG9yfSBwLmxvY2FsYCk7XG4gICAgICB0aGlzLnZpZXcucmVuZGVyKGAuc2NvcmUuJHtjb2xvcn0gcC5nbG9iYWxgKTtcbiAgICB9XG4gIH1cblxuICBfb25FeHBsb2RlKGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yICE9PSAnbm9uZScpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZShjb2xvcik7XG5cbiAgICAgIHRoaXMudmlldy5tb2RlbC5sb2NhbFNjb3JlW2NvbG9yXSA9ICcnO1xuICAgICAgdGhpcy52aWV3LnJlbmRlcignLnNjb3JlLXdyYXBwZXInKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NvcmVzU3RhdGU7XG4iXX0=