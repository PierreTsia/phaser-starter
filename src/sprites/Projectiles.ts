import Phaser from "phaser";
import Projectile from "./Projectile";
import GameScene from "../scenes/GameScene";
import { Direction } from "./BaseSprite";

export default class Projectiles extends Phaser.Physics.Arcade.Group {
  constructor(scene: GameScene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: "iceball",
      classType: Projectile,
    });
  }

  fireProjectile(x: number, y: number, direction: Direction = "right") {
    const projectile: Projectile = this.getFirstDead(false);

    if (!projectile) {
      return;
    }

    projectile.fire(x, y, direction);
  }
}
