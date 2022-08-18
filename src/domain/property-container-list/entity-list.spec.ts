import { EntityList } from './entity-list';
import { NumberProperty } from '../property/number/number-property';

interface TestContainer {
    foo: NumberProperty;
}

describe('EntityList', () => {
    it('should add two instances', () => {
        const propertyContainerList = new EntityList<TestContainer>();

        const container1 = { foo: new NumberProperty({ current: 3 }) };
        const container2 = { foo: new NumberProperty({ current: 5 }) };

        propertyContainerList.add(container1, container2);

        const allInstances = propertyContainerList.getAll();
        expect(allInstances).toHaveLength(2);
        expect(allInstances[0].foo.current).toEqual(container1.foo.current);
        expect(allInstances[1].foo.current).toEqual(container2.foo.current);
    });

    describe('find', () => {
        interface Test1 {
            foo: number;
        }
        interface Test2 {
            bar: string;
        }

        it('should find by property', () => {
            const propertyContainerList = new EntityList<Test1 | Test2>();

            const test1: Test1 = { foo: 3 };
            const test2: Test1 = { foo: 4 };
            const test3: Test2 = { bar: 'hello' };

            propertyContainerList.add(test1, test2, test3);

            const resultInstances = propertyContainerList.findWithType<Test1>(
                (instance): instance is Test1 => 'foo' in instance,
                (instance) => instance.foo === 3,
            );

            expect(resultInstances).toHaveLength(1);
            expect(resultInstances).toEqual([test1]);
            expect((resultInstances[0]).foo).toEqual(test1.foo);
        });

        it('should find by instance', () => {
            const propertyContainerList = new EntityList<Test1 | Test2>();

            const test1: Test1 = { foo: 3 };
            const test2: Test1 = { foo: 4 };
            const test3: Test2 = { bar: 'hello' };

            propertyContainerList.add(test1, test2, test3);

            const resultInstances = propertyContainerList.findWithType<Test1>(
                (instance): instance is Test1 => 'foo' in instance,
            );

            expect(resultInstances).toHaveLength(2);
            expect(resultInstances).toEqual([test1, test2]);
            expect((resultInstances[0]).foo).toEqual(test1.foo);
            expect((resultInstances[1]).foo).toEqual(test2.foo);
        });
    });
});
