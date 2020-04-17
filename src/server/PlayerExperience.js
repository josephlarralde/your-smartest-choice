import { Experience } from 'soundworks/server';

// server-side 'player' experience.
export default class PlayerExperience extends Experience {
  constructor(clientType, midiConfig, winnersResults, timeline) {
    super(clientType);

    this.checkin = this.require('checkin');
    this.sharedConfig = this.require('shared-config');
    this.sharedParams = this.require('shared-params');
    this.sync = this.require('sync');

    this.audioBufferManager = this.require('audio-buffer-manager');
    this.scheduler = this.require('sync-scheduler');

    // this.midi = this.require('midi', midiConfig);

    this.winnersResults = winnersResults;
    this.timeline = timeline;
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

    this.timeline.start();
    this.timeline.on('index', (index) => {
      console.log(`state index ${index}`);
      this.broadcast('player', null, 'state:index', index);
    });

    this.startTime = this.sync.getSyncTime();
    this.lastTime = this.startTime;
    this.cumulatedTime = 0;
    this.pollInterval = 1;
    this.lastInterval = this.pollInterval;

    this._setTimeout = () => {
      const syncTime = this.sync.getSyncTime();
      const totalTime = syncTime - this.startTime;
      const timelineTotalSecDuration = this.timeline.totalDuration * 0.001;

      if (totalTime >= timelineTotalSecDuration) {
        this.startTime += timelineTotalSecDuration;
        this.cumulatedTime = totalTime - timelineTotalSecDuration;
      }

      const delta = syncTime - this.lastTime;
      let nextInterval = this.pollInterval;

      if (delta < this.lastInterval) {
        nextInterval = this.lastInterval - delta;
      }

      if (delta > this.lastInterval && delta < 2 * this.lastInterval) {
        this.cumulatedTime += this.pollInterval;
        const realTime = syncTime - this.startTime;
        const diff = realTime - this.cumulatedTime;

        nextInterval = this.pollInterval - diff;
        this.lastInterval = nextInterval;
        this.lastTime = syncTime;

        // if (totalTime >= this.timeline.totalDuration) {
        //   this.lastTime
        // }

        this.broadcast('player', null, 'global:time', syncTime, timelineTotalSecDuration - totalTime);
      }

      setTimeout(this._setTimeout, nextInterval);
    };

    this._setTimeout();
  }

  enter(client) {
    super.enter(client);

    // everything is faked now
    this.receive(client, 'player:score', () => {
      this.send(client, 'global:score', this.winnersResults);
    });

    this.sharedParams.update('numPlayers', this.clients.length);

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
