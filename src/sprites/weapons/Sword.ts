import MeleeWeapon from "./MeleeWeapon";
import GameScene from "../../scenes/GameScene";

export default class Sword extends MeleeWeapon {
  constructor(scene: GameScene) {
    super(scene, "sword_attack", { damage: 100, attackSpeed: 1000 });
  }
}
