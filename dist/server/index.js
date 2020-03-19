'use strict';

require('source-map-support/register');

var _server = require('soundworks/server');

var soundworks = _interopRequireWildcard(_server);

var _PlayerExperience = require('./PlayerExperience');

var _PlayerExperience2 = _interopRequireDefault(_PlayerExperience);

var _ControllerExperience = require('./ControllerExperience');

var _ControllerExperience2 = _interopRequireDefault(_ControllerExperience);

var _default = require('./config/default');

var _default2 = _interopRequireDefault(_default);

var _production = require('./config/production');

var _production2 = _interopRequireDefault(_production);

var _midiConfig = require('../../data/midi-config');

var _midiConfig2 = _interopRequireDefault(_midiConfig);

var _Midi = require('./services/Midi');

var _Midi2 = _interopRequireDefault(_Midi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var config = null;

// application services
// enable sourcemaps in node


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
sharedParams.addEnum('compass:instructions', 'Compass - instructions', ['none', 'Walk around', 'Stand still', 'Be quite', 'Listen around'], 'none');

// --------------------------------------
// kill the balloons
// --------------------------------------
sharedParams.addText('killTheBalloons:title', '&nbsp;', 'KILL THE BALLOONS');
sharedParams.addEnum('killTheBalloons:samplesSet', 'KillTheBalloons - samplesSet', [0, 1, 2, 3, 4], 0);
sharedParams.addNumber('killTheBalloons:spawnInterval', 'KillTheBalloons - spawnInterval', 0, 10, 0.001, 0.15);
sharedParams.addNumber('killTheBalloons:sizeDiversity', 'KillTheBalloons - sizeDiversity', 0, 1, 0.001, 0);

sharedParams.addEnum('killTheBalloons:showText', 'KillTheBalloons - showText', ['none', 'On tempo!', 'da da dadada', 'Follow the Rhythm', 'Create a melody'], 'none');

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

var experience = new _PlayerExperience2.default('player', _midiConfig2.default, winnersResults);
var controller = new _ControllerExperience2.default('controller');

soundworks.server.start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJjb25maWciLCJwcm9jZXNzIiwiZW52IiwiRU5WIiwicHJvZHVjdGlvbkNvbmZpZyIsImRlZmF1bHRDb25maWciLCJOT0RFX0VOViIsInNlcnZlciIsImluaXQiLCJzZXRDbGllbnRDb25maWdEZWZpbml0aW9uIiwiY2xpZW50VHlwZSIsImh0dHBSZXF1ZXN0IiwiYXBwTmFtZSIsIndlYnNvY2tldHMiLCJ2ZXJzaW9uIiwiZGVmYXVsdFR5cGUiLCJkZWZhdWx0Q2xpZW50IiwiYXNzZXRzRG9tYWluIiwid2lubmVyc1Jlc3VsdHMiLCJyZWQiLCJ5ZWxsb3ciLCJwaW5rIiwiYmx1ZSIsInNoYXJlZFBhcmFtcyIsInJlcXVpcmUiLCJhZGRUZXh0IiwiYWRkTnVtYmVyIiwiYWRkRW51bSIsImV4cGVyaWVuY2UiLCJQbGF5ZXJFeHBlcmllbmNlIiwibWlkaUNvbmZpZyIsImNvbnRyb2xsZXIiLCJDb250cm9sbGVyRXhwZXJpZW5jZSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFHQTs7Ozs7Ozs7QUFFQSxJQUFJQyxTQUFTLElBQWI7O0FBSEE7QUFWc0M7OztBQWV0QyxRQUFPQyxRQUFRQyxHQUFSLENBQVlDLEdBQW5CO0FBQ0UsT0FBSyxZQUFMO0FBQ0VILGFBQVNJLG9CQUFUO0FBQ0E7QUFDRjtBQUFTO0FBQ1BKLGFBQVNLLGlCQUFUO0FBQ0E7QUFDQTtBQVBKOztBQVVBO0FBQ0FKLFFBQVFDLEdBQVIsQ0FBWUksUUFBWixHQUF1Qk4sT0FBT0UsR0FBOUI7O0FBRUFILFdBQVdRLE1BQVgsQ0FBa0JDLElBQWxCLENBQXVCUixNQUF2QjtBQUNBRCxXQUFXUSxNQUFYLENBQWtCRSx5QkFBbEIsQ0FBNEMsVUFBQ0MsVUFBRCxFQUFhVixNQUFiLEVBQXFCVyxXQUFyQixFQUFxQztBQUMvRSxTQUFP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RCxFQUFTLE1BQVQsQ0FBekUsRUFBMkYsTUFBM0Y7QUFDQUosYUFBYUcsU0FBYixDQUF1QiwyQkFBdkIsRUFBb0QsK0JBQXBELEVBQXFGLENBQXJGLEVBQXdGLENBQXhGLEVBQTJGLElBQTNGLEVBQWlHLENBQWpHO0FBQ0FILGFBQWFHLFNBQWIsQ0FBdUIsMkJBQXZCLEVBQW9ELCtCQUFwRCxFQUFxRixDQUFyRixFQUF3RixDQUF4RixFQUEyRixJQUEzRixFQUFpRyxDQUFqRztBQUNBSCxhQUFhRyxTQUFiLENBQXVCLDZCQUF2QixFQUFzRCxpQ0FBdEQsRUFBeUYsQ0FBekYsRUFBNEYsQ0FBNUYsRUFBK0YsSUFBL0YsRUFBcUcsQ0FBckc7QUFDQUgsYUFBYUcsU0FBYixDQUF1QiwwQkFBdkIsRUFBbUQsOEJBQW5ELEVBQW1GLENBQW5GLEVBQXNGLENBQXRGLEVBQXlGLElBQXpGLEVBQStGLENBQS9GO0FBQ0FILGFBQWFJLE9BQWIsQ0FBcUIsZUFBckIsRUFBc0MsaUJBQXRDLEVBQXlELENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsRUFBeUIsUUFBekIsRUFBbUMsS0FBbkMsQ0FBekQsRUFBb0csTUFBcEc7O0FBR0E7QUFDQTtBQUNBOztBQUVBLElBQU1DLGFBQWEsSUFBSUMsMEJBQUosQ0FBcUIsUUFBckIsRUFBK0JDLG9CQUEvQixFQUEyQ1osY0FBM0MsQ0FBbkI7QUFDQSxJQUFNYSxhQUFhLElBQUlDLDhCQUFKLENBQXlCLFlBQXpCLENBQW5COztBQUVBakMsV0FBV1EsTUFBWCxDQUFrQjBCLEtBQWxCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInOyAvLyBlbmFibGUgc291cmNlbWFwcyBpbiBub2RlXG5pbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcbmltcG9ydCBQbGF5ZXJFeHBlcmllbmNlIGZyb20gJy4vUGxheWVyRXhwZXJpZW5jZSc7XG5pbXBvcnQgQ29udHJvbGxlckV4cGVyaWVuY2UgZnJvbSAnLi9Db250cm9sbGVyRXhwZXJpZW5jZSc7XG5cbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gJy4vY29uZmlnL2RlZmF1bHQnO1xuaW1wb3J0IHByb2R1Y3Rpb25Db25maWcgZnJvbSAnLi9jb25maWcvcHJvZHVjdGlvbic7XG5cbmltcG9ydCBtaWRpQ29uZmlnIGZyb20gJy4uLy4uL2RhdGEvbWlkaS1jb25maWcnO1xuXG4vLyBhcHBsaWNhdGlvbiBzZXJ2aWNlc1xuaW1wb3J0IE1pZGkgZnJvbSAnLi9zZXJ2aWNlcy9NaWRpJztcblxubGV0IGNvbmZpZyA9IG51bGw7XG5cbnN3aXRjaChwcm9jZXNzLmVudi5FTlYpIHtcbiAgY2FzZSAncHJvZHVjdGlvbic6XG4gICAgY29uZmlnID0gcHJvZHVjdGlvbkNvbmZpZztcbiAgICBicmVhaztcbiAgZGVmYXVsdDogLy8gQHRvZG8gLSBkb24ndCBmb3JnZXQgdG8gdW5jb21tZW50IHRoYXRcbiAgICBjb25maWcgPSBkZWZhdWx0Q29uZmlnO1xuICAgIC8vIGNvbmZpZyA9IHByb2R1Y3Rpb25Db25maWc7XG4gICAgYnJlYWs7XG59XG5cbi8vIGNvbmZpZ3VyZSBleHByZXNzIGVudmlyb25tZW50ICgncHJvZHVjdGlvbicgZW5hYmxlcyBjYWNoZSBzeXN0ZW1zKVxucHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBjb25maWcuZW52O1xuXG5zb3VuZHdvcmtzLnNlcnZlci5pbml0KGNvbmZpZyk7XG5zb3VuZHdvcmtzLnNlcnZlci5zZXRDbGllbnRDb25maWdEZWZpbml0aW9uKChjbGllbnRUeXBlLCBjb25maWcsIGh0dHBSZXF1ZXN0KSA9PiB7XG4gIHJldHVybiB7XG4gICAgY2xpZW50VHlwZTogY2xpZW50VHlwZSxcbiAgICBlbnY6IGNvbmZpZy5lbnYsXG4gICAgYXBwTmFtZTogY29uZmlnLmFwcE5hbWUsXG4gICAgd2Vic29ja2V0czogY29uZmlnLndlYnNvY2tldHMsXG4gICAgdmVyc2lvbjogY29uZmlnLnZlcnNpb24sXG4gICAgZGVmYXVsdFR5cGU6IGNvbmZpZy5kZWZhdWx0Q2xpZW50LFxuICAgIGFzc2V0c0RvbWFpbjogY29uZmlnLmFzc2V0c0RvbWFpbixcbiAgfTtcbn0pO1xuXG5cbi8vIHJlc3VsdHMgaW4gcGVyY2VudHMgYXQgdGhlIGVuZCBvZiB0aGUgZ2FtZVxuY29uc3Qgd2lubmVyc1Jlc3VsdHMgPSB7XG4gIHJlZDogMzEuMixcbiAgeWVsbG93OiAyNy42LFxuICBwaW5rOiAyMS4zLFxuICBibHVlOiAxOS45LFxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gY29uZmlndXJlIHNoYXJlZFBhcmFtZXRlcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3Qgc2hhcmVkUGFyYW1zID0gc291bmR3b3Jrcy5zZXJ2ZXIucmVxdWlyZSgnc2hhcmVkLXBhcmFtcycpO1xuXG5zaGFyZWRQYXJhbXMuYWRkVGV4dCgnbnVtUGxheWVycycsICcjIHBsYXllcnMnLCAnMCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gZ2xvYmFsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ2dsb2JhbDp2b2x1bWUnLCAnVm9sdW1lJywgMCwgMiwgMC4wMDEsIDEpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2dsb2JhbDpzdGF0ZScsICdTdGF0ZScsIFsnd2FpdCcsICdjb21wYXNzJywgJ2JhbGxvb25zQ292ZXInLCAna2lsbFRoZUJhbGxvb25zJywgJ2ludGVybWV6em8nLCAnYXZvaWRUaGVSYWluJywgJ3Njb3JlcycsICdlbmQnXSwgJ3dhaXQnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGJhbGxvb24gY292ZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zaGFyZWRQYXJhbXMuYWRkVGV4dCgnYmFsbG9vbkNvdmVyOnRpdGxlJywgJyZuYnNwOycsICdCQUxMT09OUyBDT1ZFUicpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2JhbGxvb25Db3ZlcjpleHBsb2RlJywgJ0JhbGxvb25Db3ZlciAtIGV4cGxvZGUnLCBbJ25vbmUnLCAnYmx1ZScsICdwaW5rJywgJ3llbGxvdycsICdyZWQnXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHNoYXJlZCB2aXN1YWxcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBzaGFyZWRQYXJhbXMuYWRkRW51bSgnZ2xvYmFsOnNoYXJlZC12aXN1YWwnLCAnU2hhcmVkIFZpc3VhbCAtIEFkZCcsIFsnbm9uZScsICdnaWY6ZXhwbG9kaW5nQmFsbG9vbicsICdnaWY6Zmx5aW5nQmFsbG9vbnMnXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGJhbGxvb24gY292ZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zaGFyZWRQYXJhbXMuYWRkVGV4dCgnY29tcGFzczp0aXRsZScsICcmbmJzcDsnLCAnQ09NUEFTUycpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2NvbXBhc3M6aW5zdHJ1Y3Rpb25zJywgJ0NvbXBhc3MgLSBpbnN0cnVjdGlvbnMnLCBbJ25vbmUnLCAnV2FsayBhcm91bmQnLCAnU3RhbmQgc3RpbGwnLCAnQmUgcXVpdGUnLCAnTGlzdGVuIGFyb3VuZCddLCAnbm9uZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8ga2lsbCB0aGUgYmFsbG9vbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zaGFyZWRQYXJhbXMuYWRkVGV4dCgna2lsbFRoZUJhbGxvb25zOnRpdGxlJywgJyZuYnNwOycsICdLSUxMIFRIRSBCQUxMT09OUycpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2tpbGxUaGVCYWxsb29uczpzYW1wbGVzU2V0JywgJ0tpbGxUaGVCYWxsb29ucyAtIHNhbXBsZXNTZXQnLCBbMCwgMSwgMiwgMywgNF0sIDApO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcigna2lsbFRoZUJhbGxvb25zOnNwYXduSW50ZXJ2YWwnLCAnS2lsbFRoZUJhbGxvb25zIC0gc3Bhd25JbnRlcnZhbCcsIDAsIDEwLCAwLjAwMSwgMC4xNSk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdraWxsVGhlQmFsbG9vbnM6c2l6ZURpdmVyc2l0eScsICdLaWxsVGhlQmFsbG9vbnMgLSBzaXplRGl2ZXJzaXR5JywgMCwgMSwgMC4wMDEsIDApO1xuXG5zaGFyZWRQYXJhbXMuYWRkRW51bSgna2lsbFRoZUJhbGxvb25zOnNob3dUZXh0JywgJ0tpbGxUaGVCYWxsb29ucyAtIHNob3dUZXh0JywgWydub25lJywgJ09uIHRlbXBvIScsICdkYSBkYSBkYWRhZGEnLCAnRm9sbG93IHRoZSBSaHl0aG0nLCAnQ3JlYXRlIGEgbWVsb2R5J10sICdub25lJyk7XG5cbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdraWxsVGhlQmFsbG9vbnM6Y2xpY2tDb2xvclRleHQnLCAna2lsbFRoZUJhbGxvb25zIC0gdGV4dCBcImNsaWNrIHRoZVwiJywgWydub25lJywgJ2JsdWUnLCAncGluaycsICd5ZWxsb3cnLCAncmVkJywgJ3JhbmRvbSddLCAnbm9uZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYXZvaWQgdGhlIHJhaW5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zaGFyZWRQYXJhbXMuYWRkVGV4dCgnYXZvaWRUaGVSYWluOnRpdGxlJywgJyZuYnNwOycsICdBVk9JRCBUSEUgUkFJTicpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2F2b2lkVGhlUmFpbjp0b2dnbGVSYWluJywgJ0F2b2lkVGhlUmFpbiAtIHRvZ2dsZVJhaW4nLCBbJ3N0b3AnLCAnc3RhcnQnXSwgJ3N0b3AnKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdhdm9pZFRoZVJhaW46aGFybW9ueScsICdBdm9pZFRoZVJhaW4gLSBoYXJtb255JywgW1xuICAnTTE1OjAnLCAnTTE1OjEnLCAnTTE1OjInLCAnTTE1OjMnLFxuICAnTTE2OjAnLCAnTTE2OjEnLCAnTTE2OjInLCAnTTE2OjMnLFxuICAnTTE3OjAnLCAnTTE3OjEnLCAnTTE3OjInLCAnTTE3OjMnLFxuICAnTTE4OjAnLCAnTTE4OjEnLCAnTTE4OjInLCAnTTE4OjMnLFxuXSwgJ00xNTowJyk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdhdm9pZFRoZVJhaW46c2luZVZvbHVtZScsICdBdm9pZFRoZVJhaW4gLSBzaW5lVm9sdW1lJywgMCwgMSwgMC4wMSwgMSk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdhdm9pZFRoZVJhaW46YmFsbG9vblJhZGl1cycsICdBdm9pZFRoZVJhaW4gLSBiYWxsb29uUmFkaXVzJywgNDAsIDIwMCwgMSwgNDApO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignYXZvaWRUaGVSYWluOnNwYXduSW50ZXJ2YWwnLCAnQXZvaWRUaGVSYWluIC0gc3Bhd25JbnRlcnZhbCcsIDAsIDEsIDAuMDAxLCAxKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdhdm9pZFRoZVJhaW46c2hvd1RleHQnLCAnQXZvaWRUaGVSYWluIC0gc2hvd1RleHQnLCBbJ25vbmUnLCAnZmx5J10sICdub25lJyk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnYXZvaWRUaGVSYWluOmdvVG9UZXh0JywgJ0F2b2lkVGhlUmFpbiAtIHRleHQgXCJnbyB0b1wiJywgWydub25lJywgJ3JhbmRvbSddLCAnbm9uZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gc2NvcmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zaGFyZWRQYXJhbXMuYWRkVGV4dCgnc2NvcmU6dGl0bGUnLCAnJm5ic3A7JywgJ0ZJTkFMIFNDT1JFJyk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnc2NvcmU6c2hvd0dsb2JhbFNjb3JlJywgJ1Njb3JlIC0gc2hvd0dsb2JhbFNjb3JlJywgWydoaWRlJywgJ3Nob3cnXSwgJ2hpZGUnKTtcbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ3Njb3JlOmJsdWU6dHJhbnNmZXJ0UmF0aW8nLCAnU2NvcmUgLSBCbHVlIC0gdHJhbnNmZXJ0UmF0aW8nLCAwLCAxLCAwLjAxLCAwKTtcbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ3Njb3JlOnBpbms6dHJhbnNmZXJ0UmF0aW8nLCAnU2NvcmUgLSBQaW5rIC0gdHJhbnNmZXJ0UmF0aW8nLCAwLCAxLCAwLjAxLCAwKTtcbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ3Njb3JlOnllbGxvdzp0cmFuc2ZlcnRSYXRpbycsICdTY29yZSAtIFllbGxvdyAtIHRyYW5zZmVydFJhdGlvJywgMCwgMSwgMC4wMSwgMCk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdzY29yZTpyZWQ6dHJhbnNmZXJ0UmF0aW8nLCAnU2NvcmUgLSBSZWQgLSB0cmFuc2ZlcnRSYXRpbycsIDAsIDEsIDAuMDEsIDApO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ3Njb3JlOmV4cGxvZGUnLCAnU2NvcmUgLSBFeHBsb2RlJywgWydub25lJywgJ2JsdWUnLCAncGluaycsICd5ZWxsb3cnLCAncmVkJ10sICdub25lJyk7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcnVuIGFwcGxpY2F0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IGV4cGVyaWVuY2UgPSBuZXcgUGxheWVyRXhwZXJpZW5jZSgncGxheWVyJywgbWlkaUNvbmZpZywgd2lubmVyc1Jlc3VsdHMpO1xuY29uc3QgY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyRXhwZXJpZW5jZSgnY29udHJvbGxlcicpO1xuXG5zb3VuZHdvcmtzLnNlcnZlci5zdGFydCgpO1xuIl19