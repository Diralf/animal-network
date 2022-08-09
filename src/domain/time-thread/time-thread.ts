import { World } from '../world/world';
import { TimeThreadListener } from './time-thread-listener';

export class TimeThread {
    private listeners: TimeThreadListener[] = [];

    public addListener(listener: TimeThreadListener): void {
        this.listeners.push(listener);
    }

    public tick(world: World): void {
        this.listeners.forEach((listener) => {
            listener.tick(world);
        });
    }
}
