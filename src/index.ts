import Phaser from "phaser";

import GameScene from "./scenes/GameScene";
import PreloadAssets from "./scenes/PreloadAssets";

const WIDTH = 800;
const HEIGHT = 600;

type SceneType = typeof Scenes[number];
export type GameConfig = typeof SHARED_CONFIG;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#33A5E7",
};

const createScene = (Scene: SceneType) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);
const Scenes = [PreloadAssets, GameScene] as const;

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
