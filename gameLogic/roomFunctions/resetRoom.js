const { generatePelletArray } = require('./generatePelletArray');

const numberOfPellets = 100;

// The resetGame function clears the pelletRegeneration and updateScoreboard intervals on a room, and returns clean room object.

function resetRoom(room) {
  clearInterval(room.pelletRegeneration);
  clearInterval(room.timerInterval);
  clearInterval(room.updateScoreInterval);

  return {
    players: [],
    pelletRegenerationSpeed: 1000,
    numberOfPellets: 100,
    pellets: generatePelletArray(numberOfPellets),
    pelletRegeneration: null,
    timer: 120,
    timerInterval: null,
    scoreBoard: [],
    updateScoreInterval: null,
    isRunning: false,
  };
}

module.exports = { resetRoom };
