import { Component } from '../component/component';
import { ComponentOwnerDecorator } from './component-owner.decorator';
import { ComponentsOwner, ComponentsBuilders } from './components-owner';

describe('ComponentsOwner', () => {
    describe('default component', () => {
        class DefaultComponent extends Component<DefaultComponent>() {}

        it('should add default component to class', () => {
            interface Components {
                comp: DefaultComponent;
            }

            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Components> {
                protected components = (): ComponentsBuilders<Components> => ({
                    comp: DefaultComponent.build(),
                });
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.component.comp).toBeTruthy();
        });
    });

    describe('number component', () => {

        it('should add component with number option', () => {
            class NumberComponent extends Component<NumberComponent, number>() {}

            interface Components {
                comp: NumberComponent;
            }
            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Components> {
                protected components = (): ComponentsBuilders<Components> => ({
                    comp: NumberComponent.build(0),
                });
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.component.comp).toBeTruthy();
            expect(actor.component.comp.getProps()).toEqual(0);
        });

        it('should add component with number and apply external value', () => {
            class NumberComponent extends Component<NumberComponent, number>() {}

            interface Components {
                comp: NumberComponent;
            }
            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Components> {
                protected components = (): ComponentsBuilders<Components> => ({
                    comp: NumberComponent.build(0),
                });
            }

            const actor = new Actor({
                comp: 5,
            });

            expect(actor).toBeTruthy();
            expect(actor.component.comp).toBeTruthy();
            expect(actor.component.comp.getProps()).toEqual(5);
        });

        describe('value define level', () => {
            it.each([
                {
                    case: 'component default value',
                    expected: 3,
                    getActor: () => {
                        class NumberComponent extends Component<NumberComponent, number | undefined>() {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }

                        interface Components {
                            comp: NumberComponent;
                        }
                        @ComponentOwnerDecorator()
                        class Actor extends ComponentsOwner<Components> {
                            protected components = (): ComponentsBuilders<Components> => ({
                                comp: NumberComponent.build(),
                            });
                        }
                        return new Actor();
                    },
                },
                {
                    case: 'static props, component default value defined',
                    expected: 5,
                    getActor: () => {
                        class NumberComponent extends Component<NumberComponent, number | undefined>() {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }

                        interface Components {
                            comp: NumberComponent;
                        }
                        @ComponentOwnerDecorator()
                        class Actor extends ComponentsOwner<Components> {
                            protected components = (): ComponentsBuilders<Components> => ({
                                comp: NumberComponent.build(5),
                            });
                        }
                        return new Actor();
                    },
                },
                {
                    case: 'external props, static props and component default value defined',
                    expected: 7,
                    getActor: () => {
                        class NumberComponent extends Component<NumberComponent, number | undefined>() {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }
                        interface Components {
                            comp: NumberComponent;
                        }
                        @ComponentOwnerDecorator()
                        class Actor extends ComponentsOwner<Components> {
                            protected components = (): ComponentsBuilders<Components> => ({
                                comp: NumberComponent.build(5),
                            });
                        }
                        return new Actor({ comp: 7 });
                    },
                },
                {
                    case: 'static props and component default value not defined',
                    expected: 5,
                    getActor: () => {
                        class NumberComponent extends Component<NumberComponent, number>() {
                            constructor(props: number) {
                                super(props);
                            }
                        }

                        interface Components {
                            comp: NumberComponent;
                        }
                        @ComponentOwnerDecorator()
                        class Actor extends ComponentsOwner<Components> {
                            protected components = (): ComponentsBuilders<Components> => ({
                                comp: NumberComponent.build(5),
                            });
                        }
                        return new Actor();
                    },
                },
            ])('should use $case', ({ getActor, expected }) => {
                const actor = getActor();

                expect(actor).toBeTruthy();
                expect(actor.component.comp).toBeTruthy();
                expect(actor.component.comp.getProps()).toEqual(expected);
            });
        });

        /* { /!** expect TS error when specified other component *!/
            class NumberComponent extends Component<NumberComponent, number>() {}
            class OtherComponent extends Component<OtherComponent, string>() {}

            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Actor> {
                // @ts-expect-error
                public comp: NumberComponent = OtherComponent.build(this, '123');
            }
        }

        { /!** expect TS error when specified other component *!/
        class NumberComponent extends Component<NumberComponent, number>() {}
            class OtherComponent extends Component<OtherComponent, string>() {}

            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Actor> {
                // @ts-expect-error
                public comp: NumberComponent = OtherComponent.build(this, '123');
            }

            new Actor({
                // @ts-expect-error
                comp: '123',
            });
        }

        // TODO
        { /!** expect TS error when specified name of other component *!/
            class NumberComponent extends Component<NumberComponent, number>() {}
            class OtherComponent extends Component<OtherComponent, string>() {}

            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Actor> {
                public numberComponent: NumberComponent = NumberComponent.build(this, 0);
                public otherComponent: OtherComponent = OtherComponent.build(this, '123');
            }
        } */
    });

    describe('component with owner specified', () => {
        interface Owner {
            numberComponent: NumberComponent;
        }

        class OwnerComponent extends Component<OwnerComponent, number, Owner>() {}
        class NumberComponent extends Component<NumberComponent, number>() {}

        it('should add component with owner specified', () => {

            interface Components {
                numberComponent: NumberComponent;
                comp: OwnerComponent;
            }
            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Components> {
                public components = () => ({
                    numberComponent: NumberComponent.build(5),
                    comp: OwnerComponent.build(0),
                });
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.component.comp).toBeTruthy();
            expect(actor.component.comp.getProps()).toEqual(0);
        });

        { /** should show TS error when owner is not compatible */
            interface Components {
                comp: OwnerComponent;
            }
            @ComponentOwnerDecorator()
            class Actor extends ComponentsOwner<Components> {
                // @ts-expect-error
                public components = () => ({
                    comp: OwnerComponent.build(0),
                });
            }
        }
    });
});
