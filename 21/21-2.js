import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const foods = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(f => f.split(' (contains '))
  .map(([ings, alls]) => ({
    ingredients: ings.split(' '),
    allergens: alls.slice(0, -1).split(', '),
  }));

console.log(solve(foods));

function solve(foods) {
  const allAllergens = getAllAllergens(foods);
  const riskyIngredients = getRiskyIngredients(foods, allAllergens);
  const possibilitiesMap = getPossibilityMap(foods, riskyIngredients);
  const allergenMap = {};
  while (Object.keys(allergenMap).length !== allAllergens.size) {
    for (const allergen in possibilitiesMap) {
      const possibilitiesGroup = possibilitiesMap[allergen];
      const intersection = getIntersection(possibilitiesGroup); 
      if (intersection.length === 1) {
        const ingredient = intersection[0];
        allergenMap[allergen] = ingredient;
        removeIngredient(possibilitiesMap, ingredient);
      }
    }
  }
  return Object.entries(allergenMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([allergen, ingredient]) => ingredient)
    .join(',');
}

function getAllAllergens(foods) {
  return foods.map(food => food.allergens)
    .reduce((set, allergens) => {
      allergens.forEach(allergen => set.add(allergen));
      return set;
    }, new Set());
}

function getRiskyIngredients(foods, allAllergens) {
  const riskyIngredients = new Set();
  for (const allergen of allAllergens) {
    const allergenIngredients = foods.filter(food => food.allergens.includes(allergen))
      .map(food => food.ingredients);
    const commonIngredients = getIntersection(allergenIngredients);
    commonIngredients.forEach(ingredient => riskyIngredients.add(ingredient));
  }
  return riskyIngredients;
}

function getIntersection(arrays) {
  if (arrays.length === 0) return null;
  if (arrays.length === 1) return arrays[0];
  return arrays.reduce((acc, curr) =>
    acc.filter(v => curr.includes(v))
  );
}

function getPossibilityMap(foods, riskyIngredients) {
  const possibilitiesMap = {};
  for (const { ingredients, allergens } of foods) {
    const filteredIngredients = ingredients.filter(
      ingredient => riskyIngredients.has(ingredient)
    );
    for (const allergen of allergens) {
      if (possibilitiesMap.hasOwnProperty(allergen)) {
        possibilitiesMap[allergen].push([...filteredIngredients]);
      } else {
        possibilitiesMap[allergen] = [[...filteredIngredients]];
      }
    }
  }
  return possibilitiesMap;
}

function removeIngredient(possibilitiesMap, ingredient) {
  for (const allergen in possibilitiesMap) {
    const possibilitiesGroup = possibilitiesMap[allergen];
    for (const possibilities of possibilitiesGroup) {
      const idx = possibilities.indexOf(ingredient);
      if (idx > -1) possibilities.splice(idx, 1);
    }
  }
}