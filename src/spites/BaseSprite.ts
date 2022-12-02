import { GameConfig } from "../index";

export default class BaseSprite extends Phaser.Physics.Arcade.Sprite {
  config: GameConfig;
  constructor(
    key: string,
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: GameConfig
  ) {
    super(scene, x, y, key);
    this.config = config;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
