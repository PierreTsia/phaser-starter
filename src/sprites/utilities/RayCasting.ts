import GameScene from "../../scenes/GameScene";
import BaseSprite from "../BaseSprite";

export interface IRayCast {
  rayGraphics: Phaser.GameObjects.Graphics;
  tileHits: Phaser.Tilemaps.Tile[];
  platFormsLayer: Phaser.Tilemaps.TilemapLayer;
  hasHits: boolean;

  cast(): { hasHits: boolean; tiles: Phaser.Tilemaps.Tile[] };

  drawLine(
    body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    castLength: number
  ): void;

  drawDebug(layer: Phaser.Tilemaps.TilemapLayer): void;

  updateTilesInRange(ray: Phaser.Geom.Line): {
    hasHits: boolean;
    tiles: Phaser.Tilemaps.Tile[];
  };

  resetTileHits(): void;
}

export class RayCast implements IRayCast {
  rayGraphics: Phaser.GameObjects.Graphics;
  tileHits: Phaser.Tilemaps.Tile[];
  platFormsLayer: Phaser.Tilemaps.TilemapLayer;
  hasHits: boolean;
  sprite: BaseSprite;

  constructor(
    sprite: BaseSprite,
    scene: GameScene,
    platFormsLayer: Phaser.Tilemaps.TilemapLayer
  ) {
    scene.add.existing(
      (this.rayGraphics = new Phaser.GameObjects.Graphics(scene))
    );
    this.sprite = sprite;
    this.tileHits = [];
    this.hasHits = false;
    this.platFormsLayer = platFormsLayer;
  }

  cast(): { hasHits: boolean; tiles: Phaser.Tilemaps.Tile[] } {
    this.rayGraphics.clear();
    const ray = this.drawLine(this.sprite.body);
    return this.updateTilesInRange(ray);
  }

  drawLine(
    body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    castLength = 30
  ) {
    const line = new Phaser.Geom.Line();
    const { right, left, bottom } = body;
    const startX = this.sprite.flipX ? left : right;
    const range = this.sprite.flipX ? -castLength : castLength;
    return line.setTo(
      startX,
      body.center.y,
      startX + range,
      bottom + castLength
    );
  }

  drawDebug(layer: Phaser.Tilemaps.TilemapLayer) {
    const collidingTileColor = new Phaser.Display.Color(243, 134, 48, 100);
    layer.renderDebug(this.rayGraphics, {
      tileColor: null, // Non-colliding tiles
      collidingTileColor, // Colliding tiles
    });
  }

  updateTilesInRange(ray: Phaser.Geom.Line) {
    this.tileHits = this.platFormsLayer.getTilesWithinShape(ray, {
      isNotEmpty: true,
    });
    this.tileHits.forEach((tile) => {
      tile.setCollision(true);
    });

    return { hasHits: this.tileHits.length > 0, tiles: this.tileHits };
  }

  resetTileHits() {
    if (this.tileHits.length > 0) {
      this.tileHits.forEach((tile) => {
        tile.setCollision(false);
      });
    }
  }
}
