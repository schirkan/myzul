import { Client } from 'boardgame.io/react';
import { AzulGameBoard } from './Board';
import { AzulGame } from './Game';
import { Local } from 'boardgame.io/multiplayer'

export const Azul = Client({
  // A game object.
  game: AzulGame,

  // The number of players.
  numPlayers: 2,  

  // Your React component representing the game board.
  // The props that this component receives are listed below.
  // When using TypeScript, type the component's properties as
  // extending BoardProps.
  board: AzulGameBoard,

  // Optional: React component to display while the client
  // is in the "loading" state prior to the initial sync
  // with the game master. Relevant only in multiplayer mode.
  // If this is not provided, the client displays "connecting...".
  //loading: LoadingComponent,

  // Set this to one of the following to enable multiplayer:
  //
  // SocketIO
  //   Implementation that talks to a remote server using socket.io.
  //
  //   How to import:
  //     import { SocketIO } from 'boardgame.io/multiplayer'
  //
  //   Arguments:
  //     Object with 2 parameters
  //        1. 'socketOpts' options to pass directly to socket.io client.
  //        2. 'server' specifies the server location in the format: [http[s]://]hostname[:port];
  //            defaults to current page host.
  //
  // Local
  //   Special local mode that uses an in-memory game master. Useful
  //   for testing multiplayer interactions locally without having to
  //   connect to a server.
  //
  //   How to import:
  //     import { Local } from 'boardgame.io/multiplayer'
  //
  // Additionally, you can write your own transport implementation.
  // See `src/client/client.js` for details.
  multiplayer: Local({ /* ... */ }),

  // Set to false to disable the Debug UI.
  debug: true,

  // An optional Redux store enhancer.
  // This is useful for augmenting the Redux store
  // for purposes of debugging or simply intercepting
  // events in order to kick off other side-effects in
  // response to moves.
  //enhancer: applyMiddleware(your_middleware),
});