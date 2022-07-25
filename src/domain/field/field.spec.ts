import {Field} from "./field";

describe('field', () => {
    it('should have size 10x20 cells', () => {
        const field = new Field({ width: 10, height: 20});

        expect(field.getPropertyValue('width')).toEqual(10);
        expect(field.getPropertyValue('height')).toEqual(20);
    });
});
