import BaseSprite from "../sprites/BaseSprite";
import Projectiles from "../sprites/weapons/Projectiles";

type GConstructor<T = {}> = new (...args: any[]) => T;

type CollidingObject =
  | Phaser.GameObjects.GameObject
  | Phaser.GameObjects.GameObject[]
  | Projectiles;

export type SpriteConstructor = GConstructor<BaseSprite>;

export function WithCollision<TBase extends SpriteConstructor>(Base: TBase) {
  return class extends Base {
    addCollider(object: CollidingObject, callback?: ArcadePhysicsCallback) {
      this.scene.physics.add.collider(this, object, callback, undefined, this);
      return this;
    }

    addOverlap(
      object: Phaser.GameObjects.GameObject,
      callback?: ArcadePhysicsCallback
    ) {
      this.scene.physics.add.overlap(this, object, callback, undefined, this);
      return this;
    }
  };
}

export interface Collidable {
  addCollider: (
    object: CollidingObject,
    callback?: ArcadePhysicsCallback
  ) => this;

  addOverlap: (
    object: Phaser.GameObjects.GameObject,
    callback?: ArcadePhysicsCallback
  ) => this;
}
