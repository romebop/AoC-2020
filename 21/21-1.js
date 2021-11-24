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
  const riskyIngredients = new Set();
  const allAllergens = getAllAllergens(foods);
  for (const allergen of allAllergens) {
    const allergenIngredients = foods.filter(food => food.allergens.includes(allergen))
      .map(food => food.ingredients);
    const commonIngredients = getIntersection(allergenIngredients);
    commonIngredients.forEach(ingredient => riskyIngredients.add(ingredient));
  }
  return foods.map(food => food.ingredients)
    .reduce((acc, curr) => acc.concat(curr), [])
    .reduce((acc, curr) => (
      riskyIngredients.has(curr) ? acc : acc + 1
    ), 0);
}

function getAllAllergens(foods) {
  return foods.map(food => food.allergens)
    .reduce((set, allergens) => {
      allergens.forEach(allergen => set.add(allergen));
      return set;
    }, new Set());
}

function getIntersection(arrays) {
  return arrays.reduce((acc, curr) =>
    acc.filter(v => curr.includes(v))
  );
}