import { Experience } from 'soundworks/server';
import Timeline from './Timeline';

// server-side 'player' experience.
export default class PlayerExperience extends Experience {
  constructor(clientType, midiConfig, winnersResults) {
    super(clientType);

    this.checkin = this.require('checkin');
    this.sharedConfig = this.require('shared-config');
    this.sharedParams = this.require('shared-params');
    this.sync = this.require('sync');

    this.audioBufferManager = this.require('audio-buffer-manager');
    this.scheduler = this.require('sync-scheduler');

    // this.midi = this.require('midi', midiConfig);

    this.winnersResults = winnersResults;
    this.setTimeout = null;
    this.currentState = null;
  }

  start() {
    const keyboardOffset = this.sharedConfig.get('keyboardOffset');
    const BPM = this.sharedConfig.get('BPM');
    const beatDuration = 60 / BPM;

    // this.midi.addListener('NOTE_ON', (pitch, velocity, msg) => {
    //   this.broadcast('player', null, 'note:on', pitch - keyboardOffset);
    //   console.log('NOTE_ON: ' + (pitch - keyboardOffset));
    // });

    // this.midi.addListener('NOTE_OFF', (pitch, velocity, msg) => {
    //   this.broadcast('player', null, 'note:off', pitch - keyboardOffset);
    // });

    // defer state change to next beat
    this.sharedParams.addParamListener('global:state', (value) => {
      const syncTime =  this.sync.getSyncTime();
      const triggerAt = syncTime;// + beatDuration;
      this.currentState = value;
 
      this.broadcast('player', null, 'global:state', triggerAt, value);
    });

    this.timeline = new Timeline(this.sharedParams, this.sync);
    this.timeline.start();
    this.timeline.on('index', (index) => {
      // console.log(`state index ${index}`);
      this.broadcast('player', null, 'state:index', index);
    });

    this.timeline.on('countdown', (timeLeft) => {
      this.broadcast('player', null, 'global:time', timeLeft);
    });
  }

  enter(client) {
    super.enter(client);

    // everything is faked now
    this.receive(client, 'player:score', () => {
      this.send(client, 'global:score', this.winnersResults);
    });

    this.sharedParams.update('numPlayers', this.clients.length);
    this.send(client, 'timeline:position', this.timeline.index, this.timeline.getIndexElapsedTime());
    // this.send(client, 'state:index', this.timeline.index);

    // ugly hack...
    setTimeout(() => {
      this.send(client, 'global:state', null, this.currentState);
    }, 100);
  }

  exit(client) {
    super.exit(client);

    this.sharedParams.update('numPlayers', this.clients.length);
  }
}
