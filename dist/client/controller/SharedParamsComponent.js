'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _basicControllers = require('@ircam/basic-controllers');

var controllers = _interopRequireWildcard(_basicControllers);

var _client = require('soundworks/client');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

controllers.setTheme('dark');

/* --------------------------------------------------------- */
/* GUIs
/* --------------------------------------------------------- */

/** @private */

var _BooleanGui = function () {
  function _BooleanGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _BooleanGui);
    var label = param.label,
        value = param.value;


    this.controller = new controllers.Toggle({
      label: label,
      default: value,
      container: $container,
      callback: function callback(value) {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update(value);
      }
    });
  }

  (0, _createClass3.default)(_BooleanGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _BooleanGui;
}();

/** @private */


var _EnumGui = function () {
  function _EnumGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _EnumGui);
    var label = param.label,
        options = param.options,
        value = param.value;


    var ctor = guiOptions.type === 'buttons' ? controllers.SelectButtons : controllers.SelectList;

    this.controller = new ctor({
      label: label,
      options: options,
      default: value,
      container: $container,
      callback: function callback(value) {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update(value);
      }
    });
  }

  (0, _createClass3.default)(_EnumGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _EnumGui;
}();

/** @private */


var _NumberGui = function () {
  function _NumberGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _NumberGui);
    var label = param.label,
        min = param.min,
        max = param.max,
        step = param.step,
        value = param.value;


    if (guiOptions.type === 'slider') {
      this.controller = new controllers.Slider({
        label: label,
        min: min,
        max: max,
        step: step,
        default: value,
        unit: guiOptions.param ? guiOptions.param : '',
        size: guiOptions.size,
        container: $container
      });
    } else {
      this.controller = new controllers.NumberBox({
        label: label,
        min: min,
        max: max,
        step: step,
        default: value,
        container: $container
      });
    }

    this.controller.addListener(function (value) {
      if (guiOptions.confirm) {
        var msg = 'Are you sure you want to propagate "' + param.name + ':' + value + '"';
        if (!window.confirm(msg)) {
          return;
        }
      }

      param.update(value);
    });
  }

  (0, _createClass3.default)(_NumberGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _NumberGui;
}();

/** @private */


var _TextGui = function () {
  function _TextGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _TextGui);
    var label = param.label,
        value = param.value;


    this.controller = new controllers.Text({
      label: label,
      default: value,
      readonly: guiOptions.readonly,
      container: $container
    });

    if (!guiOptions.readonly) {
      this.controller.addListener(function (value) {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update(value);
      });
    }
  }

  (0, _createClass3.default)(_TextGui, [{
    key: 'set',
    value: function set(val) {
      this.controller.value = val;
    }
  }]);
  return _TextGui;
}();

/** @private */


