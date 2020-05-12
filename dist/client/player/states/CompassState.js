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

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top"></div>\n    <div class="section-center">\n      <% if (instructions !== \'none\') { %>\n      <p class="align-center"><%= instructions %></p>\n      <% } %>\n    </div>\n    <div class="section-bottom flex-middle">\n      <!-- <p class="small">Use the compass to choose<br />your instrument</p> -->\n      <!-- <p class="small">Turn the phone<br />360\xB0</p> -->\n      <p class="small">Use the compass to <br /> choose the colour</p>\n    </div>\n  </div>\n';

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
      this.view.render('.section-center');
    }
  }]);
  return CompassState;
}();

exports.default = CompassState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXBhc3NTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIl8yUEkiLCJNYXRoIiwiUEkiLCJNb3ZpbmdBdmVyYWdlIiwib3JkZXIiLCJidWZmZXIiLCJGbG9hdDMyQXJyYXkiLCJwb2ludGVyIiwidmFsdWUiLCJzdW0iLCJpIiwibCIsImxlbmd0aCIsImF2ZyIsIkFuZ2xlU21vb3RoaW5nIiwic2luRmlsdGVyIiwiY29zRmlsdGVyIiwicmFkIiwic2luIiwiY29zIiwic21vb3RoZWRTaW4iLCJwcm9jZXNzIiwic21vb3RoZWRDb3MiLCJhdGFuMiIsIkNvbXBhc3NCYWxsb29uIiwiYXJncyIsInNocmlua1NpemUiLCJncm93U2l6ZSIsInRhcmdldFNpemUiLCJkdCIsInNpemUiLCJ3aWR0aCIsImRlbHRhIiwiY3JvcHBlZERlbHRhIiwibWF4IiwibWluIiwiaGVpZ2h0IiwiY3R4IiwiQmFsbG9vbiIsIkNvbXBhc3NSZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsImRpcmVjdGlvbnMiLCJfc3ByaXRlQ29uZmlnIiwiX2RpcmVjdGlvbnMiLCJjb2xvciIsIl9hY3RpdmVDb2xvciIsIl9hbmdsZSIsImJhbGxvb25zIiwiX3Ntb290aEFuZ2xlIiwiY2FudmFzV2lkdGgiLCJjYW52YXNIZWlnaHQiLCJjb25maWciLCJpbWFnZSIsImdyb3VwcyIsImNsaXBQb3NpdGlvbnMiLCJjbGlwV2lkdGgiLCJjbGlwU2l6ZSIsImNsaXBIZWlnaHQiLCJyZWZyZXNoUmF0ZSIsImFuaW1hdGlvblJhdGUiLCJiYWxsb29uIiwib3BhY2l0eSIsImFuZ2xlIiwidXBkYXRlIiwic2F2ZSIsImh3IiwiaGgiLCJ0cmFuc2xhdGUiLCJncm93Iiwic2hyaW5rIiwicmVsQW5nbGUiLCJyb3RhdGUiLCJyZW5kZXIiLCJyZXN0b3JlIiwiQ2FudmFzMmRSZW5kZXJlciIsIkNvbXBhc3NTdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsIl9vbkNvbXBhc3NVcGRhdGUiLCJiaW5kIiwiX29uR3JvdXBVcGRhdGUiLCJyZW5kZXJlciIsImFyZWFDb25maWciLCJfb25JbnN0cnVjdGlvbnMiLCJ2aWV3IiwiQ2FudmFzVmlldyIsImluc3RydWN0aW9ucyIsImNsYXNzTmFtZSIsInNob3ciLCJhcHBlbmRUbyIsImdldFN0YXRlQ29udGFpbmVyIiwic2V0UHJlUmVuZGVyIiwiY2xlYXJSZWN0IiwiYWRkUmVuZGVyZXIiLCJhZGRDb21wYXNzTGlzdGVuZXIiLCJzZXRDb2xvciIsImdyb3VwRmlsdGVyIiwiZ2V0U3RhdGUiLCJzaGFyZWRQYXJhbXMiLCJhZGRQYXJhbUxpc3RlbmVyIiwiJGVsIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwicmVtb3ZlUmVuZGVyZXIiLCJyZW1vdmVDb21wYXNzTGlzdGVuZXIiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwic2V0QW5nbGUiLCJtb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSwyakJBQU47O0FBaUJBLElBQU1DLE9BQU8sSUFBSUMsS0FBS0MsRUFBdEI7O0lBRU1DLGE7QUFDSix5QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUNqQixTQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsSUFBSUMsWUFBSixDQUFpQkYsS0FBakIsQ0FBZDtBQUNBLFNBQUtHLE9BQUwsR0FBZSxDQUFmO0FBQ0Q7Ozs7NEJBRU9DLEssRUFBTztBQUNiLFVBQU1ILFNBQVMsS0FBS0EsTUFBcEI7QUFDQUEsYUFBTyxLQUFLRSxPQUFaLElBQXVCQyxLQUF2Qjs7QUFFQSxVQUFJQyxNQUFNLENBQVY7QUFDQSxXQUFLLElBQUlDLElBQUksQ0FBUixFQUFXQyxJQUFJTixPQUFPTyxNQUEzQixFQUFtQ0YsSUFBSUMsQ0FBdkMsRUFBMENELEdBQTFDO0FBQ0VELGVBQU9KLE9BQU9LLENBQVAsQ0FBUDtBQURGLE9BR0EsSUFBTUcsTUFBTUosTUFBTSxLQUFL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LENBQWdCdEIsWUFBaEIsR0FBK0I5RSxLQUEvQjtBQUNBLFdBQUs0RSxJQUFMLENBQVVaLE1BQVYsQ0FBaUIsaUJBQWpCO0FBQ0Q7Ozs7O2tCQUdZRyxZIiwiZmlsZSI6IkNvbXBhc3NTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbnZhc1ZpZXcsIENhbnZhczJkUmVuZGVyZXIgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgQmFsbG9vbiBmcm9tICcuLi9yZW5kZXJlcnMvQmFsbG9vbic7XG5cbmNvbnN0IHRlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPlxuICAgICAgPCUgaWYgKGluc3RydWN0aW9ucyAhPT0gJ25vbmUnKSB7ICU+XG4gICAgICA8cCBjbGFzcz1cImFsaWduLWNlbnRlclwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8IS0tIDxwIGNsYXNzPVwic21hbGxcIj5Vc2UgdGhlIGNvbXBhc3MgdG8gY2hvb3NlPGJyIC8+eW91ciBpbnN0cnVtZW50PC9wPiAtLT5cbiAgICAgIDwhLS0gPHAgY2xhc3M9XCJzbWFsbFwiPlR1cm4gdGhlIHBob25lPGJyIC8+MzYwwrA8L3A+IC0tPlxuICAgICAgPHAgY2xhc3M9XCJzbWFsbFwiPlVzZSB0aGUgY29tcGFzcyB0byA8YnIgLz4gY2hvb3NlIHRoZSBjb2xvdXI8L3A+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY29uc3QgXzJQSSA9IDIgKiBNYXRoLlBJO1xuXG5jbGFzcyBNb3ZpbmdBdmVyYWdlIHtcbiAgY29uc3RydWN0b3Iob3JkZXIpIHtcbiAgICB0aGlzLm9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KG9yZGVyKTtcbiAgICB0aGlzLnBvaW50ZXIgPSAwO1xuICB9XG5cbiAgcHJvY2Vzcyh2YWx1ZSkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGJ1ZmZlclt0aGlzLnBvaW50ZXJdID0gdmFsdWU7XG5cbiAgICBsZXQgc3VtID0gMDtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGJ1ZmZlci5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICBzdW0gKz0gYnVmZmVyW2ldO1xuXG4gICAgY29uc3QgYXZnID0gc3VtIC8gdGhpcy5vcmRlcjtcbiAgICB0aGlzLnBvaW50ZXIgPSAodGhpcy5wb2ludGVyICsgMSkgJSB0aGlzLm9yZGVyO1xuXG4gICAgcmV0dXJuIGF2ZztcbiAgfVxufVxuXG5jbGFzcyBBbmdsZVNtb290aGluZyB7XG4gIGNvbnN0cnVjdG9yKG9yZGVyKSB7XG4gICAgdGhpcy5vcmRlciA9IG9yZGVyO1xuICAgIHRoaXMuc2luRmlsdGVyID0gbmV3IE1vdmluZ0F2ZXJhZ2Uob3JkZXIpO1xuICAgIHRoaXMuY29zRmlsdGVyID0gbmV3IE1vdmluZ0F2ZXJhZ2Uob3JkZXIpO1xuICB9XG5cbiAgcHJvY2VzcyhyYWQpIHtcbiAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xuICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XG4gICAgY29uc3Qgc21vb3RoZWRTaW4gPSB0aGlzLnNpbkZpbHRlci5wcm9jZXNzKHNpbik7XG4gICAgY29uc3Qgc21vb3RoZWRDb3MgPSB0aGlzLmNvc0ZpbHRlci5wcm9jZXNzKGNvcyk7XG5cbiAgICByZXR1cm4gTWF0aC5hdGFuMihzbW9vdGhlZFNpbiwgc21vb3RoZWRDb3MpO1xuICB9XG59XG5cbmNsYXNzIENvbXBhc3NCYWxsb29uIGV4dGVuZHMgQmFsbG9vbiB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuc2hyaW5rU2l6ZSA9IG51bGw7XG4gICAgdGhpcy5ncm93U2l6ZSA9IG51bGw7XG4gICAgdGhpcy50YXJnZXRTaXplID0gbnVsbDtcbiAgfVxuXG4gIGdyb3coKSB7XG4gICAgdGhpcy50YXJnZXRTaXplID0gdGhpcy5ncm93U2l6ZTtcbiAgfVxuXG4gIHNocmluaygpIHtcbiAgICB0aGlzLnRhcmdldFNpemUgPSB0aGlzLnNocmlua1NpemU7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBjb25zdCBzaXplID0gdGhpcy53aWR0aDtcblxuICAgIGlmIChzaXplICE9PSB0aGlzLnRhcmdldFNpemUpIHtcbiAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy50YXJnZXRTaXplIC0gc2l6ZTtcbiAgICAgIGNvbnN0IGNyb3BwZWREZWx0YSA9IE1hdGgubWF4KC0xMCwgTWF0aC5taW4oZGVsdGEsIDEwKSk7XG5cbiAgICAgIHRoaXMud2lkdGggKz0gY3JvcHBlZERlbHRhO1xuICAgICAgdGhpcy5oZWlnaHQgKz0gY3JvcHBlZERlbHRhO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBzdXBlci5yZW5kZXIoY3R4KTtcbiAgfVxufVxuXG5jbGFzcyBDb21wYXNzUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3ByaXRlQ29uZmlnLCBkaXJlY3Rpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3Nwcml0ZUNvbmZpZyA9IHNwcml0ZUNvbmZpZztcbiAgICB0aGlzLl9kaXJlY3Rpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGlyZWN0aW9ucyk7XG4gICAgLy8gdG8gcmFkaWFuc1xuICAgIGZvciAobGV0IGNvbG9yIGluIHRoaXMuX2RpcmVjdGlvbnMpXG4gICAgICB0aGlzLl9kaXJlY3Rpb25zW2NvbG9yXSA9IHRoaXMuX2RpcmVjdGlvbnNbY29sb3JdIC8gMzYwICogXzJQSTtcblxuICAgIHRoaXMuX2FjdGl2ZUNvbG9yID0gbnVsbDtcbiAgICB0aGlzLl9hbmdsZSA9IDA7XG5cbiAgICB0aGlzLmJhbGxvb25zID0ge307XG4gICAgdGhpcy5fc21vb3RoQW5nbGUgPSBuZXcgQW5nbGVTbW9vdGhpbmcoOCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCBncm93U2l6ZSA9IHNpemUgLyAxLjU7XG4gICAgY29uc3Qgc2hyaW5rU2l6ZSA9IHNpemUgLyAzO1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX3Nwcml0ZUNvbmZpZztcblxuICAgIGZvciAobGV0IGNvbG9yIGluIHRoaXMuX2RpcmVjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGltYWdlID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uaW1hZ2U7XG4gICAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICAgIGNvbnN0IGNsaXBXaWR0aCA9IGNvbmZpZy5jbGlwU2l6ZS53aWR0aDtcbiAgICAgIGNvbnN0IGNsaXBIZWlnaHQgPSBjb25maWcuY2xpcFNpemUuaGVpZ2h0O1xuICAgICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcbiAgICAgIGNvbnN0IHNpemUgPSBzaHJpbmtTaXplOyAvLyBkZWZhdWx0IHRvIHNocmlua1xuXG4gICAgICBjb25zdCBiYWxsb29uID0gbmV3IENvbXBhc3NCYWxsb29uKGNvbG9yLCBpbWFnZSwgY2xpcFBvc2l0aW9ucywgY2xpcFdpZHRoLCBjbGlwSGVpZ2h0LCByZWZyZXNoUmF0ZSwgc2l6ZSwgc2l6ZSwgMCwgMCk7XG5cbiAgICAgIGJhbGxvb24ub3BhY2l0eSA9IDA7XG4gICAgICBiYWxsb29uLmdyb3dTaXplID0gZ3Jvd1NpemU7XG4gICAgICBiYWxsb29uLnNocmlua1NpemUgPSBzaHJpbmtTaXplO1xuICAgICAgYmFsbG9vbi50YXJnZXRTaXplID0gc2hyaW5rU2l6ZTtcblxuICAgICAgdGhpcy5iYWxsb29uc1tjb2xvcl0gPSBiYWxsb29uO1xuICAgIH1cbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5fYWN0aXZlQ29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIHNldEFuZ2xlKGFuZ2xlKSB7XG4gICAgdGhpcy5fYW5nbGUgPSB0aGlzLl9zbW9vdGhBbmdsZS5wcm9jZXNzKGFuZ2xlIC8gMzYwICogXzJQSSk7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBmb3IgKGxldCBjb2xvciBpbiB0aGlzLmJhbGxvb25zKSB7XG4gICAgICBjb25zdCBiYWxsb29uID0gdGhpcy5iYWxsb29uc1tjb2xvcl07XG5cbiAgICAgIGlmIChiYWxsb29uLm9wYWNpdHkgPCAxKVxuICAgICAgICBiYWxsb29uLm9wYWNpdHkgPSBNYXRoLm1pbihiYWxsb29uLm9wYWNpdHkgKyAwLjAyKTtcblxuICAgICAgYmFsbG9vbi51cGRhdGUoZHQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgaHcgPSB0aGlzLmNhbnZhc1dpZHRoIC8gMjtcbiAgICBjb25zdCBoaCA9IHRoaXMuY2FudmFzSGVpZ2h0IC8gMjtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4oaHcsIGhoKTtcblxuICAgIGN0eC50cmFuc2xhdGUoaHcsIGhoKTtcblxuICAgIGZvciAobGV0IGNvbG9yIGluIHRoaXMuX2RpcmVjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGJhbGxvb24gPSB0aGlzLmJhbGxvb25zW2NvbG9yXTtcblxuICAgICAgaWYgKGNvbG9yID09PSB0aGlzLl9hY3RpdmVDb2xvcilcbiAgICAgICAgYmFsbG9vbi5ncm93KCk7XG4gICAgICBlbHNlXG4gICAgICAgIGJhbGxvb24uc2hyaW5rKCk7XG5cbiAgICAgIC8vIGAqPSAtMWAgYmVjYXVzZSBkaXJlY3Rpb24gYW5kIG9yaWVudGF0aW9uIGFyZSBkZWZpbmVkIGNvdW50ZXIgY2xvY2t3aXNlXG4gICAgICAvLyB3aGlsZSByb3RhdGUgaXMgY2xvY2sgd2lzZVxuICAgICAgY29uc3QgcmVsQW5nbGUgPSAtKHRoaXMuX2RpcmVjdGlvbnNbY29sb3JdIC0gdGhpcy5fYW5nbGUpO1xuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnJvdGF0ZShyZWxBbmdsZSk7XG4gICAgICBjdHgudHJhbnNsYXRlKDAsIC1zaXplIC8gMik7XG4gICAgICBiYWxsb29uLnJlbmRlcihjdHgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG5cbmNsYXNzIENvbXBhc3NTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG5cbiAgICB0aGlzLl9vbkNvbXBhc3NVcGRhdGUgPSB0aGlzLl9vbkNvbXBhc3NVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkdyb3VwVXBkYXRlID0gdGhpcy5fb25Hcm91cFVwZGF0ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBDb21wYXNzUmVuZGVyZXIoXG4gICAgICB0aGlzLmV4cGVyaWVuY2Uuc3ByaXRlQ29uZmlnLFxuICAgICAgdGhpcy5leHBlcmllbmNlLmFyZWFDb25maWcuZGlyZWN0aW9uc1xuICAgICk7XG5cbiAgICB0aGlzLl9vbkluc3RydWN0aW9ucyA9IHRoaXMuX29uSW5zdHJ1Y3Rpb25zLmJpbmQodGhpcyk7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICB0aGlzLnZpZXcgPSBuZXcgQ2FudmFzVmlldyh0ZW1wbGF0ZSwge1xuICAgICAgYW5nbGU6ICcnLFxuICAgICAgaW5zdHJ1Y3Rpb25zOiAnJyxcbiAgICB9LCB7fSwge1xuICAgICAgY2xhc3NOYW1lOiBbJ3dhaXQtc3RhdGUnLCAnZm9yZWdyb3VuZCddLFxuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHRoaXMudmlldy5zaG93KCk7XG4gICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuZXhwZXJpZW5jZS52aWV3LmdldFN0YXRlQ29udGFpbmVyKCkpO1xuXG4gICAgdGhpcy52aWV3LnNldFByZVJlbmRlcigoY3R4LCBkdCwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIHRoaXMuZXhwZXJpZW5jZS5hZGRDb21wYXNzTGlzdGVuZXIoJ2NvbXBhc3MnLCB0aGlzLl9vbkNvbXBhc3NVcGRhdGUpO1xuICAgIHRoaXMuZXhwZXJpZW5jZS5hZGRDb21wYXNzTGlzdGVuZXIoJ2dyb3VwJywgdGhpcy5fb25Hcm91cFVwZGF0ZSk7XG4gICAgLy8gc2V0IHJlbmRlcmVyIHdpdGggY3VycmVudCBncm91cFxuICAgIHRoaXMucmVuZGVyZXIuc2V0Q29sb3IodGhpcy5leHBlcmllbmNlLmdyb3VwRmlsdGVyLmdldFN0YXRlKCkpO1xuXG4gICAgY29uc3Qgc2hhcmVkUGFyYW1zID0gdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcztcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignY29tcGFzczppbnN0cnVjdGlvbnMnLCB0aGlzLl9vbkluc3RydWN0aW9ucyk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9yZWdyb3VuZCcpO1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuXG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcblxuICAgIHRoaXMuZXhwZXJpZW5jZS5yZW1vdmVDb21wYXNzTGlzdGVuZXIoJ2NvbXBhc3MnLCB0aGlzLl9vbkNvbXBhc3NVcGRhdGUpO1xuICAgIHRoaXMuZXhwZXJpZW5jZS5yZW1vdmVDb21wYXNzTGlzdGVuZXIoJ2dyb3VwJywgdGhpcy5fb25Hcm91cFVwZGF0ZSk7XG5cbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdjb21wYXNzOmluc3RydWN0aW9ucycsIHRoaXMuX29uSW5zdHJ1Y3Rpb25zKTtcbiAgfVxuXG4gIF9vbkNvbXBhc3NVcGRhdGUoYW5nbGUpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEFuZ2xlKGFuZ2xlKTtcbiAgfVxuXG4gIF9vbkdyb3VwVXBkYXRlKGNvbG9yKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDb2xvcihjb2xvcik7XG4gIH1cblxuICBfb25JbnN0cnVjdGlvbnModmFsdWUpIHtcbiAgICB0aGlzLnZpZXcubW9kZWwuaW5zdHJ1Y3Rpb25zID0gdmFsdWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tY2VudGVyJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcGFzc1N0YXRlO1xuIl19