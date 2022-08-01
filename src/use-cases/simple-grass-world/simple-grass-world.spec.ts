import {InstanceTypes, SimpleGrassWorld} from "./simple-grass-world";

describe('SimpleGrassWorld', () => {
    it('should generate world with 5 grass and one animal', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const entityList = simpleGrassWorld.entityList;
        const grassInstances = entityList.find({ tags: [InstanceTypes.GRASS] });
        const animalInstances = entityList.find({ tags: [InstanceTypes.ANIMAL] });

        expect(grassInstances).toHaveLength(5);
        expect(animalInstances).toHaveLength(1);
    });

    it('should generate grass in the different places', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const entityList = simpleGrassWorld.entityList;
        const grassInstances = entityList.find({ tags: [InstanceTypes.GRASS] });

        expect(grassInstances).toHaveLength(5);
        grassInstances.forEach((grassInstance) => {
            const position = grassInstance.get.position();
            const result = entityList.find({ position });

            expect(result).toHaveLength(1);
        });
    });
});
