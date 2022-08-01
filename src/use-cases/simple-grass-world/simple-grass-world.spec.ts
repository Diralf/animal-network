import {Food} from "../../domain/entity/instances/food/food";
import {Animal} from "../../domain/entity/instances/animal/animal";
import {SimpleGrassWorld} from "./simple-grass-world";

describe('SimpleGrassWorld', () => {
    it('should generate world with 5 grass and one animal', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const entityList = simpleGrassWorld.entityList;
        const grassInstances = entityList.getEntity({ byInstanceOf: Food });
        const animalInstances = entityList.getEntity({ byInstanceOf: Animal });

        expect(grassInstances).toHaveLength(5);
        expect(animalInstances).toHaveLength(1);
    });

    it('should generate grass in the different places', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const entityList = simpleGrassWorld.entityList;
        const grassInstances = entityList.getEntity({ byInstanceOf: Food });

        expect(grassInstances).toHaveLength(5);
        grassInstances.forEach((grassInstance) => {
            const position = grassInstance.get.position();
            const result = entityList.getEntity({
                byInstanceOf: Food,
                position,
            });

            expect(result).toHaveLength(1);
        });
    });
});
