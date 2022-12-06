import GameScene from "../GameScene";

export default class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  size = {
    width: 80,
    height: 8,
  };

  constructor(scene: GameScene, x: number, y: number, health: number) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar.setScrollFactor(0, 0);
    this.x = x;
    this.y = y;
    this.value = health;

    scene.add.existing(this.bar);
    this.draw(x, y);
  }

  get pixelPerHealth() {
    return this.value / this.size.width;
  }

  update(health: number) {
    this.value = health;
    const { x, y } = this;
    this.draw(x, y);
  }

  draw(
    x: number,
    y: number,
    width = this.size.width,
    height = this.size.height
  ) {
    console.log(this.pixelPerHealth);
    this.bar.clear();
    this.bar.fillStyle(this.getColor());
    this.bar.fillRect(x, y, width * this.pixelPerHealth, height);
  }

  private getColor() {
    if (this.pixelPerHealth > 0.5) {
      return 0x00ff00;
    } else if (this.pixelPerHealth > 0.25) {
      return 0xffff00;
    } else {
      return 0xff0000;
    }
  }
}
