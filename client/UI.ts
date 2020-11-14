import RoomInfo from '../common/RoomInfo';

class UI {
  static get<T extends HTMLElement>(id: string) {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`#${id} does not exist!`);
    }
    return element as T;
  }

  private static validateIdentifier(value: string): string {
    return value.trim();
  }

  static getName() {
    const nameInput = UI.get<HTMLInputElement>('input_player_name');
    return UI.validateIdentifier(nameInput.value);
  }

  static getRoomId() {
    const roomInput = UI.get<HTMLInputElement>('input_room_id');
    return UI.validateIdentifier(roomInput.value);
  }

  // HTMLButtonElement, HTMLCanvasElement;
  static closePopup() {
    const popup = UI.get('popup');
    popup.classList.remove('shown');
  }

  static showError(text: string) {
    const popup = UI.get('popup');
    const message = popup.querySelector<HTMLElement>('.popup__message')!;
    message.innerText = text;
    popup.classList.add('error');
    popup.classList.add('shown');
    setTimeout(this.closePopup, 3000);
  }

  static setPage(name: string) {
    this.closePopup();
    const pages = document.getElementsByClassName('page');
    Array.from(pages).forEach(page => {
      if (page.id === `page_${name}`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });
  }

  static wait(canStart: boolean) {
    UI.get('start_wrapper').style.display = '';
    const waitingStyle = UI.get('waiting').style;
    const startButtonStyle = UI.get('button_start').style;
    if (canStart) {
      startButtonStyle.display = '';
      waitingStyle.display = 'none';
    } else {
      startButtonStyle.display = 'none';
      waitingStyle.display = '';
    }
  }

  private static buildScoreTable(players: any[]) { // TODO types
    const scoresContainer = UI.get('scores');
    scoresContainer.innerHTML = '';
    players
      .sort((p1, p2) => p2.score - p1.score)
      .forEach(player => {
        scoresContainer.insertAdjacentHTML('beforeend', `
          <div class="stat__scores_row">
            <p class="stat__scores_name">${player.name}</p>
            <p class="stat__scores_score">${player.score}</p>
          </div>
        `);
      });
  }

  static updateRoomInfo(room: RoomInfo) {
    UI.get('room_id').innerText = room.id;
    UI.get('players_number').innerText = room.players.length.toString();
    UI.get('current_player').innerText = room.players[room.current].name;
    UI.get('host_player').innerText = room.players[0].name;
    UI.buildScoreTable(room.players);
  }
}

export default UI;
