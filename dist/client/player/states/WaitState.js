'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _Balloon = require('../renderers/Balloon');

var _Balloon2 = _interopRequireDefault(_Balloon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-center">\n    </div>\n    <div class="section-bottom flex-middle">\n      <% if (showText) { %>\n        <!-- <p class="small soft-blink">Please wait for the beginning</p> -->\n        <p class="small info">\n          Please wait ...\n          <br>\n          Next session starting in\n          <br>\n          <%= timeLeftText %>\n        </p>\n      <% } %>\n    </div>\n  </div>\n';

var BalloonRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(BalloonRenderer, _Canvas2dRenderer);

  function BalloonRenderer(spriteConfig, onExplode) {
    (0, _classCallCheck3.default)(this, BalloonRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BalloonRenderer.__proto__ || (0, _getPrototypeOf2.default)(BalloonRenderer)).call(this));

    _this.spriteConfig = spriteConfig;
    _this.onExplode = onExplode;
    return _this;
  }

  (0, _createClass3.default)(BalloonRenderer, [{
    key: 'init',
    value: function init() {
      // should create a factory (getBallon())
      var config = this.spriteConfig;
      // pick a random color
      var colorIndex = Math.floor(Math.random() * config.colors.length);
      var color = config.colors[colorIndex];

      var image = config.groups[color].image;
      var clipPositions = config.groups[color].clipPositions;
      var clipWidth = config.clipSize.width;
      var clipHeight = config.clipSize.height;
      var refreshRate = config.animationRate;
      var size = Math.min(this.canvasWidth, this.canvasHeight) * config.largeSizeRatio;
      var x = this.canvasWidth / 2;
      var y = this.canvasHeight / 2;

      this.balloon = new _Balloon2.default(color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

      this.balloon.opacity = 0;
    }
  }, {
    key: 'onResize',
    value: function onResize(canvasWidth, canvasHeight, orientation) {
      (0, _get3.default)(BalloonRenderer.prototype.__proto__ || (0, _getPrototypeOf2.default)(BalloonRenderer.prototype), 'onResize', this).call(this, canvasWidth, canvasHeight, orientation);

      if (this.balloon) {
        this.balloon.x = canvasWidth / 2;
        this.balloon.y = canvasHeight / 2;
      }
    }
  }, {
    key: 'explode',
    value: function explode() {
      this.balloon.explode = true;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      // this.balloon.x += Math.random() * 0.2 - 0.1;
      // this.balloon.y += Math.random() * 0.2 - 0.1;
      this.balloon.update(dt);

      if (this.balloon.opacity < 1) this.balloon.opacity = Math.min(this.balloon.opacity + 0.02, 1);

      if (this.balloon.isDead) this.onExplode();
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      this.balloon.render(ctx);
    }
  }]);
  return BalloonRenderer;
}(_client.Canvas2dRenderer);

var WaitState = function () {
  function WaitState(experience, globalState) {
    var _this2 = this;

    (0, _classCallCheck3.default)(this, WaitState);

    this.experience = experience;
    this.globalState = globalState;

    this._onExploded = this._onExploded.bind(this);
    this.renderer = new BalloonRenderer(this.experience.spriteConfig, this._onExploded);

    if (!this.timeListener) {
      this.timeListener = this.experience.receive('global:time', function (syncTime, time) {
        var min = parseInt(time / 60);
        var sec = parseInt(time % 60);

        console.log(time);
        console.log(min + ' ' + sec);

        if (!_this2.view || !_this2.view.$el.querySelector('.info')) return;

        _this2.view.model.timeLeftText = min + '\'' + ("0" + sec).slice(-2) + '\'\'';
        _this2.view.render('.info');
      });
    }
  }

  (0, _createClass3.default)(WaitState, [{
    key: 'enter',
    value: function enter() {
      this.view = new _client.CanvasView(template, {
        showText: true,
        timeLeftText: ''
      }, {}, {
        className: ['wait-state', 'foreground']
      });

      // update timeLeft like this :
      // this.view.model.timeLeftText = '4\'33\'\'';
      // this.view.render('.info');

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);
      });

      this.view.addRenderer(this.renderer);

      // this.timeListener = this.experience.sharedParams.addParamListener('global:time', time => {
      //   const min = parseInt(time / 60);
      //   const sec = parseInt(time % 60);
      //   // console.log(time);
      //   // console.log(min + ' ' + sec);
      //   this.view.model.timeLeftText = `${min}'${sec}''`;
      //   this.view.render('.info');
      // });
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');

      this.view.model.showText = false;
      this.view.render('.section-bottom');
      // make the balloon explode, wait for
      this.renderer.explode();

      this.experience.sharedParams.removeParamListener('global:time', this.timeListener);
    }
  }, {
    key: '_onExploded',
    value: function _onExploded() {
      this.view.removeRenderer(this.renderer);
      this.view.remove();
    }
  }]);
  return WaitState;
}();

exports.default = WaitState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhaXRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIkJhbGxvb25SZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsIm9uRXhwbG9kZSIsImNvbmZpZyIsImNvbG9ySW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjb2xvcnMiLCJsZW5ndGgiLCJjb2xvciIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwid2lkdGgiLCJjbGlwSGVpZ2h0IiwiaGVpZ2h0IiwicmVmcmVzaFJhdGUiLCJhbmltYXRpb25SYXRlIiwic2l6ZSIsIm1pbiIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwibGFyZ2VTaXplUmF0aW8iLCJ4IiwieSIsImJhbGxvb24iLCJCYWxsb29uIiwib3BhY2l0eSIsIm9yaWVudGF0aW9uIiwiZXhwbG9kZSIsImR0IiwidXBkYXRlIiwiaXNEZWFkIiwiY3R4IiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIldhaXRTdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsIl9vbkV4cGxvZGVkIiwiYmluZCIsInJlbmRlcmVyIiwidGltZUxpc3RlbmVyIiwicmVjZWl2ZSIsInN5bmNUaW1lIiwidGltZSIsInBhcnNlSW50Iiwic2VjIiwiY29uc29sZSIsImxvZyIsInZpZXciLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwibW9kZWwiLCJ0aW1lTGVmdFRleHQiLCJzbGljZSIsIkNhbnZhc1ZpZXciLCJzaG93VGV4dCIsImNsYXNzTmFtZSIsInNob3ciLCJhcHBlbmRUbyIsImdldFN0YXRlQ29udGFpbmVyIiwic2V0UHJlUmVuZGVyIiwiY2xlYXJSZWN0IiwiYWRkUmVuZGVyZXIiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJzaGFyZWRQYXJhbXMiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwicmVtb3ZlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7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QUFuQjs7QUFFQSxXQUFLWCxJQUFMLENBQVVZLFlBQVYsQ0FBdUIsVUFBQzdCLEdBQUQsRUFBTUgsRUFBTixFQUFVakIsS0FBVixFQUFpQkUsTUFBakIsRUFBNEI7QUFDakRrQixZQUFJOEIsU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0JsRCxLQUFwQixFQUEyQkUsTUFBM0I7QUFDRCxPQUZEOztBQUlBLFdBQUttQyxJQUFMLENBQVVjLFdBQVYsQ0FBc0IsS0FBS3ZCLFFBQTNCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7OzJCQUVNO0FBQ0wsV0FBS1MsSUFBTCxDQUFVQyxHQUFWLENBQWNjLFNBQWQsQ0FBd0JDLE1BQXhCLENBQStCLFlBQS9CO0FBQ0EsV0FBS2hCLElBQUwsQ0FBVUMsR0FBVixDQUFjYyxTQUFkLENBQXdCRSxHQUF4QixDQUE0QixZQUE1Qjs7QUFFQSxXQUFLakIsSUFBTCxDQUFVRyxLQUFWLENBQWdCSSxRQUFoQixHQUEyQixLQUEzQjtBQUNBLFdBQUtQLElBQUwsQ0FBVWhCLE1BQVYsQ0FBaUIsaUJBQWpCO0FBQ0E7QUFDQSxXQUFLTyxRQUFMLENBQWNaLE9BQWQ7O0FBRUEsV0FBS1EsVUFBTCxDQUFnQitCLFlBQWhCLENBQTZCQyxtQkFBN0IsQ0FBaUQsYUFBakQsRUFBZ0UsS0FBSzNCLFlBQXJFO0FBQ0Q7OztrQ0FFYTtBQUNaLFdBQUtRLElBQUwsQ0FBVW9CLGNBQVYsQ0FBeUIsS0FBSzdCLFFBQTlCO0FBQ0EsV0FBS1MsSUFBTCxDQUFVZ0IsTUFBVjtBQUNEOzs7OztrQkFHWTlCLFMiLCJmaWxlIjoiV2FpdFN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzVmlldywgQ2FudmFzMmRSZW5kZXJlciB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBCYWxsb29uIGZyb20gJy4uL3JlbmRlcmVycy9CYWxsb29uJztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoc2hvd1RleHQpIHsgJT5cbiAgICAgICAgPCEtLSA8cCBjbGFzcz1cInNtYWxsIHNvZnQtYmxpbmtcIj5QbGVhc2Ugd2FpdCBmb3IgdGhlIGJlZ2lubmluZzwvcD4gLS0+XG4gICAgICAgIDxwIGNsYXNzPVwic21hbGwgaW5mb1wiPlxuICAgICAgICAgIFBsZWFzZSB3YWl0IC4uLlxuICAgICAgICAgIDxicj5cbiAgICAgICAgICBOZXh0IHNlc3Npb24gc3RhcnRpbmcgaW5cbiAgICAgICAgICA8YnI+XG4gICAgICAgICAgPCU9IHRpbWVMZWZ0VGV4dCAlPlxuICAgICAgICA8L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY2xhc3MgQmFsbG9vblJlbmRlcmVyIGV4dGVuZHMgQ2FudmFzMmRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHNwcml0ZUNvbmZpZywgb25FeHBsb2RlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMub25FeHBsb2RlID0gb25FeHBsb2RlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBzaG91bGQgY3JlYXRlIGEgZmFjdG9yeSAoZ2V0QmFsbG9uKCkpXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgLy8gcGljayBhIHJhbmRvbSBjb2xvclxuICAgIGNvbnN0IGNvbG9ySW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb25maWcuY29sb3JzLmxlbmd0aCk7XG4gICAgY29uc3QgY29sb3IgPSBjb25maWcuY29sb3JzW2NvbG9ySW5kZXhdO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICBjb25zdCBjbGlwV2lkdGggPSBjb25maWcuY2xpcFNpemUud2lkdGg7XG4gICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4odGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpICogY29uZmlnLmxhcmdlU2l6ZVJhdGlvO1xuICAgIGNvbnN0IHggPSB0aGlzLmNhbnZhc1dpZHRoIC8gMjtcbiAgICBjb25zdCB5ID0gdGhpcy5jYW52YXNIZWlnaHQgLyAyO1xuXG4gICAgdGhpcy5iYWxsb29uID0gbmV3IEJhbGxvb24oY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCB4LCB5KTtcblxuICAgIHRoaXMuYmFsbG9vbi5vcGFjaXR5ID0gMDtcbiAgfVxuXG4gIG9uUmVzaXplKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbikge1xuICAgICAgdGhpcy5iYWxsb29uLnggPSBjYW52YXNXaWR0aCAvIDI7XG4gICAgICB0aGlzLmJhbGxvb24ueSA9IGNhbnZhc0hlaWdodCAvIDI7XG4gICAgfVxuICB9XG5cbiAgZXhwbG9kZSgpIHtcbiAgICB0aGlzLmJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICAvLyB0aGlzLmJhbGxvb24ueCArPSBNYXRoLnJhbmRvbSgpICogMC4yIC0gMC4xO1xuICAgIC8vIHRoaXMuYmFsbG9vbi55ICs9IE1hdGgucmFuZG9tKCkgKiAwLjIgLSAwLjE7XG4gICAgdGhpcy5iYWxsb29uLnVwZGF0ZShkdCk7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uLm9wYWNpdHkgPCAxKVxuICAgICAgdGhpcy5iYWxsb29uLm9wYWNpdHkgPSBNYXRoLm1pbih0aGlzLmJhbGxvb24ub3BhY2l0eSArIDAuMDIsIDEpO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbi5pc0RlYWQpXG4gICAgICB0aGlzLm9uRXhwbG9kZSgpO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIHRoaXMuYmFsbG9vbi5yZW5kZXIoY3R4KTtcbiAgfVxufVxuXG5jbGFzcyBXYWl0U3RhdGUge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBnbG9iYWxTdGF0ZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5nbG9iYWxTdGF0ZSA9IGdsb2JhbFN0YXRlO1xuXG4gICAgdGhpcy5fb25FeHBsb2RlZCA9IHRoaXMuX29uRXhwbG9kZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IEJhbGxvb25SZW5kZXJlcih0aGlzLmV4cGVyaWVuY2Uuc3ByaXRlQ29uZmlnLCB0aGlzLl9vbkV4cGxvZGVkKTtcblxuICAgIGlmICghdGhpcy50aW1lTGlzdGVuZXIpIHtcbiAgICAgIHRoaXMudGltZUxpc3RlbmVyID0gdGhpcy5leHBlcmllbmNlLnJlY2VpdmUoJ2dsb2JhbDp0aW1lJywgKHN5bmNUaW1lLCB0aW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IG1pbiA9IHBhcnNlSW50KHRpbWUgLyA2MCk7XG4gICAgICAgIGNvbnN0IHNlYyA9IHBhcnNlSW50KHRpbWUgJSA2MCk7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyh0aW1lKTtcbiAgICAgICAgY29uc29sZS5sb2cobWluICsgJyAnICsgc2VjKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy52aWV3IHx8ICF0aGlzLnZpZXcuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5pbmZvJykpIHJldHVybjtcblxuICAgICAgICB0aGlzLnZpZXcubW9kZWwudGltZUxlZnRUZXh0ID0gYCR7bWlufSckeyhcIjBcIiArIHNlYykuc2xpY2UoLTIpfScnYDtcbiAgICAgICAgdGhpcy52aWV3LnJlbmRlcignLmluZm8nKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHRoaXMudmlldyA9IG5ldyBDYW52YXNWaWV3KHRlbXBsYXRlLCB7XG4gICAgICBzaG93VGV4dDogdHJ1ZSxcbiAgICAgIHRpbWVMZWZ0VGV4dDogJycsXG4gICAgfSwge30sIHtcbiAgICAgIGNsYXNzTmFtZTogWyd3YWl0LXN0YXRlJywgJ2ZvcmVncm91bmQnXVxuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIHRpbWVMZWZ0IGxpa2UgdGhpcyA6XG4gICAgLy8gdGhpcy52aWV3Lm1vZGVsLnRpbWVMZWZ0VGV4dCA9ICc0XFwnMzNcXCdcXCcnO1xuICAgIC8vIHRoaXMudmlldy5yZW5kZXIoJy5pbmZvJyk7XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdGhpcy52aWV3LnNob3coKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy5leHBlcmllbmNlLnZpZXcuZ2V0U3RhdGVDb250YWluZXIoKSk7XG5cbiAgICB0aGlzLnZpZXcuc2V0UHJlUmVuZGVyKChjdHgsIGR0LCB3aWR0aCwgaGVpZ2h0KSA9PiB7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LmFkZFJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuXG4gICAgLy8gdGhpcy50aW1lTGlzdGVuZXIgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2dsb2JhbDp0aW1lJywgdGltZSA9PiB7XG4gICAgLy8gICBjb25zdCBtaW4gPSBwYXJzZUludCh0aW1lIC8gNjApO1xuICAgIC8vICAgY29uc3Qgc2VjID0gcGFyc2VJbnQodGltZSAlIDYwKTtcbiAgICAvLyAgIC8vIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgIC8vICAgLy8gY29uc29sZS5sb2cobWluICsgJyAnICsgc2VjKTtcbiAgICAvLyAgIHRoaXMudmlldy5tb2RlbC50aW1lTGVmdFRleHQgPSBgJHttaW59JyR7c2VjfScnYDtcbiAgICAvLyAgIHRoaXMudmlldy5yZW5kZXIoJy5pbmZvJyk7XG4gICAgLy8gfSk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9yZWdyb3VuZCcpO1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuXG4gICAgdGhpcy52aWV3Lm1vZGVsLnNob3dUZXh0ID0gZmFsc2U7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tYm90dG9tJyk7XG4gICAgLy8gbWFrZSB0aGUgYmFsbG9vbiBleHBsb2RlLCB3YWl0IGZvclxuICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZSgpO1xuXG4gICAgdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdnbG9iYWw6dGltZScsIHRoaXMudGltZUxpc3RlbmVyKTtcbiAgfVxuXG4gIF9vbkV4cGxvZGVkKCkge1xuICAgIHRoaXMudmlldy5yZW1vdmVSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2FpdFN0YXRlO1xuIl19