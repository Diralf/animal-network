import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { Component } from '../../../domain/components/component/component';
import { DirectionBrainCommand } from '../../../domain/property/direction-brain/direction-brain-property';
import { World } from '../../../domain/world/world';
import { AnimalDirectionGrassNetwork } from '../../../network/animal-direction-grass-network/animal-direction-grass-network';
import { Owner } from '../components/component-builder';
import { Animal } from './animal';

class NeuralBrainComponent extends Component<void, Owner<'brain' | 'sight' | 'size' | 'taste' | 'energy'>> {
    private network = new AnimalDirectionGrassNetwork();

    async loadFromFile() {
        try {
            // this.network.dispose();
            this.network = await this.network?.copyByFile(false);
        } catch (e) {
            console.error(e);
        }
    }

    async setNetwork(network: AnimalDirectionGrassNetwork) {
        this.network.dispose();
        await network.saveToFile();
        network.disposeVariables();
        this.network = await network?.copyByFile(false);
    }

    private brainHandler(): DirectionBrainCommand {
        return this.network.predict(this.owner.component);
    }

    dispose() {
        this.network.dispose();
    }

    getNetwork() {
        return this.network;
    }

    tick(world: World, time: number) {
        super.tick(world, time);
        this.owner.component.brain.applyDecision(this.brainHandler());
    }
}

export const NeuralAnimal = entityBuilder({
    ...Animal.factorySet,
    neuralBrain: NeuralBrainComponent.builder()(),
});

export type NeuralAnimal = ReturnType<typeof NeuralAnimal.build>;
