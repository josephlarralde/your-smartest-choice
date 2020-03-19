'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('soundworks/client');

var _Balloon = require('../renderers/Balloon');

var _Balloon2 = _interopRequireDefault(_Balloon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-center">\n      <p class="big">Thanks!</p>\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var EndRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(EndRenderer, _Canvas2dRenderer);

  function EndRenderer(spriteConfig) {
    (0, _classCallCheck3.default)(this, EndRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EndRenderer.__proto__ || (0, _getPrototypeOf2.default)(EndRenderer)).call(this));

    _this.spriteConfig = spriteConfig;
    _this.balloons = new _set2.default();
    return _this;
  }

  (0, _createClass3.default)(EndRenderer, [{
    key: 'spawnBalloon',
    value: function spawnBalloon() {
      var config = this.spriteConfig;
      var colorIndex = Math.floor(Math.random() * config.colors.length);
      var color = config.colors[colorIndex];

      var image = config.groups[color].image;
      var clipPositions = config.groups[color].clipPositions;
      var clipWidth = config.clipSize.width;
      var clipHeight = config.clipSize.height;
      var refreshRate = config.animationRate;
      var size = Math.min(this.canvasWidth, this.canvasHeight) * config.smallSizeRatio;
      var x = Math.random() * this.canvasWidth;
      var y = Math.random() * this.canvasHeight;

      var balloon = new _Balloon2.default(color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

      balloon.ttl = Math.random();
      balloon.opacity = 0;

      this.balloons.add(balloon);
    }
  }, {
    key: 'update',
    value: function update(dt) {
      var _this2 = this;

      this.balloons.forEach(function (balloon) {
        balloon.update(dt);
        balloon.ttl -= dt;

        if (balloon.opacity < 1) balloon.opacity = Math.min(1, balloon.opacity + 0.03);

        if (balloon.ttl < 0) balloon.explode = true;

        if (balloon.isDead) _this2.balloons.delete(balloon);
      });
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      this.balloons.forEach(function (balloon) {
        return balloon.render(ctx);
      });
    }
  }]);
  return EndRenderer;
}(_client.Canvas2dRenderer);

var EndState = function () {
  function EndState(experience, globalState) {
    (0, _classCallCheck3.default)(this, EndState);

    this.experience = experience;
    this.globalState = globalState;

    this.renderer = new EndRenderer(this.experience.spriteConfig);

    this._spawnBalloon = this._spawnBalloon.bind(this);
    this._spawnTimeout = null;
  }

  (0, _createClass3.default)(EndState, [{
    key: 'enter',
    value: function enter() {
      this.view = new _client.CanvasView(template, {}, {}, {
        className: ['end-state', 'foreground']
      });

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);
      });

      this.view.addRenderer(this.renderer);

      this._spawnTimeout = setTimeout(this._spawnBalloon, Math.random() * 1000);
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');

      clearTimeout(this._spawnTimeout);

      this.view.removeRenderer(this.renderer);
      this.view.remove();
    }
  }, {
    key: '_spawnBalloon',
    value: function _spawnBalloon() {
      this.renderer.spawnBalloon();
      this._spawnTimeout = setTimeout(this._spawnBalloon, Math.random() * 500);
    }
  }]);
  return EndState;
}();

