import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
import Player from "../sprites/Player";

const LAYERS = ["colliders", "environment", "platforms"] as const;

export default class GameScene extends BaseScene {
  player!: Player;
  constructor(config: GameConfig) {
    super("GameScene", config);
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    this.player = new Player(this, 100, 200);
    this.physics.add.collider(this.player, layers.colliders);
  }

  private createMap() {
    const map = this.make.tilemap({ key: "level_1" });
    map.addTilesetImage("main_lev_build_1", "tiles");
    return map;
  }

  private createLayers(map: Phaser.Tilemaps.Tilemap) {
    const tileset = map.getTileset("main_lev_build_1");
    const [colliders, environment, platforms] = LAYERS.map((layer) =>
      map.createLayer(layer, tileset)
    );
    colliders.setCollisionByExclusion([-1], true);
    return { environment, platforms, colliders };
  }
}
