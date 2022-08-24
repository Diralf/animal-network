import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { MovementProperty, MovementDirections } from '../movement/movement-property';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';

export interface BrainOwner {
    movement: MovementProperty;
}
export interface BrainHandlerInput {
    owner: BrainOwner;
    world: World;
}
export type BrainCommands = MovementDirections | 'STAND';
export type BrainHandler = (input: BrainHandlerInput) => BrainCommands;

export class BrainProperty implements PropertyWithOwner<BrainOwner>, OnTick {
    public owner = new PropertyOwner<BrainOwner>();

    constructor(public handler: BrainHandler) {
    }

    public decide(world: World): BrainCommands {
        return this.handler({
            owner: this.owner.ref,
            world,
        });
    }

    public applyDecision(world: World): void {
        const nextStep = this.decide(world);
        if (nextStep in MovementDirections) {
            this.owner.ref.movement.move(nextStep as MovementDirections);
        }
    }

    public tick(world: World): void {
        this.applyDecision(world);
    }
}
