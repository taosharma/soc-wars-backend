// Event dictionary containing socket connection events:

const { eventDictionary } = require('../../config/eventDictionary');

const { UPDATE_SCOREBOARD } = eventDictionary;

// The sortPlayerScore function orders to players by their health value.

function sortPlayerScore(player1, player2) {
  if (player1.health < player2.health) {
    return 1;
  }
  if (player1.health > player2.health) {
    return -1;
  } else {
    return 0;
  }
}

// The updateScoreboard function sets an interval which updates the scoreboard in a specific room every 0.5 seconds.

function updateScoreboard(game, room, roomId) {
  room.updateScoreInterval = setInterval(() => {
    room.scoreBoard = [...room.players].sort((player1, player2) =>
      sortPlayerScore(player1, player2)
    );
    console.log('Hello from the updateScoreboard interval!');
    game.to(roomId).emit(UPDATE_SCOREBOARD, {
      payload: { scoreBoard: room.scoreBoard },
    });
  }, 500);
}

module.exports = { updateScoreboard };
