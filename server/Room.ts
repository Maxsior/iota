// import PlayerInfo from '../common/PlayerInfo';
import { Socket } from 'socket.io';
import RoomInfo from '../common/RoomInfo';
import Query from '../common/Query';

class Room {
  private players: Socket[] = [];

  constructor(
    private id: string,
    private deck: any,
    private field: any,
  ) {
  }

  get playing() {
    return false;
  }

  get empty() {
    return this.players.length === 0;
  }

  getInfo(): RoomInfo {
    return {
      id: this.id,
      players: this.players.map(socket => ({
        id: socket.id,
        name: (socket.handshake.query as Query).name,
        score: 0,
      })),
      current: 0,
    };
  }

  join(socket: Socket) {
    this.players.push(socket);
    socket.join(this.id);
    socket.to(this.id).emit('room_updated', this.getInfo());
  }

  leave(socket: Socket) {
    this.players = this.players.filter(player => player.id !== socket.id);
    socket.to(this.id).emit('room_updated', this.getInfo());
  }

  startGame() {
    // const initCard = this.deck.pick();
    // this.field.put(0, 0, initCard);
    // this.pla

    // this.players[0].nsp.to(this.id).emit('field_updated', this.field.getInfo());

    this.players.forEach(player => {
      // const cards = [this.deck.pick() x4]

      player.emit('game_started', {
        cards: [],
      });
    });
  }
}

export default Room;
