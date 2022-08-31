import { World } from '../../world/world';
import { DirectionMovementProperty, DirectionMovementValue } from '../direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../direction-sight/direction-sight-property';
import { DirectionProperty, DirectionTurn } from '../direction/direction-property';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { DirectionBrainProperty, DirectionBrainCommand, BrainCommandsOther } from './direction-brain-property';

interface Entity {
    brain: DirectionBrainProperty;
    movement: DirectionMovementProperty;
    position: PointProperty;
    direction: DirectionProperty;
    sight: DirectionSightProperty;
    visual: number;
}

const getPropertiesContainer = (action: DirectionBrainCommand): Entity => {
    const entity = {
        brain: new DirectionBrainProperty(() => action),
        movement: new DirectionMovementProperty(),
        position: new PointProperty({ x: 0, y: 0 }),
        sight: new DirectionSightProperty({ range: [5, 2] }),
        direction: new DirectionProperty({ x: 0, y: -1 }),
        visual: 2,
    };
    entity.sight.owner.ref = entity;
    entity.brain.owner.ref = entity;
    entity.movement.owner.ref = entity;
    return entity;
};

describe('DirectionBrainProperty', () => {
    it.each<[DirectionBrainCommand, RawPoint, RawPoint]>([
        [BrainCommandsOther.STAND, { x: 0, y: 0 }, { x: 0, y: -1 }],
        [DirectionMovementValue.FORWARD, { x: 0, y: -1 }, { x: 0, y: -1 }],
        [DirectionMovementValue.BACK, { x: 0, y: 1 }, { x: 0, y: -1 }],
        [DirectionTurn.TURN_LEFT, { x: 0, y: 0 }, { x: -1, y: 0 }],
        [DirectionTurn.TURN_RIGHT, { x: 0, y: 0 }, { x: 1, y: 0 }],
    ])('should move entity when %p', (action, expectedPoint, expectedDirection) => {
        const entity = getPropertiesContainer(action);

        entity.brain.applyDecision(new World());

        expect(entity.position.current).toEqual(expectedPoint);
        expect(entity.direction.getCurrent()).toEqual(expectedDirection);
    });
});
