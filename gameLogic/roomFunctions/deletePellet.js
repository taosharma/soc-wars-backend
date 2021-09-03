// The deletePellet function finds a pellet with its ID, then uses its index to splice it from the pellet array.

function deletePellet(room, pelletId) {
  room.pellets.find((pellet, index) => {
    if (pellet) {
      if (pellet.id === pelletId) {
        room.pellets.splice(index, 1);
      }
    }
  });
}

module.exports = { deletePellet };
