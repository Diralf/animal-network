import { Component } from '../../components/component/component';
import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Directional } from '../direction/directional';
import { Positionable } from '../point/positionable';
import { RawPoint } from '../point/raw-point';
import { Visualable } from '../sight/visualable';
import { rotateMatrix } from '../utils/rotate-matrix';
import { rotateVector } from '../utils/rotate-vector';
import { visualEntitiesAsString } from '../utils/visual-entities-as-string';

type Owner = Positionable & Visualable & Directional;

interface Options {
    range: [number, number];
}

export class DirectionSightProperty extends Component<Options, Owner> implements OnTick {
    private readonly _range: [number, number];
    public current: number[][] = [];

    constructor(options: Options) {
        super(options);
        this._range = options.range;
    }

    public get range(): [number, number] {
        return this._range;
    }

    public getSightMask() {
        const [forward, side] = this.range;
        const [maskStart, maskEnd] = [{ x: 0, y: -side }, { x: forward, y: side }];
        return {
            maskStart,
            maskEnd,
        };
    }

    public getRotatedSightMask() {
        const directionProperty = this.owner.ref.direction;
        const angle = directionProperty.getAsAngle();
        const { maskStart, maskEnd } = this.getSightMask();
        // const [maskS, maskE] = [{ x: 0, y: forward }, { x: 0, y: 0 }];
        const [rotS, rotE] = [rotateVector(maskStart, angle), rotateVector(maskEnd, angle)];
        return [
            { x: Math.min(rotS.x, rotE.x), y: Math.min(rotS.y, rotE.y) },
            { x: Math.max(rotS.x, rotE.x), y: Math.max(rotS.y, rotE.y) },
        ];
    }

    public getSightFieldArea(): [RawPoint, RawPoint] {
        const { x, y } = this.owner.ref.position.current;
        const [rotS, rotE] = this.getRotatedSightMask();
        const [sx, sy] = [x + Math.min(rotS.x, rotE.x), y + Math.min(rotS.y, rotE.y)];
        const [ex, ey] = [x + Math.max(rotS.x, rotE.x), y + Math.max(rotS.y, rotE.y)];
        return [{ x: sx, y: sy }, { x: ex, y: ey }];
    }

    public getSightField(list: EntityList<Positionable & Visualable>, [{ x: sx, y: sy }, { x: ex, y: ey }]: [RawPoint, RawPoint]) {
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

        return newCurrent;
    }

    public rotateFieldSight(newCurrent: number[][]) {
        const directionProperty = this.owner.ref.direction;
        const angle = directionProperty.getAsAngle() / 90;
        switch (angle) {
            case 1:
                return rotateMatrix(newCurrent, 2);
            case 0:
                return rotateMatrix(newCurrent, -1);
            case -1:
                return rotateMatrix(newCurrent, 0);
            case 2:
                return rotateMatrix(newCurrent, 1);
        }
        return rotateMatrix(newCurrent, angle);
    }

    public update(list: EntityList<Positionable & Visualable>): void {
        const area = this.getSightFieldArea();
        const newCurrent = this.getSightField(list, area);

        this.current = this.rotateFieldSight(newCurrent);
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
