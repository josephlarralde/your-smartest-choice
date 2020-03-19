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

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-center">\n    </div>\n    <div class="section-bottom flex-middle">\n      <% if (showText) { %>\n        <p class="small soft-blink">Please wait for the beginning</p>\n      <% } %>\n    </div>\n  </div>\n';

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

    this._onExploded = this._onExploded.bind(this);
    this.renderer = new BalloonRenderer(this.experience.spriteConfig, this._onExploded);
  }

  (0, _createClass3.default)(WaitState, [{
    key: 'enter',
    value: function enter() {
      this.view = new _client.CanvasView(template, {
        showText: true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhaXRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIkJhbGxvb25SZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsIm9uRXhwbG9kZSIsImNvbmZpZyIsImNvbG9ySW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjb2xvcnMiLCJsZW5ndGgiLCJjb2xvciIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwid2lkdGgiLCJjbGlwSGVpZ2h0IiwiaGVpZ2h0IiwicmVmcmVzaFJhdGUiLCJhbmltYXRpb25SYXRlIiwic2l6ZSIsIm1pbiIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwibGFyZ2VTaXplUmF0aW8iLCJ4IiwieSIsImJhbGxvb24iLCJCYWxsb29uIiwib3BhY2l0eSIsIm9yaWVudGF0aW9uIiwiZXhwbG9kZSIsImR0IiwidXBkYXRlIiwiaXNEZWFkIiwiY3R4IiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIldhaXRTdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsIl9vbkV4cGxvZGVkIiwiYmluZCIsInJlbmRlcmVyIiwidmlldyIsIkNhbnZhc1ZpZXciLCJzaG93VGV4dCIsImNsYXNzTmFtZSIsInNob3ciLCJhcHBlbmRUbyIsImdldFN0YXRlQ29udGFpbmVyIiwic2V0UHJlUmVuZGVyIiwiY2xlYXJSZWN0IiwiYWRkUmVuZGVyZXIiLCIkZWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJtb2RlbCIsInJlbW92ZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEscVhBQU47O0lBY01DLGU7OztBQUNKLDJCQUFZQyxZQUFaLEVBQTBCQyxTQUExQixFQUFxQztBQUFBOztBQUFBOztBQUduQyxVQUFLRCxZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLFVBQUtDLFNB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WUFBZjtBQUROLE9BRkssQ0FBWjs7QUFNQSxXQUFLSCxJQUFMLENBQVVSLE1BQVY7QUFDQSxXQUFLUSxJQUFMLENBQVVJLElBQVY7QUFDQSxXQUFLSixJQUFMLENBQVVLLFFBQVYsQ0FBbUIsS0FBS1YsVUFBTCxDQUFnQkssSUFBaEIsQ0FBcUJNLGlCQUFyQixFQUFuQjs7QUFFQSxXQUFLTixJQUFMLENBQVVPLFlBQVYsQ0FBdUIsVUFBQ2hCLEdBQUQsRUFBTUgsRUFBTixFQUFVakIsS0FBVixFQUFpQkUsTUFBakIsRUFBNEI7QUFDakRrQixZQUFJaUIsU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0JyQyxLQUFwQixFQUEyQkUsTUFBM0I7QUFDRCxPQUZEOztBQUlBLFdBQUsyQixJQUFMLENBQVVTLFdBQVYsQ0FBc0IsS0FBS1YsUUFBM0I7QUFDRDs7OzJCQUVNO0FBQ0wsV0FBS0MsSUFBTCxDQUFVVSxHQUFWLENBQWNDLFNBQWQsQ0FBd0JDLE1BQXhCLENBQStCLFlBQS9CO0FBQ0EsV0FBS1osSUFBTCxDQUFVVSxHQUFWLENBQWNDLFNBQWQsQ0FBd0JFLEdBQXhCLENBQTRCLFlBQTVCOztBQUVBLFdBQUtiLElBQUwsQ0FBVWMsS0FBVixDQUFnQlosUUFBaEIsR0FBMkIsS0FBM0I7QUFDQSxXQUFLRixJQUFMLENBQVVSLE1BQVYsQ0FBaUIsaUJBQWpCO0FBQ0E7QUFDQSxXQUFLTyxRQUFMLENBQWNaLE9BQWQ7QUFDRDs7O2tDQUVhO0FBQ1osV0FBS2EsSUFBTCxDQUFVZSxjQUFWLENBQXlCLEtBQUtoQixRQUE5QjtBQUNBLFdBQUtDLElBQUwsQ0FBVVksTUFBVjtBQUNEOzs7OztrQkFHWWxCLFMiLCJmaWxlIjoiV2FpdFN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzVmlldywgQ2FudmFzMmRSZW5kZXJlciB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBCYWxsb29uIGZyb20gJy4uL3JlbmRlcmVycy9CYWxsb29uJztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoc2hvd1RleHQpIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJzbWFsbCBzb2Z0LWJsaW5rXCI+UGxlYXNlIHdhaXQgZm9yIHRoZSBiZWdpbm5pbmc8L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY2xhc3MgQmFsbG9vblJlbmRlcmVyIGV4dGVuZHMgQ2FudmFzMmRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHNwcml0ZUNvbmZpZywgb25FeHBsb2RlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMub25FeHBsb2RlID0gb25FeHBsb2RlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBzaG91bGQgY3JlYXRlIGEgZmFjdG9yeSAoZ2V0QmFsbG9uKCkpXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgLy8gcGljayBhIHJhbmRvbSBjb2xvclxuICAgIGNvbnN0IGNvbG9ySW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb25maWcuY29sb3JzLmxlbmd0aCk7XG4gICAgY29uc3QgY29sb3IgPSBjb25maWcuY29sb3JzW2NvbG9ySW5kZXhdO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICBjb25zdCBjbGlwV2lkdGggPSBjb25maWcuY2xpcFNpemUud2lkdGg7XG4gICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4odGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpICogY29uZmlnLmxhcmdlU2l6ZVJhdGlvO1xuICAgIGNvbnN0IHggPSB0aGlzLmNhbnZhc1dpZHRoIC8gMjtcbiAgICBjb25zdCB5ID0gdGhpcy5jYW52YXNIZWlnaHQgLyAyO1xuXG4gICAgdGhpcy5iYWxsb29uID0gbmV3IEJhbGxvb24oY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCB4LCB5KTtcblxuICAgIHRoaXMuYmFsbG9vbi5vcGFjaXR5ID0gMDtcbiAgfVxuXG4gIG9uUmVzaXplKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbikge1xuICAgICAgdGhpcy5iYWxsb29uLnggPSBjYW52YXNXaWR0aCAvIDI7XG4gICAgICB0aGlzLmJhbGxvb24ueSA9IGNhbnZhc0hlaWdodCAvIDI7XG4gICAgfVxuICB9XG5cbiAgZXhwbG9kZSgpIHtcbiAgICB0aGlzLmJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICAvLyB0aGlzLmJhbGxvb24ueCArPSBNYXRoLnJhbmRvbSgpICogMC4yIC0gMC4xO1xuICAgIC8vIHRoaXMuYmFsbG9vbi55ICs9IE1hdGgucmFuZG9tKCkgKiAwLjIgLSAwLjE7XG4gICAgdGhpcy5iYWxsb29uLnVwZGF0ZShkdCk7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uLm9wYWNpdHkgPCAxKVxuICAgICAgdGhpcy5iYWxsb29uLm9wYWNpdHkgPSBNYXRoLm1pbih0aGlzLmJhbGxvb24ub3BhY2l0eSArIDAuMDIsIDEpO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbi5pc0RlYWQpXG4gICAgICB0aGlzLm9uRXhwbG9kZSgpO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIHRoaXMuYmFsbG9vbi5yZW5kZXIoY3R4KTtcbiAgfVxufVxuXG5jbGFzcyBXYWl0U3RhdGUge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBnbG9iYWxTdGF0ZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5nbG9iYWxTdGF0ZSA9IGdsb2JhbFN0YXRlO1xuXG4gICAgdGhpcy5fb25FeHBsb2RlZCA9IHRoaXMuX29uRXhwbG9kZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IEJhbGxvb25SZW5kZXJlcih0aGlzLmV4cGVyaWVuY2Uuc3ByaXRlQ29uZmlnLCB0aGlzLl9vbkV4cGxvZGVkKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHRoaXMudmlldyA9IG5ldyBDYW52YXNWaWV3KHRlbXBsYXRlLCB7XG4gICAgICBzaG93VGV4dDogdHJ1ZVxuICAgIH0sIHt9LCB7XG4gICAgICBjbGFzc05hbWU6IFsnd2FpdC1zdGF0ZScsICdmb3JlZ3JvdW5kJ11cbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgIHRoaXMudmlldy5hcHBlbmRUbyh0aGlzLmV4cGVyaWVuY2Uudmlldy5nZXRTdGF0ZUNvbnRhaW5lcigpKTtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9yZWdyb3VuZCcpO1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuXG4gICAgdGhpcy52aWV3Lm1vZGVsLnNob3dUZXh0ID0gZmFsc2U7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tYm90dG9tJyk7XG4gICAgLy8gbWFrZSB0aGUgYmFsbG9vbiBleHBsb2RlLCB3YWl0IGZvclxuICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZSgpO1xuICB9XG5cbiAgX29uRXhwbG9kZWQoKSB7XG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYWl0U3RhdGU7XG4iXX0=