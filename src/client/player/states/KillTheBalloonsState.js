import { CanvasView, Renderer } from 'soundworks/client';
import Balloon from '../renderers/Balloon';

const template = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"></div>
    <div class="section-center flex-center">
      <% if (state === 'intro') { %>
        <p>Stage 1<br />Explode the balloons!</p>
      <% } else if (state === 'go') { %>
        <p>Go!</p>
      <% } %>
    </div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;

class RisingBalloon extends Balloon {
  constructor(...args) {
    super(...args);
    this.vy = - (Math.random() * 0.4 + 0.6) * 200;
  }

  update(dt) {
    this.vy *= 1.002;
    this.x += Math.random() * 0.2 - 0.1;
    this.y += (this.vy * dt);

    super.update(dt);
  }
}

class KillTheBalloonsView extends CanvasView {
  onRender() {
    super.onRender();
    this.$canvas = this.$el.querySelector('canvas');
  }

  onResize(...args) {
    super.onResize(...args);
    this.canvasBoundingClientRect = this.$canvas.getBoundingClientRect();
  }
}

class KillTheBalloonsRenderer extends Renderer {
  constructor(spriteConfig, onExploded) {
    super();

    this.spriteConfig = spriteConfig;
    this.onExploded = onExploded;
    this.isEnded = false;

    this.numZIndex = 3;
    this.balloons = new Array(3);
    // prepare stack for each z-indexes
    for (let i = 0; i < this.numZIndex; i++)
      this.balloons[i] = [];
  }

  init() {

  }

  spawnBalloon() {
    const config = this.spriteConfig;
    const colorIndex = Math.floor(Math.random() * config.colors.length);
    const color = config.colors[colorIndex];

    const image = config.groups[color].image;
    const clipPositions = config.groups[color].clipPositions;
    const clipWidth = config.clipSize.width;
    const clipHeight = config.clipSize.height;
    const refreshRate = config.animationRate;
    const size = Math.min(this.canvasWidth, this.canvasHeight) * config.smallSizeRatio;
    const x = Math.random() * this.canvasWidth;
    const y = this.canvasHeight + size;

    const balloon = new RisingBalloon(color, image, clipPositions, clipWidth, clipHeight, refreshRate, size, size, x, y);

    const zIndex = Math.floor(Math.random() * this.numZIndex);
    this.balloons[zIndex].push(balloon);
  }

  explodeAll() {
    for (let z = 0; z < this.balloons.length; z++) {
      const layer = this.balloons[z];

      for (let i = 0, l = layer.length; i < l; i++) {
        const balloon = layer[i];
        balloon.explode = true;
      }
    }

    this.isEnded = true;
  }

  update(dt) {
    let isEmpty = true;

    for (let z = 0; z < this.numZIndex; z++) {
      const layer = this.balloons[z];

      for (let i = layer.length - 1; i >= 0; i--) {
        const balloon = layer[i];
        balloon.update(dt);

        // if outside the screen
        if (balloon.y < - (balloon.radius + 10))
          balloon.isDead = true;

        if (balloon.isDead)
          layer.splice(i, 1);
      }

      if (layer.length !== 0)
        isEmpty = false;
    }

    if (this.isEnded && isEmpty)
      this.onExploded();
  }

  render(ctx) {
    for (let z = 0; z < this.numZIndex; z++) {
      const layer = this.balloons[z];

      for (let i = 0, l = layer.length; i < l; i++)
        layer[i].render(ctx);
    }
  }
}

class KillTheBalloonsState {
  constructor(experience, globalState) {
    this.experience = experience;
    this.globalState = globalState;

    this._spawnBalloon = this._spawnBalloon.bind(this);
    this._updateMaxSpawn = this._updateMaxSpawn.bind(this);
    this._spawnTimeout = null;
    this._maxSpawnInterval = null;

    this._onExploded = this._onExploded.bind(this);
    this._onStart = this._onStart.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);

    this.renderer = new KillTheBalloonsRenderer(this.experience.spriteConfig, this._onExploded);
  }

  enter() {
    this.view = new KillTheBalloonsView(template, {
      state: 'intro', // 'go' || 'game'
    }, {
      touchstart: this._onTouchStart,
    }, {
      className: ['kill-the-balloons-state', 'foreground'],
    });

    this.view.render();
    this.view.show();
    this.view.appendTo(this.experience.view.$el);

    const goDuration = 1;
    let goTime = 0;

    this.view.setPreRender((ctx, dt, width, height) => {
      ctx.clearRect(0, 0, width, height);

      // update view
      if (this.view.content.state === 'go') {
        goTime += dt;

        if (goTime > goDuration) {
          this.view.content.state = 'game';
          this.view.render('.section-center');
        }
      }
    });

    this.view.addRenderer(this.renderer);

    const sharedParams = this.experience.sharedParams;
    sharedParams.addParamListener('killTheBalloons:start', this._onStart);
    sharedParams.addParamListener('killTheBalloons:spawnInterval', this._updateMaxSpawn);
  }

  exit() {
    clearTimeout(this._spawnTimeout);

    this.view.$el.classList.remove('foreground');
    this.view.$el.classList.add('background');

    this.renderer.explodeAll();

    const sharedParams = this.experience.sharedParams;
    sharedParams.removeParamListener('killTheBalloons:start', this._onStart);
    sharedParams.removeParamListener('killTheBalloons:spawnInterval', this._updateMaxSpawn);
  }

  _onStart(value) {
    if (value === 'start') {
      this.view.content.state = 'go';
      this.view.render('.section-center');

      // prevent double lauch
      if (this._spawnTimeout === null)
        this._spawnBalloon();
    }
  }

  _onExploded() {
    this.view.removeRenderer(this.renderer);
    this.view.remove();
  }

  _updateMaxSpawn(value) {
    this._maxSpawnInterval = value;
  }

  _spawnBalloon() {
    this.renderer.spawnBalloon();

    const halfMaxSpawn = this._maxSpawnInterval / 2;
    const delay = halfMaxSpawn + halfMaxSpawn * Math.random(); // seconds
    this._spawnTimeout = setTimeout(this._spawnBalloon, delay * 1000);
  }

  _onTouchStart(e) {
    const touch = e.touches[0];
    const x = touch.clientX - this.view.canvasBoundingClientRect.left;
    const y = touch.clientY - this.view.canvasBoundingClientRect.top;

    this._testHit(this.renderer.balloons, x, y);
  }

  _testHit(balloons, x, y) {
    // start from top to bottom z-indexes
    for (let z = balloons.length - 1; z >= 0; z--) {
      const layer = balloons[z];

      for (let i = 0, l = layer.length; i < l; i++) {
        const balloon = layer[i];
        const dx = balloon.x - x;
        const dy = balloon.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < balloon.radius) {
          balloon.explode = true;
          this._updateScore(balloon.color);
          this._triggerSample(balloon.color, balloon.x, balloon.y);
          return;
        }
      }
    }
  }

  _updateScore(color) {
    this.globalState.score[color] += 1;
  }

  _triggerSample(color, x, y) {
    // this.experience.sharedSynth.trigger
  }
}

export default KillTheBalloonsState;
