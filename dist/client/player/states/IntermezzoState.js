'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _Balloon = require('../renderers/Balloon');

var _Balloon2 = _interopRequireDefault(_Balloon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="score-wrapper">\n      <% if (showScoreNumbers) { %>\n        <div class="score red"><%= score.red %></div>\n        <div class="score blue"><%= score.blue %></div>\n        <div class="score pink"><%= score.pink %></div>\n        <div class="score yellow"><%= score.yellow %></div>\n      <% } %>\n    </div>\n  </div>\n';

var scoreOrder = ['red', 'blue', 'pink', 'yellow'];

var IntermezzoView = function (_CanvasView) {
  (0, _inherits3.default)(IntermezzoView, _CanvasView);

  function IntermezzoView() {
    (0, _classCallCheck3.default)(this, IntermezzoView);
    return (0, _possibleConstructorReturn3.default)(this, (IntermezzoView.__proto__ || (0, _getPrototypeOf2.default)(IntermezzoView)).apply(this, arguments));
  }

  (0, _createClass3.default)(IntermezzoView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get4.default)(IntermezzoView.prototype.__proto__ || (0, _getPrototypeOf2.default)(IntermezzoView.prototype), 'onRender', this).call(this);

      this.$red = this.$el.querySelector('.red');
      this.$blue = this.$el.querySelector('.blue');
      this.$pink = this.$el.querySelector('.pink');
      this.$yellow = this.$el.querySelector('.yellow');

      this.$scores = (0, _from2.default)(this.$el.querySelectorAll('.score'));
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight) {
      var _get2;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      (_get2 = (0, _get4.default)(IntermezzoView.prototype.__proto__ || (0, _getPrototypeOf2.default)(IntermezzoView.prototype), 'onResize', this)).call.apply(_get2, [this, viewportWidth, viewportHeight].concat(args));

      var hw = viewportWidth / 2;
      var hh = viewportHeight / 2;

      this.$scores.forEach(function ($score) {
        $score.style.width = hw + 'px';
        $score.style.height = hh + 'px';
        $score.style.lineHeight = hh + 'px';
      });
    }
  }]);
  return IntermezzoView;
}(_client.CanvasView);

var IntermezzoRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(IntermezzoRenderer, _Canvas2dRenderer);

  function IntermezzoRenderer(spriteConfig, score, onExploded) {
    (0, _classCallCheck3.default)(this, IntermezzoRenderer);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (IntermezzoRenderer.__proto__ || (0, _getPrototypeOf2.default)(IntermezzoRenderer)).call(this));

    _this2.spriteConfig = spriteConfig;
    // this.score = score;
    _this2.score = score;
    _this2.onExploded = onExploded;

    _this2.balloons = [];
    return _this2;
  }

  (0, _createClass3.default)(IntermezzoRenderer, [{
    key: 'init',
    value: function init() {
      var _this3 = this;

      var hw = this.canvasWidth / 2;
      var hh = this.canvasHeight / 2;
      var size = Math.min(hw, hh);
      var config = this.spriteConfig;
      var padding = 10; //
      var maxSize = size - padding;
      var minSize = maxSize * config.minSizeScoreRatio;
      var maxScore = -Infinity;
      var minScore = +Infinity;

      for (var key in this.score) {
        if (this.score[key] > maxScore) maxScore = this.score[key];

        if (this.score[key] < minScore) minScore = this.score[key];
      }

      // initialize the balloons
      scoreOrder.forEach(function (color, index) {
        var score = _this3.score[color];
        var normScore = maxScore - minScore === 0 ? 0 : (score - minScore) / (maxScore - minScore);

        var image = config.groups[color].image;
        var clipPositions = config.groups[color].clipPositions;
        var clipWidth = config.clipSize.width;
        var clipHeight = config.clipSize.height;
        var refreshRate = config.animationRate;

        var size = (maxSize - minSize) * normScore + minSize;
        var x = hw / 2 + hw * (index % 2);
        var y = hh / 2 + hh * Math.floor(index / 2);

        var balloon = new _Balloon2.default(color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

        balloon.opacity = 0;

        _this3.balloons.push(balloon);
      });
    }
  }, {
    key: 'explode',
    value: function explode() {
      this.balloons.forEach(function (balloon) {
        return balloon.explode = true;
      });
    }
  }, {
    key: 'onResize',
    value: function onResize(width, height, orientation) {
      (0, _get4.default)(IntermezzoRenderer.prototype.__proto__ || (0, _getPrototypeOf2.default)(IntermezzoRenderer.prototype), 'onResize', this).call(this, width, height, orientation);

      var hw = width / 2;
      var hh = height / 2;

      this.balloons.forEach(function (balloon, index) {
        balloon.x = hw / 2 + hw * (index % 2);
        balloon.y = hh / 2 + hh * Math.floor(index / 2);
      });
    }
  }, {
    key: 'update',
    value: function update(dt) {
      this.balloons.forEach(function (balloon) {
        if (balloon.opacity < 1) balloon.opacity = Math.min(1, balloon.opacity += 0.02);

        balloon.update(dt);
      });

      var animationEnded = true;

      this.balloons.forEach(function (balloon) {
        if (!balloon.isDead) animationEnded = false;
      });

      if (animationEnded === true) this.onExploded();
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      this.balloons.forEach(function (balloon) {
        return balloon.render(ctx);
      });
    }
  }]);
  return IntermezzoRenderer;
}(_client.Canvas2dRenderer);

