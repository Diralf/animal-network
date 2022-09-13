export type Subscriber<Inputs extends unknown[]> = (...args: Inputs) => void;

export class Publisher<Inputs extends unknown[]> {
    private subscribers: Subscriber<Inputs>[] = [];

    public subscribe(...subscriber: Subscriber<Inputs>[]): void {
        this.subscribers.push(...subscriber);
    }

    public unsubscribe(...subscribers: Subscriber<Inputs>[]): void {
        this.subscribers = this.subscribers.filter((subscriber) => !subscribers.includes(subscriber));
    }

    public notify(...args: Inputs): void {
        this.subscribers.forEach((subscriber) => {
            subscriber(...args);
        });
    }
}
