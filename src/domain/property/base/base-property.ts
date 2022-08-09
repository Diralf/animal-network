export class BaseProperty<Value> {
    constructor(private _current: Value) {
    }

    public get current(): Value {
        return this._current;
    }

    public set current(value: Value) {
        this._current = value;
    }

    public isEqual(other: BaseProperty<Value>): boolean {
        return this.isEqualValue(other.current);
    }

    public isEqualValue(otherValue: Value): boolean {
        return this._current === otherValue;
    }
}
