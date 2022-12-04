type GConstructor<T = {}> = new (...args: any[]) => T;

export type Spritable = GConstructor<Phaser.Physics.Arcade.Sprite>;

export function WithCollision<TBase extends Spritable>(Base: TBase) {
  return class extends Base {
    addCollider(
      object: Phaser.GameObjects.GameObject,
      callback?: ArcadePhysicsCallback
    ) {
      this.scene.physics.add.collider(this, object, callback, undefined, this);
    }
  };
}

export interface Collidable {
  addCollider: (
    object: Phaser.GameObjects.GameObject,
    callback?: ArcadePhysicsCallback
  ) => void;
}
