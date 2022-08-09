import { World } from '../../world/world';
import { PropertiesContainer } from '../container/properties-container';
import { MovementProperty, MovementDirections } from '../movement/movement-property';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { BrainProperty, BrainCommands } from './brain-property';

interface Entity {
    brain: BrainProperty;
    movement: MovementProperty;
    position: PointProperty;
}

const getPropertiesContainer = (action: BrainCommands): PropertiesContainer<Entity> => {
    return new PropertiesContainer<Entity>({
        brain: new BrainProperty(() => action),
        movement: new MovementProperty(),
        position: new PointProperty({ x: 0, y: 0 }),
    });
};

describe('BrainProperty', () => {
    it.each<[BrainCommands, RawPoint]>([
        ['STAND', { x: 0, y: 0 }],
        [MovementDirections.RIGHT, { x: 1, y: 0 }],
        [MovementDirections.LEFT, { x: -1, y: 0 }],
        [MovementDirections.UP, { x: 0, y: -1 }],
        [MovementDirections.DOWN, { x: 0, y: 1 }],
    ])('should move entity when %p', (action, expectedPoint) => {
        const entity = getPropertiesContainer(action);

        entity.getProperty('brain').applyDecision(new World());

        expect(entity.get.position()).toEqual(expectedPoint);
    });
});
