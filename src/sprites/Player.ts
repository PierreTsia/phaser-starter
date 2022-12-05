import BaseSprite, { AnimConfig, Direction } from "./BaseSprite";
import BaseScene from "../scenes/BaseScene";
import { Collidable } from "../mixins/Collidable";

export type IPlayer = Player & Collidable;

export default class Player extends BaseSprite {
  speed: number;
  jumpRange: number;
  jumpCount = 0;
  allowedJumps = 2;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
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
  constructor(scene: BaseScene, x: number, y: number) {
    super("player", scene, x, y);
    this.setBodySize(this.width - 10, 35);
    this.setOffset(8, 5);
    this.speed = scene.config.playerSpeed;
    this.jumpRange = this.speed * 1.8;
    this.cursors = scene.input.keyboard.createCursorKeys();
    super.animate("player", this.animConfigs);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
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

  jump() {
    this.jumpCount++;
    this.setVelocityY(-this.jumpRange);
  }

  run(direction: Direction) {
    super.run(direction);
    this.play("run", true);
  }
}
