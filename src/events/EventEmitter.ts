export enum GameEvents {
  PLAYER_LOOSE = "PLAYER_LOOSE",
  STOP_GAME = "STOP_GAME",
}

export enum GAME_STATUS {
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
}
export default class EventEmitter extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}
