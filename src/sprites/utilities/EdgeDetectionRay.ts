import GameScene from "../../scenes/GameScene";
import BaseSprite from "../BaseSprite";
import DetectionRay from "./DetectionRay";

export type IPoint = Phaser.Geom.Point & {
  object: Phaser.GameObjects.GameObject;
};

export default class EdgeDetectionRay extends DetectionRay {
  constructor(
    scene: GameScene,
    source: BaseSprite,
    target: Phaser.Tilemaps.TilemapLayer
  ) {
    super(scene, source, target);
    this.ray.setDetectionRange(50);
  }

  get isOnEdge() {
    return !this.intersects.length;
  }
}
