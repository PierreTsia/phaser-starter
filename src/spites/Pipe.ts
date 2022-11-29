import { SCROLL_SPEED } from "../config";

export class Pipe extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    origin: [number, number] = [0, 0]
  ) {
    super(scene, x, y, "pipe");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setPosition(x, y);
    this.setOrigin(...origin);
    this.setVelocityX(-SCROLL_SPEED);
  }
}
