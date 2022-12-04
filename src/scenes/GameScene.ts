import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
import Player, { IPlayer } from "../sprites/Player";
import { WithCollision } from "../mixins/Collidable";

const LAYERS = ["colliders", "environment", "platforms"] as const;

export default class GameScene extends BaseScene {
  player!: IPlayer;
  constructor(config: GameConfig) {
    super("GameScene", config);
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const PlayerWithCollision = WithCollision(Player);
    this.player = new PlayerWithCollision(this, 100, 100);
    this.player.addCollider(layers.colliders);
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
    colliders.setCollisionByProperty({ collides: true });
    return { environment, platforms, colliders };
  }
}
