'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _client = require('soundworks/client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = _client.audio.audioContext;

var KillTheBalloonsSynth = function () {
  function KillTheBalloonsSynth(setsConfig, buffers, output) {
    (0, _classCallCheck3.default)(this, KillTheBalloonsSynth);

    this.setsConfig = setsConfig;
    this.buffers = buffers;
    this.samplesSetIndex = 0;
    this.output = output;
  }

  (0, _createClass3.default)(KillTheBalloonsSynth, [{
    key: 'setSamplesSetIndex',
    value: function setSamplesSetIndex(index) {
      this.samplesSetIndex = index;
    }
  }, {
    key: 'trigger',
    value: function trigger(group) {
      var config = this.setsConfig[this.samplesSetIndex][group];
      var buffer = this.buffers[config.fileIndex];
      var min = config.duration[0] / 1000;
      var max = config.duration[1] / 1000;
      var duration = buffer.duration;
      var segmentDuration = Math.min(min + Math.random() * (max - min), duration);
      var offset = Math.random() * (duration - segmentDuration);
      var attack = 0.01;
      var release = Math.min(segmentDuration - attack, 0.9 * segmentDuration);

      var now = audioContext.currentTime;

      var env = audioContext.createGain();
      env.connect(this.output);
      env.gain.value = 0;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(1, now + attack);
      env.gain.setValueAtTime(1, now + segmentDuration - release);
      env.gain.linearRampToValueAtTime(0, now + segmentDuration);

      var src = audioContext.createBufferSource();
      src.connect(env);
      src.buffer = buffer;
      src.start(now, offset);
      src.stop(now + segmentDuration);
    }
  }]);
  return KillTheBalloonsSynth;
}();

