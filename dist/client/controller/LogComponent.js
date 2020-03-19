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

var template = '\n  <% logs.forEach(function(log) { %>\n    <pre class="error"><%= log %></pre>\n  <% }); %>\n';

var LogComponent = function () {
  function LogComponent(experience) {
    (0, _classCallCheck3.default)(this, LogComponent);

    this.experience = experience;

    this.stackSize = 20;
    this.stack = [];
  }

  (0, _createClass3.default)(LogComponent, [{
    key: 'enter',
    value: function enter() {
      var $container = this.experience.view.$el.querySelector('#log');

      this.view = new _client.View(template, { logs: this.stack });
      this.view.render();
      this.view.appendTo($container);
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.view.remove();
    }
  }, {
    key: 'error',
    value: function error(file, line, col, msg, userAgent) {
      // @todo - check ousrcemap support
      // https://stackoverflow.com/questions/24637356/javascript-debug-stack-trace-with-source-maps
      var logView = '\n' + userAgent + '\n' + file + ':' + line + ':' + col + '  ' + msg + '\n    ';
      this.stack.unshift(logView);

      this.view.render();
    }
  }]);
  return LogComponent;
}();

exports.default = LogComponent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ0NvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsIkxvZ0NvbXBvbmVudCIsImV4cGVyaWVuY2UiLCJzdGFja1NpemUiLCJzdGFjayIsIiRjb250YWluZXIiLCJ2aWV3IiwiJGVsIiwicXVlcnlTZWxlY3RvciIsIlZpZXciLCJsb2dzIiwicmVuZGVyIiwiYXBwZW5kVG8iLCJyZW1vdmUiLCJmaWxlIiwibGluZSIsImNvbCIsIm1zZyIsInVzZXJBZ2VudCIsImxvZ1ZpZXciLCJ1bnNoaWZ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUEsSUFBTUEsMkdBQU47O0lBTU1DLFk7QUFDSix3QkFBWUMsVUFBWixFQUF3QjtBQUFBOztBQUN0QixTQUFLQSxVQUFMLEdBQWtCQSxVQUFsQjs7QUFFQSxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLEVBQWI7QUFDRDs7Ozs0QkFFTztBQUNOLFVBQU1DLGFBQWEsS0FBS0gsVUFBTCxDQUFnQkksSUFBaEIsQ0FBcUJDLEdBQXJCLENBQXlCQyxhQUF6QixDQUF1QyxNQUF2QyxDQUFuQjs7QUFFQSxXQUFLRixJQUFMLEdBQVksSUFBSUcsWUFBSixDQUFTVCxRQUFULEVBQW1CLEVBQUVVLE1BQU0sS0FBS04sS0FBYixFQUFuQixDQUFaO0FBQ0EsV0FBS0UsSUFBTCxDQUFVSyxNQUFWO0FBQ0EsV0FBS0wsSUFBTCxDQUFVTSxRQUFWLENBQW1CUCxVQUFuQjtBQUNEOzs7MkJBRU07QUFDTCxXQUFLQyxJQUFMLENBQVVPLE1BQVY7QUFDRDs7OzBCQUVLQyxJLEVBQU1DLEksRUFBTUMsRyxFQUFLQyxHLEVBQUtDLFMsRUFBVztBQUNyQztBQUNBO0FBQ0EsVUFBTUMsaUJBQ1JELFNBRFEsVUFFUkosSUFGUSxTQUVBQyxJQUZBLFNBRVFDLEdBRlIsVUFFZ0JDLEdBRmhCLFdBQU47QUFJQSxXQUFLYixLQUFMLENBQVdnQixPQUFYLENBQW1CRCxPQUFuQjs7QUFFQSxXQUFLYixJQUFMLENBQVVLLE1BQVY7QUFDRDs7Ozs7a0JBR1lWLFkiLCJmaWxlIjoiTG9nQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmlldyB9IGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcblxuY29uc3QgdGVtcGxhdGUgPSBgXG4gIDwlIGxvZ3MuZm9yRWFjaChmdW5jdGlvbihsb2cpIHsgJT5cbiAgICA8cHJlIGNsYXNzPVwiZXJyb3JcIj48JT0gbG9nICU+PC9wcmU+XG4gIDwlIH0pOyAlPlxuYDtcblxuY2xhc3MgTG9nQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZXhwZXJpZW5jZSkge1xuICAgIHRoaXMuZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG5cbiAgICB0aGlzLnN0YWNrU2l6ZSA9IDIwO1xuICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSB0aGlzLmV4cGVyaWVuY2Uudmlldy4kZWwucXVlcnlTZWxlY3RvcignI2xvZycpO1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IFZpZXcodGVtcGxhdGUsIHsgbG9nczogdGhpcy5zdGFjayB9KTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gICAgdGhpcy52aWV3LmFwcGVuZFRvKCRjb250YWluZXIpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLnZpZXcucmVtb3ZlKCk7XG4gIH1cblxuICBlcnJvcihmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KSB7XG4gICAgLy8gQHRvZG8gLSBjaGVjayBvdXNyY2VtYXAgc3VwcG9ydFxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0NjM3MzU2L2phdmFzY3JpcHQtZGVidWctc3RhY2stdHJhY2Utd2l0aC1zb3VyY2UtbWFwc1xuICAgIGNvbnN0IGxvZ1ZpZXcgPSBgXG4ke3VzZXJBZ2VudH1cbiR7ZmlsZX06JHtsaW5lfToke2NvbH0gICR7bXNnfVxuICAgIGA7XG4gICAgdGhpcy5zdGFjay51bnNoaWZ0KGxvZ1ZpZXcpO1xuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZ0NvbXBvbmVudDtcbiJdfQ==