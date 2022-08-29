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

export function main() {
    const worldParams = { width: 20, height: 20, maxGrass: 200 };
    const worldsCount = 10;

    let activeWorlds: SimpleGrassWorld[] = [];
    let finishedWorlds: SimpleGrassWorld[] = [];

    for (let i = 0; i < worldsCount; i++) {
        const simpleWorld = new SimpleGrassWorld();
        simpleWorld.startOneByOne(worldParams);
        simpleWorld.world.id = i;
        activeWorlds.push(simpleWorld);
    }

    function step() {
        activeWorlds.forEach((world, index) => {
            world.tick();

            if (world.findByTag(InstanceTypes.ANIMAL).length === 0) {
                finishedWorlds.push(activeWorlds.splice(index, 1)[0]);
            }
        });

        if (activeWorlds.length > 0) {
            displayWorld(activeWorlds[0]);
        } else {
            console.log(`GAMEOVER`.padEnd(40, '='));
            console.log('next generation');
            finishedWorlds = finishedWorlds.reverse();
            calculateFitness(finishedWorlds);
            activeWorlds = [];
            for (let i = 0; i < worldsCount; i++) {
                activeWorlds[i] = pickOne(finishedWorlds, worldParams);
            }
            finishedWorlds.forEach((world) => {
                world.despose();
            });
            finishedWorlds = [];
        }

        setTimeout(() => {
            step();
        }, 10);
    }

    step();
}

function pickOne(finishedWorlds: SimpleGrassWorld[], worldParams: { width: number; height: number, maxGrass: number }) {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
        r = r - finishedWorlds[index].getFitnessOfEntity();
        index++;
    }
    index--;
    let world = finishedWorlds[index];
    let child = new SimpleGrassWorld();
    child.startOneByOne({ ...worldParams, network: world.getNetwort() });
    child.mutate();
    return child;
}

function calculateFitness(finishedWorlds: SimpleGrassWorld[]) {
    let sum = 0;
    for (let world of finishedWorlds) {
        sum += world.getScore();
    }
    for (let world of finishedWorlds) {
        world.setFitness(world.getScore() / sum);
    }
}
