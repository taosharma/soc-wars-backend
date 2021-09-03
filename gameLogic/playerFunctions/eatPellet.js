// The eatPellet function takes in a player and increases their size and health.

function eatPellet(player) {
  if (player.r < player.maxSize) {
    player.r += player.growthRate;
  }
  player.health += 1;
}

module.exports = { eatPellet };
