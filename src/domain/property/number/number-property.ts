import { Property } from '../base/base-property';

export interface NumberPropertyProps {
    defaultValue?: number;
    min?: number;
    max?: number;
    current?: number;
}

export class NumberProperty extends Property<number, NumberPropertyProps> {
    private _default!: number;
    private _min!: number;
    private _max!: number;

    onPropsInit(props: NumberPropertyProps = {}) {
        this._min = props.min ?? -Number.MAX_SAFE_INTEGER;
        this._max = props.max ?? Number.MAX_SAFE_INTEGER;

        this._default = this.validate(props.defaultValue ?? 0);
        this.current = this.validate(props.current ?? this._default);
    }

    protected getCurrent(): number {
        return this.current;
    }

    protected setCurrent(value: number): void {
        this.current = value;
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
