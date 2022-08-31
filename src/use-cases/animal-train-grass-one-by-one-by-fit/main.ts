import { Animal } from '../simple-grass-world/entities/animal';
import { SimpleGrassWorld } from '../simple-grass-world/simple-grass-world';
import { InstanceTypes } from '../simple-grass-world/types/instance-types';
import * as tf from '@tensorflow/tfjs-node';

function displayWorld(simpleWorld: SimpleGrassWorld) {
    const animals = simpleWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];
    const sizes = animals.map((animal) => animal.size.current);
    const time = simpleWorld.world.getTime();

    console.log(tf.memory());
    console.log(`ID: ${simpleWorld.world.id} `.padEnd(40, '-'));
    console.log(`size: ${sizes}`, `time: ${time}`);
    console.log(simpleWorld.world.print(simpleWorld.world.getEntityList()), ' ');
}

const timer = (milliseconds: number) => new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
});

export async function main() {
    const worldParams = { width: 20, height: 20, maxGrass: 100 };
    const worldsCount = 1;
    let generation = 0;
    let isGenerationView = false;

    let activeWorlds: SimpleGrassWorld[] = [];
    let finishedWorlds: SimpleGrassWorld[] = [];

    for (let i = 0; i < worldsCount; i++) {
        const simpleWorld = new SimpleGrassWorld();
        await simpleWorld.startOneByOne(worldParams);
        simpleWorld.world.id = i;
        activeWorlds.push(simpleWorld);
    }

    async function step() {
        isGenerationView = generation % 100 === 0;
        activeWorlds.forEach((world, index) => {
            world.tick();

            if (world.findByTag(InstanceTypes.ANIMAL).length === 0) {
                finishedWorlds.push(activeWorlds.splice(index, 1)[0]);
            }
        });

        if (activeWorlds.length > 0) {
            if (isGenerationView) {
                displayWorld(activeWorlds[0]);
            }
        } else {
            generation += 1;
            console.log(`GAMEOVER`.padEnd(40, '='));
            console.log(`Fitting ${generation}`);
            activeWorlds = [];
            for (let i = 0; i < worldsCount; i++) {
                activeWorlds[i] = await pickOne(finishedWorlds, worldParams);
            }
            finishedWorlds.forEach((world) => {
                world.dispose();
            });
            finishedWorlds = [];
            await timer(isGenerationView ? 3000 : 0);
        }

        await timer(isGenerationView ? 100 : 0);
        await step();
    }

    await step();
}

async function pickOne(finishedWorlds: SimpleGrassWorld[], worldParams: { width: number; height: number, maxGrass: number }) {
    const world = finishedWorlds[0];
    await world.trainSavedNetwork();

    const child = new SimpleGrassWorld();
    await child.startOneByOne({ ...worldParams, network: world.getSavedNetwort() });
    return child;
}
