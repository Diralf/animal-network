import { Component } from '../component/component';
import { ComponentsOwner } from './components-owner';

describe('ComponentsOwner', () => {
    describe('default component', () => {
        class DefaultComponent extends Component {}

        it('should add default component to class', () => {
            class Actor extends ComponentsOwner<Actor> {
                public component: DefaultComponent = this.createComponent({
                    owner: this,
                    class: DefaultComponent,
                });
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.component).toBeTruthy();
        });
    });

    describe('number component', () => {

        it('should add component with number option', () => {
            class NumberComponent extends Component<number> {}
            class Actor extends ComponentsOwner<Actor> {
                public component: NumberComponent = this.createComponent({
                    owner: this,
                    class: NumberComponent,
                    props: 0,
                    name: 'component',
                });
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.component).toBeTruthy();
            expect(actor.component.getProps()).toEqual(0);
        });

        it('should add component with number and apply external value', () => {
            class NumberComponent extends Component<number> {}
            class Actor extends ComponentsOwner<Actor> {
                public component: NumberComponent = this.createComponent({
                    owner: this,
                    class: NumberComponent,
                    props: 0,
                    name: 'component',
                });
            }

            const actor = new Actor({
                component: 5,
            });

            expect(actor).toBeTruthy();
            expect(actor.component).toBeTruthy();
            expect(actor.component.getProps()).toEqual(5);
        });

        describe('value define level', () => {
            it.each([
                {
                    case: 'component default value',
                    expected: 3,
                    getActor: () => {
                        class NumberComponent extends Component<number> {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public component: NumberComponent = this.createComponent({
                                owner: this, class: NumberComponent, name: 'component',
                            });
                        }
                        return new Actor();
                    },
                },
                {
                    case: 'static props, component default value defined',
                    expected: 5,
                    getActor: () => {
                        class NumberComponent extends Component<number> {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public component: NumberComponent = this.createComponent({
                                owner: this, class: NumberComponent, name: 'component', props: 5,
                            });
                        }
                        return new Actor();
                    },
                },
                {
                    case: 'external props, static props and component default value defined',
                    expected: 7,
                    getActor: () => {
                        class NumberComponent extends Component<number> {
                            constructor(props: number = 3) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public component: NumberComponent = this.createComponent({
                                owner: this, class: NumberComponent, name: 'component', props: 5,
                            });
                        }
                        return new Actor({ component: 7 });
                    },
                },
                {
                    case: 'static props and component default value not defined',
                    expected: 5,
                    getActor: () => {
                        class NumberComponent extends Component<number> {
                            constructor(props: number) {
                                super(props);
                            }
                        }
                        class Actor extends ComponentsOwner<Actor> {
                            public component: NumberComponent = this.createComponent({
                                owner: this, class: NumberComponent, name: 'component', props: 5,
                            });
                        }
                        return new Actor();
                    },
                },
            ])('should use $case', ({ getActor, expected }) => {
                const actor = getActor();

                expect(actor).toBeTruthy();
                expect(actor.component).toBeTruthy();
                expect(actor.component.getProps()).toEqual(expected);
            });
        });

        { /** expect TS error when specified other component */
            class NumberComponent extends Component<number> {}
            class OtherComponent extends Component<string> {}

            class Actor extends ComponentsOwner<Actor> {
                public component: NumberComponent = this.createComponent({
                    owner: this,
                    // @ts-expect-error
                    class: OtherComponent,
                });
            }
        }

        { /** expect TS error when specified name of other component */
            class NumberComponent extends Component<number> {}
            class OtherComponent extends Component<string> {}

            class Actor extends ComponentsOwner<Actor> {
                // @ts-expect-error
                public numberComponent: NumberComponent = this.createComponent(
                    // @ts-expect-error
                    { owner: this, class: NumberComponent, props: 0, name: 'otherComponent' },
                );
                public otherComponent: OtherComponent = this.createComponent({
                    owner: this,
                    class: OtherComponent,
                    props: '123',
                    name: 'otherComponent',
                });
            }
        }
    });

    describe('component with owner specified', () => {
        interface Owner {
            name: string
        }

        class OwnerComponent extends Component<number, Owner> {}

        it('should add component with owner specified', () => {
            class Actor extends ComponentsOwner<Actor> implements Owner {
                public name: string = 'Hello';

                public component: OwnerComponent = this.createComponent({
                    owner: this,
                    class: OwnerComponent,
                    props: 0,
                    name: 'component',
                });
            }

            const actor = new Actor();

            expect(actor).toBeTruthy();
            expect(actor.component).toBeTruthy();
            expect(actor.component.getProps()).toEqual(0);
        });

        { /** should show TS error when owner is not compatible */
            class Actor extends ComponentsOwner<Actor> {
                public component: OwnerComponent = this.createComponent({
                    // @ts-expect-error
                    owner: this,
                    class: OwnerComponent,
                    props: 0,
                    name: 'component',
                });
            }
        }
    });
});
