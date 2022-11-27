import Phaser from "phaser";
import config from "./config";
import FlappyBirdGame from "./scenes/Game";

new Phaser.Game(
  Object.assign(config, {
    scene: [FlappyBirdGame],
  })
);
