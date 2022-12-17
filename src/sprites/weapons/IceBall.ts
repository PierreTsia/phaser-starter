import GameScene from "../../scenes/GameScene";
import Projectiles from "./Projectiles";

export default class IceBall extends Projectiles {
  constructor(scene: GameScene) {
    super(scene, "iceball", {
      coolDown: 200,
      speed: 400,
      range: 200,
      damage: 30,
    });
  }
}
