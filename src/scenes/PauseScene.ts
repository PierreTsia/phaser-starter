import BaseScene from "./BaseScene";
import { GameConfig } from "../index";
export interface MenuItem {
  scene: string;
  text: string;
  textGO?: Phaser.GameObjects.Text;
}
export interface SetupMenuEvents {
  (item: MenuItem): void;
}
export default class PauseScene extends BaseScene {
  menu: MenuItem[] = [
    { scene: "PlayScene", text: "Continue" },
    { scene: "MenuScene", text: "Exit" },
  ];

  buttons: Phaser.GameObjects.Text[] = [];
  constructor(config: GameConfig) {
    super("PauseScene", config);
  }

  create() {
    this.add
      .text(this.screenCenter[0], 50, "Paused", this.fontOptions)
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
        console.log("clicked");
        if (button.text === "Continue") {
          this.scene.stop();
          this.scene.resume("GameScene");
        } else {
          console.log("exit");
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
