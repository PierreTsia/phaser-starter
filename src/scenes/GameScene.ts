import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
import Player, { IPlayer } from "../sprites/Player";
import { WithCollision } from "../mixins/Collidable";
import { EnemyFactory, EnemyName } from "../sprites/types";
import Collisions from "./utils/Collisions";
import { IEnemy } from "../sprites/mobs/Enemy";
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import debounce from "lodash/debounce";
import Projectile from "../sprites/weapons/Projectile";
import MeleeWeapon from "../sprites/weapons/MeleeWeapon";
import GameObject = Phaser.GameObjects.GameObject;
import Birdman from "../sprites/mobs/Birdman";
import Snakeman from "../sprites/mobs/Snakeman";
import { DebouncedFunc } from "lodash";
import Collectible from "./utils/Collectible";
import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import ScoreBox from "./utils/ScoreBox";
import EventEmitter, { GameEvents } from "./../events/EventEmitter";

const LAYERS = ["colliders", "environment", "platforms", "traps"] as const;
const ZONES = ["startZone", "endZone"] as const;
type ZoneName = typeof ZONES[number];
type LayerName = typeof LAYERS[number];

type LayerMap = Record<LayerName, Phaser.Tilemaps.TilemapLayer>;

export default class GameScene extends BaseScene {
  player!: IPlayer;
  layers!: LayerMap;
  graphics!: Phaser.GameObjects.Graphics;
  line: Phaser.Geom.Line = new Phaser.Geom.Line();
  collisions: Collisions = new Collisions();
  raycasterPlugin!: PhaserRaycaster;
  enemies: Phaser.GameObjects.Group;
  collectibles!: StaticGroup;
  scoreBox!: ScoreBox;
  score: number = 0;
  eventEmitter = new EventEmitter();

  constructor(config: GameConfig) {
    super("GameScene", config);
    this.enemies = new Phaser.GameObjects.Group(this);
  }

  create() {
    const map = this.createMap();
    this.layers = this.createLayers(map);
    this.collectibles = this.spawnCollectibles(map);
    this.physics.world.setBounds(...this.bounds);
    const { start, end } = this.createPlayerZones(map);
    this.initPlayer(start);
    this.initEndOfLevel(end);
    this.populateWithEnemies(map);
    this.initCameras();
    const { rightTopCorner } = this.config;
    this.scoreBox = new ScoreBox(
      this,
      rightTopCorner.x - 50,
      rightTopCorner.y + 10,
      this.score
    );

    this.eventEmitter.on(GameEvents.PLAYER_LOOSE, () => {
      this.scene.restart();
    });
  }

  spawnCollectibles(map: Phaser.Tilemaps.Tilemap) {
    const collectibles = map.getObjectLayer("collectibles").objects;
    const collectiblesGroup = this.physics.add.staticGroup();
    collectibles.forEach((c) => {
      const collectibleName = c.properties?.find(
        (p: { name?: string }) => p.name === "collectible_type"
      )?.value;
      const collectible = new Collectible(this, c.x!, c.y!, collectibleName);

      collectiblesGroup.add(collectible);
    });
    collectiblesGroup.playAnimation("diamond_shine");
    return collectiblesGroup;
  }

  getEnemiesSpellCasts() {
    type Enemy = Birdman | Snakeman;
    return this.enemies.getChildren().reduce((acc, e: GameObject) => {
      if ((e as Enemy)?.spellCast) {
        acc.push(...((e as Enemy)?.spellCast?.getChildren() as Projectile[]));
      }
      return acc;
    }, [] as GameObject[]);
  }

  private populateWithEnemies(map: Phaser.Tilemaps.Tilemap) {
    const spawns = this.createSpawningZones(map);
    spawns.forEach((s) => {
      const enemy = this.summonEnemy(s);
      this.enemies.add(enemy);
      enemy.walk(enemy.currentDirection);
    });
    this.enablePlayerCollidesSpellcasts();
  }

  enablePlayerCollidesSpellcasts() {
    this.player.addOverlap(
      this.getEnemiesSpellCasts(),
      (player, projectile) => {
        (player as Player).takesDamage(projectile as Projectile);
      }
    );
  }

  summonEnemy(spawn: Phaser.Types.Tilemaps.TiledObject) {
    const enemy = this.createEnemy(spawn);
    this.createEnemyColliders(enemy);
    return enemy;
  }

  private createEnemyColliders(enemy: IEnemy) {
    enemy
      .addCollider(this.layers.colliders)
      .addOverlap(this.player, () =>
        this.collisions.onPlayerCollidesEnemy(this.player, enemy)
      )
      .addCollider(
        this.player.projectiles,
        this.onWeaponHit.bind(this) as ArcadePhysicsCallback
      )
      .addOverlap(
        this.player.meleeWeapon,
        debounce(
          this.onWeaponHit.bind(this),
          20
        ) as DebouncedFunc<ArcadePhysicsCallback>
      );
  }

  onWeaponHit(enemy: GameObjectWithBody, weapon: Projectile | MeleeWeapon) {
    (enemy as IEnemy).takesHit(weapon);
  }

  private createEnemy(spawn: Phaser.Types.Tilemaps.TiledObject): IEnemy {
    const enemyName = this.getEnemyName(spawn);
    const EnemyClass = EnemyFactory(enemyName);
    return new EnemyClass(this, spawn.x!, spawn.y!);
  }

  private getEnemyName(spawn: Phaser.Types.Tilemaps.TiledObject): EnemyName {
    return (
      spawn.properties?.find((p: { name: string }) => p.name === "enemy")
        ?.value ?? "bird"
    );
  }

  private initPlayer(start: Phaser.Types.Tilemaps.TiledObject) {
    const PlayerWithCollision = WithCollision(Player);
    this.player = new PlayerWithCollision(this, start.x!, start.y!);
    this.player
      .addCollider(this.layers.colliders)
      .addCollider(this.layers.traps, (player) => {
        const damage = this.getTrapsDamages();
        (player as IPlayer).takesDamage({ damage });
      });
    this.player.addOverlap(
      this.collectibles,
      this.onCollect.bind(this) as ArcadePhysicsCallback
    );
  }

  getTrapsDamages() {
    const prop: any = this.layers.traps.layer.properties?.find(
      (p: any) => p?.name === "damage"
    );
    return prop?.value ?? 0;
  }

  onCollect(_player: any, collectible: Collectible) {
    this.scoreBox.updateScoreboard(collectible.score);
    collectible.destroy();
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
    const [colliders, environment, platforms, traps] = LAYERS.map((layer) =>
      map.createLayer(layer, tileset)
    );
    colliders.setCollisionByProperty({ collides: true });
    traps.setCollisionByExclusion([-1]);
    return { environment, platforms, colliders, traps };
  }
}
