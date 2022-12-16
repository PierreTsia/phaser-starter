import { GameConfig } from "../index";
import GameScene from "../scenes/GameScene";

export type Direction = "left" | "right";
export interface AnimConfig {
  [key: string]: {
    frameRate: number;
    repeat: number;
    frames: [number, number];
  };
}
export default class BaseSprite extends Phaser.Physics.Arcade.Sprite {
  config: GameConfig;
  speed: number = 300;
  platFormsLayer: Phaser.Tilemaps.TilemapLayer;
  lastUpdatePostion: [number, number] = [0, 0];

  constructor(key: string, scene: GameScene, x: number, y: number) {
    super(scene, x, y, key);
    this.config = scene.config;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.lastUpdatePostion = [x, y];

    this.platFormsLayer = scene.layers.platforms;

    this.setOrigin(0.5, 1);
    this.setGravity(0, 800);
    this.setCollideWorldBounds(true);
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  animate(spriteName: string, animConfig: AnimConfig) {
    Object.entries(animConfig).forEach(([key, config]) => {
      const { frameRate, repeat, frames } = config;
      const [start, end] = frames;
      this.anims.create({
        key,
        repeat,
        frameRate,
        frames: this.anims.generateFrameNumbers(spriteName, {
          start,
          end,
        }),
      });
    });
  }

  isOnTheGround() {
    return this.body.blocked.down;
  }

  move(direction: Direction, modifier = 1) {
    const velocity =
      direction === "left" ? -this.speed * modifier : this.speed * modifier;
    this.setVelocityX(velocity);
  }

  turn(direction: Direction = "right") {
    this.setFlipX(direction === "left");
  }

  run(direction: Direction) {
    this.turn(direction);
    this.move(direction);
  }
  walk(direction: Direction) {
    this.turn(direction);
    this.move(direction, 0.5);
  }
  stand() {
    this.setVelocityX(0);
  }

  get isFacingLeft() {
    return this.flipX;
  }

  get watchYourFeetAngle() {
    return this.isFacingLeft ? 120 : 60;
  }

  hasReachedXEdge() {
    return this.body.blocked.left || this.body.blocked.right;
  }
}
