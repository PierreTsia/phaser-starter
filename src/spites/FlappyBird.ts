import { GRAVITY, SCROLL_SPEED, VELOCITY } from "../config";

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

  update() {
    console.log("update from bird");
  }

  private fly() {
    this.setVelocityY(0);
    this.setGravityY(GRAVITY.y);
    this.setVelocityX(SCROLL_SPEED);
  }

  public restart() {
    this.setPosition(this.originalPosition.x, this.originalPosition.y);
    this.fly();
  }

  private flap() {
    this.body.velocity.y = -VELOCITY;
  }

  isOutOfBoundX() {
    return this.y >= this.scene.scale.height - this.height / 2;
  }
}
