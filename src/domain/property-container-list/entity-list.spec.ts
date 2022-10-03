import { Entity, entityBuilder } from '../components/entity-builder/entity-builder';
import { Property } from '../property/base/base-property';
import { EntityList } from './entity-list';
import { NumberProperty } from '../property/number/number-property';

interface TestContainer {
    foo: NumberProperty;
}

describe('EntityList', () => {
    it('should add two instances', () => {
        const propertyContainerList = new EntityList<TestContainer>();

        const TestEntity = entityBuilder({
            foo: NumberProperty.build({ current: 0 }),
        });

        const entity1 = TestEntity.build({ foo: { current: 3 } });
        const entity2 = TestEntity.build({ foo: { current: 5 } });

        propertyContainerList.add(entity1, entity2);

        const allInstances = propertyContainerList.getAll();
        expect(allInstances).toHaveLength(2);
        expect(allInstances[0].component.foo.current).toEqual(entity1.component.foo.current);
        expect(allInstances[1].component.foo.current).toEqual(entity2.component.foo.current);
    });

    describe('find', () => {
        interface Test1 {
            foo: Property<number>;
        }
        const Test1Entity = entityBuilder({
            foo: Property<number>().build(0),
        });
        interface Test2 {
            bar: Property<string>;
        }
        const Test2Entity = entityBuilder({
            bar: Property<string>().build(''),
        });

        it('should find by property', () => {
            const propertyContainerList = new EntityList<Test1 | Test2>();

            const test1: Entity<Test1> = Test1Entity.build({ foo: 3 });
            const test2: Entity<Test1> = Test1Entity.build({ foo: 4 });
            const test3: Entity<Test2> = Test2Entity.build({ bar: 'hello' });

            propertyContainerList.add(test1, test2, test3);

            const resultInstances = propertyContainerList.findWithType<Test1>(
                (instance): instance is Entity<Test1> => 'foo' in instance.component,
                (instance) => instance.component.foo.current === 3,
            );

            expect(resultInstances).toHaveLength(1);
            expect(resultInstances).toEqual([test1]);
            expect((resultInstances[0]).component.foo.current).toEqual(test1.component.foo.current);
        });

        it('should find by instance', () => {
            const propertyContainerList = new EntityList<Test1 | Test2>();

            const test1: Entity<Test1> = Test1Entity.build({ foo: 3 });
            const test2: Entity<Test1> = Test1Entity.build({ foo: 4 });
            const test3: Entity<Test2> = Test2Entity.build({ bar: 'hello' });

            propertyContainerList.add(test1, test2, test3);

            const resultInstances = propertyContainerList.findWithType<Test1>(
                (instance): instance is Entity<Test1> => 'foo' in instance.component,
            );

            expect(resultInstances).toHaveLength(2);
            expect(resultInstances).toEqual([test1, test2]);
            expect((resultInstances[0]).component.foo.current).toEqual(test1.component.foo.current);
            expect((resultInstances[1]).component.foo.current).toEqual(test2.component.foo.current);
        });
    });
});
