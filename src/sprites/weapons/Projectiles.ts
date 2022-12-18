import Phaser from "phaser";
import Projectile from "./Projectile";
import GameScene from "../../scenes/GameScene";
import { Direction } from "../BaseSprite";

interface ProjectileConfig {
  coolDown: number;
  speed: number;
  range: number;
  damage: number;
}

const PROJECTILE_KEYS = ["fireball", "iceball"];
export type ProjectileKey = typeof PROJECTILE_KEYS[number];

export default class Projectiles extends Phaser.Physics.Arcade.Group {
  coolDown = 200;
  lastShot: number = 0;
  speed: number = 200;
  range: number = 200;
  damage: number = 10;
  spriteKey: ProjectileKey;
  constructor(scene: GameScene, spriteKey: string, config?: ProjectileConfig) {
    super(scene.physics.world, scene);
    this.spriteKey = spriteKey;
    config?.speed && (this.speed = config.speed);
    config?.coolDown && (this.coolDown = config.coolDown);
    config?.range && (this.range = config.range);
    config?.damage && (this.damage = config.damage);

    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: spriteKey,
      classType: Projectile,
    });

    scene.physics.add.collider(scene.layers.colliders, this, (projectile) => {
      (projectile as Projectile).crashesOnTile(this.spriteKey);
    });
  }

  create(
    x: number,
    y: number,
    key: string,
    frame?: string | number | undefined,
    visible?: boolean | undefined,
    active?: boolean | undefined
  ): void {
    super.create(x, y, key, frame, visible, active);
    (this.getChildren() as Projectile[]).forEach((projectile) => {
      projectile.speed = this.speed;
      projectile.maxDistance = this.range;
      projectile.damage = this.damage;
    });
  }

  fireProjectile(x: number, y: number, direction: Direction = "right") {
    const now = Date.now();
    const projectile: Projectile = this.getFirstDead(false);
    if (now - this.lastShot < this.coolDown || !projectile) {
      return;
    }
    projectile.fire(x, y, direction, this.spriteKey);
    this.lastShot = now;
  }
}
