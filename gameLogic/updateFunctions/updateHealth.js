// Event dictionary containing socket connection events:

const { eventDictionary } = require('../../config/eventDictionary');

const { UPDATE_HEALTH } = eventDictionary;

/* The updateHealth function updates all of the players in a room that a player's health has changed. IMPORTANT: health is managed
by the game server, so player does not know their health has changed until this function is called. */

function updateHealth(game, player, roomId) {
  game.to(roomId).emit(UPDATE_HEALTH, { player });
}

module.exports = { updateHealth };
