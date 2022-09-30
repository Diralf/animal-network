import { Entity } from '../components/components-owner/components-owner';

export class EntityList<Components> {
    private instances: Entity<Components>[] = [];

    public add(...instances: Entity<Components>[]): void {
        this.instances.push(...instances);
    }

    public findWithType<Result extends Components>(
        guard: (instance: Entity<Components>) => instance is Entity<Result>,
        predicate?: (instance: Entity<Result>) => boolean,
    ): Entity<Result>[] {
        const resultType = this.instances.filter((instance) => guard(instance)) as Entity<Result>[];
        return predicate
            ? resultType.filter((instance) => predicate(instance))
            : resultType;
    }

    public find(predicate: (instance: Entity<Components>) => boolean): Entity<Components>[] {
        return this.instances.filter(predicate);
    }

    public getAll(): Entity<Components>[] {
        return this.instances.slice();
    }

    public remove(...instances: Entity<Components>[]): void {
        this.instances = this.instances.filter((item) => !instances.includes(item));
    }

    public clear(): void {
        this.instances = [];
    }
}
