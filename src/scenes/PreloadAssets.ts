import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
import { SpriteAnimations } from "../sprites/types";

export default class PreloadAssets extends BaseScene {
  constructor(config: GameConfig) {
    super("PreloadAssets", config);
  }
  preload() {
    this.load.tilemapTiledJSON("level_1", "assets/crystal_world_map.json");
    this.load.image("tiles", "assets/main_lev_build_1.png");
    this.load.image("iceball", "assets/weapons/iceball_001.png");

    this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
      frameWidth: 32,
      spacing: 32,
      frameHeight: 38,
    });
    this.load.spritesheet(
      "player_attack",
      "assets/player/throw_attack_sheet_1.png",
      {
        frameWidth: 32,
        spacing: 32,
        frameHeight: 38,
      }
    );
    this.load.spritesheet(
      SpriteAnimations.hit_effect,
      "assets/weapons/hit_effect_sheet.png",
      {
        frameWidth: 32,
        spacing: 32,
      }
    );
    this.load.spritesheet("bird_man", "assets/enemy/enemy_sheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("snake_man", "assets/enemy/enemy_sheet_2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }
  create() {
    this.scene.start("GameScene");
  }
}
