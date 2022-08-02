import {ArrayProperty} from "../array/array-property";
import {PointProperty} from "../point/point-property";
import {PropertyContainerList} from "../../property-container-list/property-container-list";
import {PropertiesContainer} from "../container/properties-container";
import {BaseProperty} from "../base/base-property";

interface Owner {
    visual: BaseProperty<number>;
    position: PointProperty;
}

export class SightProperty extends ArrayProperty<number, PropertiesContainer<Owner>> {
    private readonly _range: number;

    constructor(options: { range: number }) {
        super([]);
        this._range = options.range;
    }

    get range(): number {
        return this._range;
    }

    update(list: PropertyContainerList<Owner>) {
        const { x, y } = this.owner.get.position();
        const [sx, sy] = [x - this.range, y - this.range];
        const [ex, ey] = [x + this.range, y + this.range];

        const newCurrent = [];
        for (let j = sy; j <= ey; j++) {
            for (let i = sx; i <= ex; i ++) {
                const [entity] = list.find({ position: { x: i, y: j }});
                const cell = (entity && entity.get.visual?.()) ?? 0;
                newCurrent.push(cell);
            }
        }

        this.current = newCurrent;
    }

    asString() {
        const sightSize = this.range * 2 + 1;
        const matrix = this.current;
        return new Array(sightSize).fill(0).map((zero, index) => {
            return matrix.slice(index * sightSize, index * sightSize + sightSize).join(',');
        }).join('\n');
    }
}
