import EventEmitter from 'events';

// possible states :
// 'wait', 'compass', 'balloonsCover', 'killTheBalloons', 'intermezzo', 'avoidTheRain'

const timeline = [
  {
    id: '0_beginning',
    start: 0,
    end: 20000,
    state: 'empty',
    events: [],
  },
  {
    id: '1_compass',
    // start: 0,
    // end: 41219,
    start: 20000,
    end: 61219,
    state: 'compass',
    events: [
      {
        name: 'compass:instructions',
        value: 'Use the compass to <br> choose the colour',
      },
      {
        name: 'compass:enableRandomMIDINotes',
        value: 'on',
      },
    ],
  },
  {
    id: '2_killtheballoon_intro',
    // start: 41219,
    // end: 114570, // 1'54.570
    start: 61219,
    end: 134570, // 1'54.570
    state: 'killTheBalloons',
    events: [
      {
        name: 'compass:enableRandomMIDINotes',
        value: 'off',
      },
      {
        name: 'killTheBalloons:showText',
        value: 'Hit the balloons!',
      },
      {
        name: 'killTheBalloons:clickColorText',
        value: 'none',
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.15, // a lot of balloons
      },
      {
        name: 'killTheBalloons:sizeDiversity',
        value: 0,
      },
      {
        name: 'killTheBalloons:showText',
        value: 'none',
        delay: 3000,
      },
      // NEXT CUE
      {
        name: 'killTheBalloons:spawnInterval',
        value: 1.5,
        delay: 21475,
      },
      // NEXT CUE
      {
        name: 'killTheBalloons:showText',
        value: 'Create your rhythm',
        delay: 29270,
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.6,
        delay: 29270,
      },
      // NEXT CUE
      {
        name: 'killTheBalloons:samplesSet',
        value: 1,
        delay: 33175,
      },
      // NEXT CUE
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.15,
        delay: 43245,
      },
      {
        name: 'killTheBalloons:sizeDiversity',
        value: 1,
        delay: 43245,
      },
      // NEXT CUE
      {
        name: 'killTheBalloons:samplesSet',
        value: 3,
        delay: 47867,
      },
      // NEXT CUE
      {
        name: 'killTheBalloons:showText',
        value: 'none', // 'Random colour',
        delay: 69322,
      },
      {
        name: 'killTheBalloons:clickColorText',
        value: 'random',
        delay: 69322,
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.33,
        delay: 69322,
      },
    ],
  },
// ];

// const machin = [
  {
    id: '3_killtheballoon_intempo',
    // start: 114570,
    // end: 163823, // 2'43.823
    start: 134570,
    end: 183823, // 2'43.823
    state: 'killTheBalloons',
    events: [
      {
        name: 'killTheBalloons:showText',
        value: 'In tempo',
      },
      {
        name: 'killTheBalloons:clickColorText',
        value: 'none',
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.5,
      },
      {
        name: 'killTheBalloons:samplesSet',
        value: 0,
      },
      {
        name: 'killTheBalloons:sizeDiversity',
        value: 0,
      },
      // {
      //   name: 'killTheBalloons:showText',
      //   value: 'none',
      //   delay: 3000,
      // },
      {
        name: 'killTheBalloons:showText',
        value: 'none',
        delay: 21635,
      },
      {
        name: 'killTheBalloons:clickColorText',
        value: 'random',
        delay: 21635,
      },
      // MORE AND MORE BALLOONS
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.5,
        delay: 39293,
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.3,
        delay: 42000,
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.15,
        delay: 45000,
      },
    ],
  },
  {
    id: '4_compass',
    // start: 163823,
    // end: 173263, // 2'53.263
    start: 183823,
    end: 193263, // 2'53.263
    state: 'compass',
    events: [
      {
        name: 'compass:instructions',
        value: 'none',
      },
      {
        name: 'compass:enableRandomMIDINotes',
        value: 'on',
      },
    ],
  },
  {
    id: '5_killtheballoon_few',
    // start: 173263,
    // end: 202602, // 3'22.602
    start: 193263,
    end: 222602, // 3'22.602
    state: 'killTheBalloons',
    events: [
      {
        name: 'compass:enableRandomMIDINotes',
        value: 'off',
      },
      {
        name: 'killTheBalloons:showText',
        value: 'none',
      },
      {
        name: 'killTheBalloons:clickColorText',
        value: 'none',
        delay: 21635,
      },
      {
        name: 'killTheBalloons:samplesSet',
        value: 5,
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 1.2,
      },
    ],
  },
  {
    id: '6_ballooncover',
    // start: 202602,
    // end: 212571, // 3'32.571
    start: 222602,
    end: 232571, // 3'32.571
    state: 'balloonsCover',
    events: [
      {
        name: 'balloonCover:explode',
        value: 'red',
        delay: 3000,
      },
      {
        name: 'balloonCover:explode',
        value: 'yellow',
        delay: 4000,
      },
      {
        name: 'balloonCover:explode',
        value: 'blue',
        delay: 5500,
      },
    ],
  },
  {
    id: '7_killtheballoon_ending',
    // start: 212571,
    // end: 225458, // 3'45.458
    start: 232571,
    end: 245458, // 3'45.458
    state: 'killTheBalloons',
    events: [
      {
        name: 'killTheBalloons:showText',
        value: 'none',
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.33,
      },
    ],
  },
  {
    id: '8_avoidtherain',
    // start: 225458,
    // end: 274714, // 4'34.714
    start: 245458,
    end: 294714, // 4'34.714
    state: 'avoidTheRain',
    events: [
      // beginning
      {
        name: 'avoidTheRain:sineVolume',
        value: 0.5,
      },
      {
        name: 'avoidTheRain:toggleRain',
        value: 'start',
      },
      {
        name: 'avoidTheRain:spawnInterval',
        value: 0.7,
      },
      {
        name: 'avoidTheRain:harmony',
        value: 'M15:0',
      },
      // set 5, diminuendo
      {
        name: 'avoidTheRain:spawnInterval',
        value: 0.3,
        delay: 29869,
      },
      {
        name: 'avoidTheRain:harmony',
        value: 'M16:0',
        delay: 29869,
      },
      // end
      {
        name: 'avoidTheRain:toggleRain',
        value: 'stop',
        delay: 49256,
      }
    ],
  },
  {
    id: '9_score',
    // start: 274714, 
    // end: 288950, // 4'48.950
    start: 294714, 
    end: 308950, // 4'48.950
    state: 'scores',
    events: [
      {
        name: 'score:blue:transfertRatio',
        value: 0,
      },
      {
        name: 'score:red:transfertRatio',
        value: 0,
      },
      {
        name: 'score:yellow:transfertRatio',
        value: 0,
      },
      {
        name: 'score:pink:transfertRatio',
        value: 0,
      },
      {
        name: 'score:explode',
        value: 'blue',
        delay: 5000,
      },
      {
        name: 'score:explode',
        value: 'pink',
        delay: 6000,
      },
      {
        name: 'score:explode',
        value: 'yellow',
        delay: 6500,
      },
      {
        name: 'score:explode',
        value: 'red',
        delay: 6900,
      },
      {
        name: 'score:explode',
        value: 'none',
        delay: 8000,
      },
    ],
  },
];

