import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { MovementProperty, MovementDirections } from '../movement/movement-property';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';
import { SightProperty } from '../sight/sight-property';

export interface BrainOwner {
    movement: MovementProperty;
    sight: SightProperty;
}
export interface BrainHandlerInput {
    owner: BrainOwner;
    world: World;
}
export enum BrainCommandsOther {
    STAND = 'STAND',
}

export type BrainCommand = MovementDirections | BrainCommandsOther;
export type BrainHandler = (input: BrainHandlerInput) => BrainCommand;

export class BrainProperty implements PropertyWithOwner<BrainOwner>, OnTick {
    public owner = new PropertyOwner<BrainOwner>();

    constructor(public handler: BrainHandler) {
    }

    public decide(world: World): BrainCommand {
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
