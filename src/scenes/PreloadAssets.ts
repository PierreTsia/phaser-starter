import BaseScene from "./BaseScene";
import { GameConfig } from "../index";

export default class PreloadAssets extends BaseScene {
  constructor(config: GameConfig) {
    super("PreloadAssets", config);
  }
  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
  }
  create() {
    this.scene.start("MenuScene");
  }
}
