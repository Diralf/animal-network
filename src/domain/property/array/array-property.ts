import {BaseProperty} from "../base/base-property";

export class ArrayProperty<Item> extends BaseProperty<Item[]> {
    isEqualValue(otherValue: Item[]): boolean {
        const current = this.current;
        return current.length === otherValue.length && current.every((item, index) => {
            return item === otherValue[index];
        });
    }
}
