import BaseSprite, { AnimConfig, Direction } from "../BaseSprite";
import { Collidable } from "../../mixins/Collidable";
import GameScene from "../../scenes/GameScene";
import { IPlayer } from "../Player";
import EdgeDetectionRay from "../utilities/EdgeDetectionRay";
import Projectile from "../spells/Projectile";

export type IEnemy = Enemy & Collidable;

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

    super.animate(name, anims);
    /*scene.events.on(
      Phaser.Scenes.Events.UPDATE,
      () => this.detectPlayerProximity(scene.player),
      this
    );*/
  }

  detectPlayerProximity(player: IPlayer) {
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.x,
      player.y
    );

    if (distance < 100) {
      const direction = this.x > player.x ? "left" : "right";
      this.setVelocityX(0);
      this.attack(direction);
    }
  }

  takesHit(source: Projectile) {
    this._health -= source.damage;
    source.deliversHit();
    if (this._health <= 0) {
      this.die();
    }
  }

  die() {
    this.setActive(false);
    this.setVisible(false);
    this.body.reset(0, 0);
    this.destroy(true);
  }

  walk(direction: Direction) {
    if (!this.body) return;
    super.walk(direction);
    this.play("walk", true);
  }
  attack(direction: Direction) {
    this.turn(direction);
    this.play("attack", true);
  }

  turnAround(direction: Direction) {
    this.isTurning = true;
    this.currentDirection = direction === "right" ? "left" : "right";
    this.stand();
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.turn(this.currentDirection);
        this.moveToInitialPosition();
      },
    });

    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.isTurning = false;
        this.walk(this.currentDirection);
      },
    });
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

  update(time: number, delta: number) {
    if (!this.body) {
      return;
    }
    super.update(time, delta);
    this.edgeDetect.refreshRay();
    this.isOnPlatform = !this.edgeDetect.isOnEdge;
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
