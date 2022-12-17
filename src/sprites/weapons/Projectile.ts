import GameScene from "../../scenes/GameScene";
import { Direction } from "../BaseSprite";
import Sprite = Phaser.GameObjects.Sprite;
import EffectManager from "../effects/EffectManager";
import { SpriteAnimations } from "../types";

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number = 200;
  traveledDistance: number = 0;
  maxDistance = 200;
  damage = 30;

  constructor(scene: GameScene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(this.width - 13, this.height - 20);
    this.initAnimations();
  }

  fire(
    x: number,
    y: number,
    direction: Direction = "right",
    spriteKey: string
  ) {
    this.flipX = direction === "left";
    this.activateProjectile(true);
    this.body.reset(x, y);
    const velocity = direction === "left" ? -this.speed : this.speed;
    this.setVelocityX(velocity);
    this.anims.play(spriteKey, true);
  }

  deliversHit(target: Sprite) {
    this.activateProjectile(false);
    this.traveledDistance = 0;
    const impactPosition = { x: this.x, y: this.y };
    this.body.reset(0, 0);
    const effect = new EffectManager(this.scene);
    effect.playEffectOn(SpriteAnimations.hit_effect, target, impactPosition);
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
      this.body?.reset(0, 0);
    }
  }
  private initAnimations() {
    this.anims.create({
      key: "fireball",
      repeat: -1,
      frameRate: 12,
      frames: [
        { key: "fireball" },
        { key: "fireball_2" },
        { key: "fireball_3" },
      ],
    });
    this.anims.create({
      key: "iceball",
      repeat: -1,
      frameRate: 5,
      frames: [{ key: "iceball" }, { key: "iceball_2" }],
    });
  }
}
