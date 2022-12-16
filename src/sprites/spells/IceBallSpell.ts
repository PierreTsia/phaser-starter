import GameScene from "../../scenes/GameScene";
import Projectiles from "./Projectiles";

export default class IceBallSpell extends Projectiles {
  constructor(scene: GameScene) {
    super(scene, "iceball", {
      coolDown: 200,
      speed: 500,
      range: 400,
      damage: 30,
    });
  }
}
