import { Component, EntityType } from '../../components/component/component';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { DirectionMovementProperty, DirectionMovementValue } from '../direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../direction-sight/direction-sight-property';
import { DirectionTurn, DirectionProperty } from '../direction/direction-property';
import { Publisher } from '../utils/observer';

export interface DirectionBrainOwner {
    movement: DirectionMovementProperty;
    sight: DirectionSightProperty;
    direction: DirectionProperty;
}
export interface DirectionBrainHandlerInput {
    owner: EntityType<DirectionBrainOwner>;
    world: World;
}
export enum BrainCommandsOther {
    STAND = 'STAND',
}

export type DirectionBrainCommand = DirectionTurn | DirectionMovementValue | BrainCommandsOther;
export type DirectionBrainHandler = (input: DirectionBrainHandlerInput) => DirectionBrainCommand;

interface Props {
    handler?: DirectionBrainHandler;
}

export class DirectionBrainProperty extends Component<DirectionBrainProperty, Props, DirectionBrainOwner>() implements OnTick {
    public publisher = new Publisher<[DirectionBrainCommand]>();
    public lastCommand: DirectionBrainCommand | null = null;

    public decide(world: World): DirectionBrainCommand {
        return this.props?.handler?.({
            owner: this.owner,
            world,
        }) ?? BrainCommandsOther.STAND;
    }

    public applyDecision(nextStep: DirectionBrainCommand): void {
        if (nextStep in DirectionMovementValue) {
            this.owner.component.movement.move(nextStep as DirectionMovementValue);
        }
        if (nextStep in DirectionTurn) {
            this.owner.component.direction.turn(nextStep as DirectionTurn);
        }
        this.lastCommand = nextStep;
        this.publisher.notify(nextStep);
    }

    public tick(world: World): void {
        if (this.props?.handler) {
            this.applyDecision(this.props.handler({
                owner: this.owner,
                world,
            }));
        }
    }
}
