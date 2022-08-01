import {PropertyContainerList} from "./property-container-list";
import {PropertiesContainer} from "../property/container/properties-container";
import {NumberProperty} from "../property/number/number-property";
import {BaseProperty} from "../property/base/base-property";

interface TestContainer {
    foo: NumberProperty;
}

describe('PropertyContainerList', () => {
    it('should add two instances', () => {
        const propertyContainerList = new PropertyContainerList<TestContainer>();

        const container1 = new PropertiesContainer<TestContainer>({ foo: new NumberProperty({ current: 3 }) });
        const container2 = new PropertiesContainer<TestContainer>({ foo: new NumberProperty({ current: 5 }) });

        propertyContainerList.add(container1, container2);

        const allInstances = propertyContainerList.getAll();
        expect(allInstances).toHaveLength(2);
        expect(allInstances[0].get.foo()).toEqual(container1.get.foo());
        expect(allInstances[1].get.foo()).toEqual(container2.get.foo());
    });

    describe('find', () => {
        interface Test1Props { foo: BaseProperty<number> }
        interface Test2Props { bar: BaseProperty<string> }
        class Test1 extends PropertiesContainer<Test1Props> {
            constructor() {
                super({
                    foo: new BaseProperty(3),
                });
            }
        }
        class Test2 extends PropertiesContainer<Test2Props> {
            constructor() {
                super({
                    bar: new BaseProperty('hello'),
                });
            }
        }

        it('should find all with empty query', () => {
            const propertyContainerList = new PropertyContainerList<Test1Props | Test2Props>();

            const test1 = new Test1();
            const test2 = new Test2();

            propertyContainerList.add(test1, test2);

            const allInstances = propertyContainerList.find();
            const instance1 = allInstances[0] as Test1;
            const instance2 = allInstances[1] as Test2;
            expect(allInstances).toHaveLength(2);
            expect(instance1).toBeInstanceOf(Test1);
            expect(instance1.get.foo()).toEqual(test1.get.foo());
            expect(instance2).toBeInstanceOf(Test2);
            expect(instance2.get.bar()).toEqual(test2.get.bar());
        });

        it('should find by property', () => {
            const propertyContainerList = new PropertyContainerList<Test1Props | Test2Props>();

            const test1 = new Test1();
            const test2 = new Test2();

            propertyContainerList.add(test1, test2);

            const resultInstances = propertyContainerList.find({ foo: 3 });

            expect(resultInstances).toHaveLength(1);
            expect(resultInstances).toEqual([test1]);
            expect((resultInstances[0] as Test1).get.foo()).toEqual(test1.get.foo());
        });

        it('should find by instance', () => {
            const propertyContainerList = new PropertyContainerList<Test1Props | Test2Props>();

            const test1 = new Test1();
            const test2 = new Test2();

            propertyContainerList.add(test1, test2);

            const resultInstances = propertyContainerList.find({}, { byInstanceOf: Test1 });

            expect(resultInstances).toHaveLength(1);
            expect(resultInstances).toEqual([test1]);
            expect((resultInstances[0] as Test1).get.foo()).toEqual(test1.get.foo());
        });
    });
});
