import BaseSprite, { AnimConfig, Direction } from "./BaseSprite";
import { Collidable } from "../mixins/Collidable";
import GameScene from "../scenes/GameScene";
import { IPlayer } from "./Player";

export type IEnemy = Enemy & Collidable;

export default class Enemy extends BaseSprite {
  speed: number = 100;
  meleeRange: number = 1;
  canMove: boolean = true;
  currentDirection: Direction = "left";
  isTurningAround: boolean = false;

  constructor(
    name: string,
    scene: GameScene,
    x: number,
    y: number,
    anims: AnimConfig
  ) {
    super(name, scene, x, y);
    this.platFormsLayer = scene.layers.platforms;

    this.setImmovable(true);

    super.animate(name, anims);
    scene.events.on(
      Phaser.Scenes.Events.UPDATE,
      () => this.detectPlayerProximity(scene.player),
      this
    );
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

  walk(direction: Direction) {
    super.walk(direction);
    this.play("walk", true);
  }
  attack(direction: Direction) {
    //this.setBodySize(this.width, 45);
    this.turn(direction);
    this.play("attack", true);
    //this.setBodySize(this.width + this.meleeRange, this.height);
  }

  turnAround(direction: Direction) {
    this.currentDirection = direction === "right" ? "left" : "right";
    console.log("turn around");
    this.turn(this.currentDirection);
    const directionMultiplier = this.currentDirection === "right" ? 1 : -1;
    this.setPosition(
      this.x + (directionMultiplier * this.body.width) / 2,
      this.y
    );
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.canMove = true;
        this.isTurningAround = false;
      },
    });
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.isTurningAround) {
      if (!this.hasHits || this.hasReachedXEdge()) {
        this.canMove = false;
      }

      if (this.canMove) {
        this.walk(this.currentDirection);
      } else {
        this.isTurningAround = true;
        this.stand();
        this.scene.time.addEvent({
          delay: 1000,
          callback: () => this.turnAround(this.currentDirection),
        });
      }
    }
  }
}
