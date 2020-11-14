import UI from './UI';
import Client from './Client';

const client = new Client('http://localhost:3000');
client.addHandler('room_updated', UI.updateRoomInfo);
client.addHandler('field_updated', console.warn);

UI.get('button_join_room').addEventListener('click', async () => {
  const name = UI.getName();

  if (!name) {
    UI.showError('Please, enter name');
    return;
  }

  client.setName(name);
  client.connect();

  const roomId = UI.getRoomId();

  const room = await client.joinRoom(roomId);

  if ('error' in room) {
    UI.showError(room.error);
    return;
  }

  if (room.data.players[0].id === client.id) {
    UI.get('button_start_wrapper').style.display = 'unset';
  }

  UI.updateRoomInfo(room.data);
  UI.setPage('game');
});

UI.get('button_start').addEventListener('click', () => {
  UI.get('button_start_wrapper').style.display = '';
  client.startGame();
});
