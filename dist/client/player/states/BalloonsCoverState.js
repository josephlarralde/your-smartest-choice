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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('soundworks/client');

var _Balloon = require('../renderers/Balloon');

var _Balloon2 = _interopRequireDefault(_Balloon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"></div>\n    <div class="section-center flex-center">\n    </div>\n    <div class="section-bottom flex-middle"></div>\n  </div>\n';

var BalloonCoverRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(BalloonCoverRenderer, _Canvas2dRenderer);

  function BalloonCoverRenderer(spriteConfig) {
    (0, _classCallCheck3.default)(this, BalloonCoverRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BalloonCoverRenderer.__proto__ || (0, _getPrototypeOf2.default)(BalloonCoverRenderer)).call(this));

    _this.spriteConfig = spriteConfig;
    _this.balloons = [];
    _this.aliveBalloons = [];
    return _this;
  }

  (0, _createClass3.default)(BalloonCoverRenderer, [{
    key: 'addBalloon',
    value: function addBalloon() {
      var config = this.spriteConfig;
      var colorIndex = Math.floor(Math.random() * config.colors.length);
      var color = config.colors[colorIndex];

      var image = config.groups[color].image;
      var clipPositions = config.groups[color].clipPositions;
      var clipWidth = config.clipSize.width;
      var clipHeight = config.clipSize.height;
      var refreshRate = config.animationRate;
      var size = Math.min(this.canvasWidth, this.canvasHeight) * config.smallSizeRatio;

      // render balloons on a square to deal simply with orientation
      var maxSize = Math.max(this.canvasWidth, this.canvasHeight);
      var x = Math.random() * maxSize;
      var y = Math.random() * maxSize;

      var balloon = new _Balloon2.default(color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

      balloon.opacity = 0;

      this.balloons.push(balloon);
      this.aliveBalloons.push(balloon);
    }
  }, {
    key: 'removeBalloon',
    value: function removeBalloon() {
      var lastIndex = this.aliveBalloons.length - 1;
      var balloon = this.aliveBalloons[lastIndex];
      balloon.explode = true;
      // remove from alive balloons
      this.aliveBalloons.length = lastIndex;
    }
  }, {
    key: 'explodeBalloons',
    value: function explodeBalloons(color) {
      for (var i = this.aliveBalloons.length - 1; i >= 0; i--) {
        var balloon = this.aliveBalloons[i];

        if (balloon.color === color) {
          balloon.explode = true;
          this.aliveBalloons.splice(i, 1);
        }
      }
    }
  }, {
    key: 'explodeRandomBalloon',
    value: function explodeRandomBalloon() {
      // const index = Math.floor(Math.random() * this.balloons.length);
      var index = this.balloons.length - 1;
      var balloon = this.balloons[index];

      if (balloon) {
        balloon.explode = true;
        this.aliveBalloons.splice(index, 1);
      }
    }
  }, {
    key: 'init',
    value: function init() {}
  }, {
    key: 'update',
    value: function update(dt) {
      var balloons = this.balloons;

      for (var i = balloons.length - 1; i >= 0; i--) {
        var balloon = balloons[i];
        balloon.update(dt);

        if (balloon.opacity < 1) balloon.opacity = Math.min(balloon.opacity + 0.05, 1);

        if (balloon.isDead) balloons.splice(i, 1);
      }
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      var balloons = this.balloons;

      for (var i = 0, l = balloons.length; i < l; i++) {
        balloons[i].render(ctx);
      }
    }
  }, {
    key: 'length',
    get: function get() {
      return this.aliveBalloons.length;
    }
  }]);
  return BalloonCoverRenderer;
}(_client.Canvas2dRenderer);

var BalloonCoverState = function () {
  function BalloonCoverState(experience, globalState) {
    (0, _classCallCheck3.default)(this, BalloonCoverState);

    this.experience = experience;
    this.globalState = globalState;

    var numBarCover = 1;

    this._state = 'cover';
    this._coverTime = 0;
    this._coverDuration = 2.4 * numBarCover; // seconds
    this._maxBalloons = 500;
    // this._explodeInterval = 1;
    // this._explodeTime = 0;

    this.renderer = new BalloonCoverRenderer(experience.spriteConfig);

    this._explodeBalloons = this._explodeBalloons.bind(this);
  }

  (0, _createClass3.default)(BalloonCoverState, [{
    key: 'enter',
    value: function enter() {
      var _this2 = this;

      this.view = new _client.CanvasView(template, {}, {}, {
        className: ['balloon-cover-state', 'foreground']
      });

      this.view.render();
      this.view.show();
      this.view.appendTo(this.experience.view.getStateContainer());

      this.view.setPreRender(function (ctx, dt, width, height) {
        ctx.clearRect(0, 0, width, height);

        // cover
        if (_this2._state === 'cover') {
          _this2._coverTime += dt;

          if (_this2._coverTime <= _this2._coverDuration) {
            var numBalloons = Math.ceil(_this2._maxBalloons * _this2._coverTime / _this2._coverDuration);
            _this2._updateNumberBalloons(numBalloons);
          } else {
            _this2._toggleBackground(true);
            _this2._state = 'explode';
          }
        } else if (_this2._state === 'explode') {
          if (Math.random() < 0.03) _this2.renderer.explodeRandomBalloon();
        }
      });

      this.view.addRenderer(this.renderer);

      var sharedParams = this.experience.sharedParams;
      sharedParams.addParamListener('balloonCover:explode', this._explodeBalloons);
    }
  }, {
    key: 'exit',
    value: function exit() {
      this._state = 'exit';
      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');
      this.view.removeRenderer(this.renderer);
      this.view.remove();

      this._toggleBackground(false); // remove shared gif

      var sharedParams = this.experience.sharedParams;
      sharedParams.removeParamListener('balloonCover:explode', this._explodeBalloons);
    }
  }, {
    key: '_explodeBalloons',
    value: function _explodeBalloons(color) {
      if (this._state === 'explode') this.renderer.explodeBalloons(color);
    }
  }, {
    key: '_updateNumberBalloons',
    value: function _updateNumberBalloons(value) {
      if (this.renderer.length < value) {
        while (this.renderer.length < value) {
          this.renderer.addBalloon();
        }
      } else if (this.renderer.length > value) {
        while (this.renderer.length > value) {
          this.renderer.removeBalloon();
        }
      }
    }
  }, {
    key: '_toggleBackground',
    value: function _toggleBackground(value) {
      if (value === true) {
        this.experience.showSharedVisual('gif:explodingBalloon');
      } else {
        this.experience.hideSharedVisual();
      }
    }
  }]);
  return BalloonCoverState;
}();

