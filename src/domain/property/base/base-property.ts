import { Component } from '../../components/component/component';

export class BaseProperty<Value, Props = Value> extends Component<Props> {
    private _current!: Value;

    constructor(props: Props) {
        super(props);
        this._current = props as unknown as Value;
    }

    public get current(): Value {
        return this._current;
    }

    public set current(value: Value) {
        this._current = value;
    }

    public isEqual(other: BaseProperty<Value, Props>): boolean {
        return this.isEqualValue(other.current);
    }

    public isEqualValue(otherValue: Value): boolean {
        return this._current === otherValue;
    }
}
