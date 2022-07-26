import {PropertiesContainer} from "./properties-container";
import {NumberProperty} from "../number/number-property";

interface TestProperties {
    foo: NumberProperty;
}

describe('PropertiesContainer', () => {
    it('should be valid', () => {
        const container = new PropertiesContainer<TestProperties>({
            foo: new NumberProperty(),
        });

        expect(container).toBeTruthy();
    });

    it('should get property', () => {
        const container = new PropertiesContainer<TestProperties>({
            foo: new NumberProperty(),
        });

        expect(container.getPropertyValue('foo')).toEqual(0);
    });

    it('should set and get property', () => {
        const container = new PropertiesContainer<TestProperties>({
            foo: new NumberProperty(),
        });

        container.setPropertyValue('foo', 123);

        expect(container.getPropertyValue('foo')).toEqual(123);
    });
});
