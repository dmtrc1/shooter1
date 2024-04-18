export function generateTargetCoordinates(screenDimensionLimit, targetDimensionLimit) {
  return Math.floor(Math.random() * (screenDimensionLimit - targetDimensionLimit))
}

export function getRandomElementFromArr(elementsArr) {
  return elementsArr[Math.floor(Math.random() * (elementsArr.length - 1))]
}

export function evaluateResult({ errorCoef, enemiesNumber, hitNumber }) {
  const numberOfMissesAllowed = Math.round(enemiesNumber*errorCoef);
  const win = (enemiesNumber - hitNumber) <= numberOfMissesAllowed;
  return win;
}
