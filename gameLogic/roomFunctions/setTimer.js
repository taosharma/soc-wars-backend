const { eventDictionary } = require('../../config/eventDictionary');

const { UPDATE_TIMER, TIME_UP } = eventDictionary;

function setTimer(game, room, roomId) {
  let timeRemaining = room.timer;
  room.timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      game.to(roomId).emit(TIME_UP, {
        success: true,
      });
      // clearInterval(intervalID);
    }
    timeRemaining--;
    game.to(roomId).emit(UPDATE_TIMER, {
      success: true,
      payload: { timeRemaining, roomId },
    });
  }, 1000);
}

module.exports = { setTimer };
