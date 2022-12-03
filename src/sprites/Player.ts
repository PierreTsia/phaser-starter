import BaseSprite from "./BaseSprite";
import BaseScene from "../scenes/BaseScene";

export default class Player extends BaseSprite {
  constructor(scene: BaseScene, x: number, y: number) {
    super("player", scene, x, y);
    this.setGravity(0, 300);
    this.setCollideWorldBounds(true);
  }
}
