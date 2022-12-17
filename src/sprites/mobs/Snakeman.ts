import Enemy from "./Enemy";
import { AnimConfig, Direction } from "../BaseSprite";
import GameScene from "../../scenes/GameScene";
import Projectiles from "../weapons/Projectiles";
import FireBall from "../weapons/FireBall";

const animConfigs: AnimConfig = {
  walk: {
    frameRate: 8,
    repeat: -1,
    frames: [0, 14],
  },
  idle: {
    frameRate: 4,
    repeat: -1,
    frames: [0, 14],
  },
  attack: {
    frameRate: 8,
    repeat: -1,
    frames: [15, 20],
  },
  damaged: {
    frameRate: 8,
    repeat: 0,
    frames: [21, 23],
  },
};
export default class Snakeman extends Enemy {
  spellCast: Projectiles;
  timeFromLastAttack: number = 0;
  attackDelay = 0;
  constructor(scene: GameScene, x: number, y: number) {
    super("snake_man", scene, x, y, animConfigs);

    this.setBodySize(this.width - 40, this.height);
    this.setOffset(30, 0);

    this.attackDelay = this.getAttackDelay();
    this.spellCast = new FireBall(scene); // new Projectiles(scene, "fireball");
  }

  private adjustOffset(direction: Direction) {
    const offset = direction === "right" ? 10 : 30;
    this.setOffset(offset, 0);
  }

  private getAttackDelay() {
    return Phaser.Math.Between(1000, 4000);
  }

  turn(direction: Direction) {
    if (!this.body) return;
    super.turn(direction);
    this.adjustOffset(direction);
  }

  update(time: number, delta: number) {
    if (!this.body) return;
    super.update(time, delta);
    if (this.timeFromLastAttack + this.attackDelay < time) {
      this.spellCast.fireProjectile(
        this.body.center.x,
        this.body.center.y,
        this.currentDirection
      );
      this.timeFromLastAttack = time;
      this.attackDelay = this.getAttackDelay();
    }
  }
}
