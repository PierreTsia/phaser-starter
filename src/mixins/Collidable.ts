import BaseSprite from "../sprites/BaseSprite";

type GConstructor<T = {}> = new (...args: any[]) => T;

export type SpriteConstructor = GConstructor<BaseSprite>;

export function WithCollision<TBase extends SpriteConstructor>(Base: TBase) {
  return class extends Base {
    addCollider(
      object: Phaser.GameObjects.GameObject,
      callback?: ArcadePhysicsCallback
    ) {
      this.scene.physics.add.collider(this, object, callback, undefined, this);
      return this;
    }
  };
}

export interface Collidable {
  addCollider: (
    object: Phaser.GameObjects.GameObject,
    callback?: ArcadePhysicsCallback
  ) => this;
}
