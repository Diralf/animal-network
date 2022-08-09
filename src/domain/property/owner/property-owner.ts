import { PropertiesContainer } from '../container/properties-container';
import { PropertiesContainerBase } from '../container/properties-container-base.type';

export class PropertyOwner<Owner extends PropertiesContainerBase<Owner>> {
    private _owner: PropertiesContainer<Owner> = null as unknown as PropertiesContainer<Owner>;

    public get ref(): PropertiesContainer<Owner> {
        if (!this._owner) {
            throw new Error('Owner is not defined');
        }
        return this._owner;
    }

    public set ref(value: PropertiesContainer<Owner>) {
        if (this._owner) {
            throw new Error('Owner already defined');
        }
        this._owner = value;
    }
}
