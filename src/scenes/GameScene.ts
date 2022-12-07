import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
import Player, { IPlayer } from "../sprites/Player";
import { WithCollision } from "../mixins/Collidable";
import { EnemyFactory, EnemyName } from "../sprites/types";
import Collisions from "./utils/Collisions";
import { IEnemy } from "../sprites/Enemy";

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
  collisions: Collisions = new Collisions();
  raycasterPlugin!: PhaserRaycaster;
  raycaster!: Raycaster;
  ray!: Raycaster.Ray;
  lastUpdate = 0;

  constructor(config: GameConfig) {
    super("GameScene", config);
  }

  create() {
    this.raycaster = this.raycasterPlugin.createRaycaster({
      boundingBox: new Phaser.Geom.Rectangle(
        0,
        0,
        this.config.mapWidth,
        this.config.mapHeight
      ),
      debug: {
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
      },
    });

    const map = this.createMap();
    this.layers = this.createLayers(map);
    const { start, end } = this.createPlayerZones(map);
    this.initPlayer(start);

    // TODO TEMP RAY

    console.log(this.layers.colliders);
    console.log(this.layers.colliders.tileset);
    this.raycaster.mapGameObjects(this.layers.colliders, false, {
      collisionTiles: [...Array(this.layers.colliders.tileset[0].total).keys()],
    });
    //console.log(this.raycaster);

    this.ray = this.raycaster.createRay({ detectionRange: 200 });

    this.initEndOfLevel(end);
    this.initCameras();
    this.physics.world.setBounds(...this.bounds);
    this.populateWithEnemies(map);
  }

  update(supertime: number, delta: number) {
    //this.ray.autoSlice = true;
    //enable arcade physics body
    this.ray.enablePhysics();
    this.ray.setOrigin(this.player.body.center.x, this.player.body.center.y);
    this.ray.setAngle(this.player.visionAngle);
    const intersections = (this.ray.cast() as Phaser.Geom.Point) && {
      object: Phaser.GameObjects.GameObject,
    };

    // execute only after one second
    let timeSinceLastUpdate = supertime - this.lastUpdate;
    if (timeSinceLastUpdate > 5000) {
      // console.log(supertime, delta);
      //enable auto slicing field of view

      // console.log("===>", visibleObjects);
      console.log(intersections);
      // console.log(intersections instanceof Phaser.Geom.Point);
      // ddistance between player and first intersection

      if (!intersections?.object) {
        this.player.setTint(0xff0000);
      } else {
        this.player.clearTint();
      }
      this.lastUpdate = supertime;
    }
  }

  private populateWithEnemies(map: Phaser.Tilemaps.Tilemap) {
    const spawns = this.createSpawningZones(map);
    spawns.forEach((s) => this.summonEnemy(s));
  }

  summonEnemy(spawn: Phaser.Types.Tilemaps.TiledObject) {
    const enemy = this.createEnemy(spawn);
    this.createEnemyColliders(enemy);
    enemy.walk(enemy.currentDirection);
  }

  private createEnemyColliders(enemy: IEnemy) {
    enemy
      .addCollider(this.layers.colliders)
      .addCollider(this.player, () =>
        this.collisions.onPlayerCollidesEnemy(this.player, enemy)
      );
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
