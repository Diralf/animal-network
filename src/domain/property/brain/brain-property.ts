import { TimeThreadListener } from '../../time-thread/time-thread-listener';
import { World } from '../../world/world';
import { BaseProperty } from '../base/base-property';
import { PropertiesContainer } from '../container/properties-container';
import { MovementProperty, MovementDirections } from '../movement/movement-property';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';

export interface BrainOwner {
    movement: MovementProperty;
}
export interface BrainCurrentInput {
    owner: PropertiesContainer<BrainOwner>;
    world: World;
}
export type BrainCommands = MovementDirections | 'STAND';
export type BrainCurrent = (input: BrainCurrentInput) => BrainCommands;

export class BrainProperty extends BaseProperty<BrainCurrent> implements PropertyWithOwner<BrainOwner>, TimeThreadListener {
    public owner = new PropertyOwner<BrainOwner>();

    public decide(world: World): BrainCommands {
        return this.current({
            owner: this.owner.ref,
            world,
        });
    }

    public applyDecision(world: World): void {
        const nextStep = this.decide(world);
        if (nextStep in MovementDirections) {
            this.owner.ref.getProperty('movement').move(nextStep as MovementDirections);
        }
    }

    public tick(world: World): void {
        this.applyDecision(world);
    }
}
