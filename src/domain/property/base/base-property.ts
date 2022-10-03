import { Component } from '../../components/component/component';

export function BaseProperty<Comp, Value, Props = Value>() {
    return class BaseProp extends Component<Comp, Props>() {
        protected getCurrent(): Value {
            return this.props as unknown as Value;
        }

        protected setCurrent(value: Value): void {
            this.props = value as unknown as Props;
        }

        public get current(): Value {
            return this.getCurrent();
        }

        public set current(value: Value) {
            this.setCurrent(value);
        }

        public isEqual(other: BaseProp): boolean {
            return this.isEqualValue(other.current);
        }

        public isEqualValue(otherValue: Value): boolean {
            return this.getCurrent() === otherValue;
        }
    };
}

const PropertyConstructor = <Value>() => BaseProperty<unknown, Value>();
export type Property<Value> = InstanceType<ReturnType<typeof PropertyConstructor<Value>>>;
export const Property = <Value>() => BaseProperty<Property<Value>, Value>();
