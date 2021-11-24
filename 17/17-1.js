import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputSlice = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(y => y.split(''));
  
const State = {
  ACTIVE: '#',
  INACTIVE: '.',
};

const activeCubes = [];
for (let y = 0; y < inputSlice.length; y++) {
  const row = inputSlice[y];
  for (let x = 0; x < row.length; x++) {
    const cube = row[x];
    if (cube === State.ACTIVE) {
      activeCubes.push({ x, y, z: 0 })
    }
  }
}

console.log(solve(activeCubes));

function solve(activeCubes, numCycles = 6) {
  for (let currCycle = 0; currCycle < numCycles; currCycle++) {
    const newActiveCubes = [];
    const newInactiveCubes = [];
    for (const activeCube of activeCubes) {
      const neighborCubes = getNeighborCubes(activeCube);
      const activeNeighborCubes = neighborCubes.filter(neighborCube =>
        containsCube(activeCubes, neighborCube)
      );
      if (![2, 3].includes(activeNeighborCubes.length) && !containsCube(newInactiveCubes, activeCube)) {
        newInactiveCubes.push(activeCube);
      }
      for (const neighborCube of neighborCubes) {
        if (containsCube(activeCubes, neighborCube)) continue;
        const neighborCubesOfInactive = getNeighborCubes(neighborCube);
        const activeNeighborCubesOfInactive = neighborCubesOfInactive.filter(neighborCube =>
          containsCube(activeCubes, neighborCube)
        );
        if (activeNeighborCubesOfInactive.length === 3 && !containsCube(newActiveCubes, neighborCube)) {
          newActiveCubes.push(neighborCube);
        }
      }
    }
    activeCubes = [
      ...activeCubes.filter(activeCube => !containsCube(newInactiveCubes, activeCube)),
      ...newActiveCubes.filter(newActiveCube => !containsCube(activeCubes, newActiveCube)),
    ];
  }
  return activeCubes.length;
}

function getNeighborCubes(cube) {
  const neighborCubes = [];
  for (let z = -1; z <= 1; z++) {
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const neighborCube = { x: cube.x + x, y: cube.y + y, z: cube.z + z };
        if (isSameCube(neighborCube, cube)) continue;
        neighborCubes.push(neighborCube);
      }
    }
  }
  return neighborCubes;
}

function isSameCube(cube1, cube2){
  return cube1.x === cube2.x
    && cube1.y === cube2.y
    && cube1.z === cube2.z;
}

function containsCube(cubes, cube) {
  return cubes.findIndex(c => isSameCube(c, cube)) > -1;
}
