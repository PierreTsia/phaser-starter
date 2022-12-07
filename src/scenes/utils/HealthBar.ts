import GameScene from "../GameScene";

export default class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  scale: number = 1;
  size = {
    width: 80,
    height: 8,
  };

  pixelPerHp: number;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    health: number,
    scale = 1.2
  ) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar.setScrollFactor(0, 0);
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.value = health;
    this.pixelPerHp = this.size.width / health;

    scene.add.existing(this.bar);
    this.draw(x, y);
  }

  update(health: number) {
    this.value = health;
    const { x, y } = this;
    this.draw(x, y);
  }

  draw(x: number, y: number) {
    const margin = 2;
    const hpWidth =
      this.value * this.pixelPerHp > margin
        ? this.value * this.pixelPerHp
        : margin;
    this.bar.clear();
    // border
    this.bar.fillStyle(0x677a3c);
    this.bar.fillRect(
      x,
      y,
      this.size.width + margin,
      this.size.height + margin
    );
    // fill
    this.bar.fillStyle(0x96b389);
    this.bar.fillRect(
      x + margin,
      y + margin,
      this.size.width - margin,
      this.size.height - margin
    );

    // hp bar
    this.bar.fillStyle(this.getColor());
    this.bar.fillRect(
      x + margin,
      y + margin,
      hpWidth - margin,
      this.size.height - margin
    );
  }

  private getColor() {
    if (this.value * this.pixelPerHp > 0.5 * this.size.width) {
      return 0x56af36;
    } else if (this.value * this.pixelPerHp > 0.25 * this.size.width) {
      return 0xffff00;
    } else {
      return 0xff0000;
    }
  }
}
