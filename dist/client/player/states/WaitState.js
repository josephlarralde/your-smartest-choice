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

      /*
      if (min === 0 && sec <= 15 && !this._showingCredits) {
        this.experience.showCreditsPage(1);
        this._showingCredits = true;
      }
      //*/

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhaXRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIkJhbGxvb25SZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsIm9uRXhwbG9kZSIsImNvbmZpZyIsImNvbG9ySW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjb2xvcnMiLCJsZW5ndGgiLCJjb2xvciIsImltYWdlIiwiZ3JvdXBzIiwiY2xpcFBvc2l0aW9ucyIsImNsaXBXaWR0aCIsImNsaXBTaXplIiwid2lkdGgiLCJjbGlwSGVpZ2h0IiwiaGVpZ2h0IiwicmVmcmVzaFJhdGUiLCJhbmltYXRpb25SYXRlIiwic2l6ZSIsIm1pbiIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwibGFyZ2VTaXplUmF0aW8iLCJ4IiwieSIsImJhbGxvb24iLCJCYWxsb29uIiwib3BhY2l0eSIsIm9yaWVudGF0aW9uIiwiZXhwbG9kZSIsImR0IiwidXBkYXRlIiwiaXNEZWFkIiwiY3R4IiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIldhaXRTdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsIl9zaG93aW5nQ3JlZGl0cyIsIl90aW1lTGlzdGVuZXIiLCJiaW5kIiwiX29uRXhwbG9kZWQiLCJyZW5kZXJlciIsInZpZXciLCJDYW52YXNWaWV3Iiwic2hvd1RleHQiLCJ0aW1lTGVmdFRleHQiLCJjbGFzc05hbWUiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsImFkZFJlbmRlcmVyIiwicmVjZWl2ZSIsInN0b3BSZWNlaXZpbmciLCIkZWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJtb2RlbCIsInNob3dDcmVkaXRzUGFnZSIsInJlbWFpbmluZyIsInBhcnNlSW50Iiwicm91bmQiLCJzZWMiLCJjb25zb2xlIiwibG9nIiwicXVlcnlTZWxlY3RvciIsInNsaWNlIiwicmVtb3ZlUmVuZGVyZXIiXSwibWFwcGlu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Ozs7OztrQkFHWXZCLFMiLCJmaWxlIjoiV2FpdFN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzVmlldywgQ2FudmFzMmRSZW5kZXJlciB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBCYWxsb29uIGZyb20gJy4uL3JlbmRlcmVycy9CYWxsb29uJztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoc2hvd1RleHQpIHsgJT5cbiAgICAgICAgPCEtLSA8cCBjbGFzcz1cInNtYWxsIHNvZnQtYmxpbmtcIj5QbGVhc2Ugd2FpdCBmb3IgdGhlIGJlZ2lubmluZzwvcD4gLS0+XG4gICAgICAgIDxwIGNsYXNzPVwic21hbGwgaW5mb1wiPlxuICAgICAgICAgIFBsZWFzZSB3YWl0IC4uLlxuICAgICAgICAgIDxicj5cbiAgICAgICAgICBOZXh0IHNlc3Npb24gc3RhcnRpbmcgaW5cbiAgICAgICAgICA8YnI+XG4gICAgICAgICAgPCU9IHRpbWVMZWZ0VGV4dCAlPlxuICAgICAgICA8L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY2xhc3MgQmFsbG9vblJlbmRlcmVyIGV4dGVuZHMgQ2FudmFzMmRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHNwcml0ZUNvbmZpZywgb25FeHBsb2RlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMub25FeHBsb2RlID0gb25FeHBsb2RlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBzaG91bGQgY3JlYXRlIGEgZmFjdG9yeSAoZ2V0QmFsbG9uKCkpXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgLy8gcGljayBhIHJhbmRvbSBjb2xvclxuICAgIGNvbnN0IGNvbG9ySW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb25maWcuY29sb3JzLmxlbmd0aCk7XG4gICAgY29uc3QgY29sb3IgPSBjb25maWcuY29sb3JzW2NvbG9ySW5kZXhdO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICBjb25zdCBjbGlwV2lkdGggPSBjb25maWcuY2xpcFNpemUud2lkdGg7XG4gICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4odGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpICogY29uZmlnLmxhcmdlU2l6ZVJhdGlvO1xuICAgIGNvbnN0IHggPSB0aGlzLmNhbnZhc1dpZHRoIC8gMjtcbiAgICBjb25zdCB5ID0gdGhpcy5jYW52YXNIZWlnaHQgLyAyO1xuXG4gICAgdGhpcy5iYWxsb29uID0gbmV3IEJhbGxvb24oY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCB4LCB5KTtcblxuICAgIHRoaXMuYmFsbG9vbi5vcGFjaXR5ID0gMDtcbiAgfVxuXG4gIG9uUmVzaXplKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbikge1xuICAgICAgdGhpcy5iYWxsb29uLnggPSBjYW52YXNXaWR0aCAvIDI7XG4gICAgICB0aGlzLmJhbGxvb24ueSA9IGNhbnZhc0hlaWdodCAvIDI7XG4gICAgfVxuICB9XG5cbiAgZXhwbG9kZSgpIHtcbiAgICB0aGlzLmJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICAvLyB0aGlzLmJhbGxvb24ueCArPSBNYXRoLnJhbmRvbSgpICogMC4yIC0gMC4xO1xuICAgIC8vIHRoaXMuYmFsbG9vbi55ICs9IE1hdGgucmFuZG9tKCkgKiAwLjIgLSAwLjE7XG4gICAgdGhpcy5iYWxsb29uLnVwZGF0ZShkdCk7XG5cbiAgICBpZiAodGhpcy5iYWxsb29uLm9wYWNpdHkgPCAxKVxuICAgICAgdGhpcy5iYWxsb29uLm9wYWNpdHkgPSBNYXRoLm1pbih0aGlzLmJhbGxvb24ub3BhY2l0eSArIDAuMDIsIDEpO1xuXG4gICAgaWYgKHRoaXMuYmFsbG9vbi5pc0RlYWQpXG4gICAgICB0aGlzLm9uRXhwbG9kZSgpO1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIHRoaXMuYmFsbG9vbi5yZW5kZXIoY3R4KTtcbiAgfVxufVxuXG5jbGFzcyBXYWl0U3RhdGUge1xuICBjb25zdHJ1Y3RvcihleHBlcmllbmNlLCBnbG9iYWxTdGF0ZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5nbG9iYWxTdGF0ZSA9IGdsb2JhbFN0YXRlO1xuXG4gICAgdGhpcy5fc2hvd2luZ0NyZWRpdHMgPSBmYWxzZTtcbiAgICB0aGlzLl90aW1lTGlzdGVuZXIgPSB0aGlzLl90aW1lTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkV4cGxvZGVkID0gdGhpcy5fb25FeHBsb2RlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgQmFsbG9vblJlbmRlcmVyKHRoaXMuZXhwZXJpZW5jZS5zcHJpdGVDb25maWcsIHRoaXMuX29uRXhwbG9kZWQpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG4gICAgdGhpcy5fc2hvd2luZ0NyZWRpdHMgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSBuZXcgQ2FudmFzVmlldyh0ZW1wbGF0ZSwge1xuICAgICAgc2hvd1RleHQ6IHRydWUsXG4gICAgICB0aW1lTGVmdFRleHQ6ICcnLFxuICAgIH0sIHt9LCB7XG4gICAgICBjbGFzc05hbWU6IFsnd2FpdC1zdGF0ZScsICdmb3JlZ3JvdW5kJ11cbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnZpZXcuc2hvdygpO1xuICAgIHRoaXMudmlldy5hcHBlbmRUbyh0aGlzLmV4cGVyaWVuY2Uudmlldy5nZXRTdGF0ZUNvbnRhaW5lcigpKTtcblxuICAgIHRoaXMudmlldy5zZXRQcmVSZW5kZXIoKGN0eCwgZHQsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcuYWRkUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG5cbiAgICB0aGlzLmV4cGVyaWVuY2UucmVjZWl2ZSgnZ2xvYmFsOnRpbWUnLCB0aGlzLl90aW1lTGlzdGVuZXIpO1xuXG4gICAgLy8gdGhpcy50aW1lTGlzdGVuZXIgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2dsb2JhbDp0aW1lJywgdGltZSA9PiB7XG4gICAgLy8gICBjb25zdCBtaW4gPSBwYXJzZUludCh0aW1lIC8gNjApO1xuICAgIC8vICAgY29uc3Qgc2VjID0gcGFyc2VJbnQodGltZSAlIDYwKTtcbiAgICAvLyAgIC8vIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgIC8vICAgLy8gY29uc29sZS5sb2cobWluICsgJyAnICsgc2VjKTtcbiAgICAvLyAgIHRoaXMudmlldy5tb2RlbC50aW1lTGVmdFRleHQgPSBgJHttaW59JyR7c2VjfScnYDtcbiAgICAvLyAgIHRoaXMudmlldy5yZW5kZXIoJy5pbmZvJyk7XG4gICAgLy8gfSk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuZXhwZXJpZW5jZS5zdG9wUmVjZWl2aW5nKCdnbG9iYWw6dGltZScsIHRoaXMuX3RpbWVMaXN0ZW5lcik7XG5cbiAgICB0aGlzLnZpZXcuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvcmVncm91bmQnKTtcbiAgICB0aGlzLnZpZXcuJGVsLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcblxuICAgIHRoaXMudmlldy5tb2RlbC5zaG93VGV4dCA9IGZhbHNlO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5zZWN0aW9uLWJvdHRvbScpO1xuICAgIC8vIG1ha2UgdGhlIGJhbGxvb24gZXhwbG9kZSwgd2FpdCBmb3JcbiAgICB0aGlzLnJlbmRlcmVyLmV4cGxvZGUoKTtcblxuICAgIC8vIHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcignZ2xvYmFsOnRpbWUnLCB0aGlzLnRpbWVMaXN0ZW5lcik7XG4gICAgaWYgKHRoaXMuX3Nob3dpbmdDcmVkaXRzKSB7XG4gICAgICB0aGlzLmV4cGVyaWVuY2Uuc2hvd0NyZWRpdHNQYWdlKDApO1xuICAgICAgdGhpcy5fc2hvd2luZ0NyZWRpdHMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBfdGltZUxpc3RlbmVyKHJlbWFpbmluZykge1xuICAgIGNvbnN0IG1pbiA9IHBhcnNlSW50KE1hdGgucm91bmQocmVtYWluaW5nKSAvIDYwKTtcbiAgICBjb25zdCBzZWMgPSBwYXJzZUludChNYXRoLnJvdW5kKHJlbWFpbmluZykgJSA2MCk7XG5cbiAgICBjb25zb2xlLmxvZyhgJHttaW59IG0gJHtzZWN9IHNgKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9zaG93aW5nQ3JlZGl0cyk7XG5cbiAgICAvKlxuICAgIGlmIChtaW4gPT09IDAgJiYgc2VjIDw9IDE1ICYmICF0aGlzLl9zaG93aW5nQ3JlZGl0cykge1xuICAgICAgdGhpcy5leHBlcmllbmNlLnNob3dDcmVkaXRzUGFnZSgxKTtcbiAgICAgIHRoaXMuX3Nob3dpbmdDcmVkaXRzID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8qL1xuICAgIFxuICAgIGlmICghdGhpcy52aWV3IHx8ICF0aGlzLnZpZXcuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5pbmZvJykpIHJldHVybjtcblxuICAgIHRoaXMudmlldy5tb2RlbC50aW1lTGVmdFRleHQgPSBgJHttaW59JyR7KFwiMFwiICsgc2VjKS5zbGljZSgtMil9JydgO1xuICAgIHRoaXMudmlldy5yZW5kZXIoJy5pbmZvJyk7XG4gIH1cblxuICBfb25FeHBsb2RlZCgpIHtcbiAgICB0aGlzLnZpZXcucmVtb3ZlUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy52aWV3LnJlbW92ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdhaXRTdGF0ZTtcbiJdfQ==