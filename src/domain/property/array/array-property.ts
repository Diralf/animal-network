import {BaseProperty} from "../base/base-property";

export class ArrayProperty<Item, Owner = unknown> extends BaseProperty<Item[], Owner> {
    isEqualValue(otherValue: Item[]): boolean {
        const current = this.current;
        return current.length === otherValue.length && current.every((item, index) => {
            return item === otherValue[index];
        });
    }
}
