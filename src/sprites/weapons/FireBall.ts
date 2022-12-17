import GameScene from "../../scenes/GameScene";
import Projectiles from "./Projectiles";

export default class FireBall extends Projectiles {
  constructor(scene: GameScene) {
    super(scene, "fireball", {
      coolDown: 200,
      speed: 200,
      range: 300,
      damage: 30,
    });
  }
}