var IntermezzoState = function () {
  function IntermezzoState(experience, globalState) {
    (0, _classCallCheck3.default)(this, IntermezzoState);

    this.experience = experience;
    this.globalState = globalState;

    this._onExploded = this._onExploded.bind(this);

    this.renderer = new IntermezzoRenderer(this.experience.spriteConfig, globalState.score, this._onExploded);
  }

  (0, _createClass3.default)(IntermezzoState, [{
    key: 'enter',
    value: function enter() {
      var _this4 = this;

      var displayedScore = { red: 0, blue: 0, pink: 0, yellow: 0 };
      var score = this.globalState.score;

      this.view = new IntermezzoView(template, {
        showScoreNumbers: true,
        score: displayedScore
      }, {}, {
        className: ['intermezzo-state', 'foreground'],
        ratios: { '.score-wrapper': 1 }
      });

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);
        // abuse preRender to animate score numbers
        var updated = false;
        // increment displayed scores
        for (var color in displayedScore) {
          if (displayedScore[color] < score[color]) {
            displayedScore[color] += 1;
            updated = true;
          }

          if (displayedScore[color] > score[color]) {
            displayedScore[color] -= 1;
            updated = true;
          }
        }

        if (updated === true) _this4.view.render('.score-wrapper');
      });

      this.view.addRenderer(this.renderer);
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');

      this.view.model.showScoreNumbers = false;
      this.view.render('.score-wrapper');

      this.renderer.explode();
    }
  }, {
    key: '_onExploded',
    value: function _onExploded() {
      this.view.removeRenderer(this.renderer);
      this.view.remove();
    }
  }]);
  return IntermezzoState;
}();

