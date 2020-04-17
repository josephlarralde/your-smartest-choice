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
sharedParams.addEnum('compass:instructions', 'Compass - instructions', ['none', 'Walk around', 'Stand still', 'Be quiet', 'Listen around'], 'none');

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

var timeline = new _Timeline2.default(sharedParams);
var experience = new _PlayerExperience2.default('player', _midiConfig2.default, winnersResults, timeline);
var controller = new _ControllerExperience2.default('controller');

soundworks.server.start();
// timeline.start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNvdW5kd29ya3MiLCJjb25maWciLCJwcm9jZXNzIiwiZW52IiwiRU5WIiwicHJvZHVjdGlvbkNvbmZpZyIsImRlZmF1bHRDb25maWciLCJOT0RFX0VOViIsInNlcnZlciIsImluaXQiLCJzZXRDbGllbnRDb25maWdEZWZpbml0aW9uIiwiY2xpZW50VHlwZSIsImh0dHBSZXF1ZXN0IiwiYXBwTmFtZSIsIndlYnNvY2tldHMiLCJ2ZXJzaW9uIiwiZGVmYXVsdFR5cGUiLCJkZWZhdWx0Q2xpZW50IiwiYXNzZXRzRG9tYWluIiwid2lubmVyc1Jlc3VsdHMiLCJyZWQiLCJ5ZWxsb3ciLCJwaW5rIiwiYmx1ZSIsInNoYXJlZFBhcmFtcyIsInJlcXVpcmUiLCJhZGRUZXh0IiwiYWRkTnVtYmVyIiwiYWRkRW51bSIsIkluZmluaXR5IiwidGltZWxpbmUiLCJUaW1lbGluZSIsImV4cGVyaWVuY2UiLCJQbGF5ZXJFeHBlcmllbmNlIiwibWlkaUNvbmZpZyIsImNvbnRyb2xsZXIiLCJDb250cm9sbGVyRXhwZXJpZW5jZSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7QUFFQTtBQUNBOztBQUVBLElBQUlDLFNBQVMsSUFBYixDLENBZHNDOzs7QUFnQnRDLFFBQU9DLFFBQVFDLEdBQVIsQ0FBWUMsR0FBbkI7QUFDRSxPQUFLLFlBQUw7QUFDRUgsYUFBU0ksb0JBQVQ7QUFDQTtBQUNGO0FBQVM7QUFDUEosYUFBU0ssaUJBQVQ7QUFDQTtBQUNBO0FBUEo7O0FBVUE7QUFDQUosUUFBUUMsR0FBUixDQUFZSSxRQUFaLEdBQXVCTixPQUFPRSxHQUE5Qjs7QUFFQUgsV0FBV1EsTUFBWCxDQUFrQkMsSUFBbEIsQ0FBdUJSLE1BQXZCO0FBQ0FELFdBQVdRLE1BQVgsQ0FBa0JFLHlCQUFsQixDQUE0QyxVQUFDQyxVQUFE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cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJzsgLy8gZW5hYmxlIHNvdXJjZW1hcHMgaW4gbm9kZVxuaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL3NlcnZlcic7XG5pbXBvcnQgUGxheWVyRXhwZXJpZW5jZSBmcm9tICcuL1BsYXllckV4cGVyaWVuY2UnO1xuaW1wb3J0IENvbnRyb2xsZXJFeHBlcmllbmNlIGZyb20gJy4vQ29udHJvbGxlckV4cGVyaWVuY2UnO1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4vVGltZWxpbmUnO1xuXG5pbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tICcuL2NvbmZpZy9kZWZhdWx0JztcbmltcG9ydCBwcm9kdWN0aW9uQ29uZmlnIGZyb20gJy4vY29uZmlnL3Byb2R1Y3Rpb24nO1xuXG5pbXBvcnQgbWlkaUNvbmZpZyBmcm9tICcuLi8uLi9kYXRhL21pZGktY29uZmlnJztcblxuLy8gYXBwbGljYXRpb24gc2VydmljZXNcbi8vIGltcG9ydCBNaWRpIGZyb20gJy4vc2VydmljZXMvTWlkaSc7XG5cbmxldCBjb25maWcgPSBudWxsO1xuXG5zd2l0Y2gocHJvY2Vzcy5lbnYuRU5WKSB7XG4gIGNhc2UgJ3Byb2R1Y3Rpb24nOlxuICAgIGNvbmZpZyA9IHByb2R1Y3Rpb25Db25maWc7XG4gICAgYnJlYWs7XG4gIGRlZmF1bHQ6IC8vIEB0b2RvIC0gZG9uJ3QgZm9yZ2V0IHRvIHVuY29tbWVudCB0aGF0XG4gICAgY29uZmlnID0gZGVmYXVsdENvbmZpZztcbiAgICAvLyBjb25maWcgPSBwcm9kdWN0aW9uQ29uZmlnO1xuICAgIGJyZWFrO1xufVxuXG4vLyBjb25maWd1cmUgZXhwcmVzcyBlbnZpcm9ubWVudCAoJ3Byb2R1Y3Rpb24nIGVuYWJsZXMgY2FjaGUgc3lzdGVtcylcbnByb2Nlc3MuZW52Lk5PREVfRU5WID0gY29uZmlnLmVudjtcblxuc291bmR3b3Jrcy5zZXJ2ZXIuaW5pdChjb25maWcpO1xuc291bmR3b3Jrcy5zZXJ2ZXIuc2V0Q2xpZW50Q29uZmlnRGVmaW5pdGlvbigoY2xpZW50VHlwZSwgY29uZmlnLCBodHRwUmVxdWVzdCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGNsaWVudFR5cGU6IGNsaWVudFR5cGUsXG4gICAgZW52OiBjb25maWcuZW52LFxuICAgIGFwcE5hbWU6IGNvbmZpZy5hcHBOYW1lLFxuICAgIHdlYnNvY2tldHM6IGNvbmZpZy53ZWJzb2NrZXRzLFxuICAgIHZlcnNpb246IGNvbmZpZy52ZXJzaW9uLFxuICAgIGRlZmF1bHRUeXBlOiBjb25maWcuZGVmYXVsdENsaWVudCxcbiAgICBhc3NldHNEb21haW46IGNvbmZpZy5hc3NldHNEb21haW4sXG4gIH07XG59KTtcblxuXG4vLyByZXN1bHRzIGluIHBlcmNlbnRzIGF0IHRoZSBlbmQgb2YgdGhlIGdhbWVcbmNvbnN0IHdpbm5lcnNSZXN1bHRzID0ge1xuICByZWQ6IDMxLjIsXG4gIHllbGxvdzogMjcuNixcbiAgcGluazogMjEuMyxcbiAgYmx1ZTogMTkuOSxcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbmZpZ3VyZSBzaGFyZWRQYXJhbWV0ZXJzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IHNoYXJlZFBhcmFtcyA9IHNvdW5kd29ya3Muc2VydmVyLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcblxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ251bVBsYXllcnMnLCAnIyBwbGF5ZXJzJywgJzAnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGdsb2JhbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdnbG9iYWw6dm9sdW1lJywgJ1ZvbHVtZScsIDAsIDIsIDAuMDAxLCAxKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdnbG9iYWw6c3RhdGUnLCAnU3RhdGUnLCBbJ3dhaXQnLCAnY29tcGFzcycsICdiYWxsb29uc0NvdmVyJywgJ2tpbGxUaGVCYWxsb29ucycsICdpbnRlcm1lenpvJywgJ2F2b2lkVGhlUmFpbicsICdzY29yZXMnLCAnZW5kJ10sICd3YWl0Jyk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdnbG9iYWw6dGltZScsICdUaW1lJywgMCwgK0luZmluaXR5LCAwLjAwMSwgMCk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBiYWxsb29uIGNvdmVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ2JhbGxvb25Db3Zlcjp0aXRsZScsICcmbmJzcDsnLCAnQkFMTE9PTlMgQ09WRVInKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdiYWxsb29uQ292ZXI6ZXhwbG9kZScsICdCYWxsb29uQ292ZXIgLSBleHBsb2RlJywgWydub25lJywgJ2JsdWUnLCAncGluaycsICd5ZWxsb3cnLCAncmVkJ10sICdub25lJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBzaGFyZWQgdmlzdWFsXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2dsb2JhbDpzaGFyZWQtdmlzdWFsJywgJ1NoYXJlZCBWaXN1YWwgLSBBZGQnLCBbJ25vbmUnLCAnZ2lmOmV4cGxvZGluZ0JhbGxvb24nLCAnZ2lmOmZseWluZ0JhbGxvb25zJ10sICdub25lJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBiYWxsb29uIGNvdmVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ2NvbXBhc3M6dGl0bGUnLCAnJm5ic3A7JywgJ0NPTVBBU1MnKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdjb21wYXNzOmluc3RydWN0aW9ucycsICdDb21wYXNzIC0gaW5zdHJ1Y3Rpb25zJywgWydub25lJywgJ1dhbGsgYXJvdW5kJywgJ1N0YW5kIHN0aWxsJywgJ0JlIHF1aWV0JywgJ0xpc3RlbiBhcm91bmQnXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGtpbGwgdGhlIGJhbGxvb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ2tpbGxUaGVCYWxsb29uczp0aXRsZScsICcmbmJzcDsnLCAnS0lMTCBUSEUgQkFMTE9PTlMnKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdraWxsVGhlQmFsbG9vbnM6c2FtcGxlc1NldCcsICdLaWxsVGhlQmFsbG9vbnMgLSBzYW1wbGVzU2V0JywgWzAsIDEsIDIsIDMsIDRdLCAwKTtcbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ2tpbGxUaGVCYWxsb29uczpzcGF3bkludGVydmFsJywgJ0tpbGxUaGVCYWxsb29ucyAtIHNwYXduSW50ZXJ2YWwnLCAwLCAxMCwgMC4wMDEsIDAuMTUpO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcigna2lsbFRoZUJhbGxvb25zOnNpemVEaXZlcnNpdHknLCAnS2lsbFRoZUJhbGxvb25zIC0gc2l6ZURpdmVyc2l0eScsIDAsIDEsIDAuMDAxLCAwKTtcblxuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2tpbGxUaGVCYWxsb29uczpzaG93VGV4dCcsICdLaWxsVGhlQmFsbG9vbnMgLSBzaG93VGV4dCcsIFsnbm9uZScsICdPbiB0ZW1wbyEnLCAnZGEgZGEgZGFkYWRhJywgJ0ZvbGxvdyB0aGUgUmh5dGhtJywgJ0NyZWF0ZSBhIG1lbG9keSddLCAnbm9uZScpO1xuXG5zaGFyZWRQYXJhbXMuYWRkRW51bSgna2lsbFRoZUJhbGxvb25zOmNsaWNrQ29sb3JUZXh0JywgJ2tpbGxUaGVCYWxsb29ucyAtIHRleHQgXCJjbGljayB0aGVcIicsIFsnbm9uZScsICdibHVlJywgJ3BpbmsnLCAneWVsbG93JywgJ3JlZCcsICdyYW5kb20nXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGF2b2lkIHRoZSByYWluXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ2F2b2lkVGhlUmFpbjp0aXRsZScsICcmbmJzcDsnLCAnQVZPSUQgVEhFIFJBSU4nKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdhdm9pZFRoZVJhaW46dG9nZ2xlUmFpbicsICdBdm9pZFRoZVJhaW4gLSB0b2dnbGVSYWluJywgWydzdG9wJywgJ3N0YXJ0J10sICdzdG9wJyk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnYXZvaWRUaGVSYWluOmhhcm1vbnknLCAnQXZvaWRUaGVSYWluIC0gaGFybW9ueScsIFtcbiAgJ00xNTowJywgJ00xNToxJywgJ00xNToyJywgJ00xNTozJyxcbiAgJ00xNjowJywgJ00xNjoxJywgJ00xNjoyJywgJ00xNjozJyxcbiAgJ00xNzowJywgJ00xNzoxJywgJ00xNzoyJywgJ00xNzozJyxcbiAgJ00xODowJywgJ00xODoxJywgJ00xODoyJywgJ00xODozJyxcbl0sICdNMTU6MCcpO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignYXZvaWRUaGVSYWluOnNpbmVWb2x1bWUnLCAnQXZvaWRUaGVSYWluIC0gc2luZVZvbHVtZScsIDAsIDEsIDAuMDEsIDEpO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignYXZvaWRUaGVSYWluOmJhbGxvb25SYWRpdXMnLCAnQXZvaWRUaGVSYWluIC0gYmFsbG9vblJhZGl1cycsIDQwLCAyMDAsIDEsIDQwKTtcbnNoYXJlZFBhcmFtcy5hZGROdW1iZXIoJ2F2b2lkVGhlUmFpbjpzcGF3bkludGVydmFsJywgJ0F2b2lkVGhlUmFpbiAtIHNwYXduSW50ZXJ2YWwnLCAwLCAxLCAwLjAwMSwgMSk7XG5zaGFyZWRQYXJhbXMuYWRkRW51bSgnYXZvaWRUaGVSYWluOnNob3dUZXh0JywgJ0F2b2lkVGhlUmFpbiAtIHNob3dUZXh0JywgWydub25lJywgJ2ZseSddLCAnbm9uZScpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ2F2b2lkVGhlUmFpbjpnb1RvVGV4dCcsICdBdm9pZFRoZVJhaW4gLSB0ZXh0IFwiZ28gdG9cIicsIFsnbm9uZScsICdyYW5kb20nXSwgJ25vbmUnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHNjb3JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hhcmVkUGFyYW1zLmFkZFRleHQoJ3Njb3JlOnRpdGxlJywgJyZuYnNwOycsICdGSU5BTCBTQ09SRScpO1xuc2hhcmVkUGFyYW1zLmFkZEVudW0oJ3Njb3JlOnNob3dHbG9iYWxTY29yZScsICdTY29yZSAtIHNob3dHbG9iYWxTY29yZScsIFsnaGlkZScsICdzaG93J10sICdoaWRlJyk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdzY29yZTpibHVlOnRyYW5zZmVydFJhdGlvJywgJ1Njb3JlIC0gQmx1ZSAtIHRyYW5zZmVydFJhdGlvJywgMCwgMSwgMC4wMSwgMCk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdzY29yZTpwaW5rOnRyYW5zZmVydFJhdGlvJywgJ1Njb3JlIC0gUGluayAtIHRyYW5zZmVydFJhdGlvJywgMCwgMSwgMC4wMSwgMCk7XG5zaGFyZWRQYXJhbXMuYWRkTnVtYmVyKCdzY29yZTp5ZWxsb3c6dHJhbnNmZXJ0UmF0aW8nLCAnU2NvcmUgLSBZZWxsb3cgLSB0cmFuc2ZlcnRSYXRpbycsIDAsIDEsIDAuMDEsIDApO1xuc2hhcmVkUGFyYW1zLmFkZE51bWJlcignc2NvcmU6cmVkOnRyYW5zZmVydFJhdGlvJywgJ1Njb3JlIC0gUmVkIC0gdHJhbnNmZXJ0UmF0aW8nLCAwLCAxLCAwLjAxLCAwKTtcbnNoYXJlZFBhcmFtcy5hZGRFbnVtKCdzY29yZTpleHBsb2RlJywgJ1Njb3JlIC0gRXhwbG9kZScsIFsnbm9uZScsICdibHVlJywgJ3BpbmsnLCAneWVsbG93JywgJ3JlZCddLCAnbm9uZScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBydW4gYXBwbGljYXRpb25cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgdGltZWxpbmUgPSBuZXcgVGltZWxpbmUoc2hhcmVkUGFyYW1zKTtcbmNvbnN0IGV4cGVyaWVuY2UgPSBuZXcgUGxheWVyRXhwZXJpZW5jZSgncGxheWVyJywgbWlkaUNvbmZpZywgd2lubmVyc1Jlc3VsdHMsIHRpbWVsaW5lKTtcbmNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlckV4cGVyaWVuY2UoJ2NvbnRyb2xsZXInKTtcblxuc291bmR3b3Jrcy5zZXJ2ZXIuc3RhcnQoKTtcbi8vIHRpbWVsaW5lLnN0YXJ0KCk7XG5cbiJdfQ==