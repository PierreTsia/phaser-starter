import Phaser from "phaser";

import GameScene from "./scenes/GameScene";
import PreloadAssets from "./scenes/PreloadAssets";

const MAP_WIDTH = 1600;
const WIDTH = document.body.clientWidth;
const HEIGHT = 600;
const PLAYER_SPEED = 200;

type SceneType = typeof Scenes[number];
export type GameConfig = typeof SHARED_CONFIG;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  playerSpeed: PLAYER_SPEED,
  zoomFactor: 1.2,
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
