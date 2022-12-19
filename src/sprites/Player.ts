import BaseSprite, { AnimConfig, Direction } from "./BaseSprite";
import { Collidable } from "../mixins/Collidable";
import GameScene from "../scenes/GameScene";
import HealthBar from "../scenes/utils/HealthBar";
import MeleeWeapon from "./weapons/MeleeWeapon";
import { SpriteAnimations } from "./types";
import Sword from "./weapons/Sword";
import Projectiles from "./weapons/Projectiles";
import IceBall from "./weapons/IceBall";
import Projectile from "./weapons/Projectile";
import { GameEvents } from "../events/EventEmitter";

export type IPlayer = Player & Collidable;

export default class Player extends BaseSprite {
  animConfigs: AnimConfig = {
    slide: {
      frames: [0, 2],
      frameRate: 10,
      repeat: 0,
    },
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
  hasJustBeenHit: boolean = false;
  lastTimeHit: number = 0;
  recoverTime = 3000;
  bounceVelocity: number = 250;
  hp: HealthBar;
  health: number = 100;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  projectiles: Projectiles;
  meleeWeapon: MeleeWeapon;
  isSliding = false;
  sceneEventsEmitter: Phaser.Events.EventEmitter;
  constructor(scene: GameScene, x: number, y: number) {
    super("player", scene, x, y);
    this.setBodySize(this.width - 10, 35);
    this.setOffset(8, 5);
    this.speed = scene.config.playerSpeed;
    this.jumpRange = this.speed * 1.8;
    this.sceneEventsEmitter = scene.eventEmitter;

    this.projectiles = new IceBall(scene);
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
    const { throw: throwAttack, slide, ...rest } = this.animConfigs;
    super.animate("player", rest);
    super.animate("player_attack", { throw: throwAttack });
    super.animate("player_slide", { slide });
  }

  private meleeAtack() {
    if (this.meleeWeapon.canSwing() && !this.isRecoverMode) {
      this.play(SpriteAnimations.throw, true);
      this.meleeWeapon.swing(this, this.isFacingLeft ? "left" : "right");
    }
  }

  private castIceBall() {
    if (!this.isRecoverMode) {
      this.play(SpriteAnimations.throw, true);
      this.projectiles.fireProjectile(
        this.body.center.x,
        this.body.center.y,
        this.isFacingLeft ? "left" : "right"
      );
    }
  }

  stand() {
    super.stand();
    this.play(SpriteAnimations.idle, true);
  }

  handleSlide() {
    if (!this.isOnTheGround()) {
      return;
    }
    this.scene.input.keyboard.on("keydown-DOWN", () => {
      this.body.setSize(this.width, this.height / 2);
      this.setOffset(0, this.height / 2);
      this.setVelocityX(0);
      this.play(SpriteAnimations.slide, true);
      this.isSliding = true;
    });

    this.scene.input.keyboard.on("keyup-DOWN", () => {
      this.body.setSize(this.width, 38);
      this.setOffset(0, 0);
      this.isSliding = false;
    });
  }

  handleJump(isSpaceJustDown: boolean, isSpaceDown: boolean) {
    if (!this.isOnTheGround()) {
      this.play(SpriteAnimations.jump, true);
      const canDoubleJump = this.jumpCount < this.allowedJumps;
      if (isSpaceJustDown && canDoubleJump) {
        this.jump();
      }
    } else {
      this.jumpCount = 0;
      if (isSpaceDown) {
        this.jump();
      }
    }
  }

  handleRun(left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key) {
    if (!this.isOnTheGround()) {
      return;
    }
    if (left.isDown) {
      this.run("left");
    } else if (right.isDown) {
      this.run("right");
    } else {
      this.stand();
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    if (
      this.hasJustBeenHit ||
      this.isSliding ||
      this.isAnimPlaying(SpriteAnimations.throw)
    ) {
      return;
    }

    const { left, right, space } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    this.handleJump(isSpaceJustDown, space.isDown);
    this.handleSlide();
    this.handleRun(left, right);
  }

  playAnimDamage() {
    return this.scene.tweens.add({
      targets: this,
      duration: 50,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  get isRecoverMode() {
    return Date.now() - this.lastTimeHit < this.recoverTime;
  }

  takesDamage(source?: Projectile | { damage: number }) {
    if (this.hasJustBeenHit || this.isRecoverMode) {
      return;
    }
    const damage = source?.damage ?? 10;
    if (source instanceof Projectile) {
      source.deliversHit(this);
    }
    this.scene.cameras.main.shake(100, 0.01);
    this.hasJustBeenHit = true;
    this.lastTimeHit = Date.now();
    this.bounceOff();
    const hitAnim = this.playAnimDamage();
    this.health -= damage;
    this.hp.update(this.health);
    this.stop();

    if (this.health <= 0) {
      this.sceneEventsEmitter.emit(GameEvents.PLAYER_LOOSE);
    }

    this.scene.time.delayedCall(600, () => {
      this.hasJustBeenHit = false;
    });
    this.scene.time.delayedCall(this.recoverTime, () => {
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
