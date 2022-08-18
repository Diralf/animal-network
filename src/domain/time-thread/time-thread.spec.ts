import { World } from '../world/world';
import { TimeThread } from './time-thread';
import { OnTick } from './on-tick';

describe('TimeThread', () => {
    it('should add listeners and trigger it on event', () => {
        const world = new World();
        const timeThread = new TimeThread();
        const listener: OnTick = {
            tick: jest.fn(),
        };

        timeThread.addListener(listener);
        timeThread.tick(world, 0);

        expect(listener.tick).toHaveBeenCalledTimes(1);
        expect(listener.tick).toHaveBeenCalledWith(world, 0);
    });
});
