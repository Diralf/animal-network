import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';
import { chainBuilder } from '../components-owner/chain-builder';
import { entityBuilder } from './entity-builder';

describe('EntityBuilder', () => {
    class StringComponent extends Component<StringComponent, string>() implements OnTick {
        tick(world: World, time: number) {}
    }
    interface Owner {
        street: StringComponent;
    }
    class NumberComponent extends Component<NumberComponent, number, Owner>() {}

    interface Components {
        name: StringComponent;
        street: StringComponent;
        age: NumberComponent;
    }

    const componentBuilder = () => chainBuilder<Components>({
        name: StringComponent.builder(),
        age: NumberComponent.builder(),
        street: StringComponent.builder(),
    });

    it('using functional paradigm', () => {
        const Actor = entityBuilder(componentBuilder()
            .age(2)
            .street('Avenue')
            .build());

        const actor = Actor.build({
            street: '123',
            age: 1,
            // @ts-expect-error
            name: '123',
        });

        expect(actor.component.street.getProps()).toEqual('123');
    });
});

describe('ComponentsOwner', () => {
    class DefaultComponent extends Component<DefaultComponent>() {}
    class NumberComponent extends Component<NumberComponent, number>() {
        constructor(props: number = 3) {
            super(props);
        }
    }
    class OtherComponent extends Component<OtherComponent, string>() {}
    class OwnerComponent extends Component<OwnerComponent, number, Pick<Components, 'numberComponent'>>() {}

    interface Components {
        defaultComponent: DefaultComponent;
        numberComponent: NumberComponent;
        otherComponent: OtherComponent;
        ownerComponent: OwnerComponent;
    }

    const componentBuilder = () => chainBuilder<Components>({
        numberComponent: NumberComponent.builder(),
        defaultComponent: DefaultComponent.builder(),
        otherComponent: OtherComponent.builder(),
        ownerComponent: OwnerComponent.builder(),
    });


    describe('default component', () => {

        it('should add default component to class', () => {
            const Actor = entityBuilder(componentBuilder()
                .defaultComponent()
                .build());

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.defaultComponent).toBeTruthy();
        });
    });

    describe('number component', () => {

        it('should add component with number option', () => {
            const Actor = entityBuilder(componentBuilder()
                .numberComponent(0)
                .build());

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.getProps()).toEqual(0);
        });

        it('should add component with number and apply external value', () => {
            const Actor = entityBuilder(componentBuilder()
                .numberComponent(0)
                .build());

            const actor = Actor.build({
                numberComponent: 5,
            });

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.getProps()).toEqual(5);
        });

        describe('value define level', () => {
            it.each([
                {
                    case: 'component default value',
                    expected: 3,
                    getActor: () => {
                        const Actor = entityBuilder(componentBuilder()
                            .numberComponent()
                            .build());

                        return Actor.build();
                    },
                },
                {
                    case: 'static props, component default value defined',
                    expected: 5,
                    getActor: () => {
                        const Actor = entityBuilder(componentBuilder()
                            .numberComponent(5)
                            .build());

                        return Actor.build();
                    },
                },
                {
                    case: 'external props, static props and component default value defined',
                    expected: 7,
                    getActor: () => {
                        const Actor = entityBuilder(componentBuilder()
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
                expect(actor.component.numberComponent.getProps()).toEqual(expected);
            });
        });

        { /** expect TS error when specified other type of value */
            const Actor = entityBuilder(componentBuilder()
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
        interface Owner {
            numberComponent: NumberComponent;
        }

        class OwnerComponent extends Component<OwnerComponent, number, Owner>() {}
        class NumberComponent extends Component<NumberComponent, number>() {}

        it('should add component with owner specified', () => {
            const Actor = entityBuilder(componentBuilder()
                .numberComponent(0)
                .ownerComponent(5)
                .build());

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.numberComponent).toBeTruthy();
            expect(actor.component.numberComponent.getProps()).toEqual(0);
            expect(actor.component.ownerComponent).toBeTruthy();
            expect(actor.component.ownerComponent.getProps()).toEqual(5);
        });

        // TODO highlight not compatible owners
        { /** should show TS error when owner is not compatible */
            const result = componentBuilder()
                .ownerComponent(5)
                .build();
            const Actor = entityBuilder(result);

            const actor = Actor.build();
        }
    });
});
