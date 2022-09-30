import { Component } from '../../components/component/component';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { DirectionMovementProperty, DirectionMovementValue } from '../direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../direction-sight/direction-sight-property';
import { DirectionTurn, DirectionProperty } from '../direction/direction-property';
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

interface Props {
    handler: DirectionBrainHandler;
}

export class DirectionBrainProperty extends Component<DirectionBrainProperty, Props, DirectionBrainOwner>() implements PropertyWithOwner<DirectionBrainOwner>, OnTick {
    public lastCommand: DirectionBrainCommand | null = null;

    public decide(world: World): DirectionBrainCommand {
        return this.props.handler({
            owner: this.owner,
            world,
        });
    }

    public applyDecision(world: World): void {
        const nextStep = this.decide(world);
        if (nextStep in DirectionMovementValue) {
            this.owner.movement.move(nextStep as DirectionMovementValue);
        }
        if (nextStep in DirectionTurn) {
            this.owner.direction.turn(nextStep as DirectionTurn);
        }
        this.lastCommand = nextStep;
    }

    public tick(world: World): void {
        this.applyDecision(world);
    }
}
