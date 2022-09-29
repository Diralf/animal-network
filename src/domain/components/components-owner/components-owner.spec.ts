import { Component } from '../component/component';
import { ComponentsOwner, ExternalComponentsProps } from './components-owner';

describe('ComponentsOwner', () => {
    describe('default component', () => {
        class DefaultComponent extends Component() {}

        it('should add default component to class', () => {
            class Actor extends ComponentsOwner<Actor> {
                public comp: DefaultComponent = DefaultComponent.build(this);
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.comp).toBeTruthy();
        });
    });

    describe('number component', () => {

        it('should add component with number option', () => {
            class NumberComponent extends Component<number>() {}
            class Actor extends ComponentsOwner<Actor> {
                public comp: NumberComponent = NumberComponent.build(this, 0);
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.comp).toBeTruthy();
            expect(actor.comp.getProps()).toEqual(0);
        });

        it('should add component with number and apply external value', () => {
            class NumberComponent extends Component<number>() {}
            class Actor extends ComponentsOwner<Actor> {
                public comp: NumberComponent = NumberComponent.build(this, 0);
                constructor(props: ExternalComponentsProps<Actor> = {}) {
                    super(props);
                    this.init();
                }
            }

            const actor = new Actor({
                comp: 5,
            });

            expect(actor).toBeTruthy();
            expect(actor.comp).toBeTruthy();
            expect(actor.comp.getProps()).toEqual(5);
        });

        describe('value define level', () => {
            it.each([
                {
                    case: 'component default value',
                    expected: 3,
                    getActor: () => {
                        class NumberComponent extends Component<number | undefined>() {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public comp: NumberComponent = NumberComponent.build(this);
                        }
                        return new Actor();
                    },
                },
                {
                    case: 'static props, component default value defined',
                    expected: 5,
                    getActor: () => {
                        class NumberComponent extends Component<number | undefined>() {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public comp: NumberComponent = NumberComponent.build(this, 5);
                        }
                        return new Actor();
                    },
                },
                {
                    case: 'external props, static props and component default value defined',
                    expected: 7,
                    getActor: () => {
                        class NumberComponent extends Component<number | undefined>() {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public comp: NumberComponent = NumberComponent.build(this, 5);
                            constructor(props: ExternalComponentsProps<Actor> = {}) {
                                super(props);
                                this.init();
                            }
                        }
                        return new Actor({ comp: 7 });
                    },
                },
                {
                    case: 'static props and component default value not defined',
                    expected: 5,
                    getActor: () => {
                        class NumberComponent extends Component<number>() {
                            constructor(props: number) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public comp: NumberComponent = NumberComponent.build(this, 5);
                        }
                        return new Actor();
                    },
                },
            ])('should use $case', ({ getActor, expected }) => {
                const actor = getActor();

                expect(actor).toBeTruthy();
                expect(actor.comp).toBeTruthy();
                expect(actor.comp.getProps()).toEqual(expected);
            });
        });

        { /** expect TS error when specified other component */
            class NumberComponent extends Component<number>() {}
            class OtherComponent extends Component<string>() {}

            class Actor extends ComponentsOwner<Actor> {
                // @ts-expect-error
                public comp: NumberComponent = OtherComponent.build(this, 'comp', '123');
            }
        }

        // TODO
        { /** expect TS error when specified name of other component */
            class NumberComponent extends Component<number>() {}
            class OtherComponent extends Component<string>() {}

            class Actor extends ComponentsOwner<Actor> {
                public numberComponent: NumberComponent = NumberComponent.build(this, 0);
                public otherComponent: OtherComponent = OtherComponent.build(this, '123');
            }
        }
    });

    describe('component with owner specified', () => {
        interface Owner {
            someField: string
        }

        class OwnerComponent extends Component<number, Owner>() {}

        it('should add component with owner specified', () => {
            class Actor extends ComponentsOwner<Actor> implements Owner {
                public someField: string = 'Hello';

                public comp: OwnerComponent = OwnerComponent.build(this, 0);
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.comp).toBeTruthy();
            expect(actor.comp.getProps()).toEqual(0);
        });

        { /** should show TS error when owner is not compatible */
            class Actor extends ComponentsOwner<Actor> {
                // @ts-expect-error
                public comp: OwnerComponent = OwnerComponent.build(this, 0);
            }
        }
    });
});
