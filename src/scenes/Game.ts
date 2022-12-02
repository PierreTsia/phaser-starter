import Phaser from "phaser";

import { FlappyBird } from "../spites/FlappyBird";
import { Pipe } from "../spites/Pipe";
import BaseScene from "./BaseScene";
import { GameConfig } from "../index";

export default class FlappyBirdGame extends BaseScene {
  bird!: FlappyBird;
  pipesSet!: PipesSet;
  score: number = 0;
  scoreText!: Phaser.GameObjects.Text;
  bestScore: number = 0;
  bestScoreText!: Phaser.GameObjects.Text;

  constructor(config: any) {
    super("GameScene", config);
  }

  create() {
    super.create();
    this.bird = new FlappyBird(this);
    this.pipesSet = new PipesSet(this);
    this.addColliders();
    this.createScores();
    this.createPauseButton();
  }

  private createPauseButton() {
    const pause = this.add
      .image(this.config.width - 50, this.config.height - 50, "pause")
      .setScale(3);
    pause.setInteractive();
    pause.on("pointerdown", this.pauseGame, this);
  }

  private pauseGame() {
    this.physics.pause();
    this.scene.pause();
    this.scene.launch("PauseScene");
  }

  // 60 fps
  update(time: number, delta: number) {
    this.detectOutOfBonds();
    if (this.pipesSet.onePipePairHasGoneLeft()) {
      this.pipesSet.recyclePipes();
      this.increaseScores();
    }
  }

  createScores() {
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      color: "#fff",
    });

    this.initBestScore();
  }

  private initBestScore() {
    const bestScore = localStorage.getItem("bestScore");
    if (bestScore) {
      this.bestScore = parseInt(bestScore);
    }
    this.bestScoreText = this.add.text(
      16,
      46,
      `Best Score: ${this.bestScore}`,
      {
        fontSize: "24px",
        color: "#fff",
      }
    );
  }

  private updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.bestScoreText.setText(`Best Score: ${this.bestScore}`);
      localStorage.setItem("bestScore", this.bestScore.toString());
    }
  }

  private detectOutOfBonds() {
    if (this.bird.isOutOfBoundY()) {
      this.gameOver();
    }
  }

  private addColliders() {
    this.physics.add.collider(
      this.bird,
      this.pipesSet.pipes,
      this.gameOver,
      undefined,
      this
    );
  }

  private increaseScores() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
    this.updateBestScore();
  }

  private gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.score = 0;
        this.scene.restart();
      },
      loop: false,
    });
  }
}

class PipesSet {
  readonly pipesToRender = 4;
  config: GameConfig;
  pipes: Pipe[] = [];
  constructor(scene: BaseScene) {
    this.config = scene.config;
    [...Array(this.pipesToRender).keys()].forEach(() => {
      const upperPipe = new Pipe(scene, 0, 0, [0, 1]);
      const lowerPipe = new Pipe(scene, 0, 0);
      this.placePipes(upperPipe, lowerPipe);
    });
  }

  recyclePipes() {
    const [uPipe, lPipe] = this.pipes.splice(0, 2);
    this.placePipes(uPipe, lPipe);
  }

  onePipePairHasGoneLeft() {
    return this.outOfBoundsPipesCount() >= 2;
  }

  private placePipes(uPipe: Pipe, lPipe: Pipe) {
    const lastPipeX = this.pipes[this.pipes.length - 1]?.x || this.config.width;
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
