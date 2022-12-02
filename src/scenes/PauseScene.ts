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
  constructor(config: GameConfig) {
    super("PauseScene", config);
    //this.createMenu(this.menu, (m) => this.setupMenuEvents(m));
  }

  create() {
    super.create();
    this.add
      .text(...this.screenCenter, "Paused", this.fontOptions)
      .setOrigin(0.5);
  }

  setupMenuEvents(menuItem: MenuItem) {
    const textGO = menuItem.textGO!;
    textGO.setInteractive();

    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#fff" });
    });

    textGO.on("pointerup", () => {
      if (menuItem.scene && menuItem.text === "Continue") {
        // Shutting down the Pause Scene and resuming the Play Scene
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        // Shutting PlayScene, PauseScene and running Menu
        this.scene.stop("PlayScene");
        this.scene.start(menuItem.scene);
      }
    });
  }
}
