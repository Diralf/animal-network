import { EntityType } from '../../components/component/component';
import { entityBuilder } from '../../components/entity-builder/entity-builder';
import { World } from '../../world/world';
import { DirectionMovementProperty, DirectionMovementValue } from '../direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../direction-sight/direction-sight-property';
import { DirectionProperty, DirectionTurn } from '../direction/direction-property';
import { NumberProperty } from '../number/number-property';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { DirectionBrainProperty, DirectionBrainCommand, BrainCommandsOther } from './direction-brain-property';

interface Entity {
    brain: DirectionBrainProperty;
    movement: DirectionMovementProperty;
    position: PointProperty;
    direction: DirectionProperty;
    sight: DirectionSightProperty;
    visual: NumberProperty;
}

const getEntity = (action: DirectionBrainCommand): EntityType<Entity> => {
    return entityBuilder({
        brain: DirectionBrainProperty.factory({ handler: () => action }),
        movement: DirectionMovementProperty.factory(),
        position: PointProperty.factory({ x: 0, y: 0 }),
        sight: DirectionSightProperty.factory({ range: [5, 2] }),
        direction: DirectionProperty.factory({ initialDirection: { x: 0, y: -1 } }),
        visual: NumberProperty.factory({ current: 2 }),
    }).build();
};

describe('DirectionBrainProperty', () => {
    it.each<[DirectionBrainCommand, RawPoint, RawPoint]>([
        [BrainCommandsOther.STAND, { x: 0, y: 0 }, { x: 0, y: -1 }],
        [DirectionMovementValue.FORWARD, { x: 0, y: -1 }, { x: 0, y: -1 }],
        [DirectionMovementValue.BACK, { x: 0, y: 1 }, { x: 0, y: -1 }],
        [DirectionTurn.TURN_LEFT, { x: 0, y: 0 }, { x: -1, y: 0 }],
        [DirectionTurn.TURN_RIGHT, { x: 0, y: 0 }, { x: 1, y: 0 }],
    ])('should move entity when %p', (action, expectedPoint, expectedDirection) => {
        const entity = getEntity(action);

        entity.component.brain.applyDecision(entity.component.brain.decide(new World()));

        expect(entity.component.position.current).toEqual(expectedPoint);
        expect(entity.component.direction.getCurrent()).toEqual(expectedDirection);
    });
});
