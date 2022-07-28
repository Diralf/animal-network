import {PropertiesContainer} from "./properties-container";
import {NumberProperty} from "../number/number-property";

interface TestProperties {
    foo: NumberProperty;
    readonly bar: NumberProperty;
}

describe('PropertiesContainer', () => {
    it('should be valid', () => {
        const container = new PropertiesContainer<TestProperties>({
            foo: new NumberProperty(),
            bar: new NumberProperty(),
        });

        expect(container).toBeTruthy();
    });

    it('should get property', () => {
        const container = new PropertiesContainer<TestProperties>({
            foo: new NumberProperty(),
            bar: new NumberProperty(),
        });

        expect(container.get.foo()).toEqual(0);
        expect(container.get.bar()).toEqual(0);
    });

    it('should set and get property', () => {
        const container = new PropertiesContainer<TestProperties>({
            foo: new NumberProperty(),
            bar: new NumberProperty(),
        });

        container.set.foo(123);

        expect(container.get.foo()).toEqual(123);
    });
});
