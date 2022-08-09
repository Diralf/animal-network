import { TimeThreadListener } from '../../time-thread/time-thread-listener';
import { World } from '../../world/world';
import { ArrayProperty } from '../array/array-property';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';
import { PointProperty } from '../point/point-property';
import { PropertyContainerList } from '../../property-container-list/property-container-list';
import { BaseProperty } from '../base/base-property';

interface Owner {
    visual: BaseProperty<number>;
    position: PointProperty;
}

export class SightProperty extends ArrayProperty<number> implements PropertyWithOwner<Owner>, TimeThreadListener {
    public owner = new PropertyOwner<Owner>();
    private readonly _range: number;

    constructor(options: { range: number }) {
        super([]);
        this._range = options.range;
    }

    public get range(): number {
        return this._range;
    }

    public update(list: PropertyContainerList<Owner>): void {
        const { x, y } = this.owner.ref.get.position();
        const [sx, sy] = [x - this.range, y - this.range];
        const [ex, ey] = [x + this.range, y + this.range];

        const newCurrent = [];
        for (let j = sy; j <= ey; j++) {
            for (let i = sx; i <= ex; i++) {
                const [entity] = list.find({
                    position: {
                        x: i,
                        y: j,
                    },
                });
                const cell = (entity && entity.get.visual?.()) ?? 0;
                newCurrent.push(cell);
            }
        }

        this.current = newCurrent;
    }

    public asString(emptyCell = '_'): string {
        const sightSize = (this.range * 2) + 1;
        const matrix = this.current;
        return new Array(sightSize).fill(0)
            .map((zero, index) => matrix.slice(index * sightSize, (index * sightSize) + sightSize).join(','))
            .join('\n')
            .replaceAll('0', emptyCell);
    }

    public tick(world: World): void {
        this.update(world.entityList);
    }
}
