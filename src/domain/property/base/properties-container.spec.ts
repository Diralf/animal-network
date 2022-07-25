import {PropertiesContainer} from "./properties-container";
import {NumberProperty} from "./number-property";

interface TestProperties {
    foo: NumberProperty;
}

describe('PropertiesContainer', () => {
    it('should be valid', () => {
        const container = new PropertiesContainer<TestProperties>({
            foo: new NumberProperty(),
        });

        expect(container).toBeTruthy();
    })
});
