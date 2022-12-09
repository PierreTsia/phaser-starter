import GameScene from "../scenes/GameScene";
import { Direction } from "./BaseSprite";

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number = 200;
  traveledDistance: number = 0;
  maxDistance = 200;

  constructor(scene: GameScene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fire(x: number, y: number, direction: Direction = "right") {
    this.flipX = direction === "left";
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    const velocity = direction === "left" ? -this.speed : this.speed;
    this.setVelocityX(velocity);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.traveledDistance += this.body.deltaAbsX();

    if (this.traveledDistance >= this.maxDistance) {
      this.setActive(false);
      this.setVisible(false);
      this.traveledDistance = 0;
    }
  }
}
