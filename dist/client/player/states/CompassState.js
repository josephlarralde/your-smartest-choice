'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _client = require('soundworks/client');

var _Balloon2 = require('../renderers/Balloon');

var _Balloon3 = _interopRequireDefault(_Balloon2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top"></div>\n    <div class="section-center">\n      <!--\n      <% if (instructions !== \'none\') { %>\n      <p class="align-center"><%= instructions %></p>\n      <% } %>\n      -->\n    </div>\n    <div class="section-bottom flex-middle">\n      <!-- <p class="small">Use the compass to choose<br />your instrument</p> -->\n      <!-- <p class="small">Turn the phone<br />360\xB0</p> -->\n      <% if (instructions !== \'none\') { %>\n      <!-- <p class="small">Use the compass to <br /> choose the colour</p> -->\n      <p class="small"><%= instructions %></p>\n      <% } %>\n    </div>\n  </div>\n';

var _2PI = 2 * Math.PI;

var MovingAverage = function () {
  function MovingAverage(order) {
    (0, _classCallCheck3.default)(this, MovingAverage);

    this.order = order;
    this.buffer = new Float32Array(order);
    this.pointer = 0;
  }

  (0, _createClass3.default)(MovingAverage, [{
    key: 'process',
    value: function process(value) {
      var buffer = this.buffer;
      buffer[this.pointer] = value;

      var sum = 0;
      for (var i = 0, l = buffer.length; i < l; i++) {
        sum += buffer[i];
      }var avg = sum / this.order;
      this.pointer = (this.pointer + 1) % this.order;

      return avg;
    }
  }]);
  return MovingAverage;
}();

var AngleSmoothing = function () {
  function AngleSmoothing(order) {
    (0, _classCallCheck3.default)(this, AngleSmoothing);

    this.order = order;
    this.sinFilter = new MovingAverage(order);
    this.cosFilter = new MovingAverage(order);
  }

  (0, _createClass3.default)(AngleSmoothing, [{
    key: 'process',
    value: function process(rad) {
      var sin = Math.sin(rad);
      var cos = Math.cos(rad);
      var smoothedSin = this.sinFilter.process(sin);
      var smoothedCos = this.cosFilter.process(cos);

      return Math.atan2(smoothedSin, smoothedCos);
    }
  }]);
  return AngleSmoothing;
}();

var CompassBalloon = function (_Balloon) {
  (0, _inherits3.default)(CompassBalloon, _Balloon);

  function CompassBalloon() {
    var _ref;

    (0, _classCallCheck3.default)(this, CompassBalloon);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = CompassBalloon.__proto__ || (0, _getPrototypeOf2.default)(CompassBalloon)).call.apply(_ref, [this].concat(args)));

    _this.shrinkSize = null;
    _this.growSize = null;
    _this.targetSize = null;
    return _this;
  }

  (0, _createClass3.default)(CompassBalloon, [{
    key: 'grow',
    value: function grow() {
      this.targetSize = this.growSize;
    }
  }, {
    key: 'shrink',
    value: function shrink() {
      this.targetSize = this.shrinkSize;
    }
  }, {
    key: 'update',
    value: function update(dt) {
      var size = this.width;

      if (size !== this.targetSize) {
        var delta = this.targetSize - size;
        var croppedDelta = Math.max(-10, Math.min(delta, 10));

        this.width += croppedDelta;
        this.height += croppedDelta;
      }
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      (0, _get3.default)(CompassBalloon.prototype.__proto__ || (0, _getPrototypeOf2.default)(CompassBalloon.prototype), 'render', this).call(this, ctx);
    }
  }]);
  return CompassBalloon;
}(_Balloon3.default);

