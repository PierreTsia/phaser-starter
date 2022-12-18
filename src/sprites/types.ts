import Birdman from "./mobs/Birdman";
import Snakeman from "./mobs/Snakeman";
import { WithCollision } from "../mixins/Collidable";

const Enemies = {
  bird: Birdman,
  snake: Snakeman,
} as const;
export type EnemyName = keyof typeof Enemies;

export function EnemyFactory(name: EnemyName) {
  return WithCollision(Enemies[name]);
}

export enum SpriteAnimations {
  walk = "walk",
  idle = "idle",
  attack = "attack",
  damaged = "damaged",
  jump = "jump",
  throw = "throw",
  run = "run",
  hit_effect = "hit_effect",
  iceball_impact = "iceball_impact",
  fireball_impact = "fireball_impact",
}
