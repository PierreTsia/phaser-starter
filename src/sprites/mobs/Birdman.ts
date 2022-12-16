import Enemy from "./Enemy";
import { AnimConfig, Direction } from "../BaseSprite";
import GameScene from "../../scenes/GameScene";
const animConfigs: AnimConfig = {
  walk: {
    frameRate: 8,
    repeat: -1,
    frames: [0, 12],
  },
  idle: {
    frameRate: 4,
    repeat: -1,
    frames: [0, 12],
  },
  attack: {
    frameRate: 8,
    repeat: 1,
    frames: [12, 24],
  },
  damaged: {
    frameRate: 8,
    repeat: 0,
    frames: [25, 27],
  },
};
export default class Birdman extends Enemy {
  constructor(scene: GameScene, x: number, y: number) {
    super("bird_man", scene, x, y, animConfigs);
    this.setBodySize(this.width - 40, 45);
    this.setOffset(10, 20);
  }

  turn(direction: Direction) {
    if (!this.body) return;
    super.turn(direction);
    this.adjustOffset(direction);
  }

  private adjustOffset(direction: Direction) {
    const offset = direction === "right" ? 10 : 30;
    this.setOffset(offset, 20);
  }
}
