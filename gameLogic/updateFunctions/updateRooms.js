// Event dictionary containing socket connection events:

const { eventDictionary } = require('../../config/eventDictionary');

const { UPDATE_ROOMS } = eventDictionary;

// A function which takes in the game and rooms, and emits an event with the number of players in each room.

function updateRooms(game, rooms) {
  game.emit(UPDATE_ROOMS, {
    room1: rooms.room1.players.length,
    room2: rooms.room2.players.length,
    room3: rooms.room3.players.length,
  });
}

module.exports = { updateRooms };
