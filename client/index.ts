import UI from './UI';
import Client from './Client';

const client = new Client('http://localhost:3000');

client.addHandler('room_updated', UI.updateRoomInfo);

client.addHandler('field_updated', console.warn);

client.addHandler('game_started', () => {
  UI.get('start_wrapper').style.display = 'none';
});

//

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

  UI.wait(room.data.players[0].id === client.id);
  UI.updateRoomInfo(room.data);
  UI.setPage('game');
});

UI.get('button_start').addEventListener('click', () => {
  client.startGame();
});

UI.get('button_quit').addEventListener('click', () => {
  client.disconnect();
  UI.setPage('start');
});