exports.default = EndState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVuZFN0YXRlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwiRW5kUmVuZGVyZXIiLCJzcHJpdGVDb25maWciLCJiYWxsb29ucyIsImNvbmZpZyIsImNvbG9ySW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjb2xvcnMiLCJsZW5ndGgiLCJjb2xvciIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwid2lkdGgiLCJjbGlwSGVpZ2h0IiwiaGVpZ2h0IiwicmVmcmVzaFJhdGUiLCJhbmltYXRpb25SYXRlIiwic2l6ZSIsIm1pbiIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0Iiwic21hbGxTaXplUmF0aW8iLCJ4IiwieSIsImJhbGxvb24iLCJCYWxsb29uIiwidHRsIiwib3BhY2l0eSIsImFkZCIsImR0IiwiZm9yRWFjaCIsInVwZGF0ZSIsImV4cGxvZGUiLCJpc0RlYWQiLCJkZWxldGUiLCJjdHgiLCJyZW5kZXIiLCJDYW52YXMyZFJlbmRlcmVyIiwiRW5kU3RhdGUiLCJleHBlcmllbmNlIiwiZ2xvYmFsU3RhdGUiLCJyZW5kZXJlciIsIl9zcGF3bkJhbGxvb24iLCJiaW5kIiwiX3NwYXduVGltZW91dCIsInZpZXciLCJDYW52YXNWaWV3IiwiY2xhc3NOYW1lIiwic2hvdyIsImFwcGVuZFRvIiwiZ2V0U3RhdGVDb250YWluZXIiLCJzZXRQcmVSZW5kZXIiLCJjbGVhclJlY3QiLCJhZGRSZW5kZXJlciIsInNldFRpbWVvdXQiLCIkZWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJjbGVhclRpbWVvdXQiLCJyZW1vdmVSZW5kZXJlciIsInNwYXduQmFsbG9vbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLDhSQUFOOztJQVlNQyxXOzs7QUFDSix1QkFBWUMsWUFBWixFQUEwQjtBQUFBOztBQUFBOztBQUd4QixVQUFL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UmVuZGVyZXIgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgQmFsbG9vbiBmcm9tICcuLi9yZW5kZXJlcnMvQmFsbG9vbic7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgPHAgY2xhc3M9XCJiaWdcIj5UaGFua3MhPC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cblxuY2xhc3MgRW5kUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3ByaXRlQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMuYmFsbG9vbnMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBzcGF3bkJhbGxvb24oKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgY29uc3QgY29sb3JJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbmZpZy5jb2xvcnMubGVuZ3RoKTtcbiAgICBjb25zdCBjb2xvciA9IGNvbmZpZy5jb2xvcnNbY29sb3JJbmRleF07XG5cbiAgICBjb25zdCBpbWFnZSA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmltYWdlO1xuICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9IGNvbmZpZy5jbGlwU2l6ZS53aWR0aDtcbiAgICBjb25zdCBjbGlwSGVpZ2h0ID0gY29uZmlnLmNsaXBTaXplLmhlaWdodDtcbiAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCkgKiBjb25maWcuc21hbGxTaXplUmF0aW87XG4gICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IHkgPSBNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICBjb25zdCBiYWxsb29uID0gbmV3IEJhbGxvb24oY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCB4LCB5KTtcblxuICAgIGJhbGxvb24udHRsID0gTWF0aC5yYW5kb20oKTtcbiAgICBiYWxsb29uLm9wYWNpdHkgPSAwO1xuXG4gICAgdGhpcy5iYWxsb29ucy5hZGQoYmFsbG9vbik7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICB0aGlzLmJhbGxvb25zLmZvckVhY2goYmFsbG9vbiA9PiB7XG4gICAgICBiYWxsb29uLnVwZGF0ZShkdCk7XG4gICAgICBiYWxsb29uLnR0bCAtPSBkdDtcblxuICAgICAgaWYgKGJhbGxvb24ub3BhY2l0eSA8IDEpXG4gICAgICAgIGJhbGxvb24ub3BhY2l0eSA9IE1hdGgubWluKDEsIGJhbGxvb24ub3BhY2l0eSArIDAuMDMpO1xuXG4gICAgICBpZiAoYmFsbG9vbi50dGwgPCAwKVxuICAgICAgICBiYWxsb29uLmV4cGxvZGUgPSB0cnVlO1xuXG4gICAgICBpZiAoYmFsbG9vbi5pc0RlYWQpXG4gICAgICAgIHRoaXMuYmFsbG9vbnMuZGVsZXRlKGJhbGxvb24pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIHRoaXMuYmFsbG9vbnMuZm9yRWFjaChiYWxsb29uID0+IGJhbGxvb24ucmVuZGVyKGN0eCkpO1xuICB9XG59XG5cbmNsYXNzIEVuZFN0YXRlIHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgZ2xvYmFsU3RhdGUpIHtcbiAgICB0aGlzLmV4cGVyaWVuY2UgPSBleHBlcmllbmNlO1xuICAgIHRoaXMuZ2xvYmFsU3RhdGUgPSBnbG9iYWxTdGF0ZTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgRW5kUmVuZGVyZXIodGhpcy5leHBlcmllbmNlLnNwcml0ZUNvbmZpZyk7XG5cbiAgICB0aGlzLl9zcGF3bkJhbGxvb24gPSB0aGlzLl9zcGF3bkJhbGxvb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zcGF3blRpbWVvdXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgdGhpcy52aWV3ID0gbmV3IENhbnZhc1ZpZXcodGVtcGxhdGUsIHt9LCB7fSwge1xuICAgICAgY2xhc3NOYW1lOiBbJ2VuZC1zdGF0ZScsICdmb3JlZ3JvdW5kJ10sXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdGhpcy52aWV3LnNob3coKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy5leHBlcmllbmNlLnZpZXcuZ2V0U3RhdGVDb250YWluZXIoKSk7XG5cbiAgICB0aGlzLnZpZXcuc2V0UHJlUmVuZGVyKChjdHgsIGR0LCB3aWR0aCwgaGVpZ2h0KSA9PiB7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LmFkZFJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuXG4gICAgdGhpcy5fc3Bhd25UaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLl9zcGF3bkJhbGxvb24sIE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JlZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fc3Bhd25UaW1lb3V0KTtcblxuICAgIHRoaXMudmlldy5yZW1vdmVSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG4gIH1cblxuICBfc3Bhd25CYWxsb29uKCkge1xuICAgIHRoaXMucmVuZGVyZXIuc3Bhd25CYWxsb29uKCk7XG4gICAgdGhpcy5fc3Bhd25UaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLl9zcGF3bkJhbGxvb24sIE1hdGgucmFuZG9tKCkgKiA1MDApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVuZFN0YXRlO1xuIl19