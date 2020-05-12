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
    (0, _classCallCheck3.default)(this, WaitState);

    this.experience = experience;
    this.globalState = globalState;

    this._showingCredits = false;
    this._timeListener = this._timeListener.bind(this);
    this._onExploded = this._onExploded.bind(this);
    this.renderer = new BalloonRenderer(this.experience.spriteConfig, this._onExploded);
  }

  (0, _createClass3.default)(WaitState, [{
    key: 'enter',
    value: function enter() {
      this._showingCredits = false;
      this.view = new _client.CanvasView(template, {
        showText: true,
        timeLeftText: ''
      }, {}, {
        className: ['wait-state', 'foreground']
      });

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);
      });

      this.view.addRenderer(this.renderer);

      this.experience.receive('global:time', this._timeListener);

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
      this.experience.stopReceiving('global:time', this._timeListener);

      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');

      this.view.model.showText = false;
      this.view.render('.section-bottom');
      // make the balloon explode, wait for
      this.renderer.explode();

      // this.experience.sharedParams.removeParamListener('global:time', this.timeListener);
      if (this._showingCredits) {
        this.experience.showCreditsPage(0);
        this._showingCredits = false;
      }
    }
  }, {
    key: '_timeListener',
    value: function _timeListener(remaining) {
      var min = parseInt(Math.round(remaining) / 60);
      var sec = parseInt(Math.round(remaining) % 60);

      console.log(min + ' m ' + sec + ' s');
      console.log(this._showingCredits);

      if (min === 0 && sec <= 30 && !this._showingCredits) {
        this.experience.showCreditsPage(1);
        this._showingCredits = true;
      }

      if (!this.view || !this.view.$el.querySelector('.info')) return;

      this.view.model.timeLeftText = min + '\'' + ("0" + sec).slice(-2) + '\'\'';
      this.view.render('.info');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhaXRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIkJhbGxvb25SZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsIm9uRXhwbG9kZSIsImNvbmZpZyIsImNvbG9ySW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjb2xvcnMiLCJsZW5ndGgiLCJjb2xvciIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwid2lkdGgiLCJjbGlwSGVpZ2h0IiwiaGVpZ2h0IiwicmVmcmVzaFJhdGUiLCJhbmltYXRpb25SYXRlIiwic2l6ZSIsIm1pbiIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwibGFyZ2VTaXplUmF0aW8iLCJ4IiwieSIsImJhbGxvb24iLCJCYWxsb29uIiwib3BhY2l0eSIsIm9yaWVudGF0aW9uIiwiZXhwbG9kZSIsImR0IiwidXBkYXRlIiwiaXNEZWFkIiwiY3R4IiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIldhaXRTdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsIl9zaG93aW5nQ3JlZGl0cyIsIl90aW1lTGlzdGVuZXIiLCJiaW5kIiwiX29uRXhwbG9kZWQiLCJyZW5kZXJlciIsInZpZXciLCJDYW52YXNWaWV3Iiwic2hvd1RleHQiLCJ0aW1lTGVmdFRleHQiLCJjbGFzc05hbWUiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsImFkZFJlbmRlcmVyIiwicmVjZWl2ZSIsInN0b3BSZWNlaXZpbmciLCIkZWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJtb2RlbCIsInNob3dDcmVkaXRzUGFnZSIsInJlbWFpbmluZyIsInBhcnNlSW50Iiwicm91bmQiLCJzZWMiLCJjb25zb2xlIiwibG9nIiwicXVlcnlTZWxlY3RvciIsInNsaWNlIiwicmVtb3ZlUmVuZGVyZXIiXSwibWFwcGlu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Q0FBekM7QUFDQSxXQUFLMUIsSUFBTCxDQUFVVixNQUFWLENBQWlCLE9BQWpCO0FBQ0Q7OztrQ0FFYTtBQUNaLFdBQUtVLElBQUwsQ0FBVTJCLGNBQVYsQ0FBeUIsS0FBSzVCLFFBQTlCO0FBQ0EsV0FBS0MsSUFBTCxDQUFVZSxNQUFWO0FBQ0Q7Ozs7O2tCQUdZdkIsUyIsImZpbGUiOiJXYWl0U3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNWaWV3LCBDYW52YXMyZFJlbmRlcmVyIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IEJhbGxvb24gZnJvbSAnLi4vcmVuZGVyZXJzL0JhbGxvb24nO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj5cbiAgICAgIDwlIGlmIChzaG93VGV4dCkgeyAlPlxuICAgICAgICA8IS0tIDxwIGNsYXNzPVwic21hbGwgc29mdC1ibGlua1wiPlBsZWFzZSB3YWl0IGZvciB0aGUgYmVnaW5uaW5nPC9wPiAtLT5cbiAgICAgICAgPHAgY2xhc3M9XCJzbWFsbCBpbmZvXCI+XG4gICAgICAgICAgUGxlYXNlIHdhaXQgLi4uXG4gICAgICAgICAgPGJyPlxuICAgICAgICAgIE5leHQgc2Vzc2lvbiBzdGFydGluZyBpblxuICAgICAgICAgIDxicj5cbiAgICAgICAgICA8JT0gdGltZUxlZnRUZXh0ICU+XG4gICAgICAgIDwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jbGFzcyBCYWxsb29uUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3ByaXRlQ29uZmlnLCBvbkV4cGxvZGUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zcHJpdGVDb25maWcgPSBzcHJpdGVDb25maWc7XG4gICAgdGhpcy5vbkV4cGxvZGUgPSBvbkV4cGxvZGU7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8vIHNob3VsZCBjcmVhdGUgYSBmYWN0b3J5IChnZXRCYWxsb24oKSlcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLnNwcml0ZUNvbmZpZztcbiAgICAvLyBwaWNrIGEgcmFuZG9tIGNvbG9yXG4gICAgY29uc3QgY29sb3JJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbmZpZy5jb2xvcnMubGVuZ3RoKTtcbiAgICBjb25zdCBjb2xvciA9IGNvbmZpZy5jb2xvcnNbY29sb3JJbmRleF07XG5cbiAgICBjb25zdCBpbWFnZSA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmltYWdlO1xuICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9IGNvbmZpZy5jbGlwU2l6ZS53aWR0aDtcbiAgICBjb25zdCBjbGlwSGVpZ2h0ID0gY29uZmlnLmNsaXBTaXplLmhlaWdodDtcbiAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCkgKiBjb25maWcubGFyZ2VTaXplUmF0aW87XG4gICAgY29uc3QgeCA9IHRoaXMuY2FudmFzV2lkdGggLyAyO1xuICAgIGNvbnN0IHkgPSB0aGlzLmNhbnZhc0hlaWdodCAvIDI7XG5cbiAgICB0aGlzLmJhbGxvb24gPSBuZXcgQmFsbG9vbihjb2xvciwgaW1hZ2UsIGNsaXBQb3NpdGlvbnMsIGNsaXBXaWR0aCwgY2xpcEhlaWdodCwgcmVmcmVzaFJhdGUsIHNpemUsIHNpemUsIHgsIHkpO1xuXG4gICAgdGhpcy5iYWxsb29uLm9wYWNpdHkgPSAwO1xuICB9XG5cbiAgb25SZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0LCBvcmllbnRhdGlvbik7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uKSB7XG4gICAgICB0aGlzLmJhbGxvb24ueCA9IGNhbnZhc1dpZHRoIC8gMjtcbiAgICAgIHRoaXMuYmFsbG9vbi55ID0gY2FudmFzSGVpZ2h0IC8gMjtcbiAgICB9XG4gIH1cblxuICBleHBsb2RlKCkge1xuICAgIHRoaXMuYmFsbG9vbi5leHBsb2RlID0gdHJ1ZTtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIC8vIHRoaXMuYmFsbG9vbi54ICs9IE1hdGgucmFuZG9tKCkgKiAwLjIgLSAwLjE7XG4gICAgLy8gdGhpcy5iYWxsb29uLnkgKz0gTWF0aC5yYW5kb20oKSAqIDAuMiAtIDAuMTtcbiAgICB0aGlzLmJhbGxvb24udXBkYXRlKGR0KTtcblxuICAgIGlmICh0aGlzLmJhbGxvb24ub3BhY2l0eSA8IDEpXG4gICAgICB0aGlzLmJhbGxvb24ub3BhY2l0eSA9IE1hdGgubWluKHRoaXMuYmFsbG9vbi5vcGFjaXR5ICsgMC4wMiwgMSk7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uLmlzRGVhZClcbiAgICAgIHRoaXMub25FeHBsb2RlKCk7XG4gIH1cblxuICByZW5kZXIoY3R4KSB7XG4gICAgdGhpcy5iYWxsb29uLnJlbmRlcihjdHgpO1xuICB9XG59XG5cbmNsYXNzIFdhaXRTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG5cbiAgICB0aGlzLl9zaG93aW5nQ3JlZGl0cyA9IGZhbHNlO1xuICAgIHRoaXMuX3RpbWVMaXN0ZW5lciA9IHRoaXMuX3RpbWVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRXhwbG9kZWQgPSB0aGlzLl9vbkV4cGxvZGVkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBCYWxsb29uUmVuZGVyZXIodGhpcy5leHBlcmllbmNlLnNwcml0ZUNvbmZpZywgdGhpcy5fb25FeHBsb2RlZCk7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICB0aGlzLl9zaG93aW5nQ3JlZGl0cyA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG5ldyBDYW52YXNWaWV3KHRlbXBsYXRlLCB7XG4gICAgICBzaG93VGV4dDogdHJ1ZSxcbiAgICAgIHRpbWVMZWZ0VGV4dDogJycsXG4gICAgfSwge30sIHtcbiAgICAgIGNsYXNzTmFtZTogWyd3YWl0LXN0YXRlJywgJ2ZvcmVncm91bmQnXVxuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHRoaXMudmlldy5zaG93KCk7XG4gICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuZXhwZXJpZW5jZS52aWV3LmdldFN0YXRlQ29udGFpbmVyKCkpO1xuXG4gICAgdGhpcy52aWV3LnNldFByZVJlbmRlcigoY3R4LCBkdCwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIHRoaXMuZXhwZXJpZW5jZS5yZWNlaXZlKCdnbG9iYWw6dGltZScsIHRoaXMuX3RpbWVMaXN0ZW5lcik7XG5cbiAgICAvLyB0aGlzLnRpbWVMaXN0ZW5lciA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignZ2xvYmFsOnRpbWUnLCB0aW1lID0+IHtcbiAgICAvLyAgIGNvbnN0IG1pbiA9IHBhcnNlSW50KHRpbWUgLyA2MCk7XG4gICAgLy8gICBjb25zdCBzZWMgPSBwYXJzZUludCh0aW1lICUgNjApO1xuICAgIC8vICAgLy8gY29uc29sZS5sb2codGltZSk7XG4gICAgLy8gICAvLyBjb25zb2xlLmxvZyhtaW4gKyAnICcgKyBzZWMpO1xuICAgIC8vICAgdGhpcy52aWV3Lm1vZGVsLnRpbWVMZWZ0VGV4dCA9IGAke21pbn0nJHtzZWN9JydgO1xuICAgIC8vICAgdGhpcy52aWV3LnJlbmRlcignLmluZm8nKTtcbiAgICAvLyB9KTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5leHBlcmllbmNlLnN0b3BSZWNlaXZpbmcoJ2dsb2JhbDp0aW1lJywgdGhpcy5fdGltZUxpc3RlbmVyKTtcblxuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9yZWdyb3VuZCcpO1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuXG4gICAgdGhpcy52aWV3Lm1vZGVsLnNob3dUZXh0ID0gZmFsc2U7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tYm90dG9tJyk7XG4gICAgLy8gbWFrZSB0aGUgYmFsbG9vbiBleHBsb2RlLCB3YWl0IGZvclxuICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZSgpO1xuXG4gICAgLy8gdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdnbG9iYWw6dGltZScsIHRoaXMudGltZUxpc3RlbmVyKTtcbiAgICBpZiAodGhpcy5fc2hvd2luZ0NyZWRpdHMpIHtcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5zaG93Q3JlZGl0c1BhZ2UoMCk7XG4gICAgICB0aGlzLl9zaG93aW5nQ3JlZGl0cyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIF90aW1lTGlzdGVuZXIocmVtYWluaW5nKSB7XG4gICAgY29uc3QgbWluID0gcGFyc2VJbnQoTWF0aC5yb3VuZChyZW1haW5pbmcpIC8gNjApO1xuICAgIGNvbnN0IHNlYyA9IHBhcnNlSW50KE1hdGgucm91bmQocmVtYWluaW5nKSAlIDYwKTtcblxuICAgIGNvbnNvbGUubG9nKGAke21pbn0gbSAke3NlY30gc2ApO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX3Nob3dpbmdDcmVkaXRzKTtcblxuICAgIGlmIChtaW4gPT09IDAgJiYgc2VjIDw9IDMwICYmICF0aGlzLl9zaG93aW5nQ3JlZGl0cykge1xuICAgICAgdGhpcy5leHBlcmllbmNlLnNob3dDcmVkaXRzUGFnZSgxKTtcbiAgICAgIHRoaXMuX3Nob3dpbmdDcmVkaXRzID0gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCF0aGlzLnZpZXcgfHwgIXRoaXMudmlldy4kZWwucXVlcnlTZWxlY3RvcignLmluZm8nKSkgcmV0dXJuO1xuXG4gICAgdGhpcy52aWV3Lm1vZGVsLnRpbWVMZWZ0VGV4dCA9IGAke21pbn0nJHsoXCIwXCIgKyBzZWMpLnNsaWNlKC0yKX0nJ2A7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLmluZm8nKTtcbiAgfVxuXG4gIF9vbkV4cGxvZGVkKCkge1xuICAgIHRoaXMudmlldy5yZW1vdmVSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2FpdFN0YXRlO1xuIl19