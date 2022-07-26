import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';
import { chainBuilder } from '../components-owner/chain-builder';
import { entityBuilder, ComponentsDeps } from './entity-builder';

describe('EntityBuilder', () => {
    class StringComponent extends Component<string> implements OnTick {
        public value = '';
        public onPropsInit(props: string): void {
            this.value = props;
        }
        tick(world: World, time: number) {}
    }
    interface Owner {
        street: StringComponent;
    }
    class NumberComponent extends Component<number, Owner> {}

    interface Components {
        name: StringComponent;
        street: StringComponent;
        age: NumberComponent;
    }

    const testBuilder = () => chainBuilder<Components>({
        name: StringComponent.builder(),
        age: NumberComponent.builder(),
        street: StringComponent.builder(),
    });

    it('using functional paradigm', () => {
        const Actor = entityBuilder(testBuilder()
            .age(2)
            .street('Avenue')
            .build());

        const actor = Actor.build({
            street: '123',
            age: 1,
            // @ts-expect-error
            name: '123',
        });

        expect(actor.component.street.value).toEqual('123');
    });
});

describe('ComponentsOwner', () => {
    class DefaultComponent extends Component {}
    class NumberComponent extends Component<number> {
        public value = 0;
        public onPropsInit(props = 3): void {
            this.value = props;
        }
    }
    class OtherComponent extends Component<string> {}
    class OwnerComponent extends Component<number, Pick<Components, 'numberComponent'>> {
        public value = 0;
        public onPropsInit(props: number): void {
            this.value = props;
        }
    }

    interface Components {
        defaultComponent: DefaultComponent;
        numberComponent: NumberComponent;
        otherComponent: OtherComponent;
        ownerComponent: OwnerComponent;
    }

    const testBuilder = () => chainBuilder<Components>({
        numberComponent: NumberComponent.builder(),
        defaultComponent: DefaultComponent.builder(),
        otherComponent: OtherComponent.builder(),
        ownerComponent: OwnerComponent.builder(),
    });

    {
        class Owner2Component extends Component<number, Pick<Components, 'numberComponent' | 'otherComponent'>> {
            public value = 0;
            public onPropsInit(props: number): void {
                this.value = props;
            }
        }

        interface ComponentsDepsTest {
            defaultComponent: DefaultComponent;
            numberComponent: NumberComponent;
            otherComponent: OtherComponent;
            ownerComponent: OwnerComponent;
            owner2Component: Owner2Component;
        }

        const deps1: ComponentsDeps<ComponentsDepsTest> = {
            numberComponent: NumberComponent.build({ component: {} }),
            otherComponent: OtherComponent.build({ component: {} }, '123'),
        };

        // @ts-expect-error
        const deps2: ComponentsDeps<ComponentsDepsTest> = {};
    }

    describe('default component', () => {

        it('should add default component to class', () => {
            const Actor = entityBuilder(testBuilder()
                .defaultComponent()
                .build());

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.defaultComponent).toBeTruthy();
        });
    });

    describe('number component', () => {

        it('should add component with number option', () => {
            const Actor = entityBuilder(testBuilder()
                .numberComponent(0)
                .build());

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.value).toEqual(0);
        });

        it('should add component with number and apply external value', () => {
            const Actor = entityBuilder(testBuilder()
                .numberComponent(0)
                .otherComponent('123')
                .build());

            const actor = Actor.build({
                numberComponent: 5,
            });

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.value).toEqual(5);
        });

        describe('value define level', () => {
            it.each([
                {
                    case: 'component default value',
                    expected: 3,
                    getActor: () => {
                        const Actor = entityBuilder(testBuilder()
                            .numberComponent()
                            .build());

                        return Actor.build();
                    },
                },
                {
                    case: 'static props, component default value defined',
                    expected: 5,
                    getActor: () => {
                        const Actor = entityBuilder(testBuilder()
                            .numberComponent(5)
                            .build());

                        return Actor.build();
                    },
                },
                {
                    case: 'external props, static props and component default value defined',
                    expected: 7,
                    getActor: () => {
                        const Actor = entityBuilder(testBuilder()
                            .numberComponent(5)
                            .build());

                        return Actor.build({
                            numberComponent: 7
                        });
                    },
                }
            ])('should use $case', ({ getActor, expected }) => {
                const actor = getActor();

                expect(actor).toBeTruthy();
                expect(actor.component.numberComponent).toBeTruthy();
                expect(actor.component.numberComponent.value).toEqual(expected);
            });
        });

        { /** expect TS error when specified other type of value */
            const Actor = entityBuilder(testBuilder()
                // @ts-expect-error
                .numberComponent('123')
                .build());

            Actor.build({
                // @ts-expect-error
                numberComponent: '123'
            });
        }
    });

    describe('component with owner specified', () => {
        it('should add component with owner specified', () => {
            const Actor = entityBuilder(testBuilder()
                .numberComponent(0)
                .ownerComponent(5)
                .build());

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.value).toEqual(0);
            expect(actor.component.ownerComponent).toBeTruthy();
            expect(actor.component.ownerComponent.value).toEqual(5);
        });

        { /** should show TS error when owner is not compatible */
            // @ts-expect-error
            const Actor = entityBuilder(testBuilder()
                .ownerComponent(5)
                .build());

            Actor.build();
        }
    });

    describe('component builder getting by different static method', () => {
        it('should add component by builder() only', () => {
            const Actor = entityBuilder({
                numberComponent: NumberComponent.builder()(),
                ownerComponent: OwnerComponent.builder()(1),
            });

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.value).toEqual(3);
            expect(actor.component.ownerComponent).toBeTruthy();
            expect(actor.component.ownerComponent.value).toEqual(1);
        });

        it('should add component by factory() only', () => {
            const Actor = entityBuilder({
                numberComponent: NumberComponent.factory(),
                ownerComponent: OwnerComponent.factory(1),
            });

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.value).toEqual(3);
            expect(actor.component.ownerComponent).toBeTruthy();
            expect(actor.component.ownerComponent.value).toEqual(1);
        });

        it('should add component by builder() and factory() only', () => {
            const Actor = entityBuilder({
                // @ts-expect-error TODO resolve this error
                numberComponent: NumberComponent.builder()(),
                // @ts-expect-error TODO resolve this error
                ownerComponent: OwnerComponent.factory(1),
            });

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.value).toEqual(3);
            expect(actor.component.ownerComponent).toBeTruthy();
            expect(actor.component.ownerComponent.value).toEqual(1);
        });
    });
});
