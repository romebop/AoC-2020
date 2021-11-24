import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const tileIdRegex = /^Tile (?<id>\d+):$/;

const tiles = readFileSync(inputFile, 'utf8')
  .split('\n\n')
  .map(rawTileInput => {
    const lines = rawTileInput.split('\n');
    const id = lines[0].match(tileIdRegex).groups.id;
    const pixels = lines.slice(1).map(line => line.split(''));
    return { id, pixels };
  });

const sideLength = Math.sqrt(tiles.length);

const seaMonsterPixels = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `
  .split('\n')
  .map(str => str.split(''));

const seaMonsterWidth = seaMonsterPixels[0].length;
const seaMonsterHeight = seaMonsterPixels.length;

console.log(solve(tiles));

function solve(tiles) {
  // find and orient corner tile
  const cornerTile = getCornerTile(tiles);
  const cornerTileIdx = tiles.findIndex(tile => tile.id === cornerTile.id);
  const tileGrid = [tiles.splice(cornerTileIdx, 1)];
  orientCornerTile(cornerTile, tiles);
  // build tile grid
  for (let y = 0; y < sideLength; y++) {
    for (let x = 0; x < sideLength; x++) {
      const thisTile = tileGrid[y][x];
      tileLoop:
      for (let i = 0; i < tiles.length; i++) {
        const thatTile = tiles[i];
        for (let flipCount = 1; flipCount <= 2; flipCount++) {
          thatTile.pixels = flipPixels(thatTile.pixels);
          for (let sideCount = 1; sideCount <= 4; sideCount++) {
            thatTile.pixels = rotatePixels(thatTile.pixels);
            if (doesRightMatch(thisTile, thatTile)) {
              tiles.splice(i, 1);
              tileGrid[y].push(thatTile);
              break tileLoop;
            }
          }
        }
      }
    }
    if (y < sideLength - 1) {
      const rowFirstTile = tileGrid[y][0];
      tileLoop:
      for (let i = 0; i < tiles.length; i++) {
        const thatTile = tiles[i];
        for (let flipCount = 1; flipCount <= 2; flipCount++) {
          thatTile.pixels = flipPixels(thatTile.pixels);
          for (let sideCount = 1; sideCount <= 4; sideCount++) {
            thatTile.pixels = rotatePixels(thatTile.pixels);
            if (doesBottomMatch(rowFirstTile, thatTile)) {
              tiles.splice(i, 1);
              tileGrid.push([thatTile]);
              break tileLoop;
            }
          }
        }
      }
    }
  }
  const pixelsGrid = tileGrid.map(row =>
    row.map(tile => removeBorders(tile.pixels))
  );
  // build image
  const tileLength = pixelsGrid[0][0].length;
  let image = [];
  for (let y = 0; y < tileLength * sideLength; y++) {
    const row = [];
    const gridY = Math.floor(y / tileLength);
    const tileY = y % tileLength;
    for (let x = 0; x < tileLength * sideLength; x++) {
      const gridX = Math.floor(x / tileLength);
      const tileX = x % tileLength;
      row.push(pixelsGrid[gridY][gridX][tileY][tileX]);
    }
    image.push(row);
  }
  for (let flipCount = 1; flipCount <= 2; flipCount++) {
    image = flipPixels(image);
    for (let sideCount = 1; sideCount <= 4; sideCount++) {
      image = rotatePixels(image);
      // label sea monsters
      for (let y = 0; y < image.length - seaMonsterHeight; y++) {
        for (let x = 0; x < image[0].length - seaMonsterWidth; x++) {
          // check sea monster from coordinate
          let isSeaMonsterFound = true;
          for (let offsetY = 0; offsetY < seaMonsterHeight; offsetY++) {
            for (let offsetX = 0; offsetX < seaMonsterWidth; offsetX++) {
              const seaMonsterPixel = seaMonsterPixels[offsetY][offsetX]
              if (seaMonsterPixel === '#') {
                const imagePixel = image[y + offsetY][x + offsetX]; 
                isSeaMonsterFound = isSeaMonsterFound && (imagePixel === '#');
              }
            }
          }
          // if found then mark
          if (isSeaMonsterFound) {
            for (let offsetY = 0; offsetY < seaMonsterHeight; offsetY++) {
              for (let offsetX = 0; offsetX < seaMonsterWidth; offsetX++) {
                const seaMonsterPixel = seaMonsterPixels[offsetY][offsetX]
                if (seaMonsterPixel === '#') {
                  image[y + offsetY][x + offsetX] = 'O'; 
                }
              }
            }
          }
        }
      }
      if (image.flat().includes('O')) {
        console.log(getPixelsStr(image));
        return image.flat().reduce((count, pixel) => (
          count + (pixel === '#' ? 1 : 0)
        ), 0); 
      }
    }
  }
}

function removeBorders(pixels) {
  const newPixels = [];
  for (let y = 1; y < pixels.length - 1; y++) {
    newPixels.push(pixels[y].slice(1, -1));
  }
  return newPixels;
}

function orientCornerTile(cornerTile, tiles) {
  for (let cornerFlipCount = 1; cornerFlipCount <= 2; cornerFlipCount++) {
    cornerTile.pixels = flipPixels(cornerTile.pixels);
    for (let cornerSideCount = 1; cornerSideCount <= 4; cornerSideCount++) {
      cornerTile.pixels = rotatePixels(cornerTile.pixels);
      let hasRightMatch = false;
      let hasBottomMatch = false;
      for (let i = 0; i < tiles.length; i++) {
        const thatTile = tiles[i];
        for (let thatFlipCount = 1; thatFlipCount <= 2; thatFlipCount++) {
          thatTile.pixels = flipPixels(thatTile.pixels);
          for (let thatSideCount = 1; thatSideCount <= 4; thatSideCount++) {
            thatTile.pixels = rotatePixels(thatTile.pixels);
            if (doesRightMatch(cornerTile, thatTile)) {
              hasRightMatch = true;
            }
            if (doesBottomMatch(cornerTile, thatTile)) {
              hasBottomMatch = true;
            }
          }
        }
        if (hasRightMatch && hasBottomMatch) return;
      }
    }
  }
}

function doesRightMatch(tile1, tile2) {
  return doesBorderMatch(
    getRightBorder(tile1.pixels),
    getLeftBorder(tile2.pixels),
  );
}

function doesBottomMatch(tile1, tile2) {
  return doesBorderMatch(
    getBottomBorder(tile1.pixels),
    getTopBorder(tile2.pixels),
  );
}

function getCornerTile(tiles) {
  for (let i = 0; i < tiles.length; i++) {
    const thisTile = tiles[i];
    let count = 0;
    for (let j = 0; j < tiles.length; j++) {
      if (i === j) continue;
      const thatTile = tiles[j];
      if (doesTileMatch(thisTile, thatTile)) count++;
    }
    if (count === 2) return thisTile;
  }
}

function doesTileMatch(tile1, tile2) {
  for (const border1 of getBorders(tile1.pixels)) {
    for (const border2 of getBorders(tile2.pixels)) {
      if (
        doesBorderMatch(border1, border2)
        || doesBorderMatch(border1, border2.slice().reverse())
      ) return true;
    }
  }
  return false;
}

function doesBorderMatch(border1, border2) {
  for (let i = 0; i < border1.length; i++) {
    if (border1[i] !== border2[i]) return false;
  }
  return true;
}

function getBorders(pixels) {
  return [
    getTopBorder(pixels),
    getRightBorder(pixels),
    getBottomBorder(pixels),
    getLeftBorder(pixels),
  ];
}

function getTopBorder(pixels) {
  return [...pixels[0]];
}

function getRightBorder(pixels) {
  const rightBorder = [];
  for (let i = 0; i < pixels.length; i++) {
    rightBorder.push(pixels[i][pixels.length - 1]);
  }
  return rightBorder;
}

function getBottomBorder(pixels) {
  return [...pixels[pixels.length - 1]];
}

function getLeftBorder(pixels) {
  const leftBorder = [];
  for (let i = 0; i < pixels.length; i++) {
    leftBorder.push(pixels[i][0]);
  }
  return leftBorder;
}

// rotate 90 degrees clockwise
function rotatePixels(pixels) {
  const newPixels = [];
  for (let i = 0; i < pixels.length; i++) {
    const row = [];
    for (let j = pixels.length - 1; j > -1; j--) {
      row.push(pixels[j][i]);
    }
    newPixels.push(row);
  }
  return newPixels;
}

// flip y axis
function flipPixels(pixels) {
  const newPixels = [];
  for (let i = 0; i < pixels.length; i++) {
    const row = [];
    for (let j = pixels.length - 1; j > -1; j--) {
      row.push(pixels[i][j]);
    }
    newPixels.push(row);
  }
  return newPixels;
}

function getPixelsStr(pixels) {
  let tileStr = '';
  for (const row of pixels) {
    tileStr += row.join('') + '\n';
  }
  return tileStr;
}