import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { DirectionMovementProperty, DirectionMovementValue } from '../direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../direction-sight/direction-sight-property';
import { DirectionTurn, DirectionProperty } from '../direction/direction-property';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';

export interface DirectionBrainOwner {
    movement: DirectionMovementProperty;
    sight: DirectionSightProperty;
    direction: DirectionProperty;
}
export interface DirectionBrainHandlerInput {
    owner: DirectionBrainOwner;
    world: World;
}
export enum BrainCommandsOther {
    STAND = 'STAND',
}

export type DirectionBrainCommand = DirectionTurn | DirectionMovementValue | BrainCommandsOther;
export type DirectionBrainHandler = (input: DirectionBrainHandlerInput) => DirectionBrainCommand;

export class DirectionBrainProperty implements PropertyWithOwner<DirectionBrainOwner>, OnTick {
    public owner = new PropertyOwner<DirectionBrainOwner>();
    public lastCommand: DirectionBrainCommand | null = null;

    constructor(public handler: DirectionBrainHandler) {
    }

    public decide(world: World): DirectionBrainCommand {
        return this.handler({
            owner: this.owner.ref,
            world,
        });
    }

    public applyDecision(world: World): void {
        const nextStep = this.decide(world);
        if (nextStep in DirectionMovementValue) {
            this.owner.ref.movement.move(nextStep as DirectionMovementValue);
        }
        if (nextStep in DirectionTurn) {
            this.owner.ref.direction.turn(nextStep as DirectionTurn);
        }
        this.lastCommand = nextStep;
    }

    public tick(world: World): void {
        this.applyDecision(world);
    }
}
