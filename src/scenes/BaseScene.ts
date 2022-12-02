import { GameConfig } from "../index";
import { MenuItem, SetupMenuEvents } from "./PauseScene";

export default class BaseScene extends Phaser.Scene {
  config: GameConfig;
  screenCenter: [number, number];
  fontSize: number;
  lineHeight: number;
  fontOptions: { fontSize: string; fill: string };
  constructor(key: string, config: GameConfig) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#fff" };
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createMenu(menu: MenuItem[], setupMenuEvents: SetupMenuEvents) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem) => {
      console.log(this);
      const [x, y] = this.screenCenter;

      const menuPosition: [number, number] = [x, y + lastMenuPositionY];
      menuItem["textGO"] = this.add
        .text(...menuPosition, menuItem.text, this.fontOptions)
        .setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);
    });
  }
}
