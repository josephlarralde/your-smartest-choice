'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Balloon = function () {
  function Balloon(color, spriteImage, clipPositions, clipWidth, clipHeight, refreshRate, width, height, x, y) {
    var zIndex = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 0;
    (0, _classCallCheck3.default)(this, Balloon);

    this.color = color;
    this.spriteImage = spriteImage;
    this.clipPositions = clipPositions;
    this.nbrClips = clipPositions.length;
    this.refreshRate = refreshRate;
    this.clipWidth = clipWidth;
    this.clipHeight = clipHeight;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.zIndex = zIndex;
    this.radius = width / 2 - 4;

    this.counter = 0;
    this.clipIndex = 0;

    this.explode = false;
    this.isDead = false;
    this.opacity = 1;

    this.rotation = Math.random() * 2 * Math.PI;
    this.rotationDirection = Math.random() < 0.5 ? -1 : 1;
    this.rotationVelocity = Math.random() * Math.PI / 10; // 2 / S

    this.debugHitZone = false;

    // move this in a mixin
    // this.vy = - (Math.random() * 0.4 + 0.6) * 200;
  }

  (0, _createClass3.default)(Balloon, [{
    key: 'update',
    value: function update(dt) {
      // move all this in a mixin
      // this.vy *= 1.002;
      // this.x += Math.random() * 0.2 - 0.1;
      // this.y += (this.vy * dt);
      // end move

      // probably keep rotation generic
      this.rotation += this.rotationDirection * this.rotationVelocity * dt;

      if (this.explode === true) {
        this.counter += 1;

        if (this.counter >= this.refreshRate) {
          this.counter = 0;
          this.clipIndex = (this.clipIndex + 1) % this.nbrClips;

          // reset once exploded
          if (this.clipIndex === 0) this.isDead = true;
        }
      };
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      if (this.isDead) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      var position = this.clipPositions[this.clipIndex];
      var sx = position[0];
      var sy = position[1];
      var sw = this.clipWidth;
      var sh = this.clipHeight;
      var tx = -this.width / 2;
      var ty = -this.height / 2;
      var tw = this.width;
      var th = this.height;

      ctx.drawImage(this.spriteImage, sx, sy, sw, sh, tx, ty, tw, th);

      // test hit zone
      if (this.debugHitZone) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(23, 23, 23, 0.2)';
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
      }

      ctx.restore();
    }
  }]);
  return Balloon;
}();

exports.default = Balloon;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhbGxvb24uanMiXSwibmFtZXMiOlsiQmFsbG9vbiIsImNvbG9yIiwic3ByaXRlSW1hZ2UiLCJjbGlwUG9zaXRpb25zIiwiY2xpcFdpZHRoIiwiY2xpcEhlaWdodCIsInJlZnJlc2hSYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJ4IiwieSIsInpJbmRleCIsIm5ickNsaXBzIiwibGVuZ3RoIiwicmFkaXVzIiwiY291bnRlciIsImNsaXBJbmRleCIsImV4cGxvZGUiLCJpc0RlYWQiLCJvcGFjaXR5Iiwicm90YXRpb24iLCJNYXRoIiwicmFuZG9tIiwiUEkiLCJyb3RhdGlvbkRpcmVjdGlvbiIsInJvdGF0aW9uVmVsb2NpdHkiLCJkZWJ1Z0hpdFpvbmUiLCJkdCIsImN0eCIsInNhdmUiLCJ0cmFuc2xhdGUiLCJyb3RhdGUiLCJnbG9iYWxBbHBoYSIsInBvc2l0aW9uIiwic3giLCJzeSIsInN3Iiwic2giLCJ0eCIsInR5IiwidHciLCJ0aCIsImRyYXdJbWFnZSIsImJlZ2luUGF0aCIsImZpbGxTdHlsZSIsImFyYyIsImZpbGwiLCJjbG9zZVBhdGgiLCJyZXN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQ01BLE87QUFDSixtQkFBWUMsS0FBWixFQUFtQkMsV0FBbkIsRUFBZ0NDLGFBQWhDLEVBQStDQyxTQUEvQyxFQUEwREMsVUFBMUQsRUFBc0VDLFdBQXRFLEVBQW1GQyxLQUFuRixFQUEwRkMsTUFBMUYsRUFBa0dDLENBQWxHLEVBQXFHQyxDQUFyRyxFQUFvSDtBQUFBLFFBQVpDLE1BQVksMEVBQUgsQ0FBRztBQUFBOztBQUNsSCxTQUFLVixLQUFMLEdBQWFBLEtBQWI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUJBLGFBQXJCO0FBQ0EsU0FBS1MsUUFBTCxHQUFnQlQsY0FBY1UsTUFBOUI7QUFDQSxTQUFLUCxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLFNBQUtGLFNBQUwsR0FBaUJBLFNBQWpCO0FB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QixFQUEyQixDQUEzQixFQUE4QixJQUFJTyxLQUFLRSxFQUF2QyxFQUEyQyxLQUEzQztBQUNBSyxZQUFJa0IsSUFBSjtBQUNBbEIsWUFBSW1CLFNBQUo7QUFDRDs7QUFFRG5CLFVBQUlvQixPQUFKO0FBQ0Q7Ozs7O2tCQUdZaEQsTyIsImZpbGUiOiJCYWxsb29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBCYWxsb29uIHtcbiAgY29uc3RydWN0b3IoY29sb3IsIHNwcml0ZUltYWdlLCBjbGlwUG9zaXRpb25zLCBjbGlwV2lkdGgsIGNsaXBIZWlnaHQsIHJlZnJlc2hSYXRlLCB3aWR0aCwgaGVpZ2h0LCB4LCB5LCB6SW5kZXggPSAwKSB7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMuc3ByaXRlSW1hZ2UgPSBzcHJpdGVJbWFnZTtcbiAgICB0aGlzLmNsaXBQb3NpdGlvbnMgPSBjbGlwUG9zaXRpb25zO1xuICAgIHRoaXMubmJyQ2xpcHMgPSBjbGlwUG9zaXRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnJlZnJlc2hSYXRlID0gcmVmcmVzaFJhdGU7XG4gICAgdGhpcy5jbGlwV2lkdGggPSBjbGlwV2lkdGg7XG4gICAgdGhpcy5jbGlwSGVpZ2h0ID0gY2xpcEhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMucmFkaXVzID0gd2lkdGggLyAyIC0gNDtcblxuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5jbGlwSW5kZXggPSAwO1xuXG4gICAgdGhpcy5leHBsb2RlID0gZmFsc2U7XG4gICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxO1xuXG4gICAgdGhpcy5yb3RhdGlvbiA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcbiAgICB0aGlzLnJvdGF0aW9uRGlyZWN0aW9uID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IC0xIDogMTtcbiAgICB0aGlzLnJvdGF0aW9uVmVsb2NpdHkgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAvIDEwOyAvLyAyIC8gU1xuXG4gICAgdGhpcy5kZWJ1Z0hpdFpvbmUgPSBmYWxzZTtcblxuICAgIC8vIG1vdmUgdGhpcyBpbiBhIG1peGluXG4gICAgLy8gdGhpcy52eSA9IC0gKE1hdGgucmFuZG9tKCkgKiAwLjQgKyAwLjYpICogMjAwO1xuICB9XG5cbiAgdXBkYXRlKGR0KSB7XG4gICAgLy8gbW92ZSBhbGwgdGhpcyBpbiBhIG1peGluXG4gICAgLy8gdGhpcy52eSAqPSAxLjAwMjtcbiAgICAvLyB0aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDAuMiAtIDAuMTtcbiAgICAvLyB0aGlzLnkgKz0gKHRoaXMudnkgKiBkdCk7XG4gICAgLy8gZW5kIG1vdmVcblxuICAgIC8vIHByb2JhYmx5IGtlZXAgcm90YXRpb24gZ2VuZXJpY1xuICAgIHRoaXMucm90YXRpb24gKz0gKHRoaXMucm90YXRpb25EaXJlY3Rpb24gKiB0aGlzLnJvdGF0aW9uVmVsb2NpdHkgKiBkdCk7XG5cbiAgICBpZiAodGhpcy5leHBsb2RlID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmNvdW50ZXIgKz0gMTtcblxuICAgICAgaWYgKHRoaXMuY291bnRlciA+PSB0aGlzLnJlZnJlc2hSYXRlKSB7XG4gICAgICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgICAgIHRoaXMuY2xpcEluZGV4ID0gKHRoaXMuY2xpcEluZGV4ICsgMSkgJSB0aGlzLm5ickNsaXBzO1xuXG4gICAgICAgIC8vIHJlc2V0IG9uY2UgZXhwbG9kZWRcbiAgICAgICAgaWYgKHRoaXMuY2xpcEluZGV4ID09PSAwKVxuICAgICAgICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKGN0eCkge1xuICAgIGlmICh0aGlzLmlzRGVhZClcbiAgICAgIHJldHVybjtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSB0aGlzLm9wYWNpdHk7XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY2xpcFBvc2l0aW9uc1t0aGlzLmNsaXBJbmRleF07XG4gICAgY29uc3Qgc3ggPSBwb3NpdGlvblswXTtcbiAgICBjb25zdCBzeSA9IHBvc2l0aW9uWzFdO1xuICAgIGNvbnN0IHN3ID0gdGhpcy5jbGlwV2lkdGg7XG4gICAgY29uc3Qgc2ggPSB0aGlzLmNsaXBIZWlnaHQ7XG4gICAgY29uc3QgdHggPSAtdGhpcy53aWR0aCAvIDI7XG4gICAgY29uc3QgdHkgPSAtdGhpcy5oZWlnaHQgLyAyO1xuICAgIGNvbnN0IHR3ID0gdGhpcy53aWR0aDtcbiAgICBjb25zdCB0aCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLnNwcml0ZUltYWdlLCBzeCwgc3ksIHN3LCBzaCwgdHgsIHR5LCB0dywgdGgpO1xuXG4gICAgLy8gdGVzdCBoaXQgem9uZVxuICAgIGlmICh0aGlzLmRlYnVnSGl0Wm9uZSkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDIzLCAyMywgMjMsIDAuMiknO1xuICAgICAgY3R4LmFyYygwLCAwLCB0aGlzLnJhZGl1cywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYWxsb29uO1xuIl19