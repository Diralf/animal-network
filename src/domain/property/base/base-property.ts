export class BaseProperty<Value> {
    constructor(private _current: Value) {
    }

    get current(): Value {
        return this._current;
    }

    set current(value: Value) {
        this._current = value;
    }
}
