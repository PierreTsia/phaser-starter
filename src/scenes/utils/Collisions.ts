import { IPlayer } from "../../sprites/Player";
import { IEnemy } from "../../sprites/Enemy";

export default class Collisions {
  onPlayerCollidesEnemy = (player: IPlayer, enemy: IEnemy) => {
    console.log("Collided with player");
    console.log(player, enemy);
    if (player.body.touching.down && enemy.body.touching.up) {
      enemy.destroy();
    } else {
      player.takesDamage();
    }
  };
}