const timeline2 = [
  // {
  //   id: 'start',
  //   start: 0,
  //   end: 1000,
  //   state: 'wait',
  //   // todo : this should be used to join the waiting clients, maybe no use for events at all ... ?
  //   events: [
  //     {
  //       name: 'whatever',
  //       value: true,
  //     },
  //   ],
  // },
  {
    id: 'compass1',
    start: 0,
    end: 41219, // 0'41.2198
    state: 'compass',
    events: [
      {
        name: 'compass:instructions',
        value: 'Walk around',
        // delay: 0,
      },
      {
        name: 'compass:instructions',
        value: 'Stand still',
        delay: 0.25,
      },
      {
        name: 'compass:instructions',
        value: 'Be quiet',
        delay: 0.5,
      },
      {
        name: 'compass:instructions',
        value: 'Listen around',
        delay: 0.75,
      },
    ],
  },
  {
    id: 'killtheballoon:dense',
    start: 41219,
    end: 98493, // 1'38.4937
    state: 'killTheBalloons',
    events: [
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.15,
      },
      {
        name: 'killTheBalloons:sizeDiversity',
        value: 0,
      },
    ],
  },
  {
    id: 'killtheballoon:bigger',
    start: 98493,
    end: 114954, // 1'54.9541
    state: 'killTheBalloons',
    events: [
      {
        name: 'killTheBalloons:sizeDiversity',
        value: 1,
      },
    ],
  },
  {
    id: 'killtheballoon:intempo',
    start: 114954,
    end: 164568, // 2'44.5685
    state: 'killTheBalloons',
    events: [
      {
        name: 'killTheBalloons:showText',
        value: 'On tempo!',
      },
      {
        name: 'killTheBalloons:spawnInterval',
        value: 0.66, // todo : check tempo more precisely
      },
      {
        name: 'killTheBalloons:sizeDiversity',
        value: 0,
      },
    ],
  },
  {
    id: 'randomcolour',
    start: 164568,
    end: 182324, // 3'02.3249
    state: 'intermezzo', // TODO : eventually replace with something else
    events: [
      {
        name: 'killTheBalloons:showText',
        value: 'none',
      },
    ],
  },
  {
    id: 'compass2',
    start: 182324,
    end: 210034, // 3'30.0344
    state: 'compass',
    events: [
      {
        name: 'compass:instructions',
        value: 'Walk around',
        // delay: 0,
      },
      {
        name: 'compass:instructions',
        value: 'Stand still',
        delay: 0.25,
      },
      {
        name: 'compass:instructions',
        value: 'Be quiet',
        delay: 0.5,
      },
      {
        name: 'compass:instructions',
        value: 'Listen around',
        delay: 0.75,
      },
    ],
  },
  {
    id: 'ballooncover',
    start: 210034,
    end: 223370, // 3'43.3707
    state: 'balloonsCover',
    events: [],
  },
  {
    id: 'killtheballoon:default',
    start: 223370,
    end: 236257, // 3'56.2570
    state: 'killTheBalloons',
    events: [],
  },
  {
    id: 'avoidtherain',
    start: 236257,
    end: 299749, // 4'59.7495
    state: 'avoidTheRain',
    events: [
      {
        name: 'avoidTheRain:toggleRain',
        value: 'start',
      },
      {
        name: 'avoidTheRain:spawnInterval',
        value: 0.7,
      },
    ],
  },
];

