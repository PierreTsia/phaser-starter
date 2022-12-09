import GameScene from "../../scenes/GameScene";
import BaseSprite from "../BaseSprite";
import DetectionRay from "./DetectionRay";
import GameObject = Phaser.GameObjects.GameObject;

export type IPoint = Phaser.Geom.Point & {
  object: Phaser.GameObjects.GameObject;
};

export default class EnemyAgroDetection extends DetectionRay {
  constructor(scene: GameScene, source: BaseSprite, target: GameObject) {
    super(scene, source, target);
    this.ray.setDetectionRange(250);
  }

  /*refreshRay(angle: number = this.source.lineOfViewAngle) {
    super.refreshRay(angle);
    console.log(this.intersects);
  }*/
}
