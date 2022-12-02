import BaseScene from "./BaseScene";
import { GameConfig } from "../index";

export default class GameScene extends BaseScene {
  constructor(config: GameConfig) {
    super("GameScene", config);
  }

  create() {
    const logo = this.add.image(400, 70, "logo");

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }
}
