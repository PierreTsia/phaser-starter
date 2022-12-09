import BaseSprite, { AnimConfig, Direction } from "./BaseSprite";
import { Collidable } from "../mixins/Collidable";
import GameScene from "../scenes/GameScene";
import HealthBar from "../scenes/utils/HealthBar";
import Projectiles from "./Projectiles";

export type IPlayer = Player & Collidable;

export default class Player extends BaseSprite {
  animConfigs: AnimConfig = {
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
  projectiles: Projectiles;
  constructor(scene: GameScene, x: number, y: number) {
    super("player", scene, x, y);
    this.setBodySize(this.width - 10, 35);
    this.setOffset(8, 5);
    this.speed = scene.config.playerSpeed;
    this.jumpRange = this.speed * 1.8;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.projectiles = new Projectiles(scene);
    scene.input.keyboard.on("keydown-Q", () => {
      this.projectiles.fireProjectile(
        this.body.center.x,
        this.body.center.y,
        this.isFacingLeft ? "left" : "right"
      );
    });
    this.hp = new HealthBar(
      scene,
      this.config.leftTopCorner.x + 20,
      this.config.leftTopCorner.y + 20,
      this.health
    );
    super.animate("player", this.animConfigs);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    if (this.hasBeenHit) {
      return;
    }
    const { left, right, space } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

    if (!this.isOnTheGround()) {
      this.play("jump", true);
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
    this.play("run", true);
  }
}
