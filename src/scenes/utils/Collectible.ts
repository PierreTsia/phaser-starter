export default class Collectible extends Phaser.Physics.Arcade.Sprite {
  score = 10;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.anims.create({
      key: "diamond_shine",
      frames: [
        { key: "diamond_shine" },
        { key: "diamond_shine_2" },
        { key: "diamond_shine_3" },
        { key: "diamond_shine_4" },
        { key: "diamond_shine_5" },
        { key: "diamond_shine_6" },
      ],
      frameRate: 5,
      repeat: -1,
    });
    scene.tweens.add({
      targets: this,
      y: this.y - 2,
      duration: Phaser.Math.Between(600, 1200),
      repeat: -1,
      easy: "linear",
      yoyo: true,
    });
    this.setDepth(1);
  }
}
