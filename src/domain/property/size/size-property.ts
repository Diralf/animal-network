import {NumberProperty} from "../base/number-property";

export class SizeProperty extends NumberProperty {
    constructor({ current }: { current?: number } = {}) {
        super({
            defaultValue: 1,
            min: 1,
            max: 100,
        });
        this.current = current ?? this.default;
    }
}