exports.default = BalloonCoverState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhbGxvb25zQ292ZXJTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIkJhbGxvb25Db3ZlclJlbmRlcmVyIiwic3ByaXRlQ29uZmlnIiwiYmFsbG9vbnMiLCJhbGl2ZUJhbGxvb25zIiwiY29uZmlnIiwiY29sb3JJbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNvbG9ycyIsImxlbmd0aCIsImNvbG9yIiwiaW1hZ2UiLCJncm91cHMiLCJjbGlwUG9zaXRpb25zIiwiY2xpcFdpZHRoIiwiY2xpcFNpemUiLCJ3aWR0aCIsImNsaXBIZWlnaHQiLCJoZWlnaHQiLCJyZWZyZXNoUmF0ZSIsImFuaW1hdGlvblJhdGUiLCJzaXplIiwibWluIiwiY2FudmFzV2lkdGgiLCJjYW52YXNIZWlnaHQiLCJzbWFsbFNpemVSYXRpbyIsIm1heFNpemUiLCJtYXgiLCJ4IiwieSIsImJhbGxvb24iLCJCYWxsb29uIiwib3BhY2l0eSIsInB1c2giLCJsYXN0SW5kZXgiLCJleHBsb2RlIiwiaSIsInNwbGljZSIsImluZGV4IiwiZHQiLCJ1cGRhdGUiLCJpc0RlYWQiLCJjdHgiLCJsIiwicmVuZGVyIiwiQ2FudmFzMmRSZW5kZXJlciIsIkJhbGxvb25Db3ZlclN0YXRlIiwiZXhwZXJpZW5jZSIsImdsb2JhbFN0YXRlIiwibnVtQmFyQ292ZXIiLCJfc3RhdGUiLCJfY292ZXJUaW1lIiwiX2NvdmVyRHVyYXRpb24iLCJfbWF4QmFsbG9vbnMiLCJyZW5kZXJlciIsIl9leHBsb2RlQmFsbG9vbnMiLCJiaW5kIiwidmlldyIsIkNhbnZhc1ZpZXciLCJjbGFzc05hbWUiLCJzaG93IiwiYXBwZW5kVG8iLCJnZXRTdGF0ZUNvbnRhaW5lciIsInNldFByZVJlbmRlciIsImNsZWFyUmVjdCIsIm51bUJhbGxvb25zIiwiY2VpbCIsIl91cGRhdGVOdW1iZXJCYWxsb29ucyIsIl90b2dnbGVCYWNrZ3JvdW5kIiwiZXhwbG9kZVJhbmRvbUJhbGxvb24iLCJhZGRSZW5kZXJlciIsInNoYXJlZFBhcmFtcyIsImFkZFBhcmFtTGlzdGVuZXIiLCIkZWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJyZW1vdmVSZW5kZXJlciIsInJlbW92ZVBhcmFtTGlzdGVuZXIiLCJleHBsb2RlQmFsbG9vbnMiLCJ2YWx1ZSIsImFkZEJhbGxvb24iLCJyZW1vdmVCYWxsb29uIiwic2hvd1NoYXJlZFZpc3VhbCIsImhpZGVTaGFyZWRWaXN1YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLDRQQUFOOztJQVVNQyxvQjs7O0FBQ0osZ0NBQVlDLFlBQVosRUFBMEI7QUFBQTs7QUFBQTs7QUFHeEIsVUFBS0EsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxVQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQixFQUFyQjtBQUx3QjtBQU16Qjs7OztpQ0FNWTtBQUNYLFVBQU1DLFNBQVMsS0FBS0gsWUFBcEI7QUFDQSxVQUFNSSxhQUFhQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JKLE9BQU9LLE1BQVAsQ0FBY0MsTUFBekMsQ0FBbkI7QUFDQSxVQUFNQyxRQUFRUCxPQUFPSyxNQUFQLENBQWNKLFVBQWQsQ0FBZDs7QUFFQSxVQUFNTyxRQUFRUixPQUFPUyxNQUFQLENBQWNGLEtBQWQsRUFBcUJDLEtBQW5DO0FBQ0EsVUFBTUUsZ0JBQWdCVixPQUFPUyxNQUFQLENBQWNGLEtBQWQsRUFBcUJHLGFBQTNDO0FBQ0EsVUFBTUMsWUFBWVgsT0FBT1ksUUFBUCxDQUFnQkMsS0FBbEM7QUFDQSxVQUFNQyxhQUFhZCxPQUFPWSxRQUFQLENBQWdCRyxNQUFuQztBQUNBLFVBQU1DLGNBQWNoQixPQUFPaUIsYUFBM0I7QUFDQSxVQUFNQyxPQUFPaEIsS0FBS2lCLEdBQUwsQ0FBUyxLQUFLQyxXQUFkLEVBQTJCLEtBQUtDLFlBQWhDLElBQWdEckIsT0FBT3NCLGNBQXBFOztBQUVBO0FBQ0EsVUFBTUMsVUFB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QWIsQ0FBaUMsc0JBQWpDLEVBQXlELEtBQUt2QixnQkFBOUQ7QUFDRDs7O3FDQUVnQjdDLEssRUFBTztBQUN0QixVQUFJLEtBQUt3QyxNQUFMLEtBQWdCLFNBQXBCLEVBQ0UsS0FBS0ksUUFBTCxDQUFjeUIsZUFBZCxDQUE4QnJFLEtBQTlCO0FBQ0g7OzswQ0FFcUJzRSxLLEVBQU87QUFDM0IsVUFBSSxLQUFLMUIsUUFBTCxDQUFjN0MsTUFBZCxHQUF1QnVFLEtBQTNCLEVBQWtDO0FBQ2hDLGVBQU8sS0FBSzFCLFFBQUwsQ0FBYzdDLE1BQWQsR0FBdUJ1RSxLQUE5QjtBQUNFLGVBQUsxQixRQUFMLENBQWMyQixVQUFkO0FBREY7QUFFRCxPQUhELE1BR08sSUFBSSxLQUFLM0IsUUFBTCxDQUFjN0MsTUFBZCxHQUF1QnVFLEtBQTNCLEVBQWtDO0FBQ3ZDLGVBQU8sS0FBSzFCLFFBQUwsQ0FBYzdDLE1BQWQsR0FBdUJ1RSxLQUE5QjtBQUNFLGVBQUsxQixRQUFMLENBQWM0QixhQUFkO0FBREY7QUFFRDtBQUNGOzs7c0NBRWlCRixLLEVBQU87QUFDdkIsVUFBSUEsVUFBVSxJQUFkLEVBQW9CO0FBQ2xCLGFBQUtqQyxVQUFMLENBQWdCb0MsZ0JBQWhCLENBQWlDLHNCQUFqQztBQUNELE9BRkQsTUFFTztBQUNMLGFBQUtwQyxVQUFMLENBQWdCcUMsZ0JBQWhCO0FBQ0Q7QUFDRjs7Ozs7a0JBR1l0QyxpQiIsImZpbGUiOiJCYWxsb29uc0NvdmVyU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNWaWV3LCBDYW52YXMyZFJlbmRlcmVyIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IEJhbGxvb24gZnJvbSAnLi4vcmVuZGVyZXJzL0JhbGxvb24nO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jbGFzcyBCYWxsb29uQ292ZXJSZW5kZXJlciBleHRlbmRzIENhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzcHJpdGVDb25maWcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zcHJpdGVDb25maWcgPSBzcHJpdGVDb25maWc7XG4gICAgdGhpcy5iYWxsb29ucyA9IFtdO1xuICAgIHRoaXMuYWxpdmVCYWxsb29ucyA9IFtdO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5hbGl2ZUJhbGxvb25zLmxlbmd0aDtcbiAgfVxuXG4gIGFkZEJhbGxvb24oKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zcHJpdGVDb25maWc7XG4gICAgY29uc3QgY29sb3JJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbmZpZy5jb2xvcnMubGVuZ3RoKTtcbiAgICBjb25zdCBjb2xvciA9IGNvbmZpZy5jb2xvcnNbY29sb3JJbmRleF07XG5cbiAgICBjb25zdCBpbWFnZSA9IGNvbmZpZy5ncm91cHNbY29sb3JdLmltYWdlO1xuICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgIGNvbnN0IGNsaXBXaWR0aCA9IGNvbmZpZy5jbGlwU2l6ZS53aWR0aDtcbiAgICBjb25zdCBjbGlwSGVpZ2h0ID0gY29uZmlnLmNsaXBTaXplLmhlaWdodDtcbiAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCkgKiBjb25maWcuc21hbGxTaXplUmF0aW87XG5cbiAgICAvLyByZW5kZXIgYmFsbG9vbnMgb24gYSBzcXVhcmUgdG8gZGVhbCBzaW1wbHkgd2l0aCBvcmllbnRhdGlvblxuICAgIGNvbnN0IG1heFNpemUgPSBNYXRoLm1heCh0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiBtYXhTaXplO1xuICAgIGNvbnN0IHkgPSBNYXRoLnJhbmRvbSgpICogbWF4U2l6ZTtcblxuICAgIGNvbnN0IGJhbGxvb24gPSBuZXcgQmFsbG9vbihjb2xvciwgaW1hZ2UsIGNsaXBQb3NpdGlvbnMsIGNsaXBXaWR0aCwgY2xpcEhlaWdodCwgcmVmcmVzaFJhdGUsIHNpemUsIHNpemUsIHgsIHkpO1xuXG4gICAgYmFsbG9vbi5vcGFjaXR5ID0gMDtcblxuICAgIHRoaXMuYmFsbG9vbnMucHVzaChiYWxsb29uKTtcbiAgICB0aGlzLmFsaXZlQmFsbG9vbnMucHVzaChiYWxsb29uKTtcbiAgfVxuXG4gIHJlbW92ZUJhbGxvb24oKSB7XG4gICAgY29uc3QgbGFzdEluZGV4ID0gdGhpcy5hbGl2ZUJhbGxvb25zLmxlbmd0aCAtIDE7XG4gICAgY29uc3QgYmFsbG9vbiA9IHRoaXMuYWxpdmVCYWxsb29uc1tsYXN0SW5kZXhdO1xuICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgLy8gcmVtb3ZlIGZyb20gYWxpdmUgYmFsbG9vbnNcbiAgICB0aGlzLmFsaXZlQmFsbG9vbnMubGVuZ3RoID0gbGFzdEluZGV4O1xuICB9XG5cbiAgZXhwbG9kZUJhbGxvb25zKGNvbG9yKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuYWxpdmVCYWxsb29ucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgYmFsbG9vbiA9IHRoaXMuYWxpdmVCYWxsb29uc1tpXTtcblxuICAgICAgaWYgKGJhbGxvb24uY29sb3IgPT09IGNvbG9yKSB7XG4gICAgICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYWxpdmVCYWxsb29ucy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXhwbG9kZVJhbmRvbUJhbGxvb24oKSB7XG4gICAgLy8gY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmJhbGxvb25zLmxlbmd0aCk7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmJhbGxvb25zLmxlbmd0aCAtIDE7XG4gICAgY29uc3QgYmFsbG9vbiA9IHRoaXMuYmFsbG9vbnNbaW5kZXhdO1xuXG4gICAgaWYgKGJhbGxvb24pIHtcbiAgICAgIGJhbGxvb24uZXhwbG9kZSA9IHRydWU7XG4gICAgICB0aGlzLmFsaXZlQmFsbG9vbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBpbml0KCkge1xuXG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBjb25zdCBiYWxsb29ucyA9IHRoaXMuYmFsbG9vbnM7XG5cbiAgICBmb3IgKGxldCBpID0gYmFsbG9vbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGJhbGxvb24gPSBiYWxsb29uc1tpXTtcbiAgICAgIGJhbGxvb24udXBkYXRlKGR0KTtcblxuICAgICAgaWYgKGJhbGxvb24ub3BhY2l0eSA8IDEpXG4gICAgICAgIGJhbGxvb24ub3BhY2l0eSA9IE1hdGgubWluKGJhbGxvb24ub3BhY2l0eSArIDAuMDUsIDEpO1xuXG4gICAgICBpZiAoYmFsbG9vbi5pc0RlYWQpXG4gICAgICAgIGJhbGxvb25zLnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoY3R4KSB7XG4gICAgY29uc3QgYmFsbG9vbnMgPSB0aGlzLmJhbGxvb25zO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBiYWxsb29ucy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICBiYWxsb29uc1tpXS5yZW5kZXIoY3R4KTtcbiAgfVxufVxuXG5jbGFzcyBCYWxsb29uQ292ZXJTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG5cbiAgICBjb25zdCBudW1CYXJDb3ZlciA9IDE7XG5cbiAgICB0aGlzLl9zdGF0ZSA9ICdjb3Zlcic7XG4gICAgdGhpcy5fY292ZXJUaW1lID0gMDtcbiAgICB0aGlzLl9jb3ZlckR1cmF0aW9uID0gMi40ICogbnVtQmFyQ292ZXI7IC8vIHNlY29uZHNcbiAgICB0aGlzLl9tYXhCYWxsb29ucyA9IDUwMDtcbiAgICAvLyB0aGlzLl9leHBsb2RlSW50ZXJ2YWwgPSAxO1xuICAgIC8vIHRoaXMuX2V4cGxvZGVUaW1lID0gMDtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgQmFsbG9vbkNvdmVyUmVuZGVyZXIoZXhwZXJpZW5jZS5zcHJpdGVDb25maWcpO1xuXG4gICAgdGhpcy5fZXhwbG9kZUJhbGxvb25zID0gdGhpcy5fZXhwbG9kZUJhbGxvb25zLmJpbmQodGhpcyk7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICB0aGlzLnZpZXcgPSBuZXcgQ2FudmFzVmlldyh0ZW1wbGF0ZSwge30sIHt9LCB7XG4gICAgICBjbGFzc05hbWU6IFsnYmFsbG9vbi1jb3Zlci1zdGF0ZScsICdmb3JlZ3JvdW5kJ10sXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdGhpcy52aWV3LnNob3coKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy5leHBlcmllbmNlLnZpZXcuZ2V0U3RhdGVDb250YWluZXIoKSk7XG5cbiAgICB0aGlzLnZpZXcuc2V0UHJlUmVuZGVyKChjdHgsIGR0LCB3aWR0aCwgaGVpZ2h0KSA9PiB7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAvLyBjb3ZlclxuICAgICAgaWYgKHRoaXMuX3N0YXRlID09PSAnY292ZXInKSB7XG4gICAgICAgIHRoaXMuX2NvdmVyVGltZSArPSBkdDtcblxuICAgICAgICBpZiAodGhpcy5fY292ZXJUaW1lIDw9IHRoaXMuX2NvdmVyRHVyYXRpb24pIHtcbiAgICAgICAgICBjb25zdCBudW1CYWxsb29ucyA9IE1hdGguY2VpbCh0aGlzLl9tYXhCYWxsb29ucyAqIHRoaXMuX2NvdmVyVGltZSAvIHRoaXMuX2NvdmVyRHVyYXRpb24pO1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZU51bWJlckJhbGxvb25zKG51bUJhbGxvb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90b2dnbGVCYWNrZ3JvdW5kKHRydWUpO1xuICAgICAgICAgIHRoaXMuX3N0YXRlID0gJ2V4cGxvZGUnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAnZXhwbG9kZScpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjAzKVxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuZXhwbG9kZVJhbmRvbUJhbGxvb24oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIGNvbnN0IHNoYXJlZFBhcmFtcyA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXM7XG4gICAgc2hhcmVkUGFyYW1zLmFkZFBhcmFtTGlzdGVuZXIoJ2JhbGxvb25Db3ZlcjpleHBsb2RlJywgdGhpcy5fZXhwbG9kZUJhbGxvb25zKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5fc3RhdGUgPSAnZXhpdCc7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JlZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcblxuICAgIHRoaXMuX3RvZ2dsZUJhY2tncm91bmQoZmFsc2UpOyAvLyByZW1vdmUgc2hhcmVkIGdpZlxuXG4gICAgY29uc3Qgc2hhcmVkUGFyYW1zID0gdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcztcbiAgICBzaGFyZWRQYXJhbXMucmVtb3ZlUGFyYW1MaXN0ZW5lcignYmFsbG9vbkNvdmVyOmV4cGxvZGUnLCB0aGlzLl9leHBsb2RlQmFsbG9vbnMpO1xuICB9XG5cbiAgX2V4cGxvZGVCYWxsb29ucyhjb2xvcikge1xuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gJ2V4cGxvZGUnKVxuICAgICAgdGhpcy5yZW5kZXJlci5leHBsb2RlQmFsbG9vbnMoY29sb3IpO1xuICB9XG5cbiAgX3VwZGF0ZU51bWJlckJhbGxvb25zKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMucmVuZGVyZXIubGVuZ3RoIDwgdmFsdWUpIHtcbiAgICAgIHdoaWxlICh0aGlzLnJlbmRlcmVyLmxlbmd0aCA8IHZhbHVlKVxuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZEJhbGxvb24oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVuZGVyZXIubGVuZ3RoID4gdmFsdWUpIHtcbiAgICAgIHdoaWxlICh0aGlzLnJlbmRlcmVyLmxlbmd0aCA+IHZhbHVlKVxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUJhbGxvb24oKTtcbiAgICB9XG4gIH1cblxuICBfdG9nZ2xlQmFja2dyb3VuZCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5leHBlcmllbmNlLnNob3dTaGFyZWRWaXN1YWwoJ2dpZjpleHBsb2RpbmdCYWxsb29uJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5oaWRlU2hhcmVkVmlzdWFsKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhbGxvb25Db3ZlclN0YXRlO1xuIl19