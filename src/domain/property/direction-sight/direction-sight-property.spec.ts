import { FieldBuilder } from '../../utils/field-builder';
import { EntityType } from '../../components/component/component';
import { entityBuilder } from '../../components/entity-builder/entity-builder';
import { World } from '../../world/world';
import { DirectionProperty } from '../direction/direction-property';
import { NumberProperty } from '../number/number-property';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { visualEntitiesAsString } from '../utils/visual-entities-as-string';
import { DirectionSightProperty } from './direction-sight-property';

export interface FieldOptions {
    stringField: string;
    availableEntities: Record<string, (point: RawPoint) => EntityType<any>>;
    staticEntities?: Array<() => EntityType<any>>;
}

const buildWorld = ({ stringField, availableEntities, staticEntities }: FieldOptions): World => {
    const world = new World();

    staticEntities && world.registerStatic(staticEntities);
    world.registerEntities(new Map(Object.entries(availableEntities)));
    world.buildWorldFromString(stringField);

    return world;
};

function makeDirectionSight(direction: RawPoint) {
    const world = buildWorld({
        stringField: FieldBuilder.build(`
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,3,_,_,_,_,_
                    _,_,_,3,_,3,_,_,_,_
                    _,_,3,_,_,_,3,_,_,_
                    _,4,_,_,5,_,_,2,_,_
                    _,_,_,3,_,3,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,7,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                `),
        availableEntities: {
            '7': (point: RawPoint) => entityBuilder({
                position: PointProperty.factory(point),
                visual: NumberProperty.factory({ current: 7 }),
            }).build(),
            '2': (point: RawPoint) => entityBuilder({
                position: PointProperty.factory(point),
                visual: NumberProperty.factory({ current: 2 }),
            }).build(),
            '3': (point: RawPoint) => entityBuilder({
                position: PointProperty.factory(point),
                visual: NumberProperty.factory({ current: 3 }),
            }).build(),
            '4': (point: RawPoint) => entityBuilder({
                position: PointProperty.factory(point),
                visual: NumberProperty.factory({ current: 4 }),
            }).build(),
            '5': (point: RawPoint) => entityBuilder({
                position: PointProperty.factory(point),
                visual: NumberProperty.factory({ current: 5 }),
                direction: DirectionProperty.factory({ initialDirection: direction }),
                sight: DirectionSightProperty.factory({ range: [5, 2] }),
            }).build(),
        },
    });
    const owner: EntityType<{ sight: DirectionSightProperty }> = world.getEntityList()
        .find((instance: EntityType<any>) => instance.component.visual.current === 5)[0] as EntityType<any>;

    return {
        directionSight: owner.component.sight,
        world,
    };
}

describe('DirectionSightProperty', () => {

    describe('getSightMask', () => {
        it('should get start mask', () => {
            const { directionSight } = makeDirectionSight({ x: 1, y: 0 });

            expect(directionSight.getSightMask()).toEqual({
                maskStart: { x: 0, y: -2 },
                maskEnd: { x: 5, y: 2 },
            });
        });
    });

    describe('getRotatedSightMask', () => {
        it.each([
            {
                direction: { x: 0, y: 1 },
                rotatedMask: [{ x: -2, y: 0 }, { x: 2, y: 5 }],
            },
            {
                direction: { x: 1, y: 0 },
                rotatedMask: [{ x: 0, y: -2 }, { x: 5, y: 2 }],
            },
            {
                direction: { x: 0, y: -1 },
                rotatedMask: [{ x: -2, y: -5 }, { x: 2, y: 0 }],
            },
            {
                direction: { x: -1, y: 0 },
                rotatedMask: [{ x: -5, y: -2 }, { x: 0, y: 2 }],
            },
        ])('should render get rotation mask $direction', ({ direction, rotatedMask }) => {
            const { directionSight } = makeDirectionSight(direction);

            const actualRotatedMask = directionSight.getRotatedSightMask();

            expect(actualRotatedMask).toEqual(rotatedMask);
        });
    });

    describe('getSightFieldArea', () => {
        it.each([
            {
                direction: { x: 0, y: 1 },
                area: [{ x: 2, y: 5 }, { x: 6, y: 10 }],
            },
            {
                direction: { x: 1, y: 0 },
                area: [{ x: 4, y: 3 }, { x: 9, y: 7 }],
            },
            {
                direction: { x: 0, y: -1 },
                area: [{ x: 2, y: 0 }, { x: 6, y: 5 }],
            },
            {
                direction: { x: -1, y: 0 },
                area: [{ x: -1, y: 3 }, { x: 4, y: 7 }],
            },
        ])('should render with $direction', ({ direction, area }) => {
            const { directionSight } = makeDirectionSight(direction);

            const fieldArea = directionSight.getSightFieldArea();

            expect(fieldArea).toEqual(area);
        });
    });

    describe('getSightField', () => {
        it.each([
            {
                direction: { x: 0, y: 1 },
                field: FieldBuilder.build(`
                    _,_,5,_,_
                    _,3,_,3,_
                    _,_,_,_,_
                    _,_,7,_,_
                    _,_,_,_,_
                    _,_,_,_,_
                `),
            },
            {
                direction: { x: 1, y: 0 },
                field: FieldBuilder.build(`
                    _,3,_,_,_,_
                    _,_,3,_,_,_
                    5,_,_,2,_,_
                    _,3,_,_,_,_
                    _,_,_,_,_,_
                `),
            },
            {
                direction: { x: 0, y: -1 },
                field: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,3,_,_
                    _,3,_,3,_
                    3,_,_,_,3
                    _,_,5,_,_
                `),
            },
            {
                direction: { x: -1, y: 0 },
                field: FieldBuilder.build(`
                    _,_,_,_,3,_
                    _,_,_,3,_,_
                    _,_,4,_,_,5
                    _,_,_,_,3,_
                    _,_,_,_,_,_
                `),
            },
        ])('should render with $direction', ({ direction, field }) => {
            const { directionSight, world } = makeDirectionSight(direction);

            const fieldArea = directionSight.getSightFieldArea();
            const fieldSight = directionSight.getSightField(world.getEntityList() as any, fieldArea);

            expect('field\n' + visualEntitiesAsString(fieldSight)).toEqual('field\n' + field);
        });
    });

    describe('update', () => {
        it.each([
            {
                direction: { x: 0, y: 1 },
                sight: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,7,_,_
                    _,_,_,_,_
                    _,3,_,3,_
                    _,_,5,_,_
                `),
            },
            {
                direction: { x: 1, y: 0 },
                sight: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,2,_,_
                    _,3,_,_,_
                    3,_,_,3,_
                    _,_,5,_,_
                `),
            },
            {
                direction: { x: 0, y: -1 },
                sight: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,3,_,_
                    _,3,_,3,_
                    3,_,_,_,3
                    _,_,5,_,_
                `),
            },
            {
                direction: { x: -1, y: 0 },
                sight: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,4,_,_
                    _,_,_,3,_
                    _,3,_,_,3
                    _,_,5,_,_
                `),
            },
        ])('should render with $direction', ({ direction, sight }) => {
            const { directionSight, world } = makeDirectionSight(direction);

            directionSight.update(world.getEntityList() as any);

            expect(directionSight.asString()).toEqual(sight);
        });
    });
});
