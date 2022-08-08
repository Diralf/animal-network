export class BaseProperty<Value, Owner = unknown> {
    private _owner: Owner = null as unknown as Owner;

    constructor(private _current: Value) {
    }

    public get current(): Value {
        return this._current;
    }

    public set current(value: Value) {
        this._current = value;
    }

    public get owner(): Owner {
        if (!this._owner) {
            throw new Error('Owner is not defined');
        }
        return this._owner;
    }

    public set owner(value: Owner) {
        if (this._owner) {
            throw new Error('Owner already defined');
        }
        this._owner = value;
    }

    public isEqual(other: BaseProperty<Value>): boolean {
        return this.isEqualValue(other.current);
    }

    public isEqualValue(otherValue: Value): boolean {
        return this._current === otherValue;
    }
}
