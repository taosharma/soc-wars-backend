function checkEmptyRoom(room) {
  const activePlayers = room.players.filter((player) => player.active);

  if (activePlayers.length === 0) {
    return true;
  } else return false;
}

module.exports = { checkEmptyRoom };
