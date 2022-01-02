import { Ctx, MoveFn } from "boardgame.io";
import { TilePlaceholderProps } from "../../components/azul/TilePlaceholder";
import { floorSetups, wallSetups } from "./azulConfig";
import { AzulGameState, AzulTileState, BoardType } from "./models";

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

  const [first, ...rest] = tiles;

  // move tile
  moveTile(first, "Wall", target.location.boardId, target.location.x, target.location.y);

  // move rest to store
  moveToTileStorage(rest);

  // calculare score
  calculateTileScore(G, ctx, target);
}

export const calculateScore = (G: AzulGameState, ctx: Ctx) => {
  // loop five pattern rows
  for (let row = 0; row < 5; row++) {
    calculatePatternRow(G, ctx, row);
  }

  // floor line
  calculateFloorLines(G, ctx);
};

const calculateFloorLines = async (G: AzulGameState, ctx: Ctx) => {
  // loop players
  for (const playerId of ctx.playOrder) {
    const tiles = G.tiles.filter(x =>
      x.location.boardType === "FloorLine" &&
      x.location.boardId === playerId
    );

    // calculare score
    tiles.forEach(tile => {
      if (tile.location.boardId && tile.location.x) {
        let points = floorSetups[G.config.floorSetup][tile.location.x];
        G.score[tile.location.boardId] += points;
      }
    });

    // move to storage
    moveToTileStorage(tiles);
  }
}

const calculatePatternRow = async (G: AzulGameState, ctx: Ctx, y: number) => {
  const maxTilesInRow = y + 1;
  // loop players
  for (const playerId of ctx.playOrder) {
    // get tiles 
    const tiles = G.tiles.filter(x =>
      x.location.boardType === "PatternLine" &&
      x.location.boardId === playerId &&
      x.location.y === y
    );

    if (tiles.length >= maxTilesInRow) {
      // find target
      const rowSetup = wallSetups[G.config.wallSetup][y];
      const x = rowSetup.findIndex(x => x.color === tiles[0].color);
      const placeholderConfig = rowSetup.find(x => x.color === tiles[0].color);

      // calculare score
      calculateTileScore(G, ctx, {
        location: { boardType: 'Wall', boardId: playerId, x, y },
        color: placeholderConfig?.color,
        multiplier: placeholderConfig?.multiplier
      });

      const [first, ...rest] = tiles;

      // move tiles
      moveTile(first, "Wall", playerId, x, y);

      // move rest to store
      moveToTileStorage(rest);
    }
  }
}

const calculateTileScore = async (G: AzulGameState, ctx: Ctx, target: TilePlaceholderProps) => {
  if (!target.location.boardId || target.location.x === undefined || target.location.y === undefined) {
    throw new Error('calculateTileScore: location incomplete');
  }
  let points = 1;

  // find tiles in row
  const tilesInRow = G.tiles.filter(x =>
    x.location.boardType === 'Wall' &&
    x.location.boardId === target.location.boardId &&
    x.location.y === target.location.y
  ).map(x => x.location.x);

  // right
  for (let x = target.location.x + 1; x < 5; x++) {
    if (tilesInRow.includes(x)) {
      points++;
    } else {
      break;
    }
  }

  // left
  for (let x = target.location.x - 1; x >= 0; x--) {
    if (tilesInRow.includes(x)) {
      points++;
    } else {
      break;
    }
  }

  const tilesInColumn = G.tiles.filter(x =>
    x.location.boardType === 'Wall' &&
    x.location.boardId === target.location.boardId &&
    x.location.x === target.location.x
  ).map(x => x.location.y);

  // down
  for (let y = target.location.y + 1; y < 5; y++) {
    if (tilesInColumn.includes(y)) {
      points++;
    } else {
      break;
    }
  }

  // top
  for (let y = target.location.y - 1; y >= 0; y--) {
    if (tilesInColumn.includes(y)) {
      points++;
    } else {
      break;
    }
  }

  // extra points - row +2
  if (tilesInRow.length === 4) {
    points += 2;
  }
  // extra points - column +7
  if (tilesInColumn.length === 4) {
    points += 7;
  }
  // extra points - color +10
  const tilesOfSameColor = G.tiles.filter(x =>
    x.location.boardType === 'Wall' &&
    x.location.boardId === target.location.boardId &&
    x.color === target.color
  );
  if (tilesOfSameColor.length === 4) {
    points += 10;
  }

  G.score[target.location.boardId] += points * (target.multiplier || 1);
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
    .sort((a, b) => {
      if (a.color === 'white') return -1;
      if (b.color === 'white') return 1;
      return ('' + b.color).localeCompare(a.color)
    });
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

export const moveToTileStorage = (tiles: AzulTileState[]): void => {
  tiles.forEach(x => {
    moveTile(x, 'TileStorage');
  });
};
