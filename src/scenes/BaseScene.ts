import { GameConfig } from "../index";

export default class BaseScene extends Phaser.Scene {
  config: GameConfig;
  screenCenter: [number, number];
  fontSize: number;
  lineHeight: number;
  fontOptions: { fontSize: string; fill: string };
  constructor(key: string, config: GameConfig) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#fff" };
  }
}
