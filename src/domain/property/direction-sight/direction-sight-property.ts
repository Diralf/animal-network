import { Component } from '../../components/component/component';
import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { DirectionProperty } from '../direction/direction-property';
import { NumberProperty } from '../number/number-property';
import { PointProperty } from '../point/point-property';
import { Positionable } from '../point/positionable';
import { RawPoint } from '../point/raw-point';
import { Visualable } from '../sight/visualable';
import { rotateMatrix } from '../utils/rotate-matrix';
import { rotateVector } from '../utils/rotate-vector';
import { visualEntitiesAsString } from '../utils/visual-entities-as-string';

export interface DirectionSightPropertyDeps {
    position: PointProperty;
    direction: DirectionProperty;
    visual: NumberProperty;
}

export interface DirectionSightPropertyProps {
    range: [number, number];
}

export class DirectionSightProperty extends Component<DirectionSightPropertyProps, DirectionSightPropertyDeps> implements OnTick {
    public current: number[][] = [];
    private range!: DirectionSightPropertyProps['range'];

    onPropsInit(props: DirectionSightPropertyProps = { range: [1, 1] }) {
        this.range = props.range;
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
        const directionProperty = this.owner.component.direction;
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
        const { x, y } = this.owner.component.position.current;
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
                const [entity] = list.find((instance) => instance.component.position.isEqualValue({
                    x: i,
                    y: j,
                }));
                const cell = entity?.component.visual.current ?? 1;
                row.push(cell);
            }
            newCurrent.push(row);
        }

        return newCurrent;
    }

    public rotateFieldSight(newCurrent: number[][]) {
        const directionProperty = this.owner.component.direction;
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

    public tick(world: World<DirectionSightPropertyDeps>): void {
        this.update(world.getEntityList());
    }
}
