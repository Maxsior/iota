import Room from './Room.js';

class RoomFactory {
  static create(id: string) {
    // TODO new Field();
    // TODO new Deck();
    return new Room(id, {}, {});
  }
}

export default RoomFactory;
