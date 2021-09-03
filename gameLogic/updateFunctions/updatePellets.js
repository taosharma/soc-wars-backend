// Event dictionary containing socket connection events:

const { eventDictionary } = require('../../config/eventDictionary');

const { GET_PELLETS } = eventDictionary;

// The update pellet function updates the location of all of the game pellets to all of the players in a room.

function updatePellets(game, pellets, roomId) {
  game.to(roomId).emit(GET_PELLETS, {
    success: true,
    payload: { pellets },
  });
}

module.exports = { updatePellets };
