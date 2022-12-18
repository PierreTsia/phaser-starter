import BaseScene from "./BaseScene";
import { GameConfig } from "../index";

export default class PreloadAssets extends BaseScene {
  constructor(config: GameConfig) {
    super("PreloadAssets", config);
  }
  preload() {
    this.load.tilemapTiledJSON("level_1", "assets/crystal_world_map.json");
    this.load.image("tiles", "assets/main_lev_build_1.png");

    this.load.image("iceball", "assets/weapons/iceball_001.png");
    this.load.image("iceball_2", "assets/weapons/iceball_002.png");

    this.load.image("iceball_impact", "assets/weapons/iceball_impact_001.png");
    this.load.image(
      "iceball_impact_2",
      "assets/weapons/iceball_impact_002.png"
    );
    this.load.image(
      "iceball_impact_3",
      "assets/weapons/iceball_impact_003.png"
    );

    this.load.image("fireball", "assets/weapons/improved_fireball_001.png");
    this.load.image("fireball_2", "assets/weapons/improved_fireball_002.png");
    this.load.image("fireball_3", "assets/weapons/improved_fireball_003.png");

    this.load.image("diamond", "assets/collectibles/diamond.png");
    this.load.image("diamond_shine", "assets/collectibles/diamond_big_01.png");
    this.load.image(
      "diamond_shine_2",
      "assets/collectibles/diamond_big_02.png"
    );
    this.load.image(
      "diamond_shine_3",
      "assets/collectibles/diamond_big_03.png"
    );
    this.load.image(
      "diamond_shine_4",
      "assets/collectibles/diamond_big_04.png"
    );
    this.load.image(
      "diamond_shine_5",
      "assets/collectibles/diamond_big_05.png"
    );
    this.load.image(
      "diamond_shine_6",
      "assets/collectibles/diamond_big_06.png"
    );

    this.load.image(
      "fireball_impact",
      "assets/weapons/improved_fireball_impact_001.png"
    );
    this.load.image(
      "fireball_impact_2",
      "assets/weapons/improved_fireball_impact_002.png"
    );
    this.load.image(
      "fireball_impact_3",
      "assets/weapons/improved_fireball_impact_003.png"
    );

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

    this.load.spritesheet("player_slide", "assets/player/slide_sheet.png", {
      frameWidth: 32,
      spacing: 32,
      frameHeight: 38,
    });

    this.load.spritesheet("bird_man", "assets/enemy/enemy_sheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("snake_man", "assets/enemy/enemy_sheet_2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("hit_effect", "assets/weapons/hit_effect_sheet.png", {
      frameWidth: 32,
      spacing: 32,
    });

    this.load.spritesheet("sword_attack", "assets/weapons/sword_sheet_1.png", {
      frameWidth: 52,
      frameHeight: 32,
      spacing: 16,
    });
  }
  create() {
    this.scene.start("GameScene");
  }
}
