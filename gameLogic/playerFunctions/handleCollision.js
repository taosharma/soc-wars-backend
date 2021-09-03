// who beats whom can now easily be changed
const characters = {
  Chris: { strongerThan: ['Liz', 'Ben'] },
  Liz: { strongerThan: ['Banwo', 'Bish'] },
  Banwo: { strongerThan: ['Chris', 'Bish'] },
  Ben: { strongerThan: ['Liz', 'Banwo'] },
  Bish: { strongerThan: ['Chris', 'Ben'] },
};

const healthSettings = {
  increment: 1.01,
  decrement: 0.99,
};

function handleCollision(myPlayer, otherPlayer) {
  if (
    characters[myPlayer.character].strongerThan.includes(otherPlayer.character)
  ) {
    myPlayer.health = Math.floor(myPlayer.health * healthSettings.increment);
    otherPlayer.health = Math.floor(
      otherPlayer.health * healthSettings.decrement
    );
    return { myPlayer, otherPlayer };
  }
  if (
    characters[otherPlayer.character].strongerThan.includes(myPlayer.character)
  ) {
    myPlayer.health = Math.floor(myPlayer.health * healthSettings.decrement);
    otherPlayer.health = Math.floor(
      otherPlayer.health * healthSettings.increment
    );
    return { myPlayer, otherPlayer };
  }
  return { myPlayer, otherPlayer };
}

module.exports = {
  handleCollision,
};
