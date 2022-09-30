import { Entity } from '../components/components-owner/components-owner';
import { EntityList } from './entity-list';
import { NumberProperty } from '../property/number/number-property';

interface TestContainer {
    foo: NumberProperty;
}

describe('EntityList', () => {
    it('should add two instances', () => {
        const propertyContainerList = new EntityList<TestContainer>();

        const container1 = { component: { foo: new NumberProperty({ current: 3 }) } };
        const container2 = { component: { foo: new NumberProperty({ current: 5 }) } };

        propertyContainerList.add(container1, container2);

        const allInstances = propertyContainerList.getAll();
        expect(allInstances).toHaveLength(2);
        expect(allInstances[0].component.foo.current).toEqual(container1.component.foo.current);
        expect(allInstances[1].component.foo.current).toEqual(container2.component.foo.current);
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

            const test1: Entity<Test1> = { component: { foo: 3 } };
            const test2: Entity<Test1> = { component: { foo: 4 } };
            const test3: Entity<Test2> = { component: { bar: 'hello' } };

            propertyContainerList.add(test1, test2, test3);

            const resultInstances = propertyContainerList.findWithType<Test1>(
                (instance): instance is Entity<Test1> => 'foo' in instance.component,
                (instance) => instance.component.foo === 3,
            );

            expect(resultInstances).toHaveLength(1);
            expect(resultInstances).toEqual([test1]);
            expect((resultInstances[0]).component.foo).toEqual(test1.component.foo);
        });

        it('should find by instance', () => {
            const propertyContainerList = new EntityList<Test1 | Test2>();

            const test1: Entity<Test1> = { component: { foo: 3 } };
            const test2: Entity<Test1> = { component: { foo: 4 } };
            const test3: Entity<Test2> = { component: { bar: 'hello' } };

            propertyContainerList.add(test1, test2, test3);

            const resultInstances = propertyContainerList.findWithType<Test1>(
                (instance): instance is Entity<Test1> => 'foo' in instance.component,
            );

            expect(resultInstances).toHaveLength(2);
            expect(resultInstances).toEqual([test1, test2]);
            expect((resultInstances[0]).component.foo).toEqual(test1.component.foo);
            expect((resultInstances[1]).component.foo).toEqual(test2.component.foo);
        });
    });
});
