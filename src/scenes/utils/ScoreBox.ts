import GameScene from "../GameScene";

export default class ScoreBox {
  fontSize = 20;
  container: Phaser.GameObjects.Container;
  score: number;
  text: Phaser.GameObjects.Text;
  image: Phaser.GameObjects.Image;

  constructor(scene: GameScene, x: number, y: number, score: number) {
    this.container = new Phaser.GameObjects.Container(scene, x, y);
    scene.add.existing(this.container);

    this.score = score;
    this.text = scene.add.text(0, 0, "0", {
      fontSize: `${this.fontSize}px`,
      color: "#ffffff",
    });
    this.image = scene.add
      .image(this.text.width + 5, 0, "diamond")
      .setOrigin(0)
      .setScale(1.3);

    this.container.add([this.text, this.image]);
    this.container.setScrollFactor(0, 0);
    this.container.setName("scoreBoard");
    this.container.setInteractive();
  }

  updateScoreboard(score: number) {
    this.text.setText(`${(this.score += score)}`);
    this.image.setX(this.text.width + 5);
  }
}
