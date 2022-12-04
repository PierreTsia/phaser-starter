import { GameConfig } from "../index";
import BaseScene from "../scenes/BaseScene";
export interface AnimConfig {
  [key: string]: {
    frameRate: number;
    repeat: number;
    frames: [number, number];
  };
}
export default class BaseSprite extends Phaser.Physics.Arcade.Sprite {
  config: GameConfig;
  constructor(key: string, scene: BaseScene, x: number, y: number) {
    super(scene, x, y, key);
    this.config = scene.config;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time: number, delta: number) {
    console.log("update from base sprite");
  }

  animate(spriteName: string, animConfig: AnimConfig) {
    Object.entries(animConfig).forEach(([key, config]) => {
      const { frameRate, repeat, frames } = config;
      const [start, end] = frames;
      this.anims.create({
        key,
        repeat,
        frameRate,
        frames: this.anims.generateFrameNumbers(spriteName, {
          start,
          end,
        }),
      });
    });
  }
}
