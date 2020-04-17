import EventEmitter from 'events';

// possible states :
// 'wait', 'compass', 'balloonsCover', 'killTheBalloons', 'intermezzo', 'avoidTheRain'

const timeline = [
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
  constructor(sharedParams) {
    super();
    this.nextEventIndex = 0;
    this.sharedParams = sharedParams;
    this.totalDuration = timeline[timeline.length - 1].end;
  }

  start() {
    this.timeLeft = 0;
    this.triggerNextEvent();
  }

  triggerNextEvent() {
    const event = timeline[this.nextEventIndex];
    const timeout = event.end - event.start;
    const actualState = this.sharedParams.params['global:state'].data;

    // emit index first ! then update state ...
    this.emit('index', this.nextEventIndex);

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
      }, (e.delay || 0) * timeout); // delay is a percentage of state duration
    }

    this.nextEventIndex = (this.nextEventIndex + 1) % timeline.length;

    setTimeout(() => {
      this.triggerNextEvent();
    }, timeout);
  }
};

export default Timeline;