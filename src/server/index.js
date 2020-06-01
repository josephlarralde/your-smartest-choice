import 'source-map-support/register'; // enable sourcemaps in node
import * as soundworks from 'soundworks/server';
import PlayerExperience from './PlayerExperience';
import ControllerExperience from './ControllerExperience';
import Timeline from './Timeline';

import defaultConfig from './config/default';
import productionConfig from './config/production';

import midiConfig from '../../data/midi-config';

// application services
// import Midi from './services/Midi';

let config = null;

switch(process.env.ENV) {
  case 'production':
    config = productionConfig;
    break;
  default: // @todo - don't forget to uncomment that
    config = defaultConfig;
    // config = productionConfig;
    break;
}

// configure express environment ('production' enables cache systems)
process.env.NODE_ENV = config.env;

soundworks.server.init(config);
soundworks.server.setClientConfigDefinition((clientType, config, httpRequest) => {
  return {
    clientType: clientType,
    env: config.env,
    appName: config.appName,
    websockets: config.websockets,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain,
  };
});


// results in percents at the end of the game
const winnersResults = {
  red: 31.2,
  yellow: 27.6,
  pink: 21.3,
  blue: 19.9,
};

// ----------------------------------------------------
// configure sharedParameters
// ----------------------------------------------------

const sharedParams = soundworks.server.require('shared-params');

sharedParams.addText('numPlayers', '# players', '0');

// --------------------------------------
// globals
// --------------------------------------
sharedParams.addNumber('global:volume', 'Volume', 0, 2, 0.001, 1);
sharedParams.addEnum('global:state', 'State', ['wait', 'empty', 'compass', 'balloonsCover', 'killTheBalloons', 'intermezzo', 'avoidTheRain', 'scores', 'end'], 'wait');
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
sharedParams.addEnum('compass:instructions', 'Compass - instructions', ['none', 'Use the compass to <br> choose the colour'], 'none');
sharedParams.addEnum('compass:enableRandomMIDINotes', 'Compass - enable random MIDI notes', [ 'off', 'on' ], 'off');

// --------------------------------------
// kill the balloons
// --------------------------------------
sharedParams.addText('killTheBalloons:title', '&nbsp;', 'KILL THE BALLOONS');
sharedParams.addEnum('killTheBalloons:samplesSet', 'KillTheBalloons - samplesSet', [0, 1, 2, 3, 4], 0);
sharedParams.addNumber('killTheBalloons:spawnInterval', 'KillTheBalloons - spawnInterval', 0, 10, 0.001, 0.15);
sharedParams.addNumber('killTheBalloons:sizeDiversity', 'KillTheBalloons - sizeDiversity', 0, 1, 0.001, 0);

// sharedParams.addEnum('killTheBalloons:showText', 'KillTheBalloons - showText', ['none', 'On tempo!', 'da da dadada', 'Follow the Rhythm', 'Create a melody'], 'none');
sharedParams.addEnum('killTheBalloons:showText', 'KillTheBalloons - showText', ['none', 'Hit the balloons!', 'Create your rhythm', 'In tempo'], 'none');

sharedParams.addEnum('killTheBalloons:clickColorText', 'killTheBalloons - text "click the"', ['none', 'blue', 'pink', 'yellow', 'red', 'random'], 'none');

// --------------------------------------
// avoid the rain
// --------------------------------------
sharedParams.addText('avoidTheRain:title', '&nbsp;', 'AVOID THE RAIN');
sharedParams.addEnum('avoidTheRain:toggleRain', 'AvoidTheRain - toggleRain', ['stop', 'start'], 'stop');
sharedParams.addEnum('avoidTheRain:harmony', 'AvoidTheRain - harmony', [
  'M15:0', 'M15:1', 'M15:2', 'M15:3',
  'M16:0', 'M16:1', 'M16:2', 'M16:3',
  'M17:0', 'M17:1', 'M17:2', 'M17:3',
  'M18:0', 'M18:1', 'M18:2', 'M18:3',
], 'M15:0');
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

// --------------------------------------
// MIDI
// --------------------------------------
sharedParams.addText('midi:title', '&nbsp;', 'MIDI');
sharedParams.addEnum('midi:note:01', 'MIDI - note 1', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:02', 'MIDI - note 2', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:03', 'MIDI - note 3', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:04', 'MIDI - note 4', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:05', 'MIDI - note 5', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:06', 'MIDI - note 6', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:07', 'MIDI - note 7', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:08', 'MIDI - note 8', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:09', 'MIDI - note 9', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:10', 'MIDI - note 10', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:11', 'MIDI - note 11', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:12', 'MIDI - note 12', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:13', 'MIDI - note 13', ['off', 'on'], 'off');
sharedParams.addEnum('midi:note:14', 'MIDI - note 14', ['off', 'on'], 'off');

// ----------------------------------------------------
// run application
// ----------------------------------------------------

// const timeline = new Timeline(sharedParams);
const experience = new PlayerExperience('player', midiConfig, winnersResults);
const controller = new ControllerExperience('controller');

soundworks.server.start();
