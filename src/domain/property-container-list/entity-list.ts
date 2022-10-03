import { EntityType } from '../components/component/component';

export class EntityList<Components extends Record<keyof Components, unknown>> {
    private instances: Array<EntityType<Components>> = [];

    public add(...instances: Array<EntityType<Components>>): void {
        this.instances.push(...instances);
    }

    public findWithType<Result extends Components>(
        guard: (instance: EntityType<{}>) => instance is EntityType<Result>,
        predicate?: (instance: EntityType<Result>) => boolean,
    ): Array<EntityType<Result>> {
        const resultType = this.instances.filter((instance) => guard(instance)) as unknown as Array<EntityType<Result>>;
        return predicate
            ? resultType.filter((instance) => predicate(instance))
            : resultType;
    }

    public find(predicate: (instance: EntityType<Components>) => boolean): Array<EntityType<Components>> {
        return this.instances.filter(predicate);
    }

    public getAll(): Array<EntityType<Components>> {
        return this.instances.slice();
    }

    public remove(...instances: Array<EntityType<Components>>): void {
        this.instances = this.instances.filter((item) => !instances.includes(item));
    }

    public clear(): void {
        this.instances = [];
    }
}
