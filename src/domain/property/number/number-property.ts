import { BaseProperty } from '../base/base-property';

interface Props {
    defaultValue?: number;
    min?: number;
    max?: number;
    current?: number;
}

export class NumberProperty extends BaseProperty<NumberProperty, number, Props | undefined>() {
    private _default!: number;
    private _min!: number;
    private _max!: number;

    constructor(options: Props = {}) {
        super(options);
        this._min = options.min ?? -Number.MAX_SAFE_INTEGER;
        this._max = options.max ?? Number.MAX_SAFE_INTEGER;

        this._default = this.validate(options.defaultValue ?? 0);
        this.current = this.validate(options.current ?? this._default);
    }

    protected getCurrent(): number {
        return this.props?.current ?? this._default;
    }

    protected setCurrent(value: number): void {
        this.props!.current = value;
    }

    public get current(): number {
        return super.current;
    }

    public set current(value: number) {
        super.current = this.validate(value);
    }

    public get min(): number {
        return this._min;
    }

    public get max(): number {
        return this._max;
    }

    public get default(): number {
        return this._default;
    }

    public validate(value: number): number {
        if (value < this.min || value > this.max) {
            throw this.getOutOfRangeError(value);
        }
        return value;
    }

    public getOutOfRangeError(value: number): Error {
        return new Error(`Value out of range. Value ${value}, allowed [${this.min}, ${this.max}]`);
    }
}
