import { GameConfig } from "../index";
import BaseScene from "../scenes/BaseScene";

export default class BaseSprite extends Phaser.Physics.Arcade.Sprite {
  config: GameConfig;
  constructor(key: string, scene: BaseScene, x: number, y: number) {
    super(scene, x, y, key);
    this.config = scene.config;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
