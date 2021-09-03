// Event dictionary containing socket connection events:

const { eventDictionary } = require('../../config/eventDictionary');

const { UPDATE_SIZE } = eventDictionary;

/* The updateSize function updates all of the players in a room that a player's size has changed. IMPORTANT: size is managed
by the game server, so player does not know their size has changed until this function is called. */

function updateSize(game, player, roomId) {
  game.to(roomId).emit(UPDATE_SIZE, { player });
}

module.exports = { updateSize };
