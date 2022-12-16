import Phaser from "phaser";
import PhaserRaycaster from "phaser-raycaster";
import GameScene from "./scenes/GameScene";
import PreloadAssets from "./scenes/PreloadAssets";

const MAP_WIDTH = 1600;
const WIDTH = document.body.clientWidth;
const HEIGHT = 600;
const MAP_HEIGHT = 640;
const PLAYER_SPEED = 200;
const ZOOM_FACTOR = 1.5;

type SceneType = typeof Scenes[number];
export type GameConfig = typeof SHARED_CONFIG;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  mapWidth: MAP_WIDTH,
  mapHeight: MAP_HEIGHT,
  mapOffsetX: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  mapOffsetY: MAP_HEIGHT > HEIGHT ? MAP_HEIGHT - HEIGHT : 0,
  zoomFactor: ZOOM_FACTOR,
  debug: true,
  leftTopCorner: {
    x: (WIDTH - WIDTH / ZOOM_FACTOR) / 2,
    y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
  },
  rightTopCorner: {
    x: WIDTH / ZOOM_FACTOR + (WIDTH - WIDTH / ZOOM_FACTOR) / 2,
    y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
  },
  playerSpeed: PLAYER_SPEED,
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
      debug: false,
    },
  },
  scene: initScenes(),
  plugins: {
    scene: [
      {
        key: "PhaserRaycaster",
        plugin: PhaserRaycaster,
        mapping: "raycasterPlugin",
      },
    ],
  },
};

new Phaser.Game(config);
