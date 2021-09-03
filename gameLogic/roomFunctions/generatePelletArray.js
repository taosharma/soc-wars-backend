// The generatePelletArray function returns an array with the specified number of pellets in it.

const { canvasWidth, canvasHeight } = require('../../config/canvasConfig');

const { generatePellet } = require('./generateNewPellet');

function generatePelletArray(numberOfPellets) {
  let pellets = [];
  for (let i = 0; i < numberOfPellets; i++) {
    pellets.push(generatePellet());
  }
  return pellets;
}

module.exports = { generatePelletArray };
