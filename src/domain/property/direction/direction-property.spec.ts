import { DirectionProperty, DirectionTurn } from './direction-property';

describe('DirectionProperty', () => {

    it.each([
        { start: { x: 0, y: 1 }, turn: DirectionTurn.TURN_LEFT, result: { x: 1, y: 0 } },
        { start: { x: 1, y: 0 }, turn: DirectionTurn.TURN_LEFT, result: { x: 0, y: -1 } },
        { start: { x: 0, y: -1 }, turn: DirectionTurn.TURN_LEFT, result: { x: -1, y: 0 } },
        { start: { x: -1, y: 0 }, turn: DirectionTurn.TURN_LEFT, result: { x: 0, y: 1 } },

        { start: { x: 0, y: 1 }, turn: DirectionTurn.TURN_RIGHT, result: { x: -1, y: 0 } },
        { start: { x: -1, y: 0 }, turn: DirectionTurn.TURN_RIGHT, result: { x: 0, y: -1 } },
        { start: { x: 0, y: -1 }, turn: DirectionTurn.TURN_RIGHT, result: { x: 1, y: 0 } },
        { start: { x: 1, y: 0 }, turn: DirectionTurn.TURN_RIGHT, result: { x: 0, y: 1 } },
    ])('should rotate $start to $turn and get $result', ({ start, turn, result }) => {
        const property = new DirectionProperty(start);

        property.turn(turn);

        expect(JSON.parse(JSON.stringify(property.getCurrent()))).toEqual(JSON.parse(JSON.stringify(result)));
    });

    it.each([
        { direction: { x: 0, y: -1 }, expected: -90 },
        { direction: { x: -1, y: 0 }, expected: 180 },
        { direction: { x: 0, y: 1 }, expected: 90 },
        { direction: { x: 1, y: 0 }, expected: 0 },
    ])('should get $direction as angle $expected', ({ direction, expected }) => {
        const property = new DirectionProperty(direction);

        expect(property.getAsAngle()).toEqual(expected);
    });

});
