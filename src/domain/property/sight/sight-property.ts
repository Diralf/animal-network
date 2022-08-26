import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';
import { Positionable } from '../point/positionable';
import { visualEntitiesAsString } from '../utils/visual-entities-as-string';
import { Visualable } from './visualable';

type Owner = Positionable & Visualable;

export class SightProperty implements PropertyWithOwner<Owner>, OnTick {
    public owner = new PropertyOwner<Owner>();
    private readonly _range: number;
    public current: number[][] = [];

    constructor(options: { range: number }) {
        this._range = options.range;
    }

    public get range(): number {
        return this._range;
    }

    public update(list: EntityList<Owner>): void {
        const { x, y } = this.owner.ref.position.current;
        const [sx, sy] = [x - this.range, y - this.range];
        const [ex, ey] = [x + this.range, y + this.range];

        const newCurrent = [];
        for (let j = sy; j <= ey; j++) {
            const row = [];
            for (let i = sx; i <= ex; i++) {
                const [entity] = list.find((instance) => instance.position.isEqualValue({
                    x: i,
                    y: j,
                }));
                const cell = entity?.visual ?? 1;
                row.push(cell);
            }
            newCurrent.push(row);
        }

        this.current = newCurrent;
    }

    public asString(emptyCell = '_'): string {
        const matrix = this.current;
        return visualEntitiesAsString(
            matrix,
            emptyCell,
        );
    }

    public tick(world: World<Owner>): void {
        this.update(world.getEntityList());
    }
}
