
export class EntityList<Entity> {
    private instances: Entity[] = [];

    public add(...instances: Entity[]): void {
        this.instances.push(...instances);
    }

    public findWithType<Result extends Entity>(
        guard: (instance: Entity) => instance is Result,
        predicate?: (instance: Result) => boolean,
    ): Result[] {
        const resultType = this.instances.filter((instance) => guard(instance)) as Result[];
        return predicate
            ? resultType.filter((instance) => predicate(instance))
            : resultType;
    }

    public find(predicate: (instance: Entity) => boolean): Entity[] {
        return this.instances.filter(predicate);
    }

    public getAll(): Entity[] {
        return this.instances.slice();
    }

    public remove(...instances: Entity[]): void {
        this.instances = this.instances.filter((item) => !instances.includes(item));
    }
}
