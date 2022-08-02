export class BaseProperty<Value, Owner = unknown> {
    private _owner: Owner = null as unknown as Owner;

    constructor(private _current: Value) {
    }

    get current(): Value {
        return this._current;
    }

    set current(value: Value) {
        this._current = value;
    }

    get owner(): Owner {
        if (!this._owner) {
            throw new Error('Owner is not defined');
        }
        return this._owner;
    }

    set owner(value: Owner) {
        if (this._owner) {
            throw new Error('Owner already defined');
        }
        this._owner = value;
    }

    public isEqual(other: BaseProperty<Value>) {
        return this.isEqualValue(other.current);
    }

    public isEqualValue(otherValue: Value) {
        return this._current === otherValue;
    }
}
