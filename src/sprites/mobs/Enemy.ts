import BaseSprite, { AnimConfig, Direction } from "../BaseSprite";
import { Collidable } from "../../mixins/Collidable";
import GameScene from "../../scenes/GameScene";
import EdgeDetectionRay from "../utilities/EdgeDetectionRay";
import Projectile from "../spells/Projectile";
import { SpriteAnimations } from "../types";

export type IEnemy = Enemy & Collidable;
const animConfigs: AnimConfig = {
  hit_effect: {
    frameRate: 8,
    repeat: 0,
    frames: [0, 4],
  },
};

export default class Enemy extends BaseSprite {
  speed: number = 100;
  meleeRange: number = 1;
  currentDirection: Direction = "left";
  currentPatrolDistance: number = 0;
  maxPatrolDistance: number = 100;
  lastTurnTime: number = 0;
  edgeDetect!: EdgeDetectionRay;
  isOnPlatform: boolean = false;
  isTurning: boolean = false;
  private _health: number = 100;

  constructor(
    name: string,
    scene: GameScene,
    x: number,
    y: number,
    anims: AnimConfig
  ) {
    super(name, scene, x, y);
    this.platFormsLayer = scene.layers.platforms;
    scene.physics.add.existing(this);

    this.setImmovable(true);
    this.edgeDetect = new EdgeDetectionRay(scene, this, scene.layers.colliders);

    super.animate(name, { ...anims, ...animConfigs });
  }

  takesHit(source: Projectile) {
    this._health -= source.damage;
    source.deliversHit(this);
    this.anims.play(SpriteAnimations.hit_effect, true);
    this.anims.play(SpriteAnimations.damaged, true);
    if (this._health <= 0) {
      this.terminate();
    }
  }

  terminate() {
    this.setTint(0xff0000);
    this.setVelocity(0, -200);
    this.body.checkCollision.none = true;
    this.setCollideWorldBounds(false);
  }

  walk(direction: Direction) {
    if (!this.body) return;
    super.walk(direction);
    this.play(SpriteAnimations.walk, true);
  }
  attack(direction: Direction) {
    this.turn(direction);
    this.play(SpriteAnimations.attack, true);
  }

  turnAround(direction: Direction) {
    this.isTurning = true;
    this.currentDirection = direction === "right" ? "left" : "right";
    this.stand();

    this.turn(this.currentDirection);
    this.moveToInitialPosition();

    this.isTurning = false;
    this.walk(this.currentDirection);
  }

  private moveToInitialPosition() {
    if (!this.body) return;
    this.setPosition(
      this.x + (this.directionMultiplier * this.body.width) / 2,
      this.y
    );
  }

  private get directionMultiplier() {
    return this.currentDirection === "right" ? 1 : -1;
  }

  stand() {
    super.stand();
    this.play(SpriteAnimations.idle, true);
  }

  get isOutOfScene() {
    return this.getBounds().top > this.config.mapHeight;
  }

  update(time: number, delta: number) {
    if (!this.body) {
      return;
    }
    if (this.isOutOfScene) {
      this.destroy();
      return;
    }
    super.update(time, delta);
    this.edgeDetect.refreshRay();
    this.isOnPlatform = !this.edgeDetect.isOnEdge;
    if (this.isAnimPlaying(SpriteAnimations.damaged)) {
      return;
    }
    this.patrol(time);
  }

  private patrol(time: number) {
    if (
      this.isTurning ||
      !this.body ||
      !(this.body as Phaser.Physics.Arcade.Body).onFloor()
    ) {
      return;
    }
    if (!this.isOnPlatform || this.hasReachedXEdge()) {
      this.lastTurnTime = time;
      this.turnAround(this.currentDirection);
    } else {
      this.walk(this.currentDirection);
    }
  }
}
