import express from 'express';
import { createServer } from 'http';
import SocketIO from 'socket.io';
import RoomInfo from '../common/RoomInfo';
import Ack from './Ack';
import GameServer from './GameServer.js';

const app = express();
app.use(express.static(process.env.STATIC_DIR || 'public'));
const staticServer = createServer(app);

const gameServer = new GameServer(staticServer);

gameServer.addHandler('join_room', (socket: SocketIO.Socket, { id }: Partial<RoomInfo>, ack: Ack<RoomInfo>) => {
  const roomInfo = gameServer.joinRoom(socket, id);
  ack({ data: roomInfo });
});

gameServer.addHandler('start_game', (socket: any) => {
  console.log(socket.id, 'started game');
});

gameServer.addHandler('disconnect', (socket: any) => {
  console.log('disconnect: ', socket.id);
});

const port = process.env.PORT || 3000;
gameServer.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
