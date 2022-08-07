import { BaseProperty } from '../base/base-property';

export class NumberProperty extends BaseProperty<number> {
    private readonly _default: number;
    private readonly _min: number;
    private readonly _max: number;

    constructor(options: { defaultValue?: number, min?: number, max?: number, current?: number } = {}) {
        super(0);
        this._min = options.min ?? -Number.MAX_SAFE_INTEGER;
        this._max = options.max ?? Number.MAX_SAFE_INTEGER;

        this._default = this.validate(options.defaultValue ?? 0);
        this.current = this.validate(options.current ?? this._default);
    }

    get current() {
        return super.current;
    }

    set current(value: number) {
        super.current = this.validate(value);
    }

    get min(): number {
        return this._min;
    }

    get max(): number {
        return this._max;
    }

    get default(): number {
        return this._default;
    }

    validate(value: number) {
        if (value < this.min || value > this.max) {
            throw this.getOutOfRangeError(value);
        }
        return value;
    }

    getOutOfRangeError(value: number) {
        return new Error(`Value out of range. Value ${value}, allowed [${this.min}, ${this.max}]`);
    }
}
