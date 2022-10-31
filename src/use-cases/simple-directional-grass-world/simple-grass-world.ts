import { EntityType } from '../../domain/components/component/component';
import { Positionable } from '../../domain/property/point/positionable';
import { RawPoint } from '../../domain/property/point/raw-point';
import { Visualable } from '../../domain/property/sight/visualable';
import { World } from '../../domain/world/world';
import { AnimalDirectionGrassNetwork } from '../../network/animal-direction-grass-network/animal-direction-grass-network';
import { DeadAnimal } from './entities/dead-animal';
import { Hole } from './entities/hole';
import { NeuralAnimal } from './entities/neural-animal';
import { GrassGenerator } from './static/grass-generator';
import { InstanceTypes } from './types/instance-types';
import { Taggable } from './types/taggable';

type SimpleGrassWorldEntityTypes = Positionable & Taggable & Visualable;
type SimpleGrassWorldEntity = EntityType<SimpleGrassWorldEntityTypes>;

export interface FieldOptions {
    stringField: string;
    availableEntities: Record<string, (point: RawPoint) => SimpleGrassWorldEntity>;
    staticEntities: Array<() => EntityType<any>>;
}

export class SimpleGrassWorld {
    public world: World<SimpleGrassWorldEntityTypes> = new World();

    public start({ stringField, availableEntities, staticEntities }: FieldOptions): void {
        this.world.registerStatic(staticEntities);
        this.world.registerEntities(new Map(Object.entries(availableEntities)));
        this.world.buildWorldFromString(stringField);
    }

    public tick(): void {
        this.world.tick();
    }

    public findByTag(tag: InstanceTypes): SimpleGrassWorldEntity[] {
        return this.world.getEntityList().find((instance) => {
            return instance.component.tags.current.includes(tag);
        });
    }

    async startOneByOne(param: { width: number; height: number, maxGrass: number, network?: AnimalDirectionGrassNetwork }) {
        this.world.addStatic(GrassGenerator.build({ grassGenerator: { rate: 1, maxGrassAtOnce: param.maxGrass } }));
        const neuralAnimal = NeuralAnimal.build({
            position: {
                x: Math.floor(param.width / 2),
                y: Math.floor(param.height / 2),
            },
            sight: { range: [7, 3] },
        });
        if (param.network) {
            await neuralAnimal.component.neuralBrain.setNetwork(param.network);
        } else {
            await neuralAnimal.component.neuralBrain.loadFromFile();
        }
        this.world.addEntity(neuralAnimal);
        this.world.width = param.width;
        this.world.height = param.height;
        this.world.addEntity(
            ...this.getEntitiesByRect(
                { x: 0, y: 0 },
                { x: param.width - 1, y: param.height - 1 },
                (position) => Hole.build({ position }),
            ),
        );
    }

    public getEntitiesByRect(
        start: RawPoint,
        end: RawPoint,
        factory: (position: RawPoint) => SimpleGrassWorldEntity,
    ): SimpleGrassWorldEntity[] {
        const entities = [];

        for (let i = start.y; i <= end.y; i++) {
            for (let j = start.x; j <= end.x; j++) {
                if (i === start.y || i === end.y || j === start.x || j === end.x) {
                    entities.push(factory({ x: j, y: i }));
                }
            }
        }

        return entities;
    }

    dispose() {
        const entities: DeadAnimal[] = this.findByTag(InstanceTypes.DEAD) as any;
        entities.forEach((entity) => {
            entity.component.deadNetwork.current?.dispose();
        });
    }

    private getSavedNeuralEntity(): DeadAnimal {
        return this.findByTag(InstanceTypes.DEAD)[0] as any;
    }

    getSavedNetwort() {
        const entity = this.getSavedNeuralEntity();
        return entity.component.deadNetwork.current;
    }

    async trainSavedNetwork() {
        const network = this.getSavedNetwort();
        network?.compile();
        await network?.fit();
    }
}
