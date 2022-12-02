import BaseScene from "../scenes/BaseScene";
import BaseSprite from "./BaseSprite";

export class Pipe extends BaseSprite {
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    origin: [number, number] = [0, 0]
  ) {
    super("pipe", scene, x, y);
    this.setImmovable(true);
    this.setOrigin(...origin);
    this.setVelocityX(-scene.config.scrollSpeed);
  }
}