exports.default = IntermezzoState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkludGVybWV6em9TdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsInNjb3JlT3JkZXIiLCJJbnRlcm1lenpvVmlldyIsIiRyZWQiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiJGJsdWUiLCIkcGluayIsIiR5ZWxsb3ciLCIkc2NvcmVzIiwicXVlcnlTZWxlY3RvckFsbCIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsImFyZ3MiLCJodyIsImhoIiwiZm9yRWFjaCIsIiRzY29yZSIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJsaW5lSGVpZ2h0IiwiQ2FudmFzVmlldyIsIkludGVybWV6em9SZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsInNjb3JlIiwib25FeHBsb2RlZCIsImJhbGxvb25zIiwiY2FudmFzV2lkdGgiLCJjYW52YXNIZWlnaHQiLCJzaXplIiwiTWF0aCIsIm1pbiIsImNvbmZpZyIsInBhZGRpbmciLCJtYXhTaXplIiwibWluU2l6ZSIsIm1pblNpemVTY29yZVJhdGlvIiwibWF4U2NvcmUiLCJJbmZpbml0eSIsIm1pblNjb3JlIiwia2V5IiwiY29sb3IiLCJpbmRleCIsIm5vcm1TY29yZSIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwiY2xpcEhlaWdodCIsInJlZnJlc2hSYXRlIiwiYW5pbWF0aW9uUmF0ZSIsIngiLCJ5IiwiZmxvb3IiLCJiYWxsb29uIiwiQmFsbG9vbiIsIm9wYWNpdHkiLCJwdXNoIiwiZXhwbG9kZSIsIm9yaWVudGF0aW9uIiwiZHQiLCJ1cGRhdGUiLCJhbmltYXRpb25FbmRlZCIsImlzRGVhZCIsImN0eCIsInJlbmRlciIsIkNhbnZhczJkUmVuZGVyZXIiLCJJbnRlcm1lenpvU3RhdGUiLCJleHBlcmllbmNlIiwiZ2xvYmFsU3RhdGUiLCJfb25FeHBsb2RlZCIsImJpbmQiLCJyZW5kZXJlciIsImRpc3BsYXllZFNjb3JlIiwicmVkIiwiYmx1ZSIsInBpbmsiLCJ5ZWxsb3ciLCJ2aWV3Iiwic2hvd1Njb3JlTnVtYmVycyIsImNsYXNzTmFtZSIsInJhdGlvcyIsInNob3ciLCJhcHBlbmRUbyIsImdldFN0YXRlQ29udGFpbmVyIiwic2V0UHJlUmVuZGVyIiwiY2xlYXJSZWN0IiwidXBkYXRlZCIsImFkZFJlbmRlcmVyIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwibW9kZWwiLCJyZW1vdmVSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxvYUFBTjs7QUFjQSxJQUFNQyxhQUFhLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsTUFBaEIsRUFBd0IsUUFBeEIsQ0FBbkI7O0lBRU1DLGM7Ozs7Ozs7Ozs7K0JBQ087QUFDVDs7QUFFQSxXQUFLQyxJQUFMLEdBQVksS0FBS0MsR0FBTCxDQUFTQyxhQUFULENBQXVCLE1BQXZCLENBQVo7QUFDQSxXQUFLQyxLQUFMLEdBQWEsS0FBS0YsR0FBTCxDQUFTQyxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxXQUFLRSxLQUFMLEdBQWEsS0FBS0gsR0FBTCxDQUFTQyxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxXQUFLRyxPQUFMLEdBQWUsS0FBS0osR0FBTCxDQUFTQyxhQUFULENBQXVCLFNBQXZCLENBQWY7O0FBRUEsV0FBS0ksT0FBTCxHQUFlLG9CQUFXLEtBQUtMLEdBQUwsQ0FBU00sZ0JBQVQsQ0FBMEIsUUFBMUIsQ0FBWCxDQUFmO0FBQ0Q7Ozs2QkFFUUMsYSxFQUFlQyxjLEVBQXlCO0FBQUE7O0FBQUEsd0NBQU5DLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUMvQyw2S0FBZUYsYUFBZixFQUE4QkMsY0FBOUIsU0FBaURDLElBQWpEOztBQUVBLFVBQU1DLEtBQUtILGdCQUFnQixDQUEzQjtBQUNBLFVBQU1JLEtBQUtILGlCQUFpQixDQUE1Qjs7QUFFQSxXQUFLSCxPQUFMLENBQWFPLE9BQWIsQ0FB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ckIsUUFBOUI7QUFDQSxXQUFLTSxJQUFMLENBQVVZLE1BQVY7QUFDRDs7Ozs7a0JBR1l2QixlIiwiZmlsZSI6IkludGVybWV6em9TdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbnZhc1ZpZXcsIENhbnZhczJkUmVuZGVyZXIgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgQmFsbG9vbiBmcm9tICcuLi9yZW5kZXJlcnMvQmFsbG9vbic7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzY29yZS13cmFwcGVyXCI+XG4gICAgICA8JSBpZiAoc2hvd1Njb3JlTnVtYmVycykgeyAlPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUgcmVkXCI+PCU9IHNjb3JlLnJlZCAlPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2NvcmUgYmx1ZVwiPjwlPSBzY29yZS5ibHVlICU+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzY29yZSBwaW5rXCI+PCU9IHNjb3JlLnBpbmsgJT48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNjb3JlIHllbGxvd1wiPjwlPSBzY29yZS55ZWxsb3cgJT48L2Rpdj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jb25zdCBzY29yZU9yZGVyID0gWydyZWQnLCAnYmx1ZScsICdwaW5rJywgJ3llbGxvdyddO1xuXG5jbGFzcyBJbnRlcm1lenpvVmlldyBleHRlbmRzIENhbnZhc1ZpZXcge1xuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuXG4gICAgdGhpcy4kcmVkID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnJlZCcpO1xuICAgIHRoaXMuJGJsdWUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuYmx1ZScpO1xuICAgIHRoaXMuJHBpbmsgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcucGluaycpO1xuICAgIHRoaXMuJHllbGxvdyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy55ZWxsb3cnKTtcblxuICAgIHRoaXMuJHNjb3JlcyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLnNjb3JlJykpO1xuICB9XG5cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIC4uLmFyZ3MpIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgLi4uYXJncyk7XG5cbiAgICBjb25zdCBodyA9IHZpZXdwb3J0V2lkdGggLyAyO1xuICAgIGNvbnN0IGhoID0gdmlld3BvcnRIZWlnaHQgLyAyO1xuXG4gICAgdGhpcy4kc2NvcmVzLmZvckVhY2goKCRzY29yZSkgPT4ge1xuICAgICAgJHNjb3JlLnN0eWxlLndpZHRoID0gYCR7aHd9cHhgO1xuICAgICAgJHNjb3JlLnN0eWxlLmhlaWdodCA9IGAke2hofXB4YDtcbiAgICAgICRzY29yZS5zdHlsZS5saW5lSGVpZ2h0ID0gYCR7aGh9cHhgO1xuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIEludGVybWV6em9SZW5kZXJlciBleHRlbmRzIENhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzcHJpdGVDb25maWcsIHNjb3JlLCBvbkV4cGxvZGVkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIC8vIHRoaXMuc2NvcmUgPSBzY29yZTtcbiAgICB0aGlzLnNjb3JlID0gc2NvcmU7XG4gICAgdGhpcy5vbkV4cGxvZGVkID0gb25FeHBsb2RlZDtcblxuICAgIHRoaXMuYmFsbG9vbnMgPSBbXTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgaHcgPSB0aGlzLmNhbnZhc1dpZHRoIC8gMjtcbiAgICBjb25zdCBoaCA9IHRoaXMuY2FudmFzSGVpZ2h0IC8gMjtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4oaHcsIGhoKTtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnNwcml0ZUNvbmZpZztcbiAgICBjb25zdCBwYWRkaW5nID0gMTA7IC8vXG4gICAgY29uc3QgbWF4U2l6ZSA9IHNpemUgLSBwYWRkaW5nO1xuICAgIGNvbnN0IG1pblNpemUgPSBtYXhTaXplICogY29uZmlnLm1pblNpemVTY29yZVJhdGlvO1xuICAgIGxldCBtYXhTY29yZSA9IC1JbmZpbml0eTtcbiAgICBsZXQgbWluU2NvcmUgPSArSW5maW5pdHk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zY29yZSkge1xuICAgICAgaWYgKHRoaXMuc2NvcmVba2V5XSA+IG1heFNjb3JlKVxuICAgICAgICBtYXhTY29yZSA9IHRoaXMuc2NvcmVba2V5XTtcblxuICAgICAgaWYgKHRoaXMuc2NvcmVba2V5XSA8IG1pblNjb3JlKVxuICAgICAgICBtaW5TY29yZSA9IHRoaXMuc2NvcmVba2V5XTtcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXplIHRoZSBiYWxsb29uc1xuICAgIHNjb3JlT3JkZXIuZm9yRWFjaCgoY29sb3IsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBzY29yZSA9IHRoaXMuc2NvcmVbY29sb3JdO1xuICAgICAgY29uc3Qgbm9ybVNjb3JlID0gKG1heFNjb3JlIC0gbWluU2NvcmUpID09PSAwID9cbiAgICAgICAgMCA6IChzY29yZSAtIG1pblNjb3JlKSAvIChtYXhTY29yZSAtIG1pblNjb3JlKTtcblxuICAgICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgICAgY29uc3QgY2xpcFdpZHRoID0gY29uZmlnLmNsaXBTaXplLndpZHRoO1xuICAgICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuXG4gICAgICBjb25zdCBzaXplID0gKG1heFNpemUgLSBtaW5TaXplKSAqIG5vcm1TY29yZSArIG1pblNpemU7XG4gICAgICBjb25zdCB4ID0gaHcgLyAyICsgaHcgKiAoaW5kZXggJSAyKTtcbiAgICAgIGNvbnN0IHkgPSBoaCAvIDIgKyBoaCAqIE1hdGguZmxvb3IoaW5kZXggLyAyKTtcblxuICAgICAgY29uc3QgYmFsbG9vbiA9IG5ldyBCYWxsb29uKGNvbG9yLCBpbWFnZSwgY2xpcFBvc2l0aW9ucywgY2xpcFdpZHRoLCBjbGlwSGVpZ2h0LCByZWZyZXNoUmF0ZSwgc2l6ZSwgc2l6ZSwgeCwgeSk7XG5cbiAgICAgIGJhbGxvb24ub3BhY2l0eSA9IDA7XG5cbiAgICAgIHRoaXMuYmFsbG9vbnMucHVzaChiYWxsb29uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cGxvZGUoKSB7XG4gICAgdGhpcy5iYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiBiYWxsb29uLmV4cGxvZGUgPSB0cnVlKTtcbiAgfVxuXG4gIG9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgY29uc3QgaHcgPSB3aWR0aCAvIDI7XG4gICAgY29uc3QgaGggPSBoZWlnaHQgLyAyO1xuXG4gICAgdGhpcy5iYWxsb29ucy5mb3JFYWNoKChiYWxsb29uLCBpbmRleCkgPT4ge1xuICAgICAgYmFsbG9vbi54ID0gaHcgLyAyICsgaHcgKiAoaW5kZXggJSAyKTtcbiAgICAgIGJhbGxvb24ueSA9IGhoIC8gMiArIGhoICogTWF0aC5mbG9vcihpbmRleCAvIDIpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgdGhpcy5iYWxsb29ucy5mb3JFYWNoKChiYWxsb29uKSA9PiB7XG4gICAgICBpZiAoYmFsbG9vbi5vcGFjaXR5IDwgMSlcbiAgICAgICAgYmFsbG9vbi5vcGFjaXR5ID0gTWF0aC5taW4oMSwgYmFsbG9vbi5vcGFjaXR5ICs9IDAuMDIpO1xuXG4gICAgICBiYWxsb29uLnVwZGF0ZShkdClcbiAgICB9KTtcblxuICAgIGxldCBhbmltYXRpb25FbmRlZCA9IHRydWU7XG5cbiAgICB0aGlzLmJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IHtcbiAgICAgIGlmICghYmFsbG9vbi5pc0RlYWQpXG4gICAgICAgIGFuaW1hdGlvbkVuZGVkID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBpZiAoYW5pbWF0aW9uRW5kZWQgPT09IHRydWUpXG4gICAgICB0aGlzLm9uRXhwbG9kZWQoKTtcbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICB0aGlzLmJhbGxvb25zLmZvckVhY2goKGJhbGxvb24pID0+IGJhbGxvb24ucmVuZGVyKGN0eCkpO1xuICB9XG59XG5cbmNsYXNzIEludGVybWV6em9TdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG5cbiAgICB0aGlzLl9vbkV4cGxvZGVkID0gdGhpcy5fb25FeHBsb2RlZC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBJbnRlcm1lenpvUmVuZGVyZXIodGhpcy5leHBlcmllbmNlLnNwcml0ZUNvbmZpZywgZ2xvYmFsU3RhdGUuc2NvcmUsIHRoaXMuX29uRXhwbG9kZWQpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgY29uc3QgZGlzcGxheWVkU2NvcmUgPSB7IHJlZDogMCwgYmx1ZTogMCwgcGluazogMCwgeWVsbG93OiAwIH07XG4gICAgY29uc3Qgc2NvcmUgPSB0aGlzLmdsb2JhbFN0YXRlLnNjb3JlO1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IEludGVybWV6em9WaWV3KHRlbXBsYXRlLCB7XG4gICAgICBzaG93U2NvcmVOdW1iZXJzOiB0cnVlLFxuICAgICAgc2NvcmU6IGRpc3BsYXllZFNjb3JlLFxuICAgIH0sIHt9LCB7XG4gICAgICBjbGFzc05hbWU6IFsnaW50ZXJtZXp6by1zdGF0ZScsICdmb3JlZ3JvdW5kJ10sXG4gICAgICByYXRpb3M6IHsgJy5zY29yZS13cmFwcGVyJzogMSB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHRoaXMudmlldy5zaG93KCk7XG4gICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuZXhwZXJpZW5jZS52aWV3LmdldFN0YXRlQ29udGFpbmVyKCkpO1xuXG4gICAgdGhpcy52aWV3LnNldFByZVJlbmRlcigoY3R4LCBkdCwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIC8vIGFidXNlIHByZVJlbmRlciB0byBhbmltYXRlIHNjb3JlIG51bWJlcnNcbiAgICAgIGxldCB1cGRhdGVkID0gZmFsc2U7XG4gICAgICAvLyBpbmNyZW1lbnQgZGlzcGxheWVkIHNjb3Jlc1xuICAgICAgZm9yIChsZXQgY29sb3IgaW4gZGlzcGxheWVkU2NvcmUpIHtcbiAgICAgICAgaWYgKGRpc3BsYXllZFNjb3JlW2NvbG9yXSA8IHNjb3JlW2NvbG9yXSkge1xuICAgICAgICAgIGRpc3BsYXllZFNjb3JlW2NvbG9yXSArPSAxO1xuICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpc3BsYXllZFNjb3JlW2NvbG9yXSA+IHNjb3JlW2NvbG9yXSkge1xuICAgICAgICAgIGRpc3BsYXllZFNjb3JlW2NvbG9yXSAtPSAxO1xuICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh1cGRhdGVkID09PSB0cnVlKVxuICAgICAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2NvcmUtd3JhcHBlcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LmFkZFJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLnZpZXcuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvcmVncm91bmQnKTtcbiAgICB0aGlzLnZpZXcuJGVsLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcblxuICAgIHRoaXMudmlldy5tb2RlbC5zaG93U2NvcmVOdW1iZXJzID0gZmFsc2U7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNjb3JlLXdyYXBwZXInKTtcblxuICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZSgpO1xuICB9XG5cbiAgX29uRXhwbG9kZWQoKSB7XG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnRlcm1lenpvU3RhdGU7XG4iXX0=