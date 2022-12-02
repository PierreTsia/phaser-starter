import BaseScene from "../scenes/BaseScene";

export class FlappyBird extends Phaser.Physics.Arcade.Sprite {
  gravity: number;
  velocity: number;
  screenWidth: number;
  screenHeight: number;

  constructor(
    scene: BaseScene,
    x = scene.config.startPosition.x,
    y = scene.config.startPosition.y
  ) {
    super(scene, x, y, "bird");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.input.on("pointerdown", () => this.flap());
    scene.input.keyboard.on("keydown-SPACE", () => this.flap());
    this.gravity = scene.config.gravity.y;
    this.velocity = scene.config.flapVelocity;
    this.screenWidth = scene.config.width;
    this.screenHeight = scene.config.height;

    this.setOrigin(0.5, 0.5);
    this.setPosition(x, y);
    this.setCollideWorldBounds(true);
    this.fly();
  }

  private fly() {
    this.setVelocityY(0);
    this.setGravityY(this.gravity);
  }

  private flap() {
    this.body.velocity.y = -this.velocity;
  }

  isOutOfBoundY() {
    return (
      this.getBounds().bottom >= this.screenHeight || this.getBounds().top <= 0
    );
  }
}
