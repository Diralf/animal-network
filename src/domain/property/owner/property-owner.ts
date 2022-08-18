export class PropertyOwner<Owner> {
    private _owner: Owner = null as unknown as Owner;

    public get ref(): Owner {
        if (!this._owner) {
            throw new Error('Owner is not defined');
        }
        return this._owner;
    }

    public set ref(value: Owner) {
        if (this._owner) {
            throw new Error('Owner already defined');
        }
        this._owner = value;
    }
}
