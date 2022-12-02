import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
export interface MenuItem {
  scene: string | null;
  text: string;
}

export default class MenuScene extends BaseScene {
  menu: MenuItem[] = [
    { scene: "PlayScene", text: "Play" },
    { scene: "ScoreScene", text: "Score" },
    { scene: null, text: "Exit" },
  ];

  buttons: Phaser.GameObjects.Text[] = [];
  constructor(config: GameConfig) {
    super("MenuScene", config);
  }

  create() {
    super.create();

    this.add
      .text(this.screenCenter[0], 50, "Flappy Bird 🐥", this.fontOptions)
      .setOrigin(0.5);

    this.createMenu();
  }

  setupMenuEvents() {
    this.buttons.forEach((button) => {
      button.setInteractive();
      button.on("pointerover", () => {
        button.setStyle({ fill: "#ff0" });
      });
      button.on("pointerout", () => {
        button.setStyle({ fill: "#fff" });
      });
      button.on("pointerdown", () => {
        if (button.text === "Play") {
          this.scene.stop();
          this.scene.start("GameScene");
        } else {
          this.scene.start("MenuScene");
        }
      });
    });
  }
  createMenu() {
    let lastMenuPositionY = 0;
    this.buttons = [];
    const [x, y] = this.screenCenter;
    for (let i = 0; i < this.menu.length; i++) {
      const menuPosition: [number, number] = [x, y + lastMenuPositionY];
      this.buttons.push(
        this.add
          .text(...menuPosition, this.menu[i].text, this.fontOptions)
          .setOrigin(0.5, 1)
      );
      lastMenuPositionY += this.lineHeight;
    }

    this.setupMenuEvents();
  }
}
