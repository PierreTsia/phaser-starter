import Enemy from "./Enemy";
import { AnimConfig, Direction } from "../BaseSprite";
import GameScene from "../../scenes/GameScene";
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
};
export default class Snakeman extends Enemy {
  constructor(scene: GameScene, x: number, y: number) {
    super("snake_man", scene, x, y, animConfigs);

    this.setBodySize(this.width - 40, this.height);
    this.setOffset(30, 0);
  }

  private adjustOffset(direction: Direction) {
    const offset = direction === "right" ? 10 : 30;
    this.setOffset(offset, 0);
  }

  turn(direction: Direction) {
    super.turn(direction);
    this.adjustOffset(direction);
  }
}
