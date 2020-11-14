import express from 'express';
import { createServer } from 'http';
import { Socket } from 'socket.io';
import RoomInfo from '../common/RoomInfo';
import Ack from './Ack';
import GameServer from './GameServer.js';

const app = express();
app.use(express.static(process.env.STATIC_DIR || 'public'));
const staticServer = createServer(app);

const gameServer = new GameServer(staticServer);

gameServer.addHandler('join_room', (socket: Socket, { id }: Partial<RoomInfo>, ack: Ack<RoomInfo>) => {
  try {
    const roomInfo = gameServer.joinRoom(socket, id);
    ack({ data: roomInfo });
  } catch (e) {
    ack({ error: e.message });
  }
});

gameServer.addHandler('start_game', (socket: Socket) => {
  gameServer.startGame(socket);
});

gameServer.addHandler('disconnecting', (socket: Socket) => {
  gameServer.leaveRoom(socket);
});

const port = process.env.PORT || 3000;
gameServer.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
