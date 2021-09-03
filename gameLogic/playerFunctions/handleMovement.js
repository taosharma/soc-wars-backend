const { eventDictionary } = require('../../config/eventDictionary');

const { GET_PLAYERS } = eventDictionary;

/* The handleMovement function updates the game server with the position of a new player, and emits their new position to all 
other players. */

function handleMovement(socket, roomId, player, updatedPlayer) {
  player.x = updatedPlayer.x;
  player.y = updatedPlayer.y;
  player.vx = updatedPlayer.vx;
  player.vy = updatedPlayer.vy;

  socket.to(roomId).emit(GET_PLAYERS, { player });
}

module.exports = { handleMovement };
