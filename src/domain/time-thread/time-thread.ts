import { Publisher, Subscriber } from '../property/utils/observer';
import { World } from '../world/world';
import { OnTick } from './on-tick';

export class TimeThread {
    private publisher: Publisher<[world: World, time: number]> = new Publisher();

    private getTicks(listeners: OnTick[]): Array<Subscriber<[world: World, time: number]>> {
        return listeners.map((listener) => listener.tick.bind(listener));
    }

    public addListener(...listeners: OnTick[]): void {
        this.publisher.subscribe(...this.getTicks(listeners));
    }

    public removeListener(...listeners: OnTick[]): void {
        this.publisher.unsubscribe(...this.getTicks(listeners));
    }

    public tick(world: World, time: number): void {
        this.publisher.notify(world, time);
    }
}