var CompassRenderer = function (_Canvas2dRenderer) {
  (0, _inherits3.default)(CompassRenderer, _Canvas2dRenderer);

  function CompassRenderer(spriteConfig, directions) {
    (0, _classCallCheck3.default)(this, CompassRenderer);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (CompassRenderer.__proto__ || (0, _getPrototypeOf2.default)(CompassRenderer)).call(this));

    _this2._spriteConfig = spriteConfig;
    _this2._directions = (0, _assign2.default)({}, directions);
    // to radians
    for (var color in _this2._directions) {
      _this2._directions[color] = _this2._directions[color] / 360 * _2PI;
    }_this2._activeColor = null;
    _this2._angle = 0;

    _this2.balloons = {};
    _this2._smoothAngle = new AngleSmoothing(8);
    return _this2;
  }

  (0, _createClass3.default)(CompassRenderer, [{
    key: 'init',
    value: function init() {
      var width = this.canvasWidth;
      var height = this.canvasHeight;
      var size = Math.min(width, height);

      var growSize = size / 1.5;
      var shrinkSize = size / 3;
      var config = this._spriteConfig;

      for (var color in this._directions) {
        var image = config.groups[color].image;
        var clipPositions = config.groups[color].clipPositions;
        var clipWidth = config.clipSize.width;
        var clipHeight = config.clipSize.height;
        var refreshRate = config.animationRate;
        var _size = shrinkSize; // default to shrink

        var balloon = new CompassBalloon(color, image, clipPositions, clipWidth, clipHeight, refreshRate, _size, _size, 0, 0);

        balloon.opacity = 0;
        balloon.growSize = growSize;
        balloon.shrinkSize = shrinkSize;
        balloon.targetSize = shrinkSize;

        this.balloons[color] = balloon;
      }
    }
  }, {
    key: 'setColor',
    value: function setColor(color) {
      this._activeColor = color;
    }
  }, {
    key: 'setAngle',
    value: function setAngle(angle) {
      this._angle = this._smoothAngle.process(angle / 360 * _2PI);
    }
  }, {
    key: 'update',
    value: function update(dt) {
      for (var color in this.balloons) {
        var balloon = this.balloons[color];

        if (balloon.opacity < 1) balloon.opacity = Math.min(balloon.opacity + 0.02);

        balloon.update(dt);
      }
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      ctx.save();

      var hw = this.canvasWidth / 2;
      var hh = this.canvasHeight / 2;
      var size = Math.min(hw, hh);

      ctx.translate(hw, hh);

      for (var color in this._directions) {
        var balloon = this.balloons[color];

        if (color === this._activeColor) balloon.grow();else balloon.shrink();

        // `*= -1` because direction and orientation are defined counter clockwise
        // while rotate is clock wise
        var relAngle = -(this._directions[color] - this._angle);

        ctx.save();
        ctx.rotate(relAngle);
        ctx.translate(0, -size / 2);
        balloon.render(ctx);
        ctx.restore();
      }

      ctx.restore();
    }
  }]);
  return CompassRenderer;
}(_client.Canvas2dRenderer);

