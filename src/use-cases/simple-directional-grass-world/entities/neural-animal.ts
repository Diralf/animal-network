import { ComponentOwnerDecorator } from '../../../domain/components/components-owner/component-owner.decorator';
import {
    DirectionBrainProperty,
    DirectionBrainCommand,
} from '../../../domain/property/direction-brain/direction-brain-property';
import { World } from '../../../domain/world/world';
import { AnimalDirectionGrassNetwork } from '../../../network/animal-direction-grass-network/animal-direction-grass-network';
import { Animal, AnimalComponents } from './animal';

@ComponentOwnerDecorator()
export class NeuralAnimal extends Animal {
    protected components() {
        return ({
            ...super.components(),
            brain: DirectionBrainProperty.build({ handler: () => this.brainHandler() }),
        });
    }
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
        return this.network.predict(this.component);
    }

    dispose() {
        this.network.dispose();
    }

    getNetwork() {
        return this.network;
    }
}
