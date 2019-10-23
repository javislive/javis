import Device from './Device';
import Music from './MusicRemote';

export function createDevice(
  type: string,
  id: string,
  status: any,
): Device | null {
  switch (type) {
    case Music.type:
      return new Music(id, status);
    default:
      return null;
  }
}
