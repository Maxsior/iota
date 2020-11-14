import io from 'socket.io-client';
import RoomInfo from '../common/RoomInfo';
import AckData from '../common/AckData';

class Client {
  private io: SocketIOClient.Socket;

  constructor(private url: string) {
    this.io = io(url, {
      autoConnect: false,
      path: '/iota',
    });
  }

  connect() {
    this.io.connect();
  }

  setName(name: string) {
    this.io.io.opts.query = {
      name,
    };

    this.io.connect();
  }

  get id() {
    return this.io.id;
  }

  joinRoom(roomId: string): Promise<AckData<RoomInfo>> {
    return new Promise(resolve => {
      this.io.emit('join_room', { id: roomId }, resolve);
    });
  }

  startGame() {
    this.io.emit('start_game');
  }

  addHandler(event: string, handler: Function) {
    this.io.on(event, handler);
  }
}

export default Client;
