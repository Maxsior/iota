import Ack from './Ack';

interface ServerEventHandler {
  (player: any, data?: any, ack?: Ack<any>): void;
}

export default ServerEventHandler;
