import { MoveFn } from "boardgame.io";
import { TilePlaceholderProps } from "../../components/azul/TilePlaceholder";
import { GetTileLocationId } from "./azulConfig";
import { AzulGameState, AzulTileState, BoardType, TileLocation } from "./models";

export const INVALID_MOVE = "INVALID_MOVE";

export const selectSourceTile: MoveFn<AzulGameState> = (G, ctx, tile: AzulTileState) => {
  if (!tile.selectable) return INVALID_MOVE;

  // reset selection
  G.tiles.forEach(x => x.selected = false);

  // select all tiles of same color on same board
  const newSelection = G.tiles.filter(x => x.location.boardType === tile.location.boardType &&
    x.location.boardId === tile.location.boardId &&
    x.color === tile.color
  );
  newSelection.forEach(x => x.selected = true);

  console.log('Selected Tiles: ', newSelection.length, tile.location.boardType, tile.location.boardId);

  // Placeholder selectable machen?
};

export const selectScoreTargetLocation: MoveFn<AzulGameState> = (G, ctx, target: TilePlaceholderProps) => {
  if (target.location.boardId === undefined || target.location.boardType !== "Wall") return INVALID_MOVE;
  const maxTilesInRow = target.location.y! + 1;

  // get tiles
  const tiles = G.tiles.filter(x =>
    x.location.boardType === "PatternLine" &&
    x.location.boardId === target.location.boardId &&
    x.location.y === target.location.y &&
    x.color === target.color
  );

  if (tiles.length < maxTilesInRow) return INVALID_MOVE;

  // move tile
  moveTile(tiles[0], "Wall", target.location.boardId, target.location.x, target.location.y);

  // move rest to store
  for (let i = 1; i < maxTilesInRow; i++) {
    moveTile(tiles[i], "TileStorage");
  }

  // calculare score
  let points = 1;
  // TODO:

  G.score[target.location.boardId] += points * target.multiplier!;
}

// move all selected tiles to new board
export const selectTargetLocation: MoveFn<AzulGameState> = (G, ctx, target: TilePlaceholderProps) => {
  if (target.location.boardId !== ctx.currentPlayer) return INVALID_MOVE;
  if (ctx.playerID && ctx.playerID !== ctx.currentPlayer) return INVALID_MOVE;

  if (ctx.phase === 'calculateScore') return selectScoreTargetLocation(G, ctx, target);

  var selectedTiles = G.tiles.filter(x => x.selected);
  if (!selectedTiles.length) return INVALID_MOVE;

  // get source factory
  const sourceBoardType = selectedTiles[0].location.boardType
  const sourceBoardId = selectedTiles[0].location.boardId;

  if (target.location.boardType === 'FloorLine') {
    moveToFloorLine(G, selectedTiles, target.location.boardId);
  } else if (target.location.boardType === 'PatternLine') {
    if (!canMoveToPatternLine(G, selectedTiles, target.location.boardId, target.location.y!)) {
      console.log('invalid target');
      return INVALID_MOVE;
    }
    moveToPatternLine(G, selectedTiles, target.location.boardId, target.location.y!);
  } else {
    return INVALID_MOVE;
  }

  // move remaining tiles from factory to CenterOfTable
  if (sourceBoardType === 'Factory') {
    var factoryTiles = G.tiles.filter(x =>
      x.location.boardType === 'Factory' &&
      x.location.boardId === sourceBoardId
    );
    var centerTiles = G.tiles.filter(x => x.location.boardType === 'CenterOfTable');
    let counter = centerTiles.length;
    factoryTiles.forEach(x => moveTile(x, 'CenterOfTable', undefined, counter++));
  }

  // move white tile to floor line
  if (sourceBoardType === 'CenterOfTable') {
    const whiteTile = G.tiles.find(x => x.color === 'white');
    if (whiteTile?.location.boardType === 'CenterOfTable') {
      moveToFloorLine(G, [whiteTile], target.location.boardId);
    }
  }

  // rearrange + sort center Tiles
  var centerTiles = G.tiles
    .filter(x => x.location.boardType === 'CenterOfTable')
    .sort((a, b) => ('' + b.color).localeCompare(a.color));
  let counter = 0;
  centerTiles.forEach(x => moveTile(x, 'CenterOfTable', undefined, counter++));

  // reset selection
  G.tiles.forEach(x => x.selected = false);
};

export const moveTile = (tile: AzulTileState, boardType: BoardType, boardId?: string | number, x?: number, y?: number) => {
  // console.log('move to ' + boardType + ' from', GetTileLocationId(tile.location));
  tile.location = { boardType, boardId: "" + boardId, x, y };
};

export const canMoveToPatternLine = (G: AzulGameState, tiles: AzulTileState[], boardId: string, y: number): boolean => {
  const maxTilesOnLine = y + 1;

  // is white?
  if (tiles[0].color === 'white') return false;

  // get tiles on PatternLine
  const patternLineTiles = G.tiles.filter(x =>
    x.location.boardType === 'PatternLine' &&
    x.location.boardId === boardId &&
    x.location.y === y
  );

  // full?
  if (patternLineTiles.length >= maxTilesOnLine) return false;

  // wrong color?
  if (patternLineTiles.length && patternLineTiles[0].color !== tiles[0].color) return false;

  // color already on wall?
  const wallTiles = G.tiles.filter(x =>
    x.location.boardType === 'Wall' &&
    x.location.boardId === boardId &&
    x.location.y === y &&
    x.color === tiles[0].color
  );
  if (wallTiles.length) return false;

  // valid
  return true;
};

export const moveToPatternLine = (G: AzulGameState, tiles: AzulTileState[], boardId: string, y: number): void => {
  // get tiles on PatternLine
  const patternLineTiles = G.tiles.filter(x =>
    x.location.boardType === 'PatternLine' &&
    x.location.boardId === boardId &&
    x.location.y === y
  );
  const maxTilesOnLine = y + 1;

  // move tiles to floor
  let counter = patternLineTiles.length;
  tiles.forEach(x => {
    if (counter < maxTilesOnLine) {
      moveTile(x, 'PatternLine', boardId, counter++, y);
    } else {
      moveToFloorLine(G, [x], boardId);
    }
  });
};

// move tiles to floor
export const moveToFloorLine = (G: AzulGameState, tiles: AzulTileState[], boardId: string): void => {
  // get tiles on floor line
  const floorLineTiles = G.tiles.filter(x =>
    x.location.boardType === 'FloorLine' &&
    x.location.boardId === boardId
  );

  let counter = floorLineTiles.length;
  tiles.forEach(x => {
    if (counter <= 6) {
      moveTile(x, 'FloorLine', boardId, counter++);
    } else {
      moveTile(x, 'TileStorage');
    }
  });
};