var CompassState = function () {
  function CompassState(experience, globalState) {
    (0, _classCallCheck3.default)(this, CompassState);

    this.experience = experience;
    this.globalState = globalState;

    this._onCompassUpdate = this._onCompassUpdate.bind(this);
    this._onGroupUpdate = this._onGroupUpdate.bind(this);

    this.renderer = new CompassRenderer(this.experience.spriteConfig, this.experience.areaConfig.directions);

    this._onInstructions = this._onInstructions.bind(this);
  }

  (0, _createClass3.default)(CompassState, [{
    key: 'enter',
    value: function enter() {
      this.view = new _client.CanvasView(template, {
        angle: '',
        instructions: ''
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

      this.experience.addCompassListener('compass', this._onCompassUpdate);
      this.experience.addCompassListener('group', this._onGroupUpdate);
      // set renderer with current group
      this.renderer.setColor(this.experience.groupFilter.getState());

      var sharedParams = this.experience.sharedParams;
      sharedParams.addParamListener('compass:instructions', this._onInstructions);
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.view.$el.classList.remove('foreground');
      this.view.$el.classList.add('background');

      this.view.removeRenderer(this.renderer);
      this.view.remove();

      this.experience.removeCompassListener('compass', this._onCompassUpdate);
      this.experience.removeCompassListener('group', this._onGroupUpdate);

      var sharedParams = this.experience.sharedParams;
      sharedParams.removeParamListener('compass:instructions', this._onInstructions);
    }
  }, {
    key: '_onCompassUpdate',
    value: function _onCompassUpdate(angle) {
      this.renderer.setAngle(angle);
    }
  }, {
    key: '_onGroupUpdate',
    value: function _onGroupUpdate(color) {
      this.renderer.setColor(color);
    }
  }, {
    key: '_onInstructions',
    value: function _onInstructions(value) {
      this.view.model.instructions = value;
      // this.view.render('.section-center');
      this.view.render('.section-bottom');
    }
  }]);
  return CompassState;
}();

exports.default = CompassState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXBhc3NTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIl8yUEkiLCJNYXRoIiwiUEkiLCJNb3ZpbmdBdmVyYWdlIiwib3JkZXIiLCJidWZmZXIiLCJGbG9hdDMyQXJyYXkiLCJwb2ludGVyIiwidmFsdWUiLCJzdW0iLCJpIiwibCIsImxlbmd0aCIsImF2ZyIsIkFuZ2xlU21vb3RoaW5nIiwic2luRmlsdGVyIiwiY29zRmlsdGVyIiwicmFkIiwic2luIiwiY29zIiwic21vb3RoZWRTaW4iLCJwcm9jZXNzIiwic21vb3RoZWRDb3MiLCJhdGFuMiIsIkNvbXBhc3NCYWxsb29uIiwiYXJncyIsInNocmlua1NpemUiLCJncm93U2l6ZSIsInRhcmdldFNpemUiLCJkdCIsInNpemUiLCJ3aWR0aCIsImRlbHRhIiwiY3JvcHBlZERlbHRhIiwibWF4IiwibWluIiwiaGVpZ2h0IiwiY3R4IiwiQmFsbG9vbiIsIkNvbXBhc3NSZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsImRpcmVjdGlvbnMiLCJfc3ByaXRlQ29uZmlnIiwiX2RpcmVjdGlvbnMiLCJjb2xvciIsIl9hY3RpdmVDb2xvciIsIl9hbmdsZSIsImJhbGxvb25zIiwiX3Ntb290aEFuZ2xlIiwiY2FudmFzV2lkdGgiLCJjYW52YXNIZWlnaHQiLCJjb25maWciLCJpbWFnZSIsImdyb3VwcyIsImNsaXBQb3NpdGlvbnMiLCJjbGlwV2lkdGgiLCJjbGlwU2l6ZSIsImNsaXBIZWlnaHQiLCJyZWZyZXNoUmF0ZSIsImFuaW1hdGlvblJhdGUiLCJiYWxsb29uIiwib3BhY2l0eSIsImFuZ2xlIiwidXBkYXRlIiwic2F2ZSIsImh3IiwiaGgiLCJ0cmFuc2xhdGUiLCJncm93Iiwic2hyaW5rIiwicmVsQW5nbGUiLCJyb3RhdGUiLCJyZW5kZXIiLCJyZXN0b3JlIiwiQ2FudmFzMmRSZW5kZXJlciIsIkNvbXBhc3NTdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsIl9vbkNvbXBhc3NVcGRhdGUiLCJiaW5kIiwiX29uR3JvdXBVcGRhdGUiLCJyZW5kZXJlciIsImFyZWFDb25maWciLCJfb25JbnN0cnVjdGlvbnMiLCJ2aWV3IiwiQ2FudmFzVmlldyIsImluc3RydWN0aW9ucyIsImNsYXNzTmFtZSIsInNob3ciLCJhcHBlbmRUbyIsImdldFN0YXRlQ29udGFpbmVyIiwic2V0UHJlUmVuZGVyIiwiY2xlYXJSZWN0IiwiYWRkUmVuZGVyZXIiLCJhZGRDb21wYXNzTGlzdGVuZXIiLCJzZXRDb2xvciIsImdyb3VwRmlsdGVyIiwiZ2V0U3RhdGUiLCJzaGFyZWRQYXJhbXMiLCJhZGRQYXJhbUxpc3RlbmVyIiwiJGVsIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwicmVtb3ZlUmVuZGVyZXIiLCJyZW1vdmVDb21wYXNzTGlzdGVuZXIiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwic2V0QW5nbGUiLCJtb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSx3c0JBQU47O0FBc0JBLElBQU1DLE9BQU8sSUFBSUMsS0FBS0MsRUFBdEI7O0lBRU1DLGE7QUFDSix5QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUNqQixTQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsSUFBSUMsWUFBSixDQUFpQkYsS0FBakIsQ0FBZDtBQUNBLFNBQUtHLE9BQUwsR0FBZSxDQUFmO0FBQ0Q7Ozs7NEJBRU9DLEssRUFBTztBQUNiLFVBQU1ILFNBQVMsS0FBS0EsTUFBcEI7QUFDQUEsYUFBTyxLQUFLRSxPQUFaLElBQXVCQyxLQUF2Qjs7QUFFQSxVQUFJQyxNQUFNLENBQVY7QUFDQSxXQUFLLElBQUlDLElBQUksQ0FBUixFQUFXQyxJQUFJTixPQUFPTyxNQUEzQixFQUFtQ0YsSUFBSUMsQ0FBdkMsRUFBMENELEdBQTFDO0FBQ0VELGVBQU9KLE9BQU9LLENBQVAsQ0FBUDtBQURGLE9BR0EsSUFBTUcsTUFBTUosTUFBTSxLQUFL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LENBQWdCdEIsWUFBaEIsR0FBK0I5RSxLQUEvQjtBQUNBO0FBQ0EsV0FBSzRFLElBQUwsQ0FBVVosTUFBVixDQUFpQixpQkFBakI7QUFDRDs7Ozs7a0JBR1lHLFkiLCJmaWxlIjoiQ29tcGFzc1N0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FudmFzVmlldywgQ2FudmFzMmRSZW5kZXJlciB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbmltcG9ydCBCYWxsb29uIGZyb20gJy4uL3JlbmRlcmVycy9CYWxsb29uJztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyXCI+XG4gICAgICA8IS0tXG4gICAgICA8JSBpZiAoaW5zdHJ1Y3Rpb25zICE9PSAnbm9uZScpIHsgJT5cbiAgICAgIDxwIGNsYXNzPVwiYWxpZ24tY2VudGVyXCI+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICAgIC0tPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPlxuICAgICAgPCEtLSA8cCBjbGFzcz1cInNtYWxsXCI+VXNlIHRoZSBjb21wYXNzIHRvIGNob29zZTxiciAvPnlvdXIgaW5zdHJ1bWVudDwvcD4gLS0+XG4gICAgICA8IS0tIDxwIGNsYXNzPVwic21hbGxcIj5UdXJuIHRoZSBwaG9uZTxiciAvPjM2MMKwPC9wPiAtLT5cbiAgICAgIDwlIGlmIChpbnN0cnVjdGlvbnMgIT09ICdub25lJykgeyAlPlxuICAgICAgPCEtLSA8cCBjbGFzcz1cInNtYWxsXCI+VXNlIHRoZSBjb21wYXNzIHRvIDxiciAvPiBjaG9vc2UgdGhlIGNvbG91cjwvcD4gLS0+XG4gICAgICA8cCBjbGFzcz1cInNtYWxsXCI+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jb25zdCBfMlBJID0gMiAqIE1hdGguUEk7XG5cbmNsYXNzIE1vdmluZ0F2ZXJhZ2Uge1xuICBjb25zdHJ1Y3RvcihvcmRlcikge1xuICAgIHRoaXMub3JkZXIgPSBvcmRlcjtcbiAgICB0aGlzLmJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkob3JkZXIpO1xuICAgIHRoaXMucG9pbnRlciA9IDA7XG4gIH1cblxuICBwcm9jZXNzKHZhbHVlKSB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgYnVmZmVyW3RoaXMucG9pbnRlcl0gPSB2YWx1ZTtcblxuICAgIGxldCBzdW0gPSAwO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gYnVmZmVyLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHN1bSArPSBidWZmZXJbaV07XG5cbiAgICBjb25zdCBhdmcgPSBzdW0gLyB0aGlzLm9yZGVyO1xuICAgIHRoaXMucG9pbnRlciA9ICh0aGlzLnBvaW50ZXIgKyAxKSAlIHRoaXMub3JkZXI7XG5cbiAgICByZXR1cm4gYXZnO1xuICB9XG59XG5cbmNsYXNzIEFuZ2xlU21vb3RoaW5nIHtcbiAgY29uc3RydWN0b3Iob3JkZXIpIHtcbiAgICB0aGlzLm9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5zaW5GaWx0ZXIgPSBuZXcgTW92aW5nQXZlcmFnZShvcmRlcik7XG4gICAgdGhpcy5jb3NGaWx0ZXIgPSBuZXcgTW92aW5nQXZlcmFnZShvcmRlcik7XG4gIH1cblxuICBwcm9jZXNzKHJhZCkge1xuICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XG4gICAgY29uc3QgY29zID0gTWF0aC5jb3MocmFkKTtcbiAgICBjb25zdCBzbW9vdGhlZFNpbiA9IHRoaXMuc2luRmlsdGVyLnByb2Nlc3Moc2luKTtcbiAgICBjb25zdCBzbW9vdGhlZENvcyA9IHRoaXMuY29zRmlsdGVyLnByb2Nlc3MoY29zKTtcblxuICAgIHJldHVybiBNYXRoLmF0YW4yKHNtb290aGVkU2luLCBzbW9vdGhlZENvcyk7XG4gIH1cbn1cblxuY2xhc3MgQ29tcGFzc0JhbGxvb24gZXh0ZW5kcyBCYWxsb29uIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5zaHJpbmtTaXplID0gbnVsbDtcbiAgICB0aGlzLmdyb3dTaXplID0gbnVsbDtcbiAgICB0aGlzLnRhcmdldFNpemUgPSBudWxsO1xuICB9XG5cbiAgZ3JvdygpIHtcbiAgICB0aGlzLnRhcmdldFNpemUgPSB0aGlzLmdyb3dTaXplO1xuICB9XG5cbiAgc2hyaW5rKCkge1xuICAgIHRoaXMudGFyZ2V0U2l6ZSA9IHRoaXMuc2hyaW5rU2l6ZTtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLndpZHRoO1xuXG4gICAgaWYgKHNpemUgIT09IHRoaXMudGFyZ2V0U2l6ZSkge1xuICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnRhcmdldFNpemUgLSBzaXplO1xuICAgICAgY29uc3QgY3JvcHBlZERlbHRhID0gTWF0aC5tYXgoLTEwLCBNYXRoLm1pbihkZWx0YSwgMTApKTtcblxuICAgICAgdGhpcy53aWR0aCArPSBjcm9wcGVkRGVsdGE7XG4gICAgICB0aGlzLmhlaWdodCArPSBjcm9wcGVkRGVsdGE7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIHN1cGVyLnJlbmRlcihjdHgpO1xuICB9XG59XG5cbmNsYXNzIENvbXBhc3NSZW5kZXJlciBleHRlbmRzIENhbnZhczJkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihzcHJpdGVDb25maWcsIGRpcmVjdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fc3ByaXRlQ29uZmlnID0gc3ByaXRlQ29uZmlnO1xuICAgIHRoaXMuX2RpcmVjdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkaXJlY3Rpb25zKTtcbiAgICAvLyB0byByYWRpYW5zXG4gICAgZm9yIChsZXQgY29sb3IgaW4gdGhpcy5fZGlyZWN0aW9ucylcbiAgICAgIHRoaXMuX2RpcmVjdGlvbnNbY29sb3JdID0gdGhpcy5fZGlyZWN0aW9uc1tjb2xvcl0gLyAzNjAgKiBfMlBJO1xuXG4gICAgdGhpcy5fYWN0aXZlQ29sb3IgPSBudWxsO1xuICAgIHRoaXMuX2FuZ2xlID0gMDtcblxuICAgIHRoaXMuYmFsbG9vbnMgPSB7fTtcbiAgICB0aGlzLl9zbW9vdGhBbmdsZSA9IG5ldyBBbmdsZVNtb290aGluZyg4KTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IGdyb3dTaXplID0gc2l6ZSAvIDEuNTtcbiAgICBjb25zdCBzaHJpbmtTaXplID0gc2l6ZSAvIDM7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5fc3ByaXRlQ29uZmlnO1xuXG4gICAgZm9yIChsZXQgY29sb3IgaW4gdGhpcy5fZGlyZWN0aW9ucykge1xuICAgICAgY29uc3QgaW1hZ2UgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5pbWFnZTtcbiAgICAgIGNvbnN0IGNsaXBQb3NpdGlvbnMgPSBjb25maWcuZ3JvdXBzW2NvbG9yXS5jbGlwUG9zaXRpb25zO1xuICAgICAgY29uc3QgY2xpcFdpZHRoID0gY29uZmlnLmNsaXBTaXplLndpZHRoO1xuICAgICAgY29uc3QgY2xpcEhlaWdodCA9IGNvbmZpZy5jbGlwU2l6ZS5oZWlnaHQ7XG4gICAgICBjb25zdCByZWZyZXNoUmF0ZSA9IGNvbmZpZy5hbmltYXRpb25SYXRlO1xuICAgICAgY29uc3Qgc2l6ZSA9IHNocmlua1NpemU7IC8vIGRlZmF1bHQgdG8gc2hyaW5rXG5cbiAgICAgIGNvbnN0IGJhbGxvb24gPSBuZXcgQ29tcGFzc0JhbGxvb24oY29sb3IsIGltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCBzaXplLCBzaXplLCAwLCAwKTtcblxuICAgICAgYmFsbG9vbi5vcGFjaXR5ID0gMDtcbiAgICAgIGJhbGxvb24uZ3Jvd1NpemUgPSBncm93U2l6ZTtcbiAgICAgIGJhbGxvb24uc2hyaW5rU2l6ZSA9IHNocmlua1NpemU7XG4gICAgICBiYWxsb29uLnRhcmdldFNpemUgPSBzaHJpbmtTaXplO1xuXG4gICAgICB0aGlzLmJhbGxvb25zW2NvbG9yXSA9IGJhbGxvb247XG4gICAgfVxuICB9XG5cbiAgc2V0Q29sb3IoY29sb3IpIHtcbiAgICB0aGlzLl9hY3RpdmVDb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgc2V0QW5nbGUoYW5nbGUpIHtcbiAgICB0aGlzLl9hbmdsZSA9IHRoaXMuX3Ntb290aEFuZ2xlLnByb2Nlc3MoYW5nbGUgLyAzNjAgKiBfMlBJKTtcbiAgfVxuXG4gIHVwZGF0ZShkdCkge1xuICAgIGZvciAobGV0IGNvbG9yIGluIHRoaXMuYmFsbG9vbnMpIHtcbiAgICAgIGNvbnN0IGJhbGxvb24gPSB0aGlzLmJhbGxvb25zW2NvbG9yXTtcblxuICAgICAgaWYgKGJhbGxvb24ub3BhY2l0eSA8IDEpXG4gICAgICAgIGJhbGxvb24ub3BhY2l0eSA9IE1hdGgubWluKGJhbGxvb24ub3BhY2l0eSArIDAuMDIpO1xuXG4gICAgICBiYWxsb29uLnVwZGF0ZShkdCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCBodyA9IHRoaXMuY2FudmFzV2lkdGggLyAyO1xuICAgIGNvbnN0IGhoID0gdGhpcy5jYW52YXNIZWlnaHQgLyAyO1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbihodywgaGgpO1xuXG4gICAgY3R4LnRyYW5zbGF0ZShodywgaGgpO1xuXG4gICAgZm9yIChsZXQgY29sb3IgaW4gdGhpcy5fZGlyZWN0aW9ucykge1xuICAgICAgY29uc3QgYmFsbG9vbiA9IHRoaXMuYmFsbG9vbnNbY29sb3JdO1xuXG4gICAgICBpZiAoY29sb3IgPT09IHRoaXMuX2FjdGl2ZUNvbG9yKVxuICAgICAgICBiYWxsb29uLmdyb3coKTtcbiAgICAgIGVsc2VcbiAgICAgICAgYmFsbG9vbi5zaHJpbmsoKTtcblxuICAgICAgLy8gYCo9IC0xYCBiZWNhdXNlIGRpcmVjdGlvbiBhbmQgb3JpZW50YXRpb24gYXJlIGRlZmluZWQgY291bnRlciBjbG9ja3dpc2VcbiAgICAgIC8vIHdoaWxlIHJvdGF0ZSBpcyBjbG9jayB3aXNlXG4gICAgICBjb25zdCByZWxBbmdsZSA9IC0odGhpcy5fZGlyZWN0aW9uc1tjb2xvcl0gLSB0aGlzLl9hbmdsZSk7XG5cbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHgucm90YXRlKHJlbEFuZ2xlKTtcbiAgICAgIGN0eC50cmFuc2xhdGUoMCwgLXNpemUgLyAyKTtcbiAgICAgIGJhbGxvb24ucmVuZGVyKGN0eCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cblxuY2xhc3MgQ29tcGFzc1N0YXRlIHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSwgZ2xvYmFsU3RhdGUpIHtcbiAgICB0aGlzLmV4cGVyaWVuY2UgPSBleHBlcmllbmNlO1xuICAgIHRoaXMuZ2xvYmFsU3RhdGUgPSBnbG9iYWxTdGF0ZTtcblxuICAgIHRoaXMuX29uQ29tcGFzc1VwZGF0ZSA9IHRoaXMuX29uQ29tcGFzc1VwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uR3JvdXBVcGRhdGUgPSB0aGlzLl9vbkdyb3VwVXBkYXRlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IENvbXBhc3NSZW5kZXJlcihcbiAgICAgIHRoaXMuZXhwZXJpZW5jZS5zcHJpdGVDb25maWcsXG4gICAgICB0aGlzLmV4cGVyaWVuY2UuYXJlYUNvbmZpZy5kaXJlY3Rpb25zXG4gICAgKTtcblxuICAgIHRoaXMuX29uSW5zdHJ1Y3Rpb25zID0gdGhpcy5fb25JbnN0cnVjdGlvbnMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHRoaXMudmlldyA9IG5ldyBDYW52YXNWaWV3KHRlbXBsYXRlLCB7XG4gICAgICBhbmdsZTogJycsXG4gICAgICBpbnN0cnVjdGlvbnM6ICcnLFxuICAgIH0sIHt9LCB7XG4gICAgICBjbGFzc05hbWU6IFsnd2FpdC1zdGF0ZScsICdmb3JlZ3JvdW5kJ10sXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdGhpcy52aWV3LnNob3coKTtcbiAgICB0aGlzLnZpZXcuYXBwZW5kVG8odGhpcy5leHBlcmllbmNlLnZpZXcuZ2V0U3RhdGVDb250YWluZXIoKSk7XG5cbiAgICB0aGlzLnZpZXcuc2V0UHJlUmVuZGVyKChjdHgsIGR0LCB3aWR0aCwgaGVpZ2h0KSA9PiB7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LmFkZFJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuXG4gICAgdGhpcy5leHBlcmllbmNlLmFkZENvbXBhc3NMaXN0ZW5lcignY29tcGFzcycsIHRoaXMuX29uQ29tcGFzc1VwZGF0ZSk7XG4gICAgdGhpcy5leHBlcmllbmNlLmFkZENvbXBhc3NMaXN0ZW5lcignZ3JvdXAnLCB0aGlzLl9vbkdyb3VwVXBkYXRlKTtcbiAgICAvLyBzZXQgcmVuZGVyZXIgd2l0aCBjdXJyZW50IGdyb3VwXG4gICAgdGhpcy5yZW5kZXJlci5zZXRDb2xvcih0aGlzLmV4cGVyaWVuY2UuZ3JvdXBGaWx0ZXIuZ2V0U3RhdGUoKSk7XG5cbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdjb21wYXNzOmluc3RydWN0aW9ucycsIHRoaXMuX29uSW5zdHJ1Y3Rpb25zKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JlZ3JvdW5kJyk7XG4gICAgdGhpcy52aWV3LiRlbC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG5cbiAgICB0aGlzLnZpZXcucmVtb3ZlUmVuZGVyZXIodGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy52aWV3LnJlbW92ZSgpO1xuXG4gICAgdGhpcy5leHBlcmllbmNlLnJlbW92ZUNvbXBhc3NMaXN0ZW5lcignY29tcGFzcycsIHRoaXMuX29uQ29tcGFzc1VwZGF0ZSk7XG4gICAgdGhpcy5leHBlcmllbmNlLnJlbW92ZUNvbXBhc3NMaXN0ZW5lcignZ3JvdXAnLCB0aGlzLl9vbkdyb3VwVXBkYXRlKTtcblxuICAgIGNvbnN0IHNoYXJlZFBhcmFtcyA9IHRoaXMuZXhwZXJpZW5jZS5zaGFyZWRQYXJhbXM7XG4gICAgc2hhcmVkUGFyYW1zLnJlbW92ZVBhcmFtTGlzdGVuZXIoJ2NvbXBhc3M6aW5zdHJ1Y3Rpb25zJywgdGhpcy5fb25JbnN0cnVjdGlvbnMpO1xuICB9XG5cbiAgX29uQ29tcGFzc1VwZGF0ZShhbmdsZSkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QW5nbGUoYW5nbGUpO1xuICB9XG5cbiAgX29uR3JvdXBVcGRhdGUoY29sb3IpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENvbG9yKGNvbG9yKTtcbiAgfVxuXG4gIF9vbkluc3RydWN0aW9ucyh2YWx1ZSkge1xuICAgIHRoaXMudmlldy5tb2RlbC5pbnN0cnVjdGlvbnMgPSB2YWx1ZTtcbiAgICAvLyB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1jZW50ZXInKTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCcuc2VjdGlvbi1ib3R0b20nKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wYXNzU3RhdGU7XG4iXX0=