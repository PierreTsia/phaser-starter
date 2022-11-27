export class Pipe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "pipe");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setPosition(x, y);
    this.setOrigin(0.5, 0);
  }
}
