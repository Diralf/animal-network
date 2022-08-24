import { Animal } from '../simple-grass-world/entities/animal';
import { SimpleGrassWorld } from '../simple-grass-world/simple-grass-world';
import { InstanceTypes } from '../simple-grass-world/types/instance-types';

export function main() {
    const simpleWorld = new SimpleGrassWorld();
    simpleWorld.startOneByOne({ width: 20, height: 20, maxGrass: 10 });

    function step() {
        console.log('-'.repeat(40));
        const animals = simpleWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];
        const sizes = animals.map((animal) => animal.size.current);
        simpleWorld.tick();
        console.log(sizes);
        console.log(simpleWorld.world.print(simpleWorld.world.getEntityList()));
        if (animals.length > 0) {
            setTimeout(() => {
                step();
            }, 100);
        } else {
            console.log('GAMEOVER'.padEnd(40, '='));
        }
    }

    step();
}
