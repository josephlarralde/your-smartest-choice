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

var template = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top"></div>\n    <div class="section-center">\n      <% if (instructions !== \'none\') { %>\n      <p class="align-center"><%= instructions %></p>\n      <% } %>\n    </div>\n    <div class="section-bottom flex-middle">\n      <p class="small">Use the compass to choose<br />your instrument</p>\n    </div>\n  </div>\n';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXBhc3NTdGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIl8yUEkiLCJNYXRoIiwiUEkiLCJNb3ZpbmdBdmVyYWdlIiwib3JkZXIiLCJidWZmZXIiLCJGbG9hdDMyQXJyYXkiLCJwb2ludGVyIiwidmFsdWUiLCJzdW0iLCJpIiwibCIsImxlbmd0aCIsImF2ZyIsIkFuZ2xlU21vb3RoaW5nIiwic2luRmlsdGVyIiwiY29zRmlsdGVyIiwicmFkIiwic2luIiwiY29zIiwic21vb3RoZWRTaW4iLCJwcm9jZXNzIiwic21vb3RoZWRDb3MiLCJhdGFuMiIsIkNvbXBhc3NCYWxsb29uIiwiYXJncyIsInNocmlua1NpemUiLCJncm93U2l6ZSIsInRhcmdldFNpemUiLCJkdCIsInNpemUiLCJ3aWR0aCIsImRlbHRhIiwiY3JvcHBlZERlbHRhIiwibWF4IiwibWluIiwiaGVpZ2h0IiwiY3R4IiwiQmFsbG9vbiIsIkNvbXBhc3NSZW5kZXJlciIsInNwcml0ZUNvbmZpZyIsImRpcmVjdGlvbnMiLCJfc3ByaXRlQ29uZmlnIiwiX2RpcmVjdGlvbnMiLCJjb2xvciIsIl9hY3RpdmVDb2xvciIsIl9hbmdsZSIsImJhbGxvb25zIiwiX3Ntb290aEFuZ2xlIiwiY2FudmFzV2lkdGgiLCJjYW52YXNIZWlnaHQiLCJjb25maWciLCJpbWFnZSIsImdyb3VwcyIsImNsaXBQb3NpdGlvbnMiLCJjbGlwV2lkdGgiLCJjbGlwU2l6ZSIsImNsaXBIZWlnaHQiLCJyZWZyZXNoUmF0ZSIsImFuaW1hdGlvblJhdGUiLCJiYWxsb29uIiwib3BhY2l0eSIsImFuZ2xlIiwidXBkYXRlIiwic2F2ZSIsImh3IiwiaGgiLCJ0cmFuc2xhdGUiLCJncm93Iiwic2hyaW5rIiwicmVsQW5nbGUiLCJyb3RhdGUiLCJyZW5kZXIiLCJyZXN0b3JlIiwiQ2FudmFzMmRSZW5kZXJlciIsIkNvbXBhc3NTdGF0ZSIsImV4cGVyaWVuY2UiLCJnbG9iYWxTdGF0ZSIsIl9vbkNvbXBhc3NVcGRhdGUiLCJiaW5kIiwiX29uR3JvdXBVcGRhdGUiLCJyZW5kZXJlciIsImFyZWFDb25maWciLCJfb25JbnN0cnVjdGlvbnMiLCJ2aWV3IiwiQ2FudmFzVmlldyIsImluc3RydWN0aW9ucyIsImNsYXNzTmFtZSIsInNob3ciLCJhcHBlbmRUbyIsImdldFN0YXRlQ29udGFpbmVyIiwic2V0UHJlUmVuZGVyIiwiY2xlYXJSZWN0IiwiYWRkUmVuZGVyZXIiLCJhZGRDb21wYXNzTGlzdGVuZXIiLCJzZXRDb2xvciIsImdyb3VwRmlsdGVyIiwiZ2V0U3RhdGUiLCJzaGFyZWRQYXJhbXMiLCJhZGRQYXJhbUxpc3RlbmVyIiwiJGVsIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwicmVtb3ZlUmVuZGVyZXIiLCJyZW1vdmVDb21wYXNzTGlzdGVuZXIiLCJyZW1vdmVQYXJhbUxpc3RlbmVyIiwic2V0QW5nbGUiLCJtb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSx5YUFBTjs7QUFlQSxJQUFNQyxPQUFPLElBQUlDLEtBQUtDLEVBQXRCOztJQUVNQyxhO0FBQ0oseUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFDakIsU0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLElBQUlDLFlBQUosQ0FBaUJGLEtBQWpCLENBQWQ7QUFDQSxTQUFLRyxPQUFMLEdBQWUsQ0FBZjtBQUNEOzs7OzRCQUVPQyxLLEVBQU87QUFDYixVQUFNSCxTQUFTLEtBQUtBLE1BQXBCO0FBQ0FBLGFBQU8sS0FBS0UsT0FBWixJQUF1QkMsS0FBdkI7O0FBRUEsVUFBSUMsTUFBTSxDQUFWO0FBQ0EsV0FBSyxJQUFJQyxJQUFJLENBQVIsRUFBV0MsSUFBSU4sT0FBT08sTUFBM0IsRUFBbUNGLElBQUlDLENBQXZDLEVBQTBDRCxHQUExQztBQUNFRCxlQUFPSixPQUFPSyxDQUFQLENBQVA7QUFERixPQUdBLElBQU1HLE1BQU1KLE1BQU0sS0FBS0ws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QUFnQnRCLFlBQWhCLEdBQStCOUUsS0FBL0I7QUFDQSxXQUFLNEUsSUFBTCxDQUFVWixNQUFWLENBQWlCLGlCQUFqQjtBQUNEOzs7OztrQkFHWUcsWSIsImZpbGUiOiJDb21wYXNzU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYW52YXNWaWV3LCBDYW52YXMyZFJlbmRlcmVyIH0gZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuaW1wb3J0IEJhbGxvb24gZnJvbSAnLi4vcmVuZGVyZXJzL0JhbGxvb24nO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXJcIj5cbiAgICAgIDwlIGlmIChpbnN0cnVjdGlvbnMgIT09ICdub25lJykgeyAlPlxuICAgICAgPHAgY2xhc3M9XCJhbGlnbi1jZW50ZXJcIj48JT0gaW5zdHJ1Y3Rpb25zICU+PC9wPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPlxuICAgICAgPHAgY2xhc3M9XCJzbWFsbFwiPlVzZSB0aGUgY29tcGFzcyB0byBjaG9vc2U8YnIgLz55b3VyIGluc3RydW1lbnQ8L3A+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY29uc3QgXzJQSSA9IDIgKiBNYXRoLlBJO1xuXG5jbGFzcyBNb3ZpbmdBdmVyYWdlIHtcbiAgY29uc3RydWN0b3Iob3JkZXIpIHtcbiAgICB0aGlzLm9yZGVyID0gb3JkZXI7XG4gICAgdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KG9yZGVyKTtcbiAgICB0aGlzLnBvaW50ZXIgPSAwO1xuICB9XG5cbiAgcHJvY2Vzcyh2YWx1ZSkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGJ1ZmZlclt0aGlzLnBvaW50ZXJdID0gdmFsdWU7XG5cbiAgICBsZXQgc3VtID0gMDtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGJ1ZmZlci5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICBzdW0gKz0gYnVmZmVyW2ldO1xuXG4gICAgY29uc3QgYXZnID0gc3VtIC8gdGhpcy5vcmRlcjtcbiAgICB0aGlzLnBvaW50ZXIgPSAodGhpcy5wb2ludGVyICsgMSkgJSB0aGlzLm9yZGVyO1xuXG4gICAgcmV0dXJuIGF2ZztcbiAgfVxufVxuXG5jbGFzcyBBbmdsZVNtb290aGluZyB7XG4gIGNvbnN0cnVjdG9yKG9yZGVyKSB7XG4gICAgdGhpcy5vcmRlciA9IG9yZGVyO1xuICAgIHRoaXMuc2luRmlsdGVyID0gbmV3IE1vdmluZ0F2ZXJhZ2Uob3JkZXIpO1xuICAgIHRoaXMuY29zRmlsdGVyID0gbmV3IE1vdmluZ0F2ZXJhZ2Uob3JkZXIpO1xuICB9XG5cbiAgcHJvY2VzcyhyYWQpIHtcbiAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xuICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XG4gICAgY29uc3Qgc21vb3RoZWRTaW4gPSB0aGlzLnNpbkZpbHRlci5wcm9jZXNzKHNpbik7XG4gICAgY29uc3Qgc21vb3RoZWRDb3MgPSB0aGlzLmNvc0ZpbHRlci5wcm9jZXNzKGNvcyk7XG5cbiAgICByZXR1cm4gTWF0aC5hdGFuMihzbW9vdGhlZFNpbiwgc21vb3RoZWRDb3MpO1xuICB9XG59XG5cbmNsYXNzIENvbXBhc3NCYWxsb29uIGV4dGVuZHMgQmFsbG9vbiB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuc2hyaW5rU2l6ZSA9IG51bGw7XG4gICAgdGhpcy5ncm93U2l6ZSA9IG51bGw7XG4gICAgdGhpcy50YXJnZXRTaXplID0gbnVsbDtcbiAgfVxuXG4gIGdyb3coKSB7XG4gICAgdGhpcy50YXJnZXRTaXplID0gdGhpcy5ncm93U2l6ZTtcbiAgfVxuXG4gIHNocmluaygpIHtcbiAgICB0aGlzLnRhcmdldFNpemUgPSB0aGlzLnNocmlua1NpemU7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBjb25zdCBzaXplID0gdGhpcy53aWR0aDtcblxuICAgIGlmIChzaXplICE9PSB0aGlzLnRhcmdldFNpemUpIHtcbiAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy50YXJnZXRTaXplIC0gc2l6ZTtcbiAgICAgIGNvbnN0IGNyb3BwZWREZWx0YSA9IE1hdGgubWF4KC0xMCwgTWF0aC5taW4oZGVsdGEsIDEwKSk7XG5cbiAgICAgIHRoaXMud2lkdGggKz0gY3JvcHBlZERlbHRhO1xuICAgICAgdGhpcy5oZWlnaHQgKz0gY3JvcHBlZERlbHRhO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBzdXBlci5yZW5kZXIoY3R4KTtcbiAgfVxufVxuXG5jbGFzcyBDb21wYXNzUmVuZGVyZXIgZXh0ZW5kcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3Ioc3ByaXRlQ29uZmlnLCBkaXJlY3Rpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3Nwcml0ZUNvbmZpZyA9IHNwcml0ZUNvbmZpZztcbiAgICB0aGlzLl9kaXJlY3Rpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGlyZWN0aW9ucyk7XG4gICAgLy8gdG8gcmFkaWFuc1xuICAgIGZvciAobGV0IGNvbG9yIGluIHRoaXMuX2RpcmVjdGlvbnMpXG4gICAgICB0aGlzLl9kaXJlY3Rpb25zW2NvbG9yXSA9IHRoaXMuX2RpcmVjdGlvbnNbY29sb3JdIC8gMzYwICogXzJQSTtcblxuICAgIHRoaXMuX2FjdGl2ZUNvbG9yID0gbnVsbDtcbiAgICB0aGlzLl9hbmdsZSA9IDA7XG5cbiAgICB0aGlzLmJhbGxvb25zID0ge307XG4gICAgdGhpcy5fc21vb3RoQW5nbGUgPSBuZXcgQW5nbGVTbW9vdGhpbmcoOCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCBncm93U2l6ZSA9IHNpemUgLyAxLjU7XG4gICAgY29uc3Qgc2hyaW5rU2l6ZSA9IHNpemUgLyAzO1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX3Nwcml0ZUNvbmZpZztcblxuICAgIGZvciAobGV0IGNvbG9yIGluIHRoaXMuX2RpcmVjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGltYWdlID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uaW1hZ2U7XG4gICAgICBjb25zdCBjbGlwUG9zaXRpb25zID0gY29uZmlnLmdyb3Vwc1tjb2xvcl0uY2xpcFBvc2l0aW9ucztcbiAgICAgIGNvbnN0IGNsaXBXaWR0aCA9IGNvbmZpZy5jbGlwU2l6ZS53aWR0aDtcbiAgICAgIGNvbnN0IGNsaXBIZWlnaHQgPSBjb25maWcuY2xpcFNpemUuaGVpZ2h0O1xuICAgICAgY29uc3QgcmVmcmVzaFJhdGUgPSBjb25maWcuYW5pbWF0aW9uUmF0ZTtcbiAgICAgIGNvbnN0IHNpemUgPSBzaHJpbmtTaXplOyAvLyBkZWZhdWx0IHRvIHNocmlua1xuXG4gICAgICBjb25zdCBiYWxsb29uID0gbmV3IENvbXBhc3NCYWxsb29uKGNvbG9yLCBpbWFnZSwgY2xpcFBvc2l0aW9ucywgY2xpcFdpZHRoLCBjbGlwSGVpZ2h0LCByZWZyZXNoUmF0ZSwgc2l6ZSwgc2l6ZSwgMCwgMCk7XG5cbiAgICAgIGJhbGxvb24ub3BhY2l0eSA9IDA7XG4gICAgICBiYWxsb29uLmdyb3dTaXplID0gZ3Jvd1NpemU7XG4gICAgICBiYWxsb29uLnNocmlua1NpemUgPSBzaHJpbmtTaXplO1xuICAgICAgYmFsbG9vbi50YXJnZXRTaXplID0gc2hyaW5rU2l6ZTtcblxuICAgICAgdGhpcy5iYWxsb29uc1tjb2xvcl0gPSBiYWxsb29uO1xuICAgIH1cbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5fYWN0aXZlQ29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIHNldEFuZ2xlKGFuZ2xlKSB7XG4gICAgdGhpcy5fYW5nbGUgPSB0aGlzLl9zbW9vdGhBbmdsZS5wcm9jZXNzKGFuZ2xlIC8gMzYwICogXzJQSSk7XG4gIH1cblxuICB1cGRhdGUoZHQpIHtcbiAgICBmb3IgKGxldCBjb2xvciBpbiB0aGlzLmJhbGxvb25zKSB7XG4gICAgICBjb25zdCBiYWxsb29uID0gdGhpcy5iYWxsb29uc1tjb2xvcl07XG5cbiAgICAgIGlmIChiYWxsb29uLm9wYWNpdHkgPCAxKVxuICAgICAgICBiYWxsb29uLm9wYWNpdHkgPSBNYXRoLm1pbihiYWxsb29uLm9wYWNpdHkgKyAwLjAyKTtcblxuICAgICAgYmFsbG9vbi51cGRhdGUoZHQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjdHgpIHtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgaHcgPSB0aGlzLmNhbnZhc1dpZHRoIC8gMjtcbiAgICBjb25zdCBoaCA9IHRoaXMuY2FudmFzSGVpZ2h0IC8gMjtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4oaHcsIGhoKTtcblxuICAgIGN0eC50cmFuc2xhdGUoaHcsIGhoKTtcblxuICAgIGZvciAobGV0IGNvbG9yIGluIHRoaXMuX2RpcmVjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGJhbGxvb24gPSB0aGlzLmJhbGxvb25zW2NvbG9yXTtcblxuICAgICAgaWYgKGNvbG9yID09PSB0aGlzLl9hY3RpdmVDb2xvcilcbiAgICAgICAgYmFsbG9vbi5ncm93KCk7XG4gICAgICBlbHNlXG4gICAgICAgIGJhbGxvb24uc2hyaW5rKCk7XG5cbiAgICAgIC8vIGAqPSAtMWAgYmVjYXVzZSBkaXJlY3Rpb24gYW5kIG9yaWVudGF0aW9uIGFyZSBkZWZpbmVkIGNvdW50ZXIgY2xvY2t3aXNlXG4gICAgICAvLyB3aGlsZSByb3RhdGUgaXMgY2xvY2sgd2lzZVxuICAgICAgY29uc3QgcmVsQW5nbGUgPSAtKHRoaXMuX2RpcmVjdGlvbnNbY29sb3JdIC0gdGhpcy5fYW5nbGUpO1xuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnJvdGF0ZShyZWxBbmdsZSk7XG4gICAgICBjdHgudHJhbnNsYXRlKDAsIC1zaXplIC8gMik7XG4gICAgICBiYWxsb29uLnJlbmRlcihjdHgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG5cbmNsYXNzIENvbXBhc3NTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGV4cGVyaWVuY2UsIGdsb2JhbFN0YXRlKSB7XG4gICAgdGhpcy5leHBlcmllbmNlID0gZXhwZXJpZW5jZTtcbiAgICB0aGlzLmdsb2JhbFN0YXRlID0gZ2xvYmFsU3RhdGU7XG5cbiAgICB0aGlzLl9vbkNvbXBhc3NVcGRhdGUgPSB0aGlzLl9vbkNvbXBhc3NVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkdyb3VwVXBkYXRlID0gdGhpcy5fb25Hcm91cFVwZGF0ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBDb21wYXNzUmVuZGVyZXIoXG4gICAgICB0aGlzLmV4cGVyaWVuY2Uuc3ByaXRlQ29uZmlnLFxuICAgICAgdGhpcy5leHBlcmllbmNlLmFyZWFDb25maWcuZGlyZWN0aW9uc1xuICAgICk7XG5cbiAgICB0aGlzLl9vbkluc3RydWN0aW9ucyA9IHRoaXMuX29uSW5zdHJ1Y3Rpb25zLmJpbmQodGhpcyk7XG4gIH1cblxuICBlbnRlcigpIHtcbiAgICB0aGlzLnZpZXcgPSBuZXcgQ2FudmFzVmlldyh0ZW1wbGF0ZSwge1xuICAgICAgYW5nbGU6ICcnLFxuICAgICAgaW5zdHJ1Y3Rpb25zOiAnJyxcbiAgICB9LCB7fSwge1xuICAgICAgY2xhc3NOYW1lOiBbJ3dhaXQtc3RhdGUnLCAnZm9yZWdyb3VuZCddLFxuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHRoaXMudmlldy5zaG93KCk7XG4gICAgdGhpcy52aWV3LmFwcGVuZFRvKHRoaXMuZXhwZXJpZW5jZS52aWV3LmdldFN0YXRlQ29udGFpbmVyKCkpO1xuXG4gICAgdGhpcy52aWV3LnNldFByZVJlbmRlcigoY3R4LCBkdCwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9KTtcblxuICAgIHRoaXMudmlldy5hZGRSZW5kZXJlcih0aGlzLnJlbmRlcmVyKTtcblxuICAgIHRoaXMuZXhwZXJpZW5jZS5hZGRDb21wYXNzTGlzdGVuZXIoJ2NvbXBhc3MnLCB0aGlzLl9vbkNvbXBhc3NVcGRhdGUpO1xuICAgIHRoaXMuZXhwZXJpZW5jZS5hZGRDb21wYXNzTGlzdGVuZXIoJ2dyb3VwJywgdGhpcy5fb25Hcm91cFVwZGF0ZSk7XG4gICAgLy8gc2V0IHJlbmRlcmVyIHdpdGggY3VycmVudCBncm91cFxuICAgIHRoaXMucmVuZGVyZXIuc2V0Q29sb3IodGhpcy5leHBlcmllbmNlLmdyb3VwRmlsdGVyLmdldFN0YXRlKCkpO1xuXG4gICAgY29uc3Qgc2hhcmVkUGFyYW1zID0gdGhpcy5leHBlcmllbmNlLnNoYXJlZFBhcmFtcztcbiAgICBzaGFyZWRQYXJhbXMuYWRkUGFyYW1MaXN0ZW5lcignY29tcGFzczppbnN0cnVjdGlvbnMnLCB0aGlzLl9vbkluc3RydWN0aW9ucyk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9yZWdyb3VuZCcpO1xuICAgIHRoaXMudmlldy4kZWwuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuXG4gICAgdGhpcy52aWV3LnJlbW92ZVJlbmRlcmVyKHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcblxuICAgIHRoaXMuZXhwZXJpZW5jZS5yZW1vdmVDb21wYXNzTGlzdGVuZXIoJ2NvbXBhc3MnLCB0aGlzLl9vbkNvbXBhc3NVcGRhdGUpO1xuICAgIHRoaXMuZXhwZXJpZW5jZS5yZW1vdmVDb21wYXNzTGlzdGVuZXIoJ2dyb3VwJywgdGhpcy5fb25Hcm91cFVwZGF0ZSk7XG5cbiAgICBjb25zdCBzaGFyZWRQYXJhbXMgPSB0aGlzLmV4cGVyaWVuY2Uuc2hhcmVkUGFyYW1zO1xuICAgIHNoYXJlZFBhcmFtcy5yZW1vdmVQYXJhbUxpc3RlbmVyKCdjb21wYXNzOmluc3RydWN0aW9ucycsIHRoaXMuX29uSW5zdHJ1Y3Rpb25zKTtcbiAgfVxuXG4gIF9vbkNvbXBhc3NVcGRhdGUoYW5nbGUpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEFuZ2xlKGFuZ2xlKTtcbiAgfVxuXG4gIF9vbkdyb3VwVXBkYXRlKGNvbG9yKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDb2xvcihjb2xvcik7XG4gIH1cblxuICBfb25JbnN0cnVjdGlvbnModmFsdWUpIHtcbiAgICB0aGlzLnZpZXcubW9kZWwuaW5zdHJ1Y3Rpb25zID0gdmFsdWU7XG4gICAgdGhpcy52aWV3LnJlbmRlcignLnNlY3Rpb24tY2VudGVyJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcGFzc1N0YXRlO1xuIl19