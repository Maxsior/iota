// import PlayerInfo from '../common/PlayerInfo';
import { Socket } from 'socket.io';
import RoomInfo from '../common/RoomInfo';

class Room {
  private players: Socket[] = [];

  constructor(
    private id: string,
    private deck: any,
    private field: any,
  ) {
  }

  getInfo(): RoomInfo {
    this.players.forEach(socket => console.info(socket.handshake.query));
    return {
      id: this.id,
      players: this.players.map(socket => ({
        id: socket.id,
        name: socket.handshake.query.name,
        score: 0,
      })),
      current: 0,
    };
  }

  join(socket: Socket) {
    this.players.push(socket);
    socket.join(this.id);
  }
}

export default Room;