exports.default = KillTheBalloonsSynth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktpbGxUaGVCYWxsb29uc1N5bnRoLmpzIl0sIm5hbWVzIjpbImF1ZGlvQ29udGV4dCIsImF1ZGlvIiwiS2lsbFRoZUJhbGxvb25zU3ludGgiLCJzZXRzQ29uZmlnIiwiYnVmZmVycyIsIm91dHB1dCIsInNhbXBsZXNTZXRJbmRleCIsImluZGV4IiwiZ3JvdXAiLCJjb25maWciLCJidWZmZXIiLCJmaWxlSW5kZXgiLCJtaW4iLCJkdXJhdGlvbiIsIm1heCIsInNlZ21lbnREdXJhdGlvbiIsIk1hdGgiLCJyYW5kb20iLCJvZmZzZXQiLCJhdHRhY2siLCJyZWxlYXNlIiwibm93IiwiY3VycmVudFRpbWUiLCJlbnYiLCJjcmVhdGVHYWluIiwiY29ubmVjdCIsImdhaW4iLCJ2YWx1ZSIsInNldFZhbHVlQXRUaW1lIiwibGluZWFyUmFtcFRvVmFsdWVBdFRpbWUiLCJzcmMiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJzdGFydCIsInN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQSxJQUFNQSxlQUFlQyxjQUFNRCxZQUEzQjs7SUFFTUUsb0I7QUFDSixnQ0FBWUMsVUFBWixFQUF3QkMsT0FBeEIsRUFBaUNDLE1BQWpDLEVBQXlDO0FBQUE7O0FBQ3ZDLFNBQUtGLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0UsZUFBTCxHQUF1QixDQUF2QjtBQUNBLFNBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNEOzs7O3VDQUVrQkUsSyxFQUFPO0FBQ3hCLFdBQUtELGVBQUwsR0FBdUJDLEtBQXZCO0FBQ0Q7Ozs0QkFFT0MsSyxFQUFPO0FBQ2IsVUFBTUMsU0FBUyxLQUFLTixVQUFMLENBQWdCLEtBQUtHLGVBQXJCLEVBQXNDRSxLQUF0QyxDQUFmO0FBQ0EsVUFBTUUsU0FBUyxLQUFLTixPQUFMLENBQWFLLE9BQU9FLFNBQXBCLENBQWY7QUFDQSxVQUFNQyxNQUFNSCxPQUFPSSxRQUFQLENBQWdCLENBQWhCLElBQXFCLElBQWpDO0FBQ0EsVUFBTUMsTUFBTUwsT0FBT0ksUUFBUCxDQUFnQixDQUFoQixJQUFxQixJQUFqQztBQUNBLFVBQU1BLFdBQVdILE9BQU9HLFFBQXhCO0FBQ0EsVUFBTUUsa0JBQWtCQyxLQUFLSixHQUFMLENBQVNBLE1BQU1JLEtBQUtDLE1BQUwsTUFBaUJILE1BQU1GLEdBQXZCLENBQWYsRUFBNENDLFFBQTVDLENBQXhCO0FBQ0EsVUFBTUssU0FBU0YsS0FBS0MsTUFBTCxNQUFpQkosV0FBV0UsZUFBNUIsQ0FBZjtBQUNBLFVBQU1JLFNBQVMsSUFBZjtBQUNBLFVBQU1DLFVBQVVKLEtBQUtKLEdBQUwsQ0FBU0csa0JBQWtCSSxNQUEzQixFQUFtQyxNQUFNSixlQUF6QyxDQUFoQjs7QUFFQSxVQUFNTSxNQUFNckIsYUFBYXNCLFdBQXpCOztBQUVBLFVBQU1DLE1BQU12QixhQUFhd0IsVUFBYixFQUFaO0FBQ0FELFVBQUlFLE9BQUosQ0FBWSxLQUFLcEIsTUFBakI7QUFDQWtCLFVBQUlHLElBQUosQ0FBU0MsS0FBVCxHQUFpQixDQUFqQjtBQUNBSixVQUFJRyxJQUFKLENBQVNFLGNBQVQsQ0FBd0IsQ0FBeEIsRUFBMkJQLEdBQTNCO0FBQ0FFLFVBQUlHLElBQUosQ0FBU0csdUJBQVQsQ0FBaUMsQ0FBakMsRUFBb0NSLE1BQU1GLE1BQTFDO0FBQ0FJLFVBQUlHLElBQUosQ0FBU0UsY0FBVCxDQUF3QixDQUF4QixFQUEyQlAsTUFBTU4sZUFBTixHQUF3QkssT0FBbkQ7QUFDQUcsVUFBSUcsSUFBSixDQUFTRyx1QkFBVCxDQUFpQyxDQUFqQyxFQUFvQ1IsTUFBTU4sZUFBMUM7O0FBRUEsVUFBTWUsTUFBTTlCLGFBQWErQixrQkFBYixFQUFaO0FBQ0FELFVBQUlMLE9BQUosQ0FBWUYsR0FBWjtBQUNBTyxVQUFJcEIsTUFBSixHQUFhQSxNQUFiO0FBQ0FvQixVQUFJRSxLQUFKLENBQVVYLEdBQVYsRUFBZUgsTUFBZjtBQUNBWSxVQUFJRyxJQUFKLENBQVNaLE1BQU1OLGVBQWY7QUFDRDs7Ozs7a0JBR1liLG9CIiwiZmlsZSI6IktpbGxUaGVCYWxsb29uc1N5bnRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW8gfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBhdWRpby5hdWRpb0NvbnRleHQ7XG5cbmNsYXNzIEtpbGxUaGVCYWxsb29uc1N5bnRoIHtcbiAgY29uc3RydWN0b3Ioc2V0c0NvbmZpZywgYnVmZmVycywgb3V0cHV0KSB7XG4gICAgdGhpcy5zZXRzQ29uZmlnID0gc2V0c0NvbmZpZztcbiAgICB0aGlzLmJ1ZmZlcnMgPSBidWZmZXJzO1xuICAgIHRoaXMuc2FtcGxlc1NldEluZGV4ID0gMDtcbiAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcbiAgfVxuXG4gIHNldFNhbXBsZXNTZXRJbmRleChpbmRleCkge1xuICAgIHRoaXMuc2FtcGxlc1NldEluZGV4ID0gaW5kZXg7XG4gIH1cblxuICB0cmlnZ2VyKGdyb3VwKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zZXRzQ29uZmlnW3RoaXMuc2FtcGxlc1NldEluZGV4XVtncm91cF07XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXJzW2NvbmZpZy5maWxlSW5kZXhdO1xuICAgIGNvbnN0IG1pbiA9IGNvbmZpZy5kdXJhdGlvblswXSAvIDEwMDA7XG4gICAgY29uc3QgbWF4ID0gY29uZmlnLmR1cmF0aW9uWzFdIC8gMTAwMDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGJ1ZmZlci5kdXJhdGlvbjtcbiAgICBjb25zdCBzZWdtZW50RHVyYXRpb24gPSBNYXRoLm1pbihtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiksIGR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgPSBNYXRoLnJhbmRvbSgpICogKGR1cmF0aW9uIC0gc2VnbWVudER1cmF0aW9uKTtcbiAgICBjb25zdCBhdHRhY2sgPSAwLjAxO1xuICAgIGNvbnN0IHJlbGVhc2UgPSBNYXRoLm1pbihzZWdtZW50RHVyYXRpb24gLSBhdHRhY2ssIDAuOSAqIHNlZ21lbnREdXJhdGlvbik7XG5cbiAgICBjb25zdCBub3cgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cbiAgICBjb25zdCBlbnYgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGVudi5jb25uZWN0KHRoaXMub3V0cHV0KTtcbiAgICBlbnYuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgZW52LmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgbm93KTtcbiAgICBlbnYuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCBub3cgKyBhdHRhY2spO1xuICAgIGVudi5nYWluLnNldFZhbHVlQXRUaW1lKDEsIG5vdyArIHNlZ21lbnREdXJhdGlvbiAtIHJlbGVhc2UpO1xuICAgIGVudi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIG5vdyArIHNlZ21lbnREdXJhdGlvbik7XG5cbiAgICBjb25zdCBzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc3JjLmNvbm5lY3QoZW52KTtcbiAgICBzcmMuYnVmZmVyID0gYnVmZmVyO1xuICAgIHNyYy5zdGFydChub3csIG9mZnNldCk7XG4gICAgc3JjLnN0b3Aobm93ICsgc2VnbWVudER1cmF0aW9uKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBLaWxsVGhlQmFsbG9vbnNTeW50aDtcbiJdfQ==