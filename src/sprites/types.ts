import Birdman from "./Birdman";
import Snakeman from "./Snakeman";
import { WithCollision } from "../mixins/Collidable";

const Enemies = {
  bird: Birdman,
  snake: Snakeman,
} as const;
export type EnemyName = keyof typeof Enemies;

export function EnemyFactory(name: EnemyName) {
  return WithCollision(Enemies[name]);
}
