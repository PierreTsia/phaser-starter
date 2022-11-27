import { GRAVITY, HEIGHT, VELOCITY } from "../config";

export class FlappyBird extends Phaser.Physics.Arcade.Sprite {
  originalPosition = {
    x: this.x,
    y: this.y,
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bird");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.input.on("pointerdown", () => this.flap());
    scene.input.keyboard.on("keydown-SPACE", () => this.flap());

    this.setOrigin(0.5, 0.5);
    this.setPosition(x, y);

    this.fly();
  }

  private fly() {
    this.setVelocityY(0);
    this.setGravityY(GRAVITY.y);
  }

  public restart() {
    this.setPosition(this.originalPosition.x, this.originalPosition.y);
    this.fly();
  }

  private flap() {
    this.body.velocity.y = -VELOCITY;
  }

  isOutOfBoundY() {
    return this.y >= HEIGHT - this.height / 2 || this.y - this.height / 2 <= 0;
  }
}
