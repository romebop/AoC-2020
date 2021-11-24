import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputSlice = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(y => y.split(''));
  
const State = {
  ACTIVE: '#',
  INACTIVE: '.',
};

const activeCubes = new Set();
for (let y = 0; y < inputSlice.length; y++) {
  const row = inputSlice[y];
  for (let x = 0; x < row.length; x++) {
    const cube = row[x];
    if (cube === State.ACTIVE) {
      activeCubes.add(serializeCube({ x, y, z: 0, w: 0 }));
    }
  }
}

console.log(solve(activeCubes));

function solve(activeCubes, numCycles = 6) {
  for (let currCycle = 0; currCycle < numCycles; currCycle++) {
    const newActiveCubes = new Set();
    const newInactiveCubes = new Set();
    for (const serializedActiveCube of activeCubes) {
      const neighborCubes = getNeighborCubes(deserializeCube(serializedActiveCube));
      const activeNeighborCubes = new Set(
        [...neighborCubes].filter(serializedNeighborCube => activeCubes.has(serializedNeighborCube))
      );
      if (![2, 3].includes(activeNeighborCubes.size)) {
        newInactiveCubes.add(serializedActiveCube);
      }
      for (const serializedNeighborCube of neighborCubes) {
        if (activeCubes.has(serializedNeighborCube)) continue;
        const neighborCubesOfInactive = getNeighborCubes(deserializeCube(serializedNeighborCube));
        const activeNeighborCubesOfInactive = new Set(
          [...neighborCubesOfInactive].filter(serializedNeighborCube => activeCubes.has(serializedNeighborCube))  
        );
        if (activeNeighborCubesOfInactive.size === 3) {
          newActiveCubes.add(serializedNeighborCube);
        }
      }
    }
    activeCubes = new Set([
      ...[...activeCubes].filter(activeCube => !newInactiveCubes.has(activeCube)),
      ...[...newActiveCubes],
    ]);
  }
  return activeCubes.size;
}

function getNeighborCubes(cube) {
  const neighborCubes = new Set();
  for (let w = -1; w <= 1; w++) {
    for (let z = -1; z <= 1; z++) {
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          const neighborCube = { x: cube.x + x, y: cube.y + y, z: cube.z + z, w: cube.w + w };
          if (serializeCube(neighborCube) === serializeCube(cube)) continue;
          neighborCubes.add(serializeCube(neighborCube));
        }
      }
    }
  }
  return neighborCubes;
}

function serializeCube(cube) {
  return `(${cube.x},${cube.y},${cube.z},${cube.w})`;
}

function deserializeCube(str) {
  const [x, y, z, w] = str.slice(1, -1).split(',');
  return { x: +x, y: +y, z: +z, w: +w };
}