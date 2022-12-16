import Sprite = Phaser.GameObjects.Sprite;
import { Scene } from "phaser";
import Animation = Phaser.Animations.Animation;
import { SpriteAnimations } from "../types";

export default class SpriteEffect extends Phaser.Physics.Arcade.Sprite {
  target: Sprite | null = null;
  effectName: string;
  effectConfig = { start: 0, end: 2 };
  frameRate = 10;
  repeat = 0;
  impactPosition: { x: number; y: number };

  constructor(
    scene: Scene,
    x: number,
    y: number,
    effectName: SpriteAnimations,
    impactPosition: { x: number; y: number }
  ) {
    super(scene, x, y, effectName);
    this.effectName = effectName;
    this.impactPosition = impactPosition;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.anims.create({
      key: effectName,
      frames: this.anims.generateFrameNumbers(effectName, this.effectConfig),
      frameRate: this.frameRate,
      repeat: this.repeat,
    });

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (animation: Animation) => {
        if (animation.key === this.effectName) {
          this.destroy();
        }
      }
    );
  }

  placeEffect() {
    if (!this.target) {
      return;
    }
    const center = this.target.getCenter();

    this.body?.reset(center.x, this.impactPosition.y);
  }

  playOn(target: Sprite) {
    this.target = target;
    this.play(this.effectName, true);
    this.placeEffect();
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.placeEffect();
  }
}
