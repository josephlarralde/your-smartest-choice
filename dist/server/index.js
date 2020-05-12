'use strict';

require('source-map-support/register');

var _server = require('soundworks/server');

var soundworks = _interopRequireWildcard(_server);

var _PlayerExperience = require('./PlayerExperience');

var _PlayerExperience2 = _interopRequireDefault(_PlayerExperience);

var _ControllerExperience = require('./ControllerExperience');

var _ControllerExperience2 = _interopRequireDefault(_ControllerExperience);

var _Timeline = require('./Timeline');

var _Timeline2 = _interopRequireDefault(_Timeline);

var _default = require('./config/default');

var _default2 = _interopRequireDefault(_default);

var _production = require('./config/production');

var _production2 = _interopRequireDefault(_production);

var _midiConfig = require('../../data/midi-config');

var _midiConfig2 = _interopRequireDefault(_midiConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// application services
// import Midi from './services/Midi';

var config = null; // enable sourcemaps in node


switch (process.env.ENV) {
  case 'production':
    config = _production2.default;
    break;
  default:
    // @todo - don't forget to uncomment that
    config = _default2.default;
    // config = productionConfig;
    break;
}

// configure express environment ('production' enables cache systems)
process.env.NODE_ENV = config.env;

soundworks.server.init(config);
soundworks.server.setClientConfigDefinition(function (clientType, config, httpRequest) {
  return {
    clientType: clientType,
    env: config.env,
    appName: config.appName,
    websockets: config.websockets,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain
  };
});

// results in percents at the end of the game
var winnersResults = {
  red: 31.2,
  yellow: 27.6,
  pink: 21.3,
  blue: 19.9
};

// ----------------------------------------------------
// configure sharedParameters
// ----------------------------------------------------

var sharedParams = soundworks.server.require('shared-params');

sharedParams.addText('numPlayers', '# players', '0');

// --------------------------------------
// globals
// --------------------------------------
sharedParams.addNumber('global:volume', 'Volume', 0, 2, 0.001, 1);
sharedParams.addEnum('global:state', 'State', ['wait', 'compass', 'balloonsCover', 'killTheBalloons', 'intermezzo', 'avoidTheRain', 'scores', 'end'], 'wait');
sharedParams.addNumber('global:time', 'Time', 0, +Infinity, 0.001, 0);

// --------------------------------------
// balloon cover
// --------------------------------------
sharedParams.addText('balloonCover:title', '&nbsp;', 'BALLOONS COVER');
sharedParams.addEnum('balloonCover:explode', 'BalloonCover - explode', ['none', 'blue', 'pink', 'yellow', 'red'], 'none');

// --------------------------------------
// shared visual
// --------------------------------------
// sharedParams.addEnum('global:shared-visual', 'Shared Visual - Add', ['none', 'gif:explodingBalloon', 'gif:flyingBalloons'], 'none');

// --------------------------------------
// balloon cover
// --------------------------------------
sharedParams.addText('compass:title', '&nbsp;', 'COMPASS');
// sharedParams.addEnum('compass:instructions', 'Compass - instructions', ['none', 'Walk around', 'Stand still', 'Be quiet', 'Listen around'], 'none');
sharedParams.addEnum('compass:instructions', 'Compass - instructions', ['none', 'Use the compass to choose the colour'], 'none');

// --------------------------------------
// kill the balloons
// --------------------------------------
sharedParams.addText('killTheBalloons:title', '&nbsp;', 'KILL THE BALLOONS');
sharedParams.addEnum('killTheBalloons:samplesSet', 'KillTheBalloons - samplesSet', [0, 1, 2, 3, 4], 0);
sharedParams.addNumber('killTheBalloons:spawnInterval', 'KillTheBalloons - spawnInterval', 0, 10, 0.001, 0.15);
sharedParams.addNumber('killTheBalloons:sizeDiversity', 'KillTheBalloons - sizeDiversity', 0, 1, 0.001, 0);

// sharedParams.addEnum('killTheBalloons:showText', 'KillTheBalloons - showText', ['none', 'On tempo!', 'da da dadada', 'Follow the Rhythm', 'Create a melody'], 'none');
sharedParams.addEnum('killTheBalloons:showText', 'KillTheBalloons - showText', ['none', 'Create your rhythm', 'Random colour', 'In tempo'], 'none');

sharedParams.addEnum('killTheBalloons:clickColorText', 'killTheBalloons - text "click the"', ['none', 'blue', 'pink', 'yellow', 'red', 'random'], 'none');

// --------------------------------------
// avoid the rain
// --------------------------------------
sharedParams.addText('avoidTheRain:title', '&nbsp;', 'AVOID THE RAIN');
sharedParams.addEnum('avoidTheRain:toggleRain', 'AvoidTheRain - toggleRain', ['stop', 'start'], 'stop');
sharedParams.addEnum('avoidTheRain:harmony', 'AvoidTheRain - harmony', ['M15:0', 'M15:1', 'M15:2', 'M15:3', 'M16:0', 'M16:1', 'M16:2', 'M16:3', 'M17:0', 'M17:1', 'M17:2', 'M17:3', 'M18:0', 'M18:1', 'M18:2', 'M18:3'], 'M15:0');
sharedParams.addNumber('avoidTheRain:sineVolume', 'AvoidTheRain - sineVolume', 0, 1, 0.01, 1);
sharedParams.addNumber('avoidTheRain:balloonRadius', 'AvoidTheRain - balloonRadius', 40, 200, 1, 40);
sharedParams.addNumber('avoidTheRain:spawnInterval', 'AvoidTheRain - spawnInterval', 0, 1, 0.001, 1);
sharedParams.addEnum('avoidTheRain:showText', 'AvoidTheRain - showText', ['none', 'fly'], 'none');
sharedParams.addEnum('avoidTheRain:goToText', 'AvoidTheRain - text "go to"', ['none', 'random'], 'none');

// --------------------------------------
// score
// --------------------------------------
sharedParams.addText('score:title', '&nbsp;', 'FINAL SCORE');
sharedParams.addEnum('score:showGlobalScore', 'Score - showGlobalScore', ['hide', 'show'], 'hide');
sharedParams.addNumber('score:blue:transfertRatio', 'Score - Blue - transfertRatio', 0, 1, 0.01, 0);
sharedParams.addNumber('score:pink:transfertRatio', 'Score - Pink - transfertRatio', 0, 1, 0.01, 0);
sharedParams.addNumber('score:yellow:transfertRatio', 'Score - Yellow - transfertRatio', 0, 1, 0.01, 0);
sharedParams.addNumber('score:red:transfertRatio', 'Score - Red - transfertRatio', 0, 1, 0.01, 0);
sharedParams.addEnum('score:explode', 'Score - Explode', ['none', 'blue', 'pink', 'yellow', 'red'], 'none');

// ----------------------------------------------------
// run application
// ----------------------------------------------------

// const timeline = new Timeline(sharedParams);
var experience = new _PlayerExperience2.default('player', _midiConfig2.default, winnersResults);
var controller = new _ControllerExperience2.default('controller');

soundworks.server.start();
// timeline.start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJjb25maWciLCJwcm9jZXNzIiwiZW52IiwiRU5WIiwicHJvZHVjdGlvbkNvbmZpZyIsImRlZmF1bHRDb25maWciLCJOT0RFX0VOViIsInNlcnZlciIsImluaXQiLCJzZXRDbGllbnRDb25maWdEZWZpbml0aW9uIiwiY2xpZW50VHlwZSIsImh0dHBSZXF1ZXN0IiwiYXBwTmFtZSIsIndlYnNvY2tldHMiLCJ2ZXJzaW9uIiwiZGVmYXVsdFR5cGUiLCJkZWZhdWx0Q2xpZW50IiwiYXNzZXRzRG9tYWluIiwid2lubmVyc1Jlc3VsdHMiLCJyZWQiLCJ5ZWxsb3ciLCJwaW5rIiwiYmx1ZSIsInNoYXJlZFBhcmFtcyIsInJlcXVpcmUiLCJhZGRUZXh0IiwiYWRkTnVtYmVyIiwiYWRkRW51bSIsIkluZmluaXR5IiwiZXhwZXJpZW5jZSIsIlBsYXllckV4cGVyaWVuY2UiLCJtaWRpQ29uZmlnIiwiY29udHJvbGxlciIsIkNvbnRyb2xsZXJFeHBlcmllbmNlIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0lBQVlBLFU7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7OztBQUVBO0FBQ0E7O0FBRUEsSUFBSUMsU0FBUyxJQUFiLEMsQ0Fkc0M7OztBQWdCdEMsUUFBT0MsUUFBUUMsR0FBUixDQUFZQyxHQUFuQjtBQUNFLE9BQUssWUFBTDtBQUNFSCxhQUFTSSxvQkFBVDtBQUNBO0FBQ0Y7QUFBUztBQUNQSixhQUFTSyxpQkFBVDtBQUNBO0FBQ0E7QUFQSjs7QUFVQTtBQUNBSixRQUFRQyxHQUFSLENBQVlJLFFBQVosR0FBdUJOLE9BQU9FLEdBQTlCOztBQUVBSCxXQUFXUSxNQUFYLENBQWtCQyxJQUFsQixDQUF1QlIsTUFBdkI7QUFDQUQsV0FBV1EsTUFBWCxDQUFrQkUseUJBQWxCLENBQTRDLFVBQUNDLFVBQUQsRUFBYVYsTUFBYixFQUFxQlcsV0FB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LFFBQXBDLEVBQThDLGFBQTlDO0FBQ0FGLGFBQWFJLE9BQWIsQ0FBcUIsdUJBQXJCLEVBQThDLHlCQUE5QyxFQUF5RSxDQUFDLE1BQUQsRUFBUyxNQUFULENBQXpFLEVBQTJGLE1BQTNGO0FBQ0FKLGFBQWFHLFNBQWIsQ0FBdUIsMkJBQXZCLEVBQW9ELCtCQUFwRCxFQUFxRixDQUFyRixFQUF3RixDQUF4RixFQUEyRixJQUEzRixFQUFpRyxDQUFqRztBQUNBSCxhQUFhRyxTQUFiLENBQXVCLDJCQUF2QixFQUFvRCwrQkFBcEQsRUFBcUYsQ0FBckYsRUFBd0YsQ0FBeEYsRUFBMkYsSUFBM0YsRUFBaUcsQ0FBakc7QUFDQUgsYUFBYUcsU0FBYixDQUF1Qiw2QkFBdkIsRUFBc0QsaUNBQXRELEVBQXlGLENBQXpGLEVBQTRGLENBQTVGLEVBQStGLElBQS9GLEVBQXFHLENBQXJHO0FBQ0FILGFBQWFHLFNBQWIsQ0FBdUIsMEJBQXZCLEVBQW1ELDhCQUFuRCxFQUFtRixDQUFuRixFQUFzRixDQUF0RixFQUF5RixJQUF6RixFQUErRixDQUEvRjtBQUNBSCxhQUFhSSxPQUFiLENBQXFCLGVBQXJCLEVBQXNDLGlCQUF0QyxFQUF5RCxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLFFBQXpCLEVBQW1DLEtBQW5DLENBQXpELEVBQW9HLE1BQXBHOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQU1FLGFBQWEsSUFBSUMsMEJBQUosQ0FBcUIsUUFBckIsRUFBK0JDLG9CQUEvQixFQUEyQ2IsY0FBM0MsQ0FBbkI7QUFDQSxJQUFNYyxhQUFhLElBQUlDLDhCQUFKLENBQXlCLFlBQXpCLENBQW5COztBQUVBbEMsV0FBV1EsTUFBWCxDQUFrQjJCLEtBQWxCO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7IC8vIGVuYWJsZSBzb3VyY2VtYXBzIGluIG5vZGVcbmltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9zZXJ2ZXInO1xuaW1wb3J0IFBsYXllckV4cGVyaWVuY2UgZnJvbSAnLi9QbGF5ZXJFeHBlcmllbmNlJztcbmltcG9ydCBDb250cm9sbGVyRXhwZXJpZW5jZSBmcm9tICcuL0NvbnRyb2xsZXJFeHBlcmllbmNlJztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL1RpbWVsaW5lJztcblxuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSAnLi9jb25maWcvZGVmYXVsdCc7XG5pbXBvcnQgcHJvZHVjdGlvbkNvbmZpZyBmcm9tICcuL2NvbmZpZy9wcm9kdWN0aW9uJztcblxuaW1wb3J0IG1pZGlDb25maWcgZnJvbSAnLi4vLi4vZGF0YS9taWRpLWNvbmZpZyc7XG5cbi8vIGFwcGxpY2F0aW9uIHNlcnZpY2VzXG4vLyBpbXBvcnQgTWlkaSBmcm9tICcuL3NlcnZpY2VzL01pZGknO1xuXG5sZXQgY29uZmlnID0gbnVsbDtcblxuc3dpdGNoKHByb2Nlc3MuZW52LkVOVikge1xuICBjYXNlICdwcm9kdWN0aW9uJzpcbiAgICBjb25maWcgPSBwcm9kdWN0aW9uQ29uZmlnO1xuICAgIGJyZWFrO1xuICBkZWZhdWx0OiAvLyBAdG9kbyAtIGRvbid0IGZvcmdldCB0byB1bmNvbW1lbnQgdGhhdFxuICAgIGNvbmZpZyA9IGRlZmF1bHRDb25maWc7XG4gICAgLy8gY29uZmlnID0gcHJvZHVjdGlvbkNvbmZpZztcbiAgICBicmVhaztcbn1cblxuLy8gY29uZmlndXJlIGV4cHJlc3MgZW52aXJvbm1lbnQgKCdwcm9kdWN0aW9uJyBlbmFibGVzIGNhY2hlIHN5c3RlbXMpXG5wcm9jZXNzLmVudi5OT0RFX0VOViA9IGNvbmZpZy5lbnY7XG5cbnNvdW5kd29ya3Muc2VydmVyLmluaXQoY29uZmlnKTtcbnNvdW5kd29ya3Muc2VydmVyLnNldENsaWVudENvbmZpZ0RlZmluaXRpb24oKGNsaWVudFR5cGUsIGNvbmZpZywgaHR0cFJlcXVlc3QpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBjbGllbnRUeXBlOiBjbGllbnRUeXBlLFxuICAgIGVudjogY29uZmlnLmVudixcbiAgICBhcHBOYW1lOiBjb25maWcuYXBwTmFtZSxcbiAgICB3ZWJzb2NrZXRzOiBjb25maWcud2Vic29ja2V0cyxcbiAgICB2ZXJzaW9uOiBjb25maWcudmVyc2lvbixcbiAgICBkZWZhdWx0VHlwZTogY29uZmlnLmRlZmF1bHRDbGllbnQsXG4gICAgYXNzZXRzRG9tYWluOiBjb25maWcuYXNzZXRzRG9tYWluLFxuICB9O1xufSk7XG5cblxuLy8gcmVzdWx0cyBpbiBwZXJjZW50cyBhdCB0aGUgZW5kIG9mIHRoZSBnYW1lXG5jb25zdCB3aW5uZXJzUmVzdWx0cyA9IHtcbiAgcmVkOiAzMS4yLFxuICB5ZWxsb3c6IDI3LjYsXG4gIHBpbms6IDIxLjMsXG4gIGJsdWU6IDE5LjksXG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25maWd1cmUgc2hhcmVkUGFyYW1ldGVyc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jb25zdCBzaGFyZWRQYXJhbXMgPSBzb3VuZHdvcmtzLnNlcnZlci5yZXF1aXJlKCdzaGFyZWQtcGFyYW1zJyk7XG5cbnNoYXJlZFBhcmFtcy5hZGRUZXh0KCdudW1QbGF5ZXJzJywgJyMgcGxheWVycycsICcwJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBnbG9iYWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignZ2xvYmFsOnZvbHVtZScsICdWb2x1bWUnLCAwLCAyLCAwLjAwMSwgMSk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnZ2xvYmFsOnN0YXRlJywgJ1N0YXRlJywgWyd3YWl0JywgJ2NvbXBhc3MnLCAnYmFsbG9vbnNDb3ZlcicsICdraWxsVGhlQmFsbG9vbnMnLCAnaW50ZXJtZXp6bycsICdhdm9pZFRoZVJhaW4nLCAnc2NvcmVzJywgJ2VuZCddLCAnd2FpdCcpO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignZ2xvYmFsOnRpbWUnLCAnVGltZScsIDAsICtJbmZpbml0eSwgMC4wMDEsIDApO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYmFsbG9vbiBjb3ZlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnNoYXJlZFBhcmFtcy5hZGRUZXh0KCdiYWxsb29uQ292ZXI6dGl0bGUnLCAnJm5ic3A7JywgJ0JBTExPT05TIENPVkVSJyk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnYmFsbG9vbkNvdmVyOmV4cGxvZGUnLCAnQmFsbG9vbkNvdmVyIC0gZXhwbG9kZScsIFsnbm9uZScsICdibHVlJywgJ3BpbmsnLCAneWVsbG93JywgJ3JlZCddLCAnbm9uZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gc2hhcmVkIHZpc3VhbFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHNoYXJlZFBhcmFtcy5hZGRFbnVtKCdnbG9iYWw6c2hhcmVkLXZpc3VhbCcsICdTaGFyZWQgVmlzdWFsIC0gQWRkJywgWydub25lJywgJ2dpZjpleHBsb2RpbmdCYWxsb29uJywgJ2dpZjpmbHlpbmdCYWxsb29ucyddLCAnbm9uZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYmFsbG9vbiBjb3ZlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnNoYXJlZFBhcmFtcy5hZGRUZXh0KCdjb21wYXNzOnRpdGxlJywgJyZuYnNwOycsICdDT01QQVNTJyk7XG4vLyBzaGFyZWRQYXJhbXMuYWRkRW51bSgnY29tcGFzczppbnN0cnVjdGlvbnMnLCAnQ29tcGFzcyAtIGluc3RydWN0aW9ucycsIFsnbm9uZScsICdXYWxrIGFyb3VuZCcsICdTdGFuZCBzdGlsbCcsICdCZSBxdWlldCcsICdMaXN0ZW4gYXJvdW5kJ10sICdub25lJyk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnY29tcGFzczppbnN0cnVjdGlvbnMnLCAnQ29tcGFzcyAtIGluc3RydWN0aW9ucycsIFsnbm9uZScsICdVc2UgdGhlIGNvbXBhc3MgdG8gY2hvb3NlIHRoZSBjb2xvdXInXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGtpbGwgdGhlIGJhbGxvb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ2tpbGxUaGVCYWxsb29uczp0aXRsZScsICcmbmJzcDsnLCAnS0lMTCBUSEUgQkFMTE9PTlMnKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdraWxsVGhlQmFsbG9vbnM6c2FtcGxlc1NldCcsICdLaWxsVGhlQmFsbG9vbnMgLSBzYW1wbGVzU2V0JywgWzAsIDEsIDIsIDMsIDRdLCAwKTtcbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ2tpbGxUaGVCYWxsb29uczpzcGF3bkludGVydmFsJywgJ0tpbGxUaGVCYWxsb29ucyAtIHNwYXduSW50ZXJ2YWwnLCAwLCAxMCwgMC4wMDEsIDAuMTUpO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcigna2lsbFRoZUJhbGxvb25zOnNpemVEaXZlcnNpdHknLCAnS2lsbFRoZUJhbGxvb25zIC0gc2l6ZURpdmVyc2l0eScsIDAsIDEsIDAuMDAxLCAwKTtcblxuLy8gc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2tpbGxUaGVCYWxsb29uczpzaG93VGV4dCcsICdLaWxsVGhlQmFsbG9vbnMgLSBzaG93VGV4dCcsIFsnbm9uZScsICdPbiB0ZW1wbyEnLCAnZGEgZGEgZGFkYWRhJywgJ0ZvbGxvdyB0aGUgUmh5dGhtJywgJ0NyZWF0ZSBhIG1lbG9keSddLCAnbm9uZScpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2tpbGxUaGVCYWxsb29uczpzaG93VGV4dCcsICdLaWxsVGhlQmFsbG9vbnMgLSBzaG93VGV4dCcsIFsnbm9uZScsICdDcmVhdGUgeW91ciByaHl0aG0nLCAnUmFuZG9tIGNvbG91cicsICdJbiB0ZW1wbyddLCAnbm9uZScpO1xuXG5zaGFyZWRQYXJhbXMuYWRkRW51bSgna2lsbFRoZUJhbGxvb25zOmNsaWNrQ29sb3JUZXh0JywgJ2tpbGxUaGVCYWxsb29ucyAtIHRleHQgXCJjbGljayB0aGVcIicsIFsnbm9uZScsICdibHVlJywgJ3BpbmsnLCAneWVsbG93JywgJ3JlZCcsICdyYW5kb20nXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGF2b2lkIHRoZSByYWluXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ2F2b2lkVGhlUmFpbjp0aXRsZScsICcmbmJzcDsnLCAnQVZPSUQgVEhFIFJBSU4nKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdhdm9pZFRoZVJhaW46dG9nZ2xlUmFpbicsICdBdm9pZFRoZVJhaW4gLSB0b2dnbGVSYWluJywgWydzdG9wJywgJ3N0YXJ0J10sICdzdG9wJyk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnYXZvaWRUaGVSYWluOmhhcm1vbnknLCAnQXZvaWRUaGVSYWluIC0gaGFybW9ueScsIFtcbiAgJ00xNTowJywgJ00xNToxJywgJ00xNToyJywgJ00xNTozJyxcbiAgJ00xNjowJywgJ00xNjoxJywgJ00xNjoyJywgJ00xNjozJyxcbiAgJ00xNzowJywgJ00xNzoxJywgJ00xNzoyJywgJ00xNzozJyxcbiAgJ00xODowJywgJ00xODoxJywgJ00xODoyJywgJ00xODozJyxcbl0sICdNMTU6MCcpO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignYXZvaWRUaGVSYWluOnNpbmVWb2x1bWUnLCAnQXZvaWRUaGVSYWluIC0gc2luZVZvbHVtZScsIDAsIDEsIDAuMDEsIDEpO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignYXZvaWRUaGVSYWluOmJhbGxvb25SYWRpdXMnLCAnQXZvaWRUaGVSYWluIC0gYmFsbG9vblJhZGl1cycsIDQwLCAyMDAsIDEsIDQwKTtcbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ2F2b2lkVGhlUmFpbjpzcGF3bkludGVydmFsJywgJ0F2b2lkVGhlUmFpbiAtIHNwYXduSW50ZXJ2YWwnLCAwLCAxLCAwLjAwMSwgMSk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnYXZvaWRUaGVSYWluOnNob3dUZXh0JywgJ0F2b2lkVGhlUmFpbiAtIHNob3dUZXh0JywgWydub25lJywgJ2ZseSddLCAnbm9uZScpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2F2b2lkVGhlUmFpbjpnb1RvVGV4dCcsICdBdm9pZFRoZVJhaW4gLSB0ZXh0IFwiZ28gdG9cIicsIFsnbm9uZScsICdyYW5kb20nXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHNjb3JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ3Njb3JlOnRpdGxlJywgJyZuYnNwOycsICdGSU5BTCBTQ09SRScpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ3Njb3JlOnNob3dHbG9iYWxTY29yZScsICdTY29yZSAtIHNob3dHbG9iYWxTY29yZScsIFsnaGlkZScsICdzaG93J10sICdoaWRlJyk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdzY29yZTpibHVlOnRyYW5zZmVydFJhdGlvJywgJ1Njb3JlIC0gQmx1ZSAtIHRyYW5zZmVydFJhdGlvJywgMCwgMSwgMC4wMSwgMCk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdzY29yZTpwaW5rOnRyYW5zZmVydFJhdGlvJywgJ1Njb3JlIC0gUGluayAtIHRyYW5zZmVydFJhdGlvJywgMCwgMSwgMC4wMSwgMCk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdzY29yZTp5ZWxsb3c6dHJhbnNmZXJ0UmF0aW8nLCAnU2NvcmUgLSBZZWxsb3cgLSB0cmFuc2ZlcnRSYXRpbycsIDAsIDEsIDAuMDEsIDApO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignc2NvcmU6cmVkOnRyYW5zZmVydFJhdGlvJywgJ1Njb3JlIC0gUmVkIC0gdHJhbnNmZXJ0UmF0aW8nLCAwLCAxLCAwLjAxLCAwKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdzY29yZTpleHBsb2RlJywgJ1Njb3JlIC0gRXhwbG9kZScsIFsnbm9uZScsICdibHVlJywgJ3BpbmsnLCAneWVsbG93JywgJ3JlZCddLCAnbm9uZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBydW4gYXBwbGljYXRpb25cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gY29uc3QgdGltZWxpbmUgPSBuZXcgVGltZWxpbmUoc2hhcmVkUGFyYW1zKTtcbmNvbnN0IGV4cGVyaWVuY2UgPSBuZXcgUGxheWVyRXhwZXJpZW5jZSgncGxheWVyJywgbWlkaUNvbmZpZywgd2lubmVyc1Jlc3VsdHMpO1xuY29uc3QgY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyRXhwZXJpZW5jZSgnY29udHJvbGxlcicpO1xuXG5zb3VuZHdvcmtzLnNlcnZlci5zdGFydCgpO1xuLy8gdGltZWxpbmUuc3RhcnQoKTtcblxuIl19