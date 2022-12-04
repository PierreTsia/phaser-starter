import { GameConfig } from "../index";
export type Coords = [number, number, number, number];

export default class BaseScene extends Phaser.Scene {
  config: GameConfig;
  screenCenter: [number, number];

  constructor(key: string, config: GameConfig) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
  }
  get bounds(): Coords {
    const { width, height, mapOffset } = this.config;
    return [0, 0, width + mapOffset, height];
  }
}
