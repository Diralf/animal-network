export class Entity {
    /**
     * {min} = 1
     * {max} = 100
     */
    size: number = 1;

    constructor(options: Partial<Entity> = {}) {
        this.setSize(options.size ?? 1);
    }

    setSize(size: number) {
        if (size < 1 || size > 100) {
            throw new Error('Invalid entity size');
        }
        this.size = size;
    }
}
