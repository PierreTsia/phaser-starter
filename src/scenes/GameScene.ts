import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
import Player, { IPlayer } from "../sprites/Player";
import { WithCollision } from "../mixins/Collidable";
import { EnemyFactory, EnemyName } from "../sprites/types";

const LAYERS = ["colliders", "environment", "platforms"] as const;
const ZONES = ["startZone", "endZone"] as const;
type ZoneName = typeof ZONES[number];
type LayerName = typeof LAYERS[number];

type LayerMap = Record<LayerName, Phaser.Tilemaps.TilemapLayer>;

export default class GameScene extends BaseScene {
  player!: IPlayer;
  layers!: LayerMap;
  graphics!: Phaser.GameObjects.Graphics;
  line: Phaser.Geom.Line = new Phaser.Geom.Line();

  constructor(config: GameConfig) {
    super("GameScene", config);
  }

  create() {
    const map = this.createMap();
    this.layers = this.createLayers(map);
    const { start, end } = this.createPlayerZones(map);
    this.initPlayer(start);
    this.initEndOfLevel(end);
    this.initCameras();
    this.physics.world.setBounds(...this.bounds);
    this.populateWithEnemies(map);
  }

  private populateWithEnemies(map: Phaser.Tilemaps.Tilemap) {
    const spawns = this.createSpawningZones(map);
    spawns.forEach((spawn) => {
      const enemyName: EnemyName = spawn.properties?.find(
        (p: { name: string }) => p.name === "enemy"
      )?.value;

      const EnemyClass = EnemyFactory(enemyName);
      const enemy = new EnemyClass(this, spawn.x!, spawn.y!);
      enemy.addCollider(this.layers.colliders).addCollider(this.player);
      enemy.walk(enemy.currentDirection);
    });
  }

  private initPlayer(start: Phaser.Types.Tilemaps.TiledObject) {
    const PlayerWithCollision = WithCollision(Player);
    this.player = new PlayerWithCollision(this, start.x!, start.y!);
    this.player.addCollider(this.layers.colliders);
  }

  private createPlayerZones(map: Phaser.Tilemaps.Tilemap) {
    const playerZones = map.getObjectLayer("player_zones").objects;
    return {
      start: this.findObjectLayer("startZone", playerZones)!,
      end: this.findObjectLayer("endZone", playerZones)!,
    };
  }
  private createSpawningZones(map: Phaser.Tilemaps.Tilemap) {
    return map.getObjectLayer("enemy_spawns").objects;
  }

  private findObjectLayer(
    name: ZoneName,
    zones: Phaser.Types.Tilemaps.TiledObject[]
  ) {
    return zones.find((o) => o.name === name);
  }

  private initCameras() {
    this.cameras.main.startFollow(this.player).setZoom(this.config.zoomFactor);
    this.cameras.main.setBounds(...this.bounds);
  }

  private initEndOfLevel(end: Phaser.Types.Tilemaps.TiledObject) {
    const endOfLevel = this.physics.add
      .sprite(end.x!, end.y!, "end")
      .setAlpha(0)
      .setSize(5, this.config.height)
      .setOrigin(0.5, 1);

    const eolOverlap = this.physics.add.overlap(this.player, endOfLevel, () => {
      eolOverlap.active = false;
      console.log("Payer has won!");
    });
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
