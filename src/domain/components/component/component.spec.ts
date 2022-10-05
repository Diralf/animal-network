import { Component } from './component';

describe('Component', () => {
    describe('component define', () => {
        class DefaultComponent extends Component {}

        class NumberComponent extends Component<number> {
            public value: number = 0;
            public onPropsInit(props: number = 5) {
                super.onPropsInit(props);
                this.value = props;
            }
        }

        interface StringDeps {
            age: NumberComponent;
            logic: DefaultComponent;
        }

        class StringComponent extends Component<string, StringDeps> {}

        it.each([
            {
                case: 'using componentBuilder',
                factory: () => ({
                    defaultBuilder: DefaultComponent.builder(),
                    numberBuilder: NumberComponent.builder(),
                    stringBuilder: StringComponent.builder(),
                }),
            },
            {
                case: 'using static builder',
                factory: () => ({
                    defaultBuilder: DefaultComponent.builder(),
                    numberBuilder: NumberComponent.builder(),
                    stringBuilder: StringComponent.builder(),
                }),
            },
        ])('should define component $case', ({ factory }) => {
            const defaultOwner = { component: {} };

            const { defaultBuilder, numberBuilder, stringBuilder } = factory();

            const defaultFactory = defaultBuilder();
            const defaultComponent = defaultFactory({ owner: defaultOwner });

            const numberFactory = numberBuilder(1);
            const numberComponent = numberFactory({ owner: defaultOwner, props: 2 });

            const stringOwner = { component: {
                age: numberComponent,
                logic: defaultComponent,
            } };
            const stringFactory = stringBuilder('123');
            const stringComponent = stringFactory({ owner: stringOwner, props: '345' });

            expect(defaultComponent).toBeTruthy();
            expect(numberComponent).toBeTruthy();
            expect(stringComponent).toBeTruthy();

            // no error: when props defined at component itself
            numberBuilder();
            // no error: without external props
            numberFactory({ owner: defaultOwner });
            // no error: without external props
            stringFactory({ owner: stringOwner });

            // @ts-expect-error when specified wrong props
            numberBuilder('123');
            // @ts-expect-error when default value is not defined in the component
            stringBuilder();
            // @ts-expect-error when specified wrong props
            stringBuilder(123);
            // @ts-expect-error when specified wrong owner
            stringFactory({ owner: { component: { age: numberComponent } }, props: '345' });
        });
    });

    describe('different static method to build', () => {
        class NumberComponent extends Component<number> {
            public value: number = 0;
            public onPropsInit(props: number = 5) {
                super.onPropsInit(props);
                this.value = props;
            }
        }
        const owner = { component: {} };

        it('using builder', () => {
            const component = NumberComponent.build(owner, 10);

            expect(component).toBeTruthy();
            expect(component.value).toEqual(10);
        });

        it('using factory', () => {
            const component = NumberComponent.build(owner, 10);

            expect(component).toBeTruthy();
            expect(component.value).toEqual(10);
        });

        it('using build', () => {
            const component = NumberComponent.build(owner, 10);

            expect(component).toBeTruthy();
            expect(component.value).toEqual(10);
        });
    });

    describe('value define', () => {
        it('should get a value from component default props', () => {
            class NumberComponent extends Component<number> {
                public value: number = 1;
                public onPropsInit(props: number = 2) {
                    super.onPropsInit(props);
                    this.value = props;
                }
            }
            const defaultOwner = { component: {} };

            const numberBuilder = NumberComponent.builder();
            const numberFactory = numberBuilder();
            const numberComponent = numberFactory({ owner: defaultOwner });

            expect(numberComponent.value).toEqual(2);
        });

        it('should get a value from static props', () => {
            class NumberComponent extends Component<number> {
                public value: number = 1;
                public onPropsInit(props = 2) {
                    this.value = props;
                }
            }
            const defaultOwner = { component: {} };

            const numberBuilder = NumberComponent.builder();
            const numberFactory = numberBuilder(3);
            const numberComponent = numberFactory({ owner: defaultOwner });

            expect(numberComponent.value).toEqual(3);
        });

        it('should get a value from external props', () => {
            class NumberComponent extends Component<number> {
                public value: number = 1;
                public onPropsInit(props: number = 2) {
                    super.onPropsInit(props);
                    this.value = props;
                }
            }
            const defaultOwner = { component: {} };

            const numberBuilder = NumberComponent.builder();
            const numberFactory = numberBuilder(3);
            const numberComponent = numberFactory({ owner: defaultOwner, props: 4 });

            expect(numberComponent.value).toEqual(4);
        });
    });
});
