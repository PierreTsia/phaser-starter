import SpriteEffect from "./SpriteEffect";
import { SpriteAnimations } from "../types";

export default class EffectManager {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playEffectOn(
    effectName: SpriteAnimations,
    target: Phaser.GameObjects.Sprite,
    impactPosition: { x: number; y: number }
  ) {
    const effect = new SpriteEffect(
      this.scene,
      0,
      0,
      effectName,
      impactPosition
    );
    effect.playOn(target);
  }
}
