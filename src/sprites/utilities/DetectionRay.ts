import BaseSprite from "../BaseSprite";
import GameScene from "../../scenes/GameScene";
import { IPoint } from "./EdgeDetectionRay";

export default class DetectionRay {
  raycaster!: Raycaster;
  ray!: Raycaster.Ray;
  target!: Phaser.Tilemaps.TilemapLayer | Phaser.GameObjects.GameObject;
  source!: BaseSprite;
  intersects: Array<Phaser.Geom.Point> = [];
  debug = {
    enabled: true, //enable debug mode
    maps: true, //enable maps debug
    rays: true, //enable rays debug
    graphics: {
      ray: 0x00ff00, //debug ray color; set false to disable
      rayPoint: 0xff00ff, //debug ray point color; set false to disable
      mapPoint: 0x00ffff, //debug map point color; set false to disable
      mapSegment: 0x0000ff, //debug map segment color; set false to disable
      mapBoundingBox: 0xff0000, //debug map bounding box color; set false to disable
    },
  };
  constructor(
    scene: GameScene,
    source: BaseSprite,
    target: Phaser.Tilemaps.TilemapLayer | Phaser.GameObjects.GameObject
  ) {
    this.source = source;
    this.target = target;
    this.raycaster = scene.raycasterPlugin.createRaycaster({
      boundingBox: new Phaser.Geom.Rectangle(
        0,
        0,
        scene.config.mapWidth,
        scene.config.mapHeight
      ),
      debug: this.debug,
    });
    if (target instanceof Phaser.Tilemaps.TilemapLayer) {
      this.raycaster.mapGameObjects(target, false, {
        collisionTiles: [...Array(target.tileset[0].total).keys()],
      });
    } else {
      this.raycaster.mapGameObjects(target);
    }
    this.ray = this.raycaster.createRay({ detectionRange: 50 });
    this.ray.enablePhysics();
  }

  refreshRay() {
    if (!this.source?.body) return;
    this.ray.setOrigin(this.source.body.center.x, this.source.body.center.y);
    this.ray.setAngle(this.source.visionAngle);
    const intersections = this.ray.castCone() as Array<IPoint>;
    this.intersects = intersections.filter((i) => i.object);
  }
}
