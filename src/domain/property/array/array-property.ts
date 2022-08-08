import { BaseProperty } from '../base/base-property';

export class ArrayProperty<Item, Owner = unknown> extends BaseProperty<Item[], Owner> {
    public isEqualValue(otherValue: Item[]): boolean {
        const { current } = this;
        return current.length === otherValue.length && current.every((item, index) => item === otherValue[index]);
    }
}
