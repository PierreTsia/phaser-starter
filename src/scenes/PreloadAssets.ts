import BaseScene from "./BaseScene";
import { GameConfig } from "../index";

export default class PreloadAssets extends BaseScene {
  constructor(config: GameConfig) {
    super("PreloadAssets", config);
  }
  preload() {
    this.load.tilemapTiledJSON("level_1", "assets/crystal_world_map.json");
    this.load.image("tiles", "assets/main_lev_build_1.png");

    this.load.image("player", "assets/player/movements/idle01.png");
  }
  create() {
    this.scene.start("GameScene");
  }
}
