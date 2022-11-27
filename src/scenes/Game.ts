import Phaser from "phaser";
import { HEIGHT, WIDTH } from "../config";
import { FlappyBird } from "../spites/FlappyBird";
import { Pipe } from "../spites/Pipe";

export default class FlappyBirdGame extends Phaser.Scene {
  bird!: FlappyBird;
  pipes: Pipe[] = [];
  initialPosition = {
    x: WIDTH * 0.1,
    y: HEIGHT / 2,
  };

  readonly pipesToRender = 4;
  readonly pipesHorizontalSpace = 300;
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
      this.initialPosition.x,
      this.initialPosition.y
    );

    this.generatePipes();
  }

  generatePipes(): void {
    let startX = WIDTH * 0.6;
    [...Array(this.pipesToRender).keys()].forEach((i) => {
      const pipeVerticalDistanceRange: [number, number] = [50, 250];
      const pipeVerticalPosition = Phaser.Math.Between(-350, 20);
      const pipesVerticalSpace = Phaser.Math.Between(
        ...pipeVerticalDistanceRange
      );
      const upperPipe = new Pipe(
        this,
        startX + i * this.pipesHorizontalSpace,
        pipeVerticalPosition
      );
      const lowerPipe = new Pipe(
        this,
        startX + i * this.pipesHorizontalSpace,
        upperPipe.y + upperPipe.height + pipesVerticalSpace
      );
      this.pipes.push(upperPipe, lowerPipe);
    });
  }

  // 60 fps
  update(time: number, delta: number) {
    this.detectOutOfBonds();
  }

  private detectOutOfBonds() {
    if (this.bird.y >= HEIGHT - this.bird.height / 2) {
      this.bird.restart();
    } else if (this.bird.y - this.bird.height / 2 <= 0) {
      this.bird.restart();
    }
  }
}
