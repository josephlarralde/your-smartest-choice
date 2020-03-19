'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioContext = _client.audio.audioContext;
var scheduler = _client.audio.getScheduler();
scheduler.lookahead = 0.5;

var SineEngine = function (_audio$GranularEngine) {
  (0, _inherits3.default)(SineEngine, _audio$GranularEngine);

  function SineEngine(parent) {
    (0, _classCallCheck3.default)(this, SineEngine);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SineEngine.__proto__ || (0, _getPrototypeOf2.default)(SineEngine)).call(this));

    _this.parent = parent;
    return _this;
  }

  (0, _createClass3.default)(SineEngine, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      // update pitch
      this.resampling = this.parent.getSineResampling();
      // this.resamplingVar = this.parent.getSineResamplingVar();
      // update position
      var duration = this.durationAbs;
      var halfDuration = duration / 2;
      this.position = halfDuration + Math.random() * (this.buffer.duration - duration);

      time = Math.max(time, audioContext.currentTime);
      return (0, _get3.default)(SineEngine.prototype.__proto__ || (0, _getPrototypeOf2.default)(SineEngine.prototype), 'advanceTime', this).call(this, time);
    }
  }]);
  return SineEngine;
}(_client.audio.GranularEngine);

var AvoidTheRainSynth = function () {
  function AvoidTheRainSynth(sinesBuffers, glitchBuffers, harmonyConfig, output) {
    (0, _classCallCheck3.default)(this, AvoidTheRainSynth);

    this.sinesBuffers = sinesBuffers;
    this.glitchBuffers = (0, _values2.default)(glitchBuffers);
    this.harmonyConfig = harmonyConfig;
    this.currentHarmony = null;
    this.nextHarmony = null;
    this.output = output;

    this.currentBuffer = null;
    this.currentDetune = null;
    this.resamplingInterval = 100; // 1 tone up, 1 tone down
    this.controlPosition = [0, 0];

    var now = audioContext.currentTime;

    this.sineMaster = audioContext.createGain();
    this.sineMaster.connect(this.output);
    this.sineMaster.gain.value = 1;

    this.env = audioContext.createGain();
    this.env.connect(this.sineMaster);
    this.env.gain.value = 0;
    this.env.gain.setValueAtTime(0, now);

    this.volume = audioContext.createGain();
    this.volume.connect(this.env);
    this.volume.gain.value = 1;

    this.granularEngine = new SineEngine(this);
    this.granularEngine.connect(this.volume);
  }

  (0, _createClass3.default)(AvoidTheRainSynth, [{
    key: 'setNextHarmony',
    value: function setNextHarmony(value) {
      this.nextHarmony = value;
    }
  }, {
    key: 'setSineMaster',
    value: function setSineMaster(value) {
      this.sineMaster.gain.value = value;
    }
  }, {
    key: 'getSineResampling',
    value: function getSineResampling() {
      var resamplingInterval = this.resamplingInterval;
      var normYPosition = this.controlPosition[1];
      var detune = (1 - normYPosition) * resamplingInterval - resamplingInterval / 2;

      return this.baseSineResampling + detune; // + detune from balloon position
    }

    // triggered each time `this.controlPosition` is updated

  }, {
    key: 'onControlUpdate',
    value: function onControlUpdate() {
      var normXPosition = this.controlPosition[0];
      var delta = Math.abs(normXPosition - 0.5);
      var inverseNormDelta = 1 - delta * 2;
      var scaledDelta = inverseNormDelta * 0.8 + 0.2;
      var gain = scaledDelta * scaledDelta;

      this.volume.gain.value = gain;
    }
  }, {
    key: 'triggerGlitch',
    value: function triggerGlitch() {
      var index = Math.floor(Math.random() * this.glitchBuffers.length);
      var buffer = this.glitchBuffers[index];
      var now = audioContext.currentTime;
      var duration = buffer.duration;
      // const detune = (Math.random() * 2 - 1) * 1200;
      var resampling = Math.random() * 1.5 + 0.5;

      var src = audioContext.createBufferSource();
      src.connect(this.output);
      src.buffer = buffer;
      src.playbackRate.value = resampling;
      src.start(now);
      src.stop(now + duration);
    }
  }, {
    key: 'startSine',
    value: function startSine(fadeInDuration) {
      if (this.nextHarmony) this.currentHarmony = this.nextHarmony;

      this.nextHarmony = null;

      if (scheduler.has(this.granularEngine)) scheduler.remove(this.granularEngine);

      var parts = this.currentHarmony.split(':');
      var marker = parts[0];
      var bar = parts[1];

      var config = this.harmonyConfig['sines-score'][marker];
      // 0 is low voice, 1 is high voice - 0.7 probability for low voice
      var voiceIndex = Math.random() < 0.4 ? 0 : 1;
      var voice = config[voiceIndex];
      var buffer = this.sinesBuffers[voice.fileIndex];
      var detunes = voice.detunes[bar];

      this.baseSineResampling = detunes[Math.floor(Math.random() * detunes.length)];
      this.granularEngine.buffer = buffer;
      this.granularEngine.periodRel = 0.5;
      this.granularEngine.durationAbs = 0.8;
      this.granularEngine.positionVar = 0.03;
      this.granularEngine.attackAbs = 0;
      this.granularEngine.attackRel = 0.25;
      this.granularEngine.releaseAbs = 0;
      this.granularEngine.releaseRel = 0.25;
      this.granularEngine.centered = true;
      this.granularEngine.cyclic = false;
      scheduler.add(this.granularEngine);

      var now = audioContext.currentTime;
      this.env.gain.setValueAtTime(0, now);
      this.env.gain.linearRampToValueAtTime(1, now + fadeInDuration);
    }
  }, {
    key: 'stopSine',
    value: function stopSine() {
      // shouldn't be necessary (but just in case...)
      if (scheduler.has(this.granularEngine)) {
        scheduler.remove(this.granularEngine);

        var now = audioContext.currentTime;
        this.env.gain.setValueAtTime(1, now);
        this.env.gain.linearRampToValueAtTime(0, now + 0.01);
      }
    }
  }]);
  return AvoidTheRainSynth;
}();

