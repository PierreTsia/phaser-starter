import GameScene from "../scenes/GameScene";
import Projectiles from "./Projectiles";

export default class IceBallSpell extends Projectiles {
  constructor(scene: GameScene) {
    super(scene, "iceball", {
      coolDown: 600,
      speed: 800,
      range: 400,
    });
    this.coolDown = 100;
  }
}
