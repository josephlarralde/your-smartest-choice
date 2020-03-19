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

var _SharedParamsComponent = require('./SharedParamsComponent');

var _SharedParamsComponent2 = _interopRequireDefault(_SharedParamsComponent);

var _LogComponent = require('./LogComponent');

var _LogComponent2 = _interopRequireDefault(_LogComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <div id="shared-params"></div>\n  <div id="log"></div>\n';

var ControllerExperience = function (_Experience) {
  (0, _inherits3.default)(ControllerExperience, _Experience);

  function ControllerExperience() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, ControllerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ControllerExperience.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience)).call(this));

    _this.sharedParams = _this.require('shared-params');
    _this.sharedParamsComponent = new _SharedParamsComponent2.default(_this, _this.sharedParams);
    _this.logComponent = new _LogComponent2.default(_this);

    _this.setGuiOptions('numPlayers', { readonly: true });

    _this.setGuiOptions('global:state', { type: 'buttons' });
    _this.setGuiOptions('global:volume', { type: 'slider', size: 'large' });
    _this.setGuiOptions('global:shared-visual', { type: 'buttons' });

    // compass
    _this.setGuiOptions('compass:instructions', { type: 'buttons' });

    // balloon cover
    _this.setGuiOptions('balloonCover:explode', { type: 'buttons' });

    // kill the balloons
    _this.setGuiOptions('killTheBalloons:spawnInterval', { type: 'slider', size: 'large' });
    _this.setGuiOptions('killTheBalloons:sizeDiversity', { type: 'slider', size: 'large' });
    _this.setGuiOptions('killTheBalloons:samplesSet', { type: 'buttons' });
    _this.setGuiOptions('killTheBalloons:showText', { type: 'buttons' });
    _this.setGuiOptions('killTheBalloons:clickColorText', { type: 'buttons' });

    // avoid the rain
    _this.setGuiOptions('avoidTheRain:balloonRadius', { type: 'slider', size: 'large' });
    _this.setGuiOptions('avoidTheRain:sineVolume', { type: 'slider', size: 'large' });
    _this.setGuiOptions('avoidTheRain:toggleRain', { type: 'buttons' });
    _this.setGuiOptions('avoidTheRain:spawnInterval', { type: 'slider', size: 'large' });
    _this.setGuiOptions('avoidTheRain:showText', { type: 'buttons' });
    _this.setGuiOptions('avoidTheRain:goToText', { type: 'buttons' });

    // scores
    _this.setGuiOptions('score:showGlobalScore', { type: 'buttons' });
    _this.setGuiOptions('score:blue:transfertRatio', { type: 'slider', size: 'large' });
    _this.setGuiOptions('score:yellow:transfertRatio', { type: 'slider', size: 'large' });
    _this.setGuiOptions('score:pink:transfertRatio', { type: 'slider', size: 'large' });
    _this.setGuiOptions('score:red:transfertRatio', { type: 'slider', size: 'large' });

    _this.setGuiOptions('score:explode', { type: 'buttons' });

    if (options.auth) _this.auth = _this.require('auth');
    return _this;
  }

  (0, _createClass3.default)(ControllerExperience, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(ControllerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience.prototype), 'start', this).call(this);

      this.view = new _client.View(template, {}, {}, { id: 'controller' });

      this.show().then(function () {
        _this2.sharedParamsComponent.enter();
        _this2.logComponent.enter();

        _this2.receive('log', function (type) {
          var _logComponent;

          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          switch (type) {
            case 'error':
              (_logComponent = _this2.logComponent).error.apply(_logComponent, args);
              break;
          }
        });
      });
    }
  }, {
    key: 'setGuiOptions',
    value: function setGuiOptions(name, options) {
      this.sharedParamsComponent.setGuiOptions(name, options);
    }
  }]);
  return ControllerExperience;
}(_client.Experience);

