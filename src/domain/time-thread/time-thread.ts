import { World } from '../world/world';
import { OnTick } from './on-tick';

export class TimeThread {
    private listeners: OnTick[] = [];

    public addListener(...listeners: OnTick[]): void {
        this.listeners.push(...listeners);
    }

    public removeListener(...listeners: OnTick[]): void {
        this.listeners = this.listeners.filter((listener) => !listeners.includes(listener));
    }

    public tick(world: World, time: number): void {
        this.listeners.forEach((listener) => {
            listener.tick(world, time);
        });
    }
}
