import { GRAVITY, HEIGHT, VELOCITY, WIDTH } from "../config";
const birdInitialPosition = {
  x: WIDTH * 0.1,
  y: HEIGHT / 2,
};

export class FlappyBird extends Phaser.Physics.Arcade.Sprite {
  originalPosition = {
    x: this.x,
    y: this.y,
  };

  constructor(
    scene: Phaser.Scene,
    x = birdInitialPosition.x,
    y = birdInitialPosition.y
  ) {
    super(scene, x, y, "bird");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.input.on("pointerdown", () => this.flap());
    scene.input.keyboard.on("keydown-SPACE", () => this.flap());

    this.setOrigin(0.5, 0.5);
    this.setPosition(x, y);
    this.setCollideWorldBounds(true);
    this.fly();
  }

  private fly() {
    this.setVelocityY(0);
    this.setGravityY(GRAVITY.y);
  }

  private flap() {
    this.body.velocity.y = -VELOCITY;
  }

  isOutOfBoundY() {
    return this.getBounds().bottom >= HEIGHT || this.getBounds().top <= 0;
  }
}
