import { World } from '../world/world';
import { OnTick } from './on-tick';

export class TimeThread {
    private listeners: OnTick[] = [];

    public addListener(...listener: OnTick[]): void {
        this.listeners.push(...listener);
    }

    public tick(world: World, time: number): void {
        this.listeners.forEach((listener) => {
            listener.tick(world, time);
        });
    }
}
