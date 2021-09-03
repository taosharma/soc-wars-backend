const { generateNewPellet } = require('./generateNewPellet');

const numberOfPellets = 100;

// The setPelletRegeneration sets the pellet regenration rate for a room.

function setPelletRegeneration(game, roomId, room) {
  // Clears the current pellet regeneration speed.

  clearInterval(room.pelletRegeneration);

  // Sets the new pellet regeneration speed for the room based on the number of players.

  room.pelletRegenerationSpeed =
    room.pelletRegenerationSpeed / room.players.length;

  // Sets the new pellet regeneration speed for the room.

  room.pelletRegeneration = setInterval(() => {
    console.log('Hello from the pellet regeneration interval!');
    let pellets = room.pellets;
    if (pellets.length < numberOfPellets) {
      generateNewPellet(pellets, game, roomId);
    }
  }, room.pelletRegenerationSpeed);
}

module.exports = { setPelletRegeneration };
