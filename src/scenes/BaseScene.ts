import { GameConfig } from "../index";

export default class BaseScene extends Phaser.Scene {
  config: GameConfig;
  screenCenter: [number, number];

  constructor(key: string, config: GameConfig) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
  }
}
