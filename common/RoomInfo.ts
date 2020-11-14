import PlayerInfo from './PlayerInfo';

interface RoomInfo {
  id: string;
  players: PlayerInfo[];
  current: number;
}

export default RoomInfo;