exports.default = ControllerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbInRlbXBsYXRlIiwiQ29udHJvbGxlckV4cGVyaWVuY2UiLCJvcHRpb25zIiwic2hhcmVkUGFyYW1zIiwicmVxdWlyZSIsInNoYXJlZFBhcmFtc0NvbXBvbmVudCIsIlNoYXJlZFBhcmFtc0NvbXBvbmVudCIsImxvZ0NvbXBvbmVudCIsIkxvZ0NvbXBvbmVudCIsInNldEd1aU9wdGlvbnMiLCJyZWFkb25seSIsInR5cGUiLCJzaXplIiwiYXV0aCIsInZpZXciLCJWaWV3IiwiaWQiLCJzaG93IiwidGhlbiIsImVudGVyIiwicmVjZWl2ZSIsImFyZ3MiLCJlcnJvciIsIm5hbWUiLCJFeHBlcmllbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSx5RUFBTjs7SUFLTUMsb0I7OztBQUNKLGtDQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBOztBQUd4QixVQUFLQyxZQUFMLEdBQW9CLE1BQUtDLE9BQUwsQ0FBYSxlQUFiLENBQXBCO0FBQ0EsVUFBS0MscUJBQUwsR0FBNkIsSUFBSUMsK0JBQUosUUFBZ0MsTUFBS0gsWUFBckMsQ0FBN0I7QUFDQSxVQUFLSSxZQUFMLEdBQW9CLElBQUlDLHNCQUFKLE9BQXBCOztBQUVBLFVBQUtDLGFBQUwsQ0FBbUIsWUFBbkIsRUFBaUMsRUFBRUMsVUFBVSxJQUFaLEVBQWpDOztBQUVBLFVBQUtELGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBRUUsTUFBTSxTQUFSLEVBQW5DO0FBQ0EsVUFBS0YsYUFBTCxDQUFtQixlQUFuQixFQUFvQyxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBcEM7QUFDQSxVQUFLSCxhQUFMLENBQW1CLHNCQUFuQixFQUEyQyxFQUFFRSxNQUFNLFNBQVIsRUFBM0M7O0FBRUE7QUFDQSxVQUFLRixhQUFMLENBQW1CLHNCQUFuQixFQUEyQyxFQUFFRSxNQUFNLFNBQVIsRUFBM0M7O0FBRUE7QUFDQSxVQUFLRixhQUFMLENBQW1CLHNCQUFuQixFQUEyQyxFQUFFRSxNQUFNLFNBQVIsRUFBM0M7O0FBRUE7QUFDQSxVQUFLRixhQUFMLENBQW1CLCtCQUFuQixFQUFvRCxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBcEQ7QUFDQSxVQUFLSCxhQUFMLENBQW1CLCtCQUFuQixFQUFvRCxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBcEQ7QUFDQSxVQUFLSCxhQUFMLENBQW1CLDRCQUFuQixFQUFpRCxFQUFFRSxNQUFNLFNBQVIsRUFBakQ7QUFDQSxVQUFLRixhQUFMLENBQW1CLDBCQUFuQixFQUErQyxFQUFFRSxNQUFNLFNBQVIsRUFBL0M7QUFDQSxVQUFLRixhQUFMLENBQW1CLGdDQUFuQixFQUFxRCxFQUFFRSxNQUFNLFNBQVIsRUFBckQ7O0FBRUE7QUFDQSxVQUFLRixhQUFMLENBQW1CLDRCQUFuQixFQUFpRCxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBakQ7QUFDQSxVQUFLSCxhQUFMLENBQW1CLHlCQUFuQixFQUE4QyxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBOUM7QUFDQSxVQUFLSCxhQUFMLENBQW1CLHlCQUFuQixFQUE4QyxFQUFFRSxNQUFNLFNBQVIsRUFBOUM7QUFDQSxVQUFLRixhQUFMLENBQW1CLDRCQUFuQixFQUFpRCxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBakQ7QUFDQSxVQUFLSCxhQUFMLENBQW1CLHVCQUFuQixFQUE0QyxFQUFFRSxNQUFNLFNBQVIsRUFBNUM7QUFDQSxVQUFLRixhQUFMLENBQW1CLHVCQUFuQixFQUE0QyxFQUFFRSxNQUFNLFNBQVIsRUFBNUM7O0FBRUE7QUFDQSxVQUFLRixhQUFMLENBQW1CLHVCQUFuQixFQUE0QyxFQUFFRSxNQUFNLFNBQVIsRUFBNUM7QUFDQSxVQUFLRixhQUFMLENBQW1CLDJCQUFuQixFQUFnRCxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBaEQ7QUFDQSxVQUFLSCxhQUFMLENBQW1CLDZCQUFuQixFQUFrRCxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBbEQ7QUFDQSxVQUFLSCxhQUFMLENBQW1CLDJCQUFuQixFQUFnRCxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBaEQ7QUFDQSxVQUFLSCxhQUFMLENBQW1CLDBCQUFuQixFQUErQyxFQUFFRSxNQUFNLFFBQVIsRUFBa0JDLE1BQU0sT0FBeEIsRUFBL0M7O0FBRUEsVUFBS0gsYUFBTCxDQUFtQixlQUFuQixFQUFvQyxFQUFFRSxNQUFNLFNBQVIsRUFBcEM7O0FBRUEsUUFBSVQsUUFBUVcsSUFBWixFQUNFLE1BQUtBLElBQUwsR0FBWSxNQUFLVCxPQUFMLENBQWEsTUFBYixDQUFaO0FBNUNzQjtBQTZDekI7Ozs7NEJBRU87QUFBQTs7QUFDTjs7QUFFQSxXQUFLVSxJQUFMLEdBQVksSUFBSUMsWUFBSixDQUFTZixRQUFULEVBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLEVBQUVnQixJQUFJLFlBQU4sRUFBM0IsQ0FBWjs7QUFFQSxXQUFLQyxJQUFMLEdBQVlDLElBQVosQ0FBaUIsWUFBTTtBQUNyQixlQUFLYixxQkFBTCxDQUEyQmMsS0FBM0I7QUFDQSxlQUFLWixZQUFMLENBQWtCWSxLQUFsQjs7QUFFQSxlQUFLQyxPQUFMLENBQWEsS0FBYixFQUFvQixVQUFDVCxJQUFELEVBQW1CO0FBQUE7O0FBQUEsNENBQVRVLElBQVM7QUFBVEEsZ0JBQVM7QUFBQTs7QUFDckMsa0JBQVFWLElBQVI7QUFDRSxpQkFBSyxPQUFMO0FBQ0Usc0NBQUtKLFlBQUwsRUFBa0JlLEtBQWxCLHNCQUEyQkQsSUFBM0I7QUFDQTtBQUhKO0FBS0QsU0FORDtBQVFELE9BWkQ7QUFhRDs7O2tDQUVhRSxJLEVBQU1yQixPLEVBQVM7QUFDM0IsV0FBS0cscUJBQUwsQ0FBMkJJLGFBQTNCLENBQXlDYyxJQUF6QyxFQUErQ3JCLE9BQS9DO0FBQ0Q7OztFQXRFZ0NzQixrQjs7a0JBeUVwQnZCLG9CIiwiZmlsZSI6IkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHvCoEV4cGVyaWVuY2UsIFZpZXcgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5pbXBvcnQgU2hhcmVkUGFyYW1zQ29tcG9uZW50IGZyb20gJy4vU2hhcmVkUGFyYW1zQ29tcG9uZW50JztcbmltcG9ydCBMb2dDb21wb25lbnQgZnJvbSAnLi9Mb2dDb21wb25lbnQnO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgPGRpdiBpZD1cInNoYXJlZC1wYXJhbXNcIj48L2Rpdj5cbiAgPGRpdiBpZD1cImxvZ1wiPjwvZGl2PlxuYDtcblxuY2xhc3MgQ29udHJvbGxlckV4cGVyaWVuY2UgZXh0ZW5kcyBFeHBlcmllbmNlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXNDb21wb25lbnQgPSBuZXcgU2hhcmVkUGFyYW1zQ29tcG9uZW50KHRoaXMsIHRoaXMuc2hhcmVkUGFyYW1zKTtcbiAgICB0aGlzLmxvZ0NvbXBvbmVudCA9IG5ldyBMb2dDb21wb25lbnQodGhpcyk7XG5cbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ251bVBsYXllcnMnLCB7IHJlYWRvbmx5OiB0cnVlIH0pO1xuXG4gICAgdGhpcy5zZXRHdWlPcHRpb25zKCdnbG9iYWw6c3RhdGUnLCB7IHR5cGU6ICdidXR0b25zJyB9KTtcbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ2dsb2JhbDp2b2x1bWUnLCB7IHR5cGU6ICdzbGlkZXInLCBzaXplOiAnbGFyZ2UnIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygnZ2xvYmFsOnNoYXJlZC12aXN1YWwnLCB7IHR5cGU6ICdidXR0b25zJyB9KTtcblxuICAgIC8vIGNvbXBhc3NcbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ2NvbXBhc3M6aW5zdHJ1Y3Rpb25zJywgeyB0eXBlOiAnYnV0dG9ucycgfSk7XG5cbiAgICAvLyBiYWxsb29uIGNvdmVyXG4gICAgdGhpcy5zZXRHdWlPcHRpb25zKCdiYWxsb29uQ292ZXI6ZXhwbG9kZScsIHsgdHlwZTogJ2J1dHRvbnMnIH0pO1xuXG4gICAgLy8ga2lsbCB0aGUgYmFsbG9vbnNcbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ2tpbGxUaGVCYWxsb29uczpzcGF3bkludGVydmFsJywgeyB0eXBlOiAnc2xpZGVyJywgc2l6ZTogJ2xhcmdlJywgfSk7XG4gICAgdGhpcy5zZXRHdWlPcHRpb25zKCdraWxsVGhlQmFsbG9vbnM6c2l6ZURpdmVyc2l0eScsIHsgdHlwZTogJ3NsaWRlcicsIHNpemU6ICdsYXJnZScsIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygna2lsbFRoZUJhbGxvb25zOnNhbXBsZXNTZXQnLCB7IHR5cGU6ICdidXR0b25zJyB9KTtcbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ2tpbGxUaGVCYWxsb29uczpzaG93VGV4dCcsIHsgdHlwZTogJ2J1dHRvbnMnIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygna2lsbFRoZUJhbGxvb25zOmNsaWNrQ29sb3JUZXh0JywgeyB0eXBlOiAnYnV0dG9ucycgfSk7XG5cbiAgICAvLyBhdm9pZCB0aGUgcmFpblxuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygnYXZvaWRUaGVSYWluOmJhbGxvb25SYWRpdXMnLCB7IHR5cGU6ICdzbGlkZXInLCBzaXplOiAnbGFyZ2UnIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygnYXZvaWRUaGVSYWluOnNpbmVWb2x1bWUnLCB7IHR5cGU6ICdzbGlkZXInLCBzaXplOiAnbGFyZ2UnIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygnYXZvaWRUaGVSYWluOnRvZ2dsZVJhaW4nLCB7IHR5cGU6ICdidXR0b25zJyB9KTtcbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ2F2b2lkVGhlUmFpbjpzcGF3bkludGVydmFsJywgeyB0eXBlOiAnc2xpZGVyJywgc2l6ZTogJ2xhcmdlJyB9KTtcbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ2F2b2lkVGhlUmFpbjpzaG93VGV4dCcsIHsgdHlwZTogJ2J1dHRvbnMnIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygnYXZvaWRUaGVSYWluOmdvVG9UZXh0JywgeyB0eXBlOiAnYnV0dG9ucycgfSk7XG5cbiAgICAvLyBzY29yZXNcbiAgICB0aGlzLnNldEd1aU9wdGlvbnMoJ3Njb3JlOnNob3dHbG9iYWxTY29yZScsIHsgdHlwZTogJ2J1dHRvbnMnIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygnc2NvcmU6Ymx1ZTp0cmFuc2ZlcnRSYXRpbycsIHsgdHlwZTogJ3NsaWRlcicsIHNpemU6ICdsYXJnZScgfSk7XG4gICAgdGhpcy5zZXRHdWlPcHRpb25zKCdzY29yZTp5ZWxsb3c6dHJhbnNmZXJ0UmF0aW8nLCB7IHR5cGU6ICdzbGlkZXInLCBzaXplOiAnbGFyZ2UnIH0pO1xuICAgIHRoaXMuc2V0R3VpT3B0aW9ucygnc2NvcmU6cGluazp0cmFuc2ZlcnRSYXRpbycsIHsgdHlwZTogJ3NsaWRlcicsIHNpemU6ICdsYXJnZScgfSk7XG4gICAgdGhpcy5zZXRHdWlPcHRpb25zKCdzY29yZTpyZWQ6dHJhbnNmZXJ0UmF0aW8nLCB7IHR5cGU6ICdzbGlkZXInLCBzaXplOiAnbGFyZ2UnIH0pO1xuXG4gICAgdGhpcy5zZXRHdWlPcHRpb25zKCdzY29yZTpleHBsb2RlJywgeyB0eXBlOiAnYnV0dG9ucycgfSk7XG5cbiAgICBpZiAob3B0aW9ucy5hdXRoKVxuICAgICAgdGhpcy5hdXRoID0gdGhpcy5yZXF1aXJlKCdhdXRoJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IFZpZXcodGVtcGxhdGUsIHt9LCB7fSwgeyBpZDogJ2NvbnRyb2xsZXInIH0pO1xuXG4gICAgdGhpcy5zaG93KCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLnNoYXJlZFBhcmFtc0NvbXBvbmVudC5lbnRlcigpO1xuICAgICAgdGhpcy5sb2dDb21wb25lbnQuZW50ZXIoKTtcblxuICAgICAgdGhpcy5yZWNlaXZlKCdsb2cnLCAodHlwZSwgLi4uYXJncykgPT4ge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgICB0aGlzLmxvZ0NvbXBvbmVudC5lcnJvciguLi5hcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9XG5cbiAgc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXNDb21wb25lbnQuc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyRXhwZXJpZW5jZTtcbiJdfQ==