import GameScene from "../../scenes/GameScene";
import { Direction } from "../BaseSprite";

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number = 200;
  traveledDistance: number = 0;
  maxDistance = 200;
  damage = 30;

  constructor(scene: GameScene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fire(x: number, y: number, direction: Direction = "right") {
    this.flipX = direction === "left";
    this.activateProjectile(true);
    this.body.reset(x, y);
    const velocity = direction === "left" ? -this.speed : this.speed;
    this.setVelocityX(velocity);
  }

  deliversHit() {
    this.activateProjectile(false);
    this.traveledDistance = 0;
    this.body.reset(0, 0);
  }

  activateProjectile(value: boolean) {
    this.setActive(value);
    this.setVisible(value);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.traveledDistance += this.body.deltaAbsX();

    if (this.traveledDistance >= this.maxDistance) {
      this.activateProjectile(false);
      this.traveledDistance = 0;
    }
  }
}
