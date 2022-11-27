import Phaser from "phaser";
export const WIDTH = 800;
export const HEIGHT = 600;
export const GRAVITY = { y: 400 };
export const VELOCITY = 250;
export const SCROLL_SPEED = 150;

export default {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "game",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};
