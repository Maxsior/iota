import AckData from '../common/AckData';

interface Ack<T> {
  (res: AckData<T>): void;
}

export default Ack;
