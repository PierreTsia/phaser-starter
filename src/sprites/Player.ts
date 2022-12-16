import BaseSprite, { AnimConfig, Direction } from "./BaseSprite";
import { Collidable } from "../mixins/Collidable";
import GameScene from "../scenes/GameScene";
import HealthBar from "../scenes/utils/HealthBar";
import IceBallSpell from "./weapons/IceBallSpell";
import MeleeWeapon from "./weapons/MeleeWeapon";
import { SpriteAnimations } from "./types";
import Sword from "./weapons/Sword";

export type IPlayer = Player & Collidable;

export default class Player extends BaseSprite {
  animConfigs: AnimConfig = {
    throw: {
      frames: [0, 6],
      frameRate: 14,
      repeat: 0,
    },
    idle: {
      frameRate: 8,
      repeat: -1,
      frames: [0, 3],
    },
    run: {
      frameRate: 8,
      repeat: -1,
      frames: [11, 16],
    },
    jump: {
      frameRate: 2,
      repeat: 0,
      frames: [17, 23],
    },
  };
  speed: number;
  jumpRange: number;
  jumpCount = 0;
  allowedJumps = 2;
  hasBeenHit: boolean = false;
  bounceVelocity: number = 250;
  hp: HealthBar;
  health: number = 100;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  projectiles: IceBallSpell;
  meleeWeapon: MeleeWeapon;
  constructor(scene: GameScene, x: number, y: number) {
    super("player", scene, x, y);
    this.setBodySize(this.width - 10, 35);
    this.setOffset(8, 5);
    this.speed = scene.config.playerSpeed;
    this.jumpRange = this.speed * 1.8;
    this.projectiles = new IceBallSpell(scene);
    this.meleeWeapon = new Sword(scene);
    this.cursors = scene.input.keyboard.createCursorKeys();
    scene.input.keyboard.on("keydown-Q", this.castIceBall, this);
    scene.input.keyboard.on("keydown-E", this.meleeAtack, this);

    this.hp = new HealthBar(
      scene,
      this.config.leftTopCorner.x + 20,
      this.config.leftTopCorner.y + 20,
      this.health
    );

    // throw is a reserved word in JS
    const { throw: throwAttack, ...rest } = this.animConfigs;
    super.animate("player", rest);
    super.animate("player_attack", { throw: throwAttack });
  }

  private meleeAtack() {
    if (this.meleeWeapon.canSwing()) {
      this.play(SpriteAnimations.throw, true);
      console.log("melee atack");
      this.meleeWeapon.swing(this, this.isFacingLeft ? "left" : "right");
    }
  }

  private castIceBall() {
    this.play(SpriteAnimations.throw, true);
    this.projectiles.fireProjectile(
      this.body.center.x,
      this.body.center.y,
      this.isFacingLeft ? "left" : "right"
    );
  }

  stand() {
    super.stand();
    this.play(SpriteAnimations.idle, true);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    if (this.hasBeenHit) {
      return;
    }
    const { left, right, space } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

    if (this.isAnimPlaying(SpriteAnimations.throw)) {
      return;
    }

    if (!this.isOnTheGround()) {
      this.play(SpriteAnimations.jump, true);
      const canDoubleJump = this.jumpCount < this.allowedJumps;
      if (isSpaceJustDown && canDoubleJump) {
        this.jump();
      }
    } else {
      this.jumpCount = 0;
      if (space.isDown) {
        this.jump();
      }
      if (left.isDown) {
        this.run("left");
      } else if (right.isDown) {
        this.run("right");
      } else {
        this.stand();
      }
    }
  }

  playAnimDamage() {
    return this.scene.tweens.add({
      targets: this,
      duration: 50,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  takesDamage() {
    if (this.hasBeenHit) return;
    this.scene.cameras.main.shake(100, 0.01);
    this.hasBeenHit = true;
    this.bounceOff();
    const hitAnim = this.playAnimDamage();
    this.health -= 30;
    this.hp.update(this.health);

    this.scene.time.delayedCall(500, () => {
      this.hasBeenHit = false;
      hitAnim.stop();
      this.clearTint();
    });
  }

  bounceOff() {
    this.setVelocityX(
      this.body.touching.left ? this.bounceVelocity : -this.bounceVelocity
    );
    setTimeout(() => {
      this.setVelocityY(-this.bounceVelocity);
    }, 0);
  }

  jump() {
    this.jumpCount++;
    this.setVelocityY(-this.jumpRange);
  }

  run(direction: Direction) {
    super.run(direction);
    this.play(SpriteAnimations.run, true);
  }
}
