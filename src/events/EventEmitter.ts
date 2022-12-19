export enum GameEvents {
  PLAYER_LOOSE = "PLAYER_LOOSE",
}
export default class EventEmitter extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}
