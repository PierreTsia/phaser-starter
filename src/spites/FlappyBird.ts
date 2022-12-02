import BaseScene from "../scenes/BaseScene";
import BaseSprite from "./BaseSprite";

export class FlappyBird extends BaseSprite {
  constructor(
    scene: BaseScene,
    x = scene.config.startPosition.x,
    y = scene.config.startPosition.y
  ) {
    super("bird", scene, x, y);
    scene.input.on("pointerdown", () => this.flap());
    scene.input.keyboard.on("keydown-SPACE", () => this.flap());

    this.setOrigin(0.5, 0.5);
    this.setPosition(x, y);
    this.setCollideWorldBounds(true);
    this.fly();
  }

  private fly() {
    this.setVelocityY(0);
    this.setGravityY(this.config.gravity.y);
  }

  private flap() {
    this.body.velocity.y = -this.config.flapVelocity;
  }

  isOutOfBoundY() {
    return (
      this.getBounds().bottom >= this.config.height || this.getBounds().top <= 0
    );
  }
}