class Timeline extends EventEmitter {
  constructor(sharedParams, sync) {
    super();
    this.sharedParams = sharedParams;
    this.sync = sync;

    this.index = -1;
    this.totalDuration = timeline[timeline.length - 1].end;

    this.startTime = this.sync.getSyncTime();
    this.lastTime = this.startTime;
    this.totalTime = 0;
    this.cumulatedTime = 0;
    this.pollInterval = 1;
    this.lastInterval = this.pollInterval;

    this.triggerNextEvent = this.triggerNextEvent.bind(this);
    this.tickClock = this.tickClock.bind(this);

    // according to huihui's score
    this.midiMap = [ 3, 4, 5, 11, 14, 15, 16, 17, 22, 29, 31, 32, 34, 46 ];
    this.midiMap.forEach((m, i) => {
      this.midiMap[i] = [ `midi:note:${("0" + (i + 1)).slice(-2)}`, m ];
    });
    this.currentMidiNotes = [];
    this.midiTimeout = null;
  }

  start() {
    this.triggerNextEvent();
    this.tickClock();
  }

  triggerNextEvent() {
    this.index = (this.index + 1) % timeline.length;

    const event = timeline[this.index];
    const timeout = event.end - event.start;
    const actualState = this.sharedParams.params['global:state'].data;

    // emit index first ! then update state ...
    this.emit('index', this.index);

    if (event.state !== actualState.value) {
      console.log(`setting state to ${event.state}`);
      this.sharedParams.update('global:state', event.state);
    }

    // trigger stuff from nextEvent
    for (let i = 0; i < event.events.length; i++) {
      const e = event.events[i];
      setTimeout(() => {
        console.log(`setting ${e.name} to ${e.value}`);
        this.sharedParams.update(e.name, e.value);
      // }, (e.delay || 0) * timeout); // delay is a percentage of state duration
      }, e.delay || 0);
    }

    // this.index = (this.index + 1) % timeline.length;

    // make sure this.index and this.totalTime are computed "atomically"
    // so that this.getIndexElapsedTime() returns a correct result
    this.tickClock();

    setTimeout(this.triggerNextEvent, timeout);
  }

  tickClock() {
    const syncTime = this.sync.getSyncTime();
    this.totalTime = syncTime - this.startTime;
    this.timelineTotalSecDuration = this.totalDuration * 0.001;

    if (this.totalTime >= this.timelineTotalSecDuration) {
      this.startTime += this.timelineTotalSecDuration;
      this.cumulatedTime = this.totalTime - this.timelineTotalSecDuration;
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

      // this.broadcast('player', null, 'global:time', totalTime, timelineTotalSecDuration - totalTime);
      this.emit('countdown', this.timelineTotalSecDuration - this.totalTime);
      // console.log(this.timelineTotalSecDuration - this.totalTime)
    }

    setTimeout(this.tickClock, nextInterval * 10);
  }

  enableRandomMidiNotesGenerator(enable) {
    if (enable === true) {
      this.triggerNextMidiNotes();
    } else if (enable === false) {
      clearTimeout(this.midiTimeout);
      this.midiTimeout = null;
      this.stopAllMidiNotes();
    }
  }

  stopAllMidiNotes() {
    this.currentMidiNotes.forEach((index) => {
      this.sharedParams.update(this.midiMap[index][0], 'off');
    });
    this.currentMidiNotes = [];
  }

  triggerNextMidiNotes() {
    this.stopAllMidiNotes();

    // we create an index array to pick random indexes from
    let indexes = [];
    for (let i = 0; i < this.midiMap.length; i++) {
      indexes.push(i);
    }

    // we pick an index from the index array,
    // then remove it from the index array
    // to avoid picking the same index twice
    const n = Math.floor(Math.random() * 5); // enable 0 to 4 random notes

    for (let i = 0; i < n; i++) {
      const r = Math.floor(Math.random() * indexes.length);
      this.currentMidiNotes.push(indexes[r]);
      indexes.splice(r, 1);
    }

    this.currentMidiNotes.forEach((index) => {
      this.sharedParams.update(this.midiMap[index][0], 'on');
    });

    this.midiTimeout = setTimeout(() => {
      this.triggerNextMidiNotes();
    }, Math.random() * 2000 + 2000); // change every 2 to 4 seconds
  }

  getIndexElapsedTime() {
    // if we never start the timeline, this.index === -1
    return (this.index < 0) ? 0 : (this.totalTime - timeline[this.index].start * 0.001);
  }
};

export default Timeline;