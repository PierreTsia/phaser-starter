import BaseSprite, { Direction } from "../BaseSprite";
import GameScene from "../../scenes/GameScene";
import Animation = Phaser.Animations.Animation;
import EffectManager from "../effects/EffectManager";
import { SpriteAnimations } from "../types";
import Sprite = Phaser.Physics.Arcade.Sprite;

export default class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
  damage = 10;
  attackSpeed = 400;
  weaponName: string;
  wielder?: BaseSprite;
  lastAttack = 0;
  constructor(
    scene: GameScene,
    key: string,
    config?: { damage?: number; attackSpeed?: number }
  ) {
    super(scene, 0, 0, key);
    this.weaponName = key;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    config?.damage && (this.damage = config.damage);
    config?.attackSpeed && (this.attackSpeed = config.attackSpeed);
    this.activateWeapon(false);
    this.anims.create({
      key: this.weaponName,
      frameRate: 24,
      repeat: 0,
      frames: this.anims.generateFrameNumbers(this.weaponName, {
        start: 0,
        end: 2,
      }),
    });

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (animation: Animation) => {
        if (animation.key === this.weaponName) {
          this.activateWeapon(false);
          this.body.checkCollision.none = false;
          this.body.reset(0, 0);
        }
      }
    );
  }

  canSwing() {
    return Date.now() - this.lastAttack >= this.attackSpeed;
  }

  swing(wielder: BaseSprite, direction: Direction = "right") {
    this.flipX = direction === "left";
    const x =
      direction === "left"
        ? wielder.body.left - this.body.width / 1.8
        : wielder.body.right + this.body.width / 1.8;
    this.body.reset(x, wielder.body.center.y);
    this.activateWeapon(true);
    this.play(this.weaponName, true);
    this.lastAttack = Date.now();
  }

  activateWeapon(value: boolean) {
    this.setActive(value);
    this.setVisible(value);
    if (!value) {
      this.body.reset(0, 0);
    }
  }

  deliversHit(target: Sprite) {
    const impactPosition = { x: target.body.center.x, y: target.body.center.y };
    this.body.checkCollision.none = false;
    const effect = new EffectManager(this.scene);
    effect.playEffectOn(SpriteAnimations.hit_effect, target, impactPosition);
  }
}
