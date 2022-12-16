import { IPlayer } from "../../sprites/Player";
import { IEnemy } from "../../sprites/mobs/Enemy";

export default class Collisions {
  onPlayerCollidesEnemy = (player: IPlayer, _enemy: IEnemy) => {
    player.takesDamage();
  };
}
