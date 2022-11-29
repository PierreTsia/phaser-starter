import Phaser from "phaser";
import { HEIGHT, WIDTH } from "../config";
import { FlappyBird } from "../spites/FlappyBird";
import { Pipe } from "../spites/Pipe";

export default class FlappyBirdGame extends Phaser.Scene {
  bird!: FlappyBird;
  pipesSet!: PipesSet;
  birdInitialPosition = {
    x: WIDTH * 0.1,
    y: HEIGHT / 2,
  };

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.physics.add.image(0, 0, "sky").setOrigin(0, 0);
    this.bird = new FlappyBird(
      this,
      this.birdInitialPosition.x,
      this.birdInitialPosition.y
    );
    this.pipesSet = new PipesSet(this);
  }

  // 60 fps
  update(time: number, delta: number) {
    this.detectOutOfBonds();
    this.pipesSet.recyclePipes();
  }

  private detectOutOfBonds() {
    if (this.bird.isOutOfBoundY()) {
      this.bird.restart();
    }
  }
}

class PipesSet {
  readonly pipesToRender = 4;
  pipes: Pipe[] = [];
  constructor(scene: Phaser.Scene) {
    [...Array(this.pipesToRender).keys()].forEach(() => {
      const upperPipe = new Pipe(scene, 0, 0, [0, 1]);
      const lowerPipe = new Pipe(scene, 0, 0);
      this.placePipes(upperPipe, lowerPipe);
    });
  }

  recyclePipes() {
    if (this.outOfBoundsPipesCount() >= 2) {
      const [uPipe, lPipe] = this.pipes.splice(0, 2);
      this.placePipes(uPipe, lPipe);
    }
  }

  private placePipes(uPipe: Pipe, lPipe: Pipe) {
    const lastPipeX = this.pipes[this.pipes.length - 1]?.x || WIDTH;
    const pipeVerticalDistanceRange: [number, number] = [80, 250];
    const pipeHorizontalDistanceRange: [number, number] = [200, 460];
    const pipesHorizontalSpace = Phaser.Math.Between(
      ...pipeHorizontalDistanceRange
    );
    const pipesVerticalSpace = Phaser.Math.Between(
      ...pipeVerticalDistanceRange
    );
    let upperPipeLengthFromTop = Phaser.Math.Between(30, 320);

    uPipe.setPosition(lastPipeX + pipesHorizontalSpace, upperPipeLengthFromTop);
    lPipe.setPosition(uPipe.x, uPipe.y + pipesVerticalSpace);

    this.pipes.push(uPipe, lPipe);
  }

  private outOfBoundsPipesCount() {
    return this.pipes.filter(this.isOutOfBoundX).length;
  }

  private isOutOfBoundX(pipe: Pipe) {
    return pipe.x + pipe.width <= 0;
  }
}
