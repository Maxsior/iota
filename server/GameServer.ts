import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Room from './Room.js';
import RoomFactory from './RoomFactory.js';

class GameServer {
  private io: Server;

  private handlers: {[event: string]: Function} = {};

  private rooms: {[name: string]: Room} = {};

  constructor(
    private server: HTTPServer,
  ) {
    this.io = new Server(server, {
      path: '/iota',
      cors: {
        origin: 'http://localhost:1234',
        methods: ['GET'],
      },
      serveClient: false,
    });
    this.onConnect = this.onConnect.bind(this);
  }

  private generateRoomId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < 4; i += 1) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }

    while (id in this.rooms) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
  }

  public static getRoom(socket: Socket) {
    const roomIter = socket.rooms.values();
    roomIter.next(); // skip own room
    return roomIter.next().value;
  }

  public joinRoom(socket: Socket, roomId?: string) {
    const room = roomId?.toLowerCase() || this.generateRoomId();

    if (!(room in this.rooms)) {
      this.rooms[room] = RoomFactory.create(room);
    }

    if (this.rooms[room].playing) {
      throw new Error('Game game has already started');
    }

    this.rooms[room].join(socket);

    return this.rooms[room].getInfo();
  }

  leaveRoom(socket: Socket) {
    const room = GameServer.getRoom(socket);

    if (!room) return;

    this.rooms[room].leave(socket);

    if (this.rooms[room].empty) {
      delete this.rooms[room];
    }
  }

  addHandler(event: string, handler: Function) {
    this.handlers[event] = handler;
  }

  private onConnect(socket: Socket) {
    console.log('connect: ', socket.id);

    Object.entries(this.handlers).forEach(([event, handler]) => {
      socket.on(event, handler.bind(null, socket));
    });
  }

  listen(...args: any[]) {
    this.io.on('connect', this.onConnect);
    this.server.listen(...args);
  }

  startGame(socket: Socket) {
    const room = GameServer.getRoom(socket);

    if (!room) return;

    this.rooms[room].startGame();
  }
}

export default GameServer;