var _TriggerGui = function () {
  function _TriggerGui($container, param, guiOptions) {
    (0, _classCallCheck3.default)(this, _TriggerGui);
    var label = param.label;


    this.controller = new controllers.TriggerButtons({
      options: [label],
      container: $container,
      callback: function callback() {
        if (guiOptions.confirm) {
          var msg = 'Are you sure you want to propagate "' + param.name + '"';
          if (!window.confirm(msg)) {
            return;
          }
        }

        param.update();
      }
    });
  }

  (0, _createClass3.default)(_TriggerGui, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerGui;
}();

var SharedParamsComponent = function () {
  function SharedParamsComponent(experience) {
    (0, _classCallCheck3.default)(this, SharedParamsComponent);

    this._guiOptions = {};

    this.experience = experience;
    this.sharedParams = experience.sharedParams;
  }

  (0, _createClass3.default)(SharedParamsComponent, [{
    key: 'enter',
    value: function enter() {
      var _this = this;

      var $container = this.experience.view.$el.querySelector('#shared-params');

      this.view = new _client.View();
      this.view.render();
      this.view.appendTo($container);

      var _loop = function _loop(name) {
        var param = _this.sharedParams.params[name];
        var gui = _this._createGui(param);

        param.addListener('update', function (val) {
          return gui.set(val);
        });
      };

      for (var name in this.sharedParams.params) {
        _loop(name);
      }
    }
  }, {
    key: 'exit',
    value: function exit() {
      for (var name in this.sharedParams.params) {
        var param = this.sharedParams.params[name];
        param.removeListener('update');
      }

      this.view.remove();
    }
  }, {
    key: 'setGuiOptions',
    value: function setGuiOptions(name, options) {
      this._guiOptions[name] = options;
    }
  }, {
    key: '_createGui',
    value: function _createGui(param) {
      var config = (0, _assign2.default)({
        show: true,
        confirm: false
      }, this._guiOptions[param.name]);

      if (config.show === false) return null;

      var gui = null;
      var $container = this.view.$el;

      switch (param.type) {
        case 'boolean':
          gui = new _BooleanGui($container, param, config); // `Toggle`
          break;
        case 'enum':
          gui = new _EnumGui($container, param, config); // `SelectList` or `SelectButtons`
          break;
        case 'number':
          gui = new _NumberGui($container, param, config); // `NumberBox` or `Slider`
          break;
        case 'text':
          gui = new _TextGui($container, param, config); // `Text`
          break;
        case 'trigger':
          gui = new _TriggerGui($container, param, config);
          break;
      }

      return gui;
    }
  }]);
  return SharedParamsComponent;
}();

exports.default = SharedParamsComponent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFBhcmFtc0NvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJjb250cm9sbGVycyIsInNldFRoZW1lIiwiX0Jvb2xlYW5HdWkiLCIkY29udGFpbmVyIiwicGFyYW0iLCJndWlPcHRpb25zIiwibGFiZWwiLCJ2YWx1ZSIsImNvbnRyb2xsZXIiLCJUb2dnbGUiLCJkZWZhdWx0IiwiY29udGFpbmVyIiwiY2FsbGJhY2siLCJjb25maXJtIiwibXNnIiwibmFtZSIsIndpbmRvdyIsInVwZGF0ZSIsInZhbCIsIl9FbnVtR3VpIiwib3B0aW9ucyIsImN0b3IiLCJ0eXBlIiwiU2VsZWN0QnV0dG9ucyIsIlNlbGVjdExpc3QiLCJfTnVtYmVyR3VpIiwibWluIiwibWF4Iiwic3RlcCIsIlNsaWRlciIsInVuaXQiLCJzaXplIiwiTnVtYmVyQm94IiwiYWRkTGlzdGVuZXIiLCJfVGV4dEd1aSIsIlRleHQiLCJyZWFkb25seSIsIl9UcmlnZ2VyR3VpIiwiVHJpZ2dlckJ1dHRvbnMiLCJTaGFyZWRQYXJhbXNDb21wb25lbnQiLCJleHBlcmllbmNlIiwiX2d1aU9wdGlvbnMiLCJzaGFyZWRQYXJhbXMiLCJ2aWV3IiwiJGVsIiwicXVlcnlTZWxlY3RvciIsIlZpZXciLCJyZW5kZXIiLCJhcHBlbmRUbyIsInBhcmFtcyIsImd1aSIsIl9jcmVhdGVHdWkiLCJzZXQiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZSIsImNvbmZpZyIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxXOztBQUNaOzs7Ozs7QUFFQUEsWUFBWUMsUUFBWixDQUFxQixNQUFyQjs7QUFFQTtBQUNBOzs7QUFHQTs7SUFDTUMsVztBQUNKLHVCQUFZQyxVQUFaLEVBQXdCQyxLQUF4QixFQUErQkMsVUFBL0IsRUFBMkM7QUFBQTtBQUFBLFFBQ2pDQyxLQURpQyxHQUNoQkYsS0FEZ0IsQ0FDakNFLEtBRGlDO0FBQUEsUUFDMUJDLEtBRDBCLEdBQ2hCSCxLQURnQixDQUMx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LE1BQU1rQixJQUFkO0FBQ0UsYUFBSyxTQUFMO0FBQ0U0QixnQkFBTSxJQUFJaEQsV0FBSixDQUFnQkMsVUFBaEIsRUFBNEJDLEtBQTVCLEVBQW1DbUQsTUFBbkMsQ0FBTixDQURGLENBQ29EO0FBQ2xEO0FBQ0YsYUFBSyxNQUFMO0FBQ0VMLGdCQUFNLElBQUkvQixRQUFKLENBQWFoQixVQUFiLEVBQXlCQyxLQUF6QixFQUFnQ21ELE1BQWhDLENBQU4sQ0FERixDQUNpRDtBQUMvQztBQUNGLGFBQUssUUFBTDtBQUNFTCxnQkFBTSxJQUFJekIsVUFBSixDQUFldEIsVUFBZixFQUEyQkMsS0FBM0IsRUFBa0NtRCxNQUFsQyxDQUFOLENBREYsQ0FDbUQ7QUFDakQ7QUFDRixhQUFLLE1BQUw7QUFDRUwsZ0JBQU0sSUFBSWhCLFFBQUosQ0FBYS9CLFVBQWIsRUFBeUJDLEtBQXpCLEVBQWdDbUQsTUFBaEMsQ0FBTixDQURGLENBQ2lEO0FBQy9DO0FBQ0YsYUFBSyxTQUFMO0FBQ0VMLGdCQUFNLElBQUliLFdBQUosQ0FBZ0JsQyxVQUFoQixFQUE0QkMsS0FBNUIsRUFBbUNtRCxNQUFuQyxDQUFOO0FBQ0E7QUFmSjs7QUFrQkEsYUFBT0wsR0FBUDtBQUNEOzs7OztrQkFHWVgscUIiLCJmaWxlIjoiU2hhcmVkUGFyYW1zQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG5cbmNvbnRyb2xsZXJzLnNldFRoZW1lKCdkYXJrJyk7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogR1VJc1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX0Jvb2xlYW5HdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjb250cm9sbGVycy5Ub2dnbGUoe1xuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgZGVmYXVsdDogdmFsdWUsXG4gICAgICBjb250YWluZXI6ICRjb250YWluZXIsXG4gICAgICBjYWxsYmFjazogKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7cGFyYW0ubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyYW0udXBkYXRlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfRW51bUd1aSB7XG4gIGNvbnN0cnVjdG9yKCRjb250YWluZXIsIHBhcmFtLCBndWlPcHRpb25zKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgb3B0aW9ucywgdmFsdWUgfSA9IHBhcmFtO1xuXG4gICAgY29uc3QgY3RvciA9IGd1aU9wdGlvbnMudHlwZSA9PT0gJ2J1dHRvbnMnID9cbiAgICAgIGNvbnRyb2xsZXJzLlNlbGVjdEJ1dHRvbnMgOiBjb250cm9sbGVycy5TZWxlY3RMaXN0XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgY3Rvcih7XG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgZGVmYXVsdDogdmFsdWUsXG4gICAgICBjb250YWluZXI6ICRjb250YWluZXIsXG4gICAgICBjYWxsYmFjazogKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zdCBtc2cgPSBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSBcIiR7cGFyYW0ubmFtZX06JHt2YWx1ZX1cImA7XG4gICAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtc2cpKSB7IHJldHVybjsgfVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyYW0udXBkYXRlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgcGFyYW0sIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdmFsdWUgfSA9IHBhcmFtO1xuXG4gICAgaWYgKGd1aU9wdGlvbnMudHlwZSA9PT0gJ3NsaWRlcicpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjb250cm9sbGVycy5TbGlkZXIoe1xuICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgIG1pbjogbWluLFxuICAgICAgICBtYXg6IG1heCxcbiAgICAgICAgc3RlcDogc3RlcCxcbiAgICAgICAgZGVmYXVsdDogdmFsdWUsXG4gICAgICAgIHVuaXQ6IGd1aU9wdGlvbnMucGFyYW0gPyBndWlPcHRpb25zLnBhcmFtIDogJycsXG4gICAgICAgIHNpemU6IGd1aU9wdGlvbnMuc2l6ZSxcbiAgICAgICAgY29udGFpbmVyOiAkY29udGFpbmVyLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjb250cm9sbGVycy5OdW1iZXJCb3goe1xuICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgIG1pbjogbWluLFxuICAgICAgICBtYXg6IG1heCxcbiAgICAgICAgc3RlcDogc3RlcCxcbiAgICAgICAgZGVmYXVsdDogdmFsdWUsXG4gICAgICAgIGNvbnRhaW5lcjogJGNvbnRhaW5lcixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY29udHJvbGxlci5hZGRMaXN0ZW5lcigodmFsdWUpID0+IHtcbiAgICAgIGlmIChndWlPcHRpb25zLmNvbmZpcm0pIHtcbiAgICAgICAgY29uc3QgbXNnID0gYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgXCIke3BhcmFtLm5hbWV9OiR7dmFsdWV9XCJgO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnZhbHVlID0gdmFsO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRHdWkge1xuICBjb25zdHJ1Y3RvcigkY29udGFpbmVyLCBwYXJhbSwgZ3VpT3B0aW9ucykge1xuICAgIGNvbnN0IHsgbGFiZWwsIHZhbHVlIH0gPSBwYXJhbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjb250cm9sbGVycy5UZXh0KHtcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIGRlZmF1bHQ6IHZhbHVlLFxuICAgICAgcmVhZG9ubHk6IGd1aU9wdGlvbnMucmVhZG9ubHksXG4gICAgICBjb250YWluZXI6ICRjb250YWluZXIsXG4gICAgfSk7XG5cbiAgICBpZiAoIWd1aU9wdGlvbnMucmVhZG9ubHkpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlci5hZGRMaXN0ZW5lcigodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfVwiYDtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS51cGRhdGUodmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMuY29udHJvbGxlci52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9UcmlnZ2VyR3VpIHtcbiAgY29uc3RydWN0b3IoJGNvbnRhaW5lciwgcGFyYW0sIGd1aU9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGxhYmVsIH0gPSBwYXJhbTtcblxuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBjb250cm9sbGVycy5UcmlnZ2VyQnV0dG9ucyh7XG4gICAgICBvcHRpb25zOiBbbGFiZWxdLFxuICAgICAgY29udGFpbmVyOiAkY29udGFpbmVyLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgaWYgKGd1aU9wdGlvbnMuY29uZmlybSkge1xuICAgICAgICAgIGNvbnN0IG1zZyA9IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIFwiJHtwYXJhbS5uYW1lfVwiYDtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1zZykpIHsgcmV0dXJuOyB9XG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCh2YWwpIHsgLyogbm90aGluZyB0byBzZXQgaGVyZSAqLyB9XG59XG5cblxuY2xhc3MgU2hhcmVkUGFyYW1zQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSkge1xuICAgIHRoaXMuX2d1aU9wdGlvbnMgPSB7fTtcblxuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSBleHBlcmllbmNlLnNoYXJlZFBhcmFtcztcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLmV4cGVyaWVuY2Uudmlldy4kZWwucXVlcnlTZWxlY3RvcignI3NoYXJlZC1wYXJhbXMnKTtcblxuICAgIHRoaXMudmlldyA9IG5ldyBWaWV3KCk7XG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHRoaXMudmlldy5hcHBlbmRUbygkY29udGFpbmVyKTtcblxuICAgIGZvciAobGV0IG5hbWUgaW4gdGhpcy5zaGFyZWRQYXJhbXMucGFyYW1zKSB7XG4gICAgICBjb25zdCBwYXJhbSA9IHRoaXMuc2hhcmVkUGFyYW1zLnBhcmFtc1tuYW1lXTtcbiAgICAgIGNvbnN0IGd1aSA9IHRoaXMuX2NyZWF0ZUd1aShwYXJhbSk7XG5cbiAgICAgIHBhcmFtLmFkZExpc3RlbmVyKCd1cGRhdGUnLCAodmFsKSA9PiBndWkuc2V0KHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzLnNoYXJlZFBhcmFtcy5wYXJhbXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5zaGFyZWRQYXJhbXMucGFyYW1zW25hbWVdO1xuICAgICAgcGFyYW0ucmVtb3ZlTGlzdGVuZXIoJ3VwZGF0ZScpO1xuICAgIH1cblxuICAgIHRoaXMudmlldy5yZW1vdmUoKTtcbiAgfVxuXG4gIHNldEd1aU9wdGlvbnMobmFtZSwgb3B0aW9ucykge1xuICAgIHRoaXMuX2d1aU9wdGlvbnNbbmFtZV0gPSBvcHRpb25zO1xuICB9XG5cbiAgX2NyZWF0ZUd1aShwYXJhbSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGNvbmZpcm06IGZhbHNlLFxuICAgIH0sIHRoaXMuX2d1aU9wdGlvbnNbcGFyYW0ubmFtZV0pO1xuXG4gICAgaWYgKGNvbmZpZy5zaG93ID09PSBmYWxzZSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgZ3VpID0gbnVsbDtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy52aWV3LiRlbDtcblxuICAgIHN3aXRjaCAocGFyYW0udHlwZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGd1aSA9IG5ldyBfQm9vbGVhbkd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYFRvZ2dsZWBcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgZ3VpID0gbmV3IF9FbnVtR3VpKCRjb250YWluZXIsIHBhcmFtLCBjb25maWcpOyAvLyBgU2VsZWN0TGlzdGAgb3IgYFNlbGVjdEJ1dHRvbnNgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZ3VpID0gbmV3IF9OdW1iZXJHdWkoJGNvbnRhaW5lciwgcGFyYW0sIGNvbmZpZyk7IC8vIGBOdW1iZXJCb3hgIG9yIGBTbGlkZXJgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGd1aSA9IG5ldyBfVGV4dEd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTsgLy8gYFRleHRgXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIGd1aSA9IG5ldyBfVHJpZ2dlckd1aSgkY29udGFpbmVyLCBwYXJhbSwgY29uZmlnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRQYXJhbXNDb21wb25lbnQ7XG4iXX0=