import BaseScene from "./BaseScene";
import { GameConfig } from "../index";

export default class PreloadAssets extends BaseScene {
  constructor(config: GameConfig) {
    super("PreloadAssets", config);
  }
  preload() {
    this.load.image("logo", "assets/phaser3-logo.png");
  }
  create() {
    this.scene.start("GameScene");
  }
}
