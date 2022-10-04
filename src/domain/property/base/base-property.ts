import { Component } from '../../components/component/component';

export class Property<Value, Props = Value> extends Component<Props> {
    private _current!: Value;

    public onPropsInit(props: Props): void {
        this._current = props as unknown as Value;
    }

    public get current(): Value {
        return this._current;
    }

    public set current(value: Value) {
        this._current = value;
    }

    public isEqual(other: Property<Value>): boolean {
        return this.isEqualValue(other.current);
    }

    public isEqualValue(otherValue: Value): boolean {
        return this._current === otherValue;
    }
}
