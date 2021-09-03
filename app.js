// Require and initialise express:

const express = require('express');
const app = express();

// Require and initialise cors and json.

const cors = require('cors');
app.use(
  cors({
    origin: 'https://soc-wars-working-dev.netlify.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.use(express.json());

// Create a server using express.

const server = require('http').createServer(app);

// Initialise socket.io with the express server.

const io = require('socket.io')(server, { origins: '*:*' });

// Set the PORT to be assigned through environment variables (heroku) or localhost 5000.

const PORT = process.env.PORT || 5000;

// Update functions:

const { updateRooms } = require('./gameLogic/updateFunctions/updateRooms');
const { updatePellets } = require('./gameLogic/updateFunctions/updatePellets');
const { updateHealth } = require('./gameLogic/updateFunctions/updateHealth');
const { updateSize } = require('./gameLogic/updateFunctions/updateSize');
const {
  updateScoreboard,
} = require('./gameLogic/updateFunctions/updateScoreboard');

// Room functions:

const {
  generatePelletArray,
} = require('./gameLogic/roomFunctions/generatePelletArray');
const {
  setPelletRegeneration,
} = require('./gameLogic/roomFunctions/setPelletRegeneration');
const { setTimer } = require('./gameLogic/roomFunctions/setTimer');
const { resetRoom } = require('./gameLogic/roomFunctions/resetRoom');
const { deletePellet } = require('./gameLogic/roomFunctions/deletePellet');
const { checkEmptyRoom } = require('./gameLogic/roomFunctions/checkEmptyRoom');

// Player functions:

const {
  generatePlayer,
} = require('./gameLogic/playerFunctions/generatePlayer');
const {
  handleCollision,
} = require('./gameLogic/playerFunctions/handleCollision');
const {
  resolveCollision,
} = require('./gameLogic/playerFunctions/resolveCollision');
const {
  handleMovement,
} = require('./gameLogic/playerFunctions/handleMovement');
const { eatPellet } = require('./gameLogic/playerFunctions/eatPellet');

// Event dictionary containing socket connection events:

const { eventDictionary } = require('./config/eventDictionary');

const {
  CONNECTION,
  ENTER_GAME,
  READY_TO_START,
  PLAYER_CONNECTED,
  PLAYER_MOVED,
  PELLET_DELETED,
  PLAYER_COLLISION,
  START_TIMER,
  PLAYER_JOINED,
  UPDATE_GAME_OVER,
  JOIN_ROOM,
  UPDATE_ROOMS,
  UPDATE_MAX_CAPACITY,
  UPDATE_TIME_UP,
  DISCONNECT,
  PLAYER_DISCONNECTED,
  LEAVE_ROOM,
} = eventDictionary;

// Hello world to test whether the server is running:

app.get('/', (request, response) => {
  response.send('Hello World');
});

// The namespace '/game' created using socket.io.

const game = io.of('/game');

// The number of pellets in the game.

const numberOfPellets = 100;

/* The three rooms that the game can be played in. Each room contains an array of players, a pellet array, a set timer, a pellet
 regeneration speed and the scoreboard for that room. */

let rooms = {
  room1: {
    players: [],
    pelletRegenerationSpeed: 2000,
    pellets: generatePelletArray(numberOfPellets),
    pelletRegeneration: null,
    timer: 10,
    timerInterval: null,
    scoreBoard: [],
    updateScoreInterval: null,
    isRunning: false,
  },
  room2: {
    players: [],
    pelletRegenerationSpeed: 2000,
    pellets: generatePelletArray(numberOfPellets),
    pelletRegeneration: null,
    timer: 120,
    scoreBoard: [],
    updateScoreInterval: null,
    isRunning: false,
  },
  room3: {
    players: [],
    pelletRegenerationSpeed: 2000,
    pellets: generatePelletArray(numberOfPellets),
    pelletRegeneration: null,
    timer: 120,
    scoreBoard: [],
    updateScoreInterval: null,
    isRunning: false,
  },
};

/* The start of the game connection. The below code will resolve when a client connects, and listen for emitted events as long
 as they are connected. */

game.on(CONNECTION, (socket) => {
  /* The roomId is used to identify which room a player is currently in. It begins as null, and is given a value when the client 
  joins a room. It is changed when they enter a new room. */

  let roomId = null;

  /*  The playerIndex is used to identify each client's player object in the players array. It begins as null, and is assigned a 
  value when the client enters the game. */

  let playerIndex = null;

  /* Listens for when the client has joined a room. It adds the roomId to the client's socket object, and joins them to that room. 
  It emits an event to tell the frontend how many players are currently in each room.*/

  socket.on(JOIN_ROOM, ({ roomNumber }) => {
    roomId = roomNumber;
    socket.join(roomId);
    console.log(`${socket.id} has joined ${roomId}`);
    console.log('This is the room you are about the enter:', rooms[roomId]);
  });

  // Listens for for when the client is viewing room information.

  socket.on(UPDATE_ROOMS, () => {
    updateRooms(game, rooms);
  });

  // Listens for the client to type a name, choose a character and enter the game.

  socket.on(ENTER_GAME, ({ name, character }) => {
    // Sets the occupied room's isRunning property to true.

    rooms[roomId].isRunning = true;

    // Sets the client's playerIndex to the current length of the players array in their room.

    playerIndex = rooms[roomId].players.length;

    /* Creates a new player for the client by pushing a player object to the player array in their room. Their index is equal to
    the value of the playerIndex. The object is generated with their chosen name and character. */

    generatePlayer(playerIndex, rooms[roomId].players, name, character);

    // Modifies the pellet regeneration speed of the room to account for the new number of players.

    setPelletRegeneration(game, roomId, rooms[roomId]);

    // Updates the current number of players in each room on the frontend.

    updateRooms(game, rooms);

    // Tells the other players in the game that a new player has joined.

    socket
      .to(roomId)
      .emit(PLAYER_JOINED, { newPlayer: rooms[roomId].players[playerIndex] });
  });

  /* Listens for when the client is ready to start the game, and emits their playerIndex, and the players and pellets in the room. */

  socket.on(READY_TO_START, () => {
    if (rooms[roomId] && rooms[roomId].isRunning) {
      game.to(socket.id).emit(PLAYER_CONNECTED, {
        success: true,
        payload: {
          playerIndex,
          players: rooms[roomId].players,
          pellets: rooms[roomId].pellets,
        },
      });
    }
  });

  socket.on(START_TIMER, () => {
    setTimer(game, rooms[roomId], roomId);
    // The update scoreboard event emits the current player ranking to all clients every second, so that players can see who is winning.
    if (rooms[roomId] && rooms[roomId].isRunning) {
      updateScoreboard(game, rooms[roomId], roomId);
    }
  });

  // Listens for when a player has moved, updates their location on the server, and updates their location for all other players.

  socket.on(PLAYER_MOVED, ({ updatedPlayer }) => {
    if (rooms[roomId] && rooms[roomId].isRunning) {
      handleMovement(
        socket,
        roomId,
        rooms[roomId].players[playerIndex],
        updatedPlayer
      );
    }
  });

  // Listens for when a pellet has been eaten by a player, removes the pellet from the game, and updates the pellets for all players.

  socket.on(PELLET_DELETED, ({ pelletId }) => {
    if (rooms[roomId] && rooms[roomId].isRunning) {
      // Removes the pellet that the player has collided with.

      deletePellet(rooms[roomId], pelletId);

      // The changes the player's properties after eating a pellet.

      eatPellet(rooms[roomId].players[playerIndex]);

      // Updates all players about the new pellet and player state.

      updatePellets(game, rooms[roomId].pellets, roomId);
      updateHealth(game, rooms[roomId].players[playerIndex], roomId);
      updateSize(game, rooms[roomId].players[playerIndex], roomId);
    }
  });

  // Listens for when two players have collided, and resolves the collision.

  socket.on(PLAYER_COLLISION, ({ otherPlayerIndex }) => {
    if (rooms[roomId] && rooms[roomId].isRunning) {
      handleCollision(
        rooms[roomId].players[playerIndex],
        rooms[roomId].players[otherPlayerIndex]
      );

      resolveCollision(
        rooms[roomId].players[playerIndex],
        rooms[roomId].players[otherPlayerIndex],
        rooms[roomId].players,
        game,
        roomId,
        rooms
      );
    }
  });

  // Listens for when a player enters a room. If the room is at max capacity, they are sent to the waiting page.

  socket.on(UPDATE_MAX_CAPACITY, () => {
    if (rooms[roomId].players.length >= 5) {
      socket.emit(UPDATE_MAX_CAPACITY, {});
    }
  });

  // Listens for one player has killed another player in the game, and emits the information to be displayed on screen.

  socket.on(UPDATE_GAME_OVER, ({ losingPlayer, winningPlayer }) => {
    socket.to(roomId).emit(UPDATE_GAME_OVER, { losingPlayer, winningPlayer });
  });

  // Listens for the final scoreboard after the game has ended, and emits the final scores to the TimeUp component.

  socket.on(UPDATE_TIME_UP, ({ scoreBoard }) => {
    if (rooms[roomId].players) {
      rooms[roomId] = resetRoom(rooms[roomId]);
      updateRooms(game, rooms);
    }

    game.to(roomId).emit(UPDATE_TIME_UP, { scoreBoard });
  });

  // Listens for a player disconnecting from the game, and emits this information for remaining players.

  socket.on(DISCONNECT, () => {
    if (roomId && rooms[roomId].players[playerIndex]) {
      rooms[roomId].players[playerIndex].active = false;
      if (checkEmptyRoom(rooms[roomId])) {
        rooms[roomId] = resetRoom(rooms[roomId]);
        updateRooms(game, rooms);
      }
    }
    game.to(roomId).emit(PLAYER_DISCONNECTED, {
      success: true,
      payload: { playerIndex },
    });
  });

  socket.on(LEAVE_ROOM, () => {
    socket.leave(roomId);
  });
});

// Sets the server the listen on the specified port.

server.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
