export class BaseProperty<Value> {
    constructor(private _current: Value) {
    }

    get current(): Value {
        return this._current;
    }

    set current(value: Value) {
        this._current = value;
    }

    public isEqual(other: BaseProperty<Value>) {
        return this.isEqualValue(other.current);
    }

    public isEqualValue(otherValue: Value) {
        return this._current === otherValue;
    }
}
