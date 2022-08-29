import { World } from '../../world/world';
import { MovementProperty, MovementDirections } from '../movement/movement-property';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { SightProperty } from '../sight/sight-property';
import { BrainProperty, BrainCommand, BrainCommandsOther } from './brain-property';

interface Entity {
    brain: BrainProperty;
    movement: MovementProperty;
    position: PointProperty;
    sight: SightProperty;
    visual: number;
}

const getPropertiesContainer = (action: BrainCommand): Entity => {
    const entity = {
        brain: new BrainProperty(() => action),
        movement: new MovementProperty(),
        position: new PointProperty({ x: 0, y: 0 }),
        sight: new SightProperty({ range: 2 }),
        visual: 2,
    };
    entity.sight.owner.ref = entity;
    entity.brain.owner.ref = entity;
    entity.movement.owner.ref = entity;
    return entity;
};

describe('BrainProperty', () => {
    it.each<[BrainCommand, RawPoint]>([
        [BrainCommandsOther.STAND, { x: 0, y: 0 }],
        [MovementDirections.RIGHT, { x: 1, y: 0 }],
        [MovementDirections.LEFT, { x: -1, y: 0 }],
        [MovementDirections.UP, { x: 0, y: -1 }],
        [MovementDirections.DOWN, { x: 0, y: 1 }],
    ])('should move entity when %p', (action, expectedPoint) => {
        const entity = getPropertiesContainer(action);

        entity.brain.applyDecision(new World());

        expect(entity.position.current).toEqual(expectedPoint);
    });
});
