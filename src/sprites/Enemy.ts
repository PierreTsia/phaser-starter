import BaseSprite, { AnimConfig, Direction } from "./BaseSprite";
import { Collidable } from "../mixins/Collidable";
import GameScene from "../scenes/GameScene";
import { IPlayer } from "./Player";

export type IEnemy = Enemy & Collidable;

export default class Enemy extends BaseSprite {
  speed: number = 100;
  meleeRange: number = 1;

  constructor(
    name: string,
    scene: GameScene,
    x: number,
    y: number,
    anims: AnimConfig
  ) {
    super(name, scene, x, y);

    this.setImmovable(true);

    super.animate(name, anims);

    scene.events.on(
      Phaser.Scenes.Events.UPDATE,
      () => this.calculatePlayerDistance(scene.player),
      this
    );
  }

  calculatePlayerDistance(player: IPlayer) {
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.x,
      player.y
    );
    console.log("update from enemy", distance);
    if (distance < 100) {
      const direction = this.x > player.x ? "left" : "right";
      this.setVelocityX(0);
      this.attack(direction);
    } else {
      this.stand();
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
}
