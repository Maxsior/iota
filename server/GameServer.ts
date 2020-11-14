import SocketIO from 'socket.io';
import { Server } from 'http';
import Room from './Room.js';
import RoomFactory from './RoomFactory.js';

class GameServer {
  private io: SocketIO.Server;

  private handlers: {[event: string]: Function} = {};

  private rooms: {[name: string]: Room} = {};

  constructor(
    private server: Server,
  ) {
    this.io = new SocketIO(server, {
      path: '/iota',
    });
    this.onConnect = this.onConnect.bind(this);
  }

  private generateRoomId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < 4; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }

    while (id in this.rooms) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
  }

  public joinRoom(socket: SocketIO.Socket, roomId?: string) {
    const room = roomId || this.generateRoomId();

    if (!(room in this.rooms)) {
      this.rooms[room] = RoomFactory.create(room);
    }

    this.rooms[room].join(socket);

    socket.join(room);

    return this.rooms[room].getInfo();
  }

  addHandler(event: string, handler: Function) {
    this.handlers[event] = handler;
  }

  private onConnect(socket: SocketIO.Socket) {
    console.log('connect: ', socket.id);

    Object.entries(this.handlers).forEach(([event, handler]) => {
      socket.on(event, handler.bind(null, socket));
    });
  }

  listen(...args: any[]) {
    this.io.on('connect', this.onConnect);
    this.server.listen(...args);
  }
}

export default GameServer;