exports.default = AvoidTheRainSynth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF2b2lkVGhlUmFpblN5bnRoLmpzIl0sIm5hbWVzIjpbImF1ZGlvQ29udGV4dCIsImF1ZGlvIiwic2NoZWR1bGVyIiwiZ2V0U2NoZWR1bGVyIiwibG9va2FoZWFkIiwiU2luZUVuZ2luZSIsInBhcmVudCIsInRpbWUiLCJyZXNhbXBsaW5nIiwiZ2V0U2luZVJlc2FtcGxpbmciLCJkdXJhdGlvbiIsImR1cmF0aW9uQWJzIiwiaGFsZkR1cmF0aW9uIiwicG9zaXRpb24iLCJNYXRoIiwicmFuZG9tIiwiYnVmZmVyIiwibWF4IiwiY3VycmVudFRpbWUiLCJHcmFudWxhckVuZ2luZSIsIkF2b2lkVGhlUmFpblN5bnRoIiwic2luZXNCdWZmZXJzIiwiZ2xpdGNoQnVmZmVycyIsImhhcm1vbnlDb25maWciLCJvdXRwdXQiLCJjdXJyZW50SGFybW9ueSIsIm5leHRIYXJtb255IiwiY3VycmVudEJ1ZmZlciIsImN1cnJlbnREZXR1bmUiLCJyZXNhbXBsaW5nSW50ZXJ2YWwiLCJjb250cm9sUG9zaXRpb24iLCJub3ciLCJzaW5lTWFzdGVyIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJnYWluIiwidmFsdWUiLCJlbnYiLCJzZXRWYWx1ZUF0VGltZSIsInZvbHVtZSIsImdyYW51bGFyRW5naW5lIiwibm9ybVlQb3NpdGlvbiIsImRldHVuZSIsImJhc2VTaW5lUmVzYW1wbGluZyIsIm5vcm1YUG9zaXRpb24iLCJkZWx0YSIsImFicyIsImludmVyc2VOb3JtRGVsdGEiLCJzY2FsZWREZWx0YSIsImluZGV4IiwiZmxvb3IiLCJsZW5ndGgiLCJzcmMiLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJwbGF5YmFja1JhdGUiLCJzdGFydCIsInN0b3AiLCJmYWRlSW5EdXJhdGlvbiIsImhhcyIsInJlbW92ZSIsInBhcnRzIiwic3BsaXQiLCJtYXJrZXIiLCJiYXIiLCJjb25maWciLCJ2b2ljZUluZGV4Iiwidm9pY2UiLCJmaWxlSW5kZXgiLCJkZXR1bmVzIiwicGVyaW9kUmVsIiwicG9zaXRpb25WYXIiLCJhdHRhY2tBYnMiLCJhdHRhY2tSZWwiLCJyZWxlYXNlQWJzIiwicmVsZWFzZVJlbCIsImNlbnRlcmVkIiwiY3ljbGljIiwiYWRkIiwibGluZWFyUmFtcFRvVmFsdWVBdFRpbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBLElBQU1BLGVBQWVDLGNBQU1ELFlBQTNCO0FBQ0EsSUFBTUUsWUFBWUQsY0FBTUUsWUFBTixFQUFsQjtBQUNBRCxVQUFVRSxTQUFWLEdBQXNCLEdBQXRCOztJQUVNQyxVOzs7QUFDSixzQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUdsQixVQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFIa0I7QUFJbkI7Ozs7Z0NBRVdDLEksRUFBTTtBQUNoQjtBQUNBLFdBQUtDLFVBQUwsR0FBa0IsS0FBS0YsTUFBTCxDQUFZRyxpQkFBWixFQUFsQjtBQUNBO0FBQ0E7QUFDQSxVQUFNQyxXQUFXLEtBQUtDLFdBQXRCO0FBQ0EsVUFBTUMsZUFBZUYsV0FBVyxDQUFoQztBQUNBLFdBQUtHLFFBQUwsR0FBZ0JELGVBQWdCRSxLQUFLQyxNQUFMLE1BQWlCLEtBQUtDLE1BQUwsQ0FBWU4sUUFBWixHQUF1QkEsUUFBeEMsQ0FBaEM7O0FBRUFILGFBQU9PLEtBQUtHLEdBQUwsQ0FBU1YsSUFBVCxFQUFlUCxhQUFha0IsV0FBNUIsQ0FBUDtBQUNBLHVKQUF5QlgsSUFBekI7QUFDRDs7O0VBbEJzQk4sY0FBTWtCLGM7O0lBcUJ6QkMsaUI7QUFDSiw2QkFBWUMsWUFBWixFQUEwQkMsYUFBMUIsRUFBeUNDLGFBQXpDLEVBQXdEQyxNQUF4RCxFQUFnRTtBQUFBOztBQUM5RCxTQUFLSCxZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsc0JBQWNBLGFBQWQsQ0FBckI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCQSxhQUFyQjtBQUNBLFNBQUtFLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxTQUFLQyxXQUFMLEdB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O0FBQ0EsV0FBSzZCLGNBQUwsQ0FBb0I4QixXQUFwQixHQUFrQyxJQUFsQztBQUNBLFdBQUs5QixjQUFMLENBQW9CK0IsU0FBcEIsR0FBZ0MsQ0FBaEM7QUFDQSxXQUFLL0IsY0FBTCxDQUFvQmdDLFNBQXBCLEdBQWdDLElBQWhDO0FBQ0EsV0FBS2hDLGNBQUwsQ0FBb0JpQyxVQUFwQixHQUFpQyxDQUFqQztBQUNBLFdBQUtqQyxjQUFMLENBQW9Ca0MsVUFBcEIsR0FBaUMsSUFBakM7QUFDQSxXQUFLbEMsY0FBTCxDQUFvQm1DLFFBQXBCLEdBQStCLElBQS9CO0FBQ0EsV0FBS25DLGNBQUwsQ0FBb0JvQyxNQUFwQixHQUE2QixLQUE3QjtBQUNBMUUsZ0JBQVUyRSxHQUFWLENBQWMsS0FBS3JDLGNBQW5COztBQUVBLFVBQU1ULE1BQU0vQixhQUFha0IsV0FBekI7QUFDQSxXQUFLbUIsR0FBTCxDQUFTRixJQUFULENBQWNHLGNBQWQsQ0FBNkIsQ0FBN0IsRUFBZ0NQLEdBQWhDO0FBQ0EsV0FBS00sR0FBTCxDQUFTRixJQUFULENBQWMyQyx1QkFBZCxDQUFzQyxDQUF0QyxFQUF5Qy9DLE1BQU0wQixjQUEvQztBQUNEOzs7K0JBRVU7QUFDVDtBQUNBLFVBQUl2RCxVQUFVd0QsR0FBVixDQUFjLEtBQUtsQixjQUFuQixDQUFKLEVBQXdDO0FBQ3RDdEMsa0JBQVV5RCxNQUFWLENBQWlCLEtBQUtuQixjQUF0Qjs7QUFFQSxZQUFNVCxNQUFNL0IsYUFBYWtCLFdBQXpCO0FBQ0EsYUFBS21CLEdBQUwsQ0FBU0YsSUFBVCxDQUFjRyxjQUFkLENBQTZCLENBQTdCLEVBQWdDUCxHQUFoQztBQUNBLGFBQUtNLEdBQUwsQ0FBU0YsSUFBVCxDQUFjMkMsdUJBQWQsQ0FBc0MsQ0FBdEMsRUFBeUMvQyxNQUFNLElBQS9DO0FBQ0Q7QUFDRjs7Ozs7a0JBR1lYLGlCIiwiZmlsZSI6IkF2b2lkVGhlUmFpblN5bnRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW8gfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBhdWRpby5hdWRpb0NvbnRleHQ7XG5jb25zdCBzY2hlZHVsZXIgPSBhdWRpby5nZXRTY2hlZHVsZXIoKTtcbnNjaGVkdWxlci5sb29rYWhlYWQgPSAwLjU7XG5cbmNsYXNzIFNpbmVFbmdpbmUgZXh0ZW5kcyBhdWRpby5HcmFudWxhckVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKHRpbWUpIHtcbiAgICAvLyB1cGRhdGUgcGl0Y2hcbiAgICB0aGlzLnJlc2FtcGxpbmcgPSB0aGlzLnBhcmVudC5nZXRTaW5lUmVzYW1wbGluZygpO1xuICAgIC8vIHRoaXMucmVzYW1wbGluZ1ZhciA9IHRoaXMucGFyZW50LmdldFNpbmVSZXNhbXBsaW5nVmFyKCk7XG4gICAgLy8gdXBkYXRlIHBvc2l0aW9uXG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uQWJzO1xuICAgIGNvbnN0IGhhbGZEdXJhdGlvbiA9IGR1cmF0aW9uIC8gMjtcbiAgICB0aGlzLnBvc2l0aW9uID0gaGFsZkR1cmF0aW9uICsgKE1hdGgucmFuZG9tKCkgKiAodGhpcy5idWZmZXIuZHVyYXRpb24gLSBkdXJhdGlvbikpO1xuXG4gICAgdGltZSA9IE1hdGgubWF4KHRpbWUsIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcmV0dXJuIHN1cGVyLmFkdmFuY2VUaW1lKHRpbWUpO1xuICB9XG59XG5cbmNsYXNzIEF2b2lkVGhlUmFpblN5bnRoIHtcbiAgY29uc3RydWN0b3Ioc2luZXNCdWZmZXJzLCBnbGl0Y2hCdWZmZXJzLCBoYXJtb255Q29uZmlnLCBvdXRwdXQpIHtcbiAgICB0aGlzLnNpbmVzQnVmZmVycyA9IHNpbmVzQnVmZmVycztcbiAgICB0aGlzLmdsaXRjaEJ1ZmZlcnMgPSBPYmplY3QudmFsdWVzKGdsaXRjaEJ1ZmZlcnMpO1xuICAgIHRoaXMuaGFybW9ueUNvbmZpZyA9IGhhcm1vbnlDb25maWc7XG4gICAgdGhpcy5jdXJyZW50SGFybW9ueSA9IG51bGw7XG4gICAgdGhpcy5uZXh0SGFybW9ueSA9IG51bGw7XG4gICAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7XG5cbiAgICB0aGlzLmN1cnJlbnRCdWZmZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudERldHVuZSA9IG51bGw7XG4gICAgdGhpcy5yZXNhbXBsaW5nSW50ZXJ2YWwgPSAxMDA7IC8vIDEgdG9uZSB1cCwgMSB0b25lIGRvd25cbiAgICB0aGlzLmNvbnRyb2xQb3NpdGlvbiA9IFswLCAwXTtcblxuICAgIGNvbnN0IG5vdyA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuICAgIHRoaXMuc2luZU1hc3RlciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5zaW5lTWFzdGVyLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgIHRoaXMuc2luZU1hc3Rlci5nYWluLnZhbHVlID0gMTtcblxuICAgIHRoaXMuZW52ID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLmVudi5jb25uZWN0KHRoaXMuc2luZU1hc3Rlcik7XG4gICAgdGhpcy5lbnYuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgdGhpcy5lbnYuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBub3cpO1xuXG4gICAgdGhpcy52b2x1bWUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMudm9sdW1lLmNvbm5lY3QodGhpcy5lbnYpO1xuICAgIHRoaXMudm9sdW1lLmdhaW4udmFsdWUgPSAxO1xuXG4gICAgdGhpcy5ncmFudWxhckVuZ2luZSA9IG5ldyBTaW5lRW5naW5lKHRoaXMpO1xuICAgIHRoaXMuZ3JhbnVsYXJFbmdpbmUuY29ubmVjdCh0aGlzLnZvbHVtZSk7XG4gIH1cblxuICBzZXROZXh0SGFybW9ueSh2YWx1ZSkge1xuICAgIHRoaXMubmV4dEhhcm1vbnkgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldFNpbmVNYXN0ZXIodmFsdWUpIHtcbiAgICB0aGlzLnNpbmVNYXN0ZXIuZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0U2luZVJlc2FtcGxpbmcoKSB7XG4gICAgY29uc3QgcmVzYW1wbGluZ0ludGVydmFsID0gdGhpcy5yZXNhbXBsaW5nSW50ZXJ2YWw7XG4gICAgY29uc3Qgbm9ybVlQb3NpdGlvbiA9IHRoaXMuY29udHJvbFBvc2l0aW9uWzFdO1xuICAgIGNvbnN0IGRldHVuZSA9ICgxIC0gbm9ybVlQb3NpdGlvbikgKiByZXNhbXBsaW5nSW50ZXJ2YWwgLSAocmVzYW1wbGluZ0ludGVydmFsIC8gMik7XG5cbiAgICByZXR1cm4gdGhpcy5iYXNlU2luZVJlc2FtcGxpbmcgKyBkZXR1bmU7IC8vICsgZGV0dW5lIGZyb20gYmFsbG9vbiBwb3NpdGlvblxuICB9XG5cbiAgLy8gdHJpZ2dlcmVkIGVhY2ggdGltZSBgdGhpcy5jb250cm9sUG9zaXRpb25gIGlzIHVwZGF0ZWRcbiAgb25Db250cm9sVXBkYXRlKCkge1xuICAgIGNvbnN0IG5vcm1YUG9zaXRpb24gPSB0aGlzLmNvbnRyb2xQb3NpdGlvblswXTtcbiAgICBjb25zdCBkZWx0YSA9IE1hdGguYWJzKG5vcm1YUG9zaXRpb24gLSAwLjUpO1xuICAgIGNvbnN0IGludmVyc2VOb3JtRGVsdGEgPSAxIC0gKGRlbHRhICogMik7XG4gICAgY29uc3Qgc2NhbGVkRGVsdGEgPSBpbnZlcnNlTm9ybURlbHRhICogMC44ICsgMC4yO1xuICAgIGNvbnN0IGdhaW4gPSBzY2FsZWREZWx0YSAqIHNjYWxlZERlbHRhO1xuXG4gICAgdGhpcy52b2x1bWUuZ2Fpbi52YWx1ZSA9IGdhaW47XG4gIH1cblxuXG4gIHRyaWdnZXJHbGl0Y2goKSB7XG4gICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmdsaXRjaEJ1ZmZlcnMubGVuZ3RoKTtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmdsaXRjaEJ1ZmZlcnNbaW5kZXhdO1xuICAgIGNvbnN0IG5vdyA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGJ1ZmZlci5kdXJhdGlvbjtcbiAgICAvLyBjb25zdCBkZXR1bmUgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDEyMDA7XG4gICAgY29uc3QgcmVzYW1wbGluZyA9IE1hdGgucmFuZG9tKCkgKiAxLjUgKyAwLjU7XG5cbiAgICBjb25zdCBzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc3JjLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgIHNyYy5idWZmZXIgPSBidWZmZXI7XG4gICAgc3JjLnBsYXliYWNrUmF0ZS52YWx1ZSA9IHJlc2FtcGxpbmc7XG4gICAgc3JjLnN0YXJ0KG5vdyk7XG4gICAgc3JjLnN0b3Aobm93ICsgZHVyYXRpb24pO1xuICB9XG5cbiAgc3RhcnRTaW5lKGZhZGVJbkR1cmF0aW9uKSB7XG4gICAgaWYgKHRoaXMubmV4dEhhcm1vbnkpXG4gICAgICB0aGlzLmN1cnJlbnRIYXJtb255ID0gdGhpcy5uZXh0SGFybW9ueTtcblxuICAgIHRoaXMubmV4dEhhcm1vbnkgPSBudWxsO1xuXG4gICAgaWYgKHNjaGVkdWxlci5oYXModGhpcy5ncmFudWxhckVuZ2luZSkpXG4gICAgICBzY2hlZHVsZXIucmVtb3ZlKHRoaXMuZ3JhbnVsYXJFbmdpbmUpO1xuXG4gICAgY29uc3QgcGFydHMgPSB0aGlzLmN1cnJlbnRIYXJtb255LnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgbWFya2VyID0gcGFydHNbMF07XG4gICAgY29uc3QgYmFyID0gcGFydHNbMV07XG5cbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmhhcm1vbnlDb25maWdbJ3NpbmVzLXNjb3JlJ11bbWFya2VyXTtcbiAgICAvLyAwIGlzIGxvdyB2b2ljZSwgMSBpcyBoaWdoIHZvaWNlIC0gMC43IHByb2JhYmlsaXR5IGZvciBsb3cgdm9pY2VcbiAgICBjb25zdCB2b2ljZUluZGV4ID0gTWF0aC5yYW5kb20oKSA8IDAuNCA/IDAgOiAxO1xuICAgIGNvbnN0IHZvaWNlID0gY29uZmlnW3ZvaWNlSW5kZXhdO1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuc2luZXNCdWZmZXJzW3ZvaWNlLmZpbGVJbmRleF07XG4gICAgY29uc3QgZGV0dW5lcyA9IHZvaWNlLmRldHVuZXNbYmFyXTtcblxuICAgIHRoaXMuYmFzZVNpbmVSZXNhbXBsaW5nID0gZGV0dW5lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkZXR1bmVzLmxlbmd0aCldO1xuICAgIHRoaXMuZ3JhbnVsYXJFbmdpbmUuYnVmZmVyID0gYnVmZmVyO1xuICAgIHRoaXMuZ3JhbnVsYXJFbmdpbmUucGVyaW9kUmVsID0gMC41O1xuICAgIHRoaXMuZ3JhbnVsYXJFbmdpbmUuZHVyYXRpb25BYnMgPSAwLjg7XG4gICAgdGhpcy5ncmFudWxhckVuZ2luZS5wb3NpdGlvblZhciA9IDAuMDM7XG4gICAgdGhpcy5ncmFudWxhckVuZ2luZS5hdHRhY2tBYnMgPSAwO1xuICAgIHRoaXMuZ3JhbnVsYXJFbmdpbmUuYXR0YWNrUmVsID0gMC4yNTtcbiAgICB0aGlzLmdyYW51bGFyRW5naW5lLnJlbGVhc2VBYnMgPSAwO1xuICAgIHRoaXMuZ3JhbnVsYXJFbmdpbmUucmVsZWFzZVJlbCA9IDAuMjU7XG4gICAgdGhpcy5ncmFudWxhckVuZ2luZS5jZW50ZXJlZCA9IHRydWU7XG4gICAgdGhpcy5ncmFudWxhckVuZ2luZS5jeWNsaWMgPSBmYWxzZTtcbiAgICBzY2hlZHVsZXIuYWRkKHRoaXMuZ3JhbnVsYXJFbmdpbmUpO1xuXG4gICAgY29uc3Qgbm93ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIHRoaXMuZW52LmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgbm93KTtcbiAgICB0aGlzLmVudi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDEsIG5vdyArIGZhZGVJbkR1cmF0aW9uKTtcbiAgfVxuXG4gIHN0b3BTaW5lKCkge1xuICAgIC8vIHNob3VsZG4ndCBiZSBuZWNlc3NhcnkgKGJ1dCBqdXN0IGluIGNhc2UuLi4pXG4gICAgaWYgKHNjaGVkdWxlci5oYXModGhpcy5ncmFudWxhckVuZ2luZSkpIHtcbiAgICAgIHNjaGVkdWxlci5yZW1vdmUodGhpcy5ncmFudWxhckVuZ2luZSk7XG5cbiAgICAgIGNvbnN0IG5vdyA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgIHRoaXMuZW52LmdhaW4uc2V0VmFsdWVBdFRpbWUoMSwgbm93KTtcbiAgICAgIHRoaXMuZW52LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgbm93ICsgMC4wMSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXZvaWRUaGVSYWluU3ludGg7XG4iXX0=