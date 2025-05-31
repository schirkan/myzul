import { Ctx, MoveFn } from "boardgame.io";
import { floorSetups, wallSetups } from "./azulConfig";
import { AzulGameState, AzulTileState, BoardType, TilePlaceholderState } from "./models";

export const INVALID_MOVE = "INVALID_MOVE";

export const selectSourceTile: MoveFn<AzulGameState> = ({ G, ctx }, tile: AzulTileState) => {
  if (!tile.selectable) {
    debugger;
    return INVALID_MOVE;
  }

  // select all tiles of same color on same board
  G.tiles.forEach(x => {
    x.selected = (
      x.location.boardType === tile.location.boardType &&
      x.location.boardId === tile.location.boardId &&
      x.color === tile.color
    )
  });
};

export const selectScoreTargetLocation: MoveFn<AzulGameState> = ({ G, ctx }, target: TilePlaceholderState) => {
  if (target.location.boardId === undefined || target.location.boardType !== "Wall") return INVALID_MOVE;
  const maxTilesInRow = target.location.y! + 1;

  // get tiles
  const tiles = G.tiles.filter(x =>
    x.location.boardType === "PatternLine" &&
    x.location.boardId === target.location.boardId &&
    x.location.y === target.location.y &&
    x.color === target.color
  );

  if (tiles.length < maxTilesInRow) {
    debugger;
    return INVALID_MOVE;
  }

  const [first, ...rest] = tiles;

  // move tile
  moveTile(G, first, "Wall", target.location.boardId, target.location.x, target.location.y);

  // move rest to store
  rest.forEach(x => moveTile(G, x, 'TileStorage'));

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
      if (tile.location.x) {
        let points = floorSetups[G.config.floorSetup][tile.location.x];
        G.score[playerId].points += points;
      }
    });

    // no negative score
    if (G.score[playerId].points < 0) {
      G.score[playerId].points = 0;
    }

    // move to storage
    tiles.forEach(x => moveTile(G, x, 'TileStorage'));
  }
}

const calculatePatternRow = async (G: AzulGameState, ctx: Ctx, row: number) => {
  const maxTilesInRow = row + 1;
  // loop players
  for (const playerId of ctx.playOrder) {
    // get tiles 
    const tiles = G.tiles.filter(x =>
      x.location.boardType === "PatternLine" &&
      x.location.boardId === playerId &&
      x.location.y === row
    );

    if (tiles.length >= maxTilesInRow) {
      // find target
      const rowSetup = wallSetups[G.config.wallSetup][row];
      const x = rowSetup.findIndex(x => x.color === tiles[0].color);
      const placeholderConfig = rowSetup.find(x => x.color === tiles[0].color);

      // calculare score
      calculateTileScore(G, ctx, {
        location: { boardType: 'Wall', boardId: playerId, x, y: row },
        color: placeholderConfig?.color,
        multiplier: placeholderConfig?.multiplier
      });

      const [first, ...rest] = tiles;

      // move tiles
      moveTile(G, first, "Wall", playerId, x, row);

      // move rest to store
      rest.forEach(x => moveTile(G, x, 'TileStorage'));
    }
  }
}

const calculateTileScore = async (G: AzulGameState, ctx: Ctx, target: TilePlaceholderState) => {
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

  var hasHorizontalNeighbor = false;

  // right
  for (let x = target.location.x + 1; x < 5; x++) {
    if (tilesInRow.includes(x)) {
      points++;
      hasHorizontalNeighbor = true;
    } else {
      break;
    }
  }

  // left
  for (let x = target.location.x - 1; x >= 0; x--) {
    if (tilesInRow.includes(x)) {
      points++;
      hasHorizontalNeighbor = true;
    } else {
      break;
    }
  }

  // find tiles in column
  const tilesInColumn = G.tiles.filter(x =>
    x.location.boardType === 'Wall' &&
    x.location.boardId === target.location.boardId &&
    x.location.x === target.location.x
  ).map(x => x.location.y);

  var hasVerticalNeighbor = false;

  // down
  for (let y = target.location.y + 1; y < 5; y++) {
    if (tilesInColumn.includes(y)) {
      points++;
      hasVerticalNeighbor = true;
    } else {
      break;
    }
  }

  // top
  for (let y = target.location.y - 1; y >= 0; y--) {
    if (tilesInColumn.includes(y)) {
      points++;
      hasVerticalNeighbor = true;
    } else {
      break;
    }
  }

  // extra point - hasHorizontalNeighbor & hasVerticalNeighbor +1
  if (hasHorizontalNeighbor && hasVerticalNeighbor) {
    points += 1;
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

  G.score[target.location.boardId].points += points * (target.multiplier || 1);
}

// move all selected tiles to new board
export const selectTargetLocation: MoveFn<AzulGameState> = (context, target: TilePlaceholderState) => {
  var { G, ctx, playerID } = context;
  if (target.location.boardId !== ctx.currentPlayer) { debugger; return INVALID_MOVE; }
  if (playerID && playerID !== ctx.currentPlayer) { debugger; return INVALID_MOVE; }

  if (ctx.phase === 'calculateScore') return selectScoreTargetLocation(context, target);

  var selectedTiles = G.tiles.filter(x => x.selected);
  if (!selectedTiles.length) { debugger; return INVALID_MOVE; }

  // get source factory
  const sourceBoardType = selectedTiles[0].location.boardType
  const sourceBoardId = selectedTiles[0].location.boardId;

  if (target.location.boardType === 'FloorLine') {
    moveToFloorLine(G, selectedTiles, target.location.boardId);
  } else if (target.location.boardType === 'PatternLine') {
    if (!canMoveToPatternLine(G, selectedTiles[0], target.location.boardId, target.location.y!)) {
      console.log('invalid target');
      debugger;
      return INVALID_MOVE;
    }
    moveToPatternLine(G, selectedTiles, target.location.boardId, target.location.y!);
  } else {
    debugger;
    return INVALID_MOVE;
  }

  // move remaining tiles from factory to CenterOfTable
  if (sourceBoardType === 'Factory') {
    var factoryTiles = G.tiles.filter(x =>
      x.location.boardType === 'Factory' &&
      x.location.boardId === sourceBoardId
    );
    let counter = G.tiles.filter(x => x.location.boardType === 'CenterOfTable').length;
    factoryTiles.forEach(x => moveTile(G, x, 'CenterOfTable', undefined, counter++));
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
  centerTiles.forEach(x => moveTile(G, x, 'CenterOfTable', undefined, counter++));

  // reset selection
  G.tiles.forEach(x => x.selected = false);
};

export const moveTile = (G: AzulGameState, tile: AzulTileState, boardType: BoardType, boardId?: string | number, x?: number, y?: number) => {
  // console.log('move to ' + boardType + ' from', GetTileLocationId(tile.location));
  if (!tile) debugger;

  const oldBoardType = tile.location.boardType;
  tile.location = { boardType, boardId: '' + (boardId === undefined ? '' : boardId), x, y };

  if (oldBoardType !== boardType && (
    oldBoardType === 'TileBag' ||
    oldBoardType === 'TileStorage' ||
    boardType === 'TileBag' ||
    boardType === 'TileStorage')) {
    // remove from source
    if (oldBoardType === 'TileBag') {
      G.tileBag.splice(G.tileBag.indexOf(tile), 1);
    } else if (oldBoardType === 'TileStorage') {
      G.tileStorage.splice(G.tileStorage.indexOf(tile), 1);
    } else {
      G.tiles.splice(G.tiles.indexOf(tile), 1);
    }

    // add to target
    if (boardType === 'TileBag') {
      G.tileBag.push(tile);
    } else if (boardType === 'TileStorage') {
      G.tileStorage.push(tile);
    } else {
      G.tiles.push(tile);
    }
  }
};

export const canMoveToPatternLine = (G: AzulGameState, tile: AzulTileState, boardId: string, y: number): boolean => {
  const maxTilesOnLine = y + 1;

  // is white?
  if (tile.color === 'white') return false;

  // get tiles on PatternLine
  const patternLineTiles = G.tiles.filter(x =>
    x.location.boardType === 'PatternLine' &&
    x.location.boardId === boardId &&
    x.location.y === y
  );

  // full?
  if (patternLineTiles.length >= maxTilesOnLine) return false;

  // wrong color?
  if (patternLineTiles.length && patternLineTiles[0].color !== tile.color) return false;

  // color already on wall?
  const wallTiles = G.tiles.filter(x =>
    x.location.boardType === 'Wall' &&
    x.location.boardId === boardId &&
    x.location.y === y &&
    x.color === tile.color
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
      moveTile(G, x, 'PatternLine', boardId, counter++, y);
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
      moveTile(G, x, 'FloorLine', boardId, counter++);
    } else {
      moveTile(G, x, 'TileStorage');
    }
  });
};
