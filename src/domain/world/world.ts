import { EntityType } from '../components/component/component';
import { UnknownComponent } from '../components/components-owner/chain-builder';
import { EntityList } from '../property-container-list/entity-list';
import { Positionable } from '../property/point/positionable';
import { RawPoint } from '../property/point/raw-point';
import { Visualable } from '../property/sight/visualable';
import { visualEntitiesAsString } from '../property/utils/visual-entities-as-string';
import { OnDestroy } from '../time-thread/on-destroy';
import { isOnTickGuard, OnTick } from '../time-thread/on-tick';
import { TimeThread } from '../time-thread/time-thread';

export class World<Components extends Record<keyof Components, UnknownComponent> = {}> {
    private entityList: EntityList<Components> = new EntityList();
    private staticList: EntityList<any> = new EntityList();
    private timeThread = new TimeThread();
    private time = 0;
    public id = 0;
    public width = 0;
    public height = 0;
    public savedEntityList = new EntityList();

    private entityMap: Map<string, (point: RawPoint) => EntityType<Components>> = new Map();

    constructor() {
    }

    public addEntity(...instances: Array<EntityType<Components>>): void {
        this.entityList.add(...instances);
        const onTickInstances = instances.filter((instance) => isOnTickGuard(instance)) as unknown as OnTick[];
        this.timeThread.addListener(...onTickInstances);
    }

    public addStatic(...instances: Array<EntityType<any>>): void {
        this.staticList.add(...instances);
        const onTickInstances = instances.filter((instance) => isOnTickGuard(instance)) as unknown as OnTick[];
        this.timeThread.addListener(...onTickInstances);
    }

    public removeEntity(...instances: Array<EntityType<Components>>): void {
        this.entityList.remove(...instances);
        const onTickInstances = instances.filter((instance) => isOnTickGuard(instance)) as unknown as OnTick[];
        this.timeThread.removeListener(...onTickInstances);
        const onDestroy: OnDestroy[] = instances.filter((instances) => 'onDestroy' in instances) as any;
        onDestroy.forEach((inst) => inst.onDestroy(this));
    }

    public getEntityList() {
        return this.entityList;
    }

    public getStaticList() {
        return this.staticList;
    }

    registerEntities(entityMap: Map<string, (point: RawPoint) => EntityType<Components>>) {
        this.entityMap = entityMap;
    }

    registerStatic(staticList: Array<() => EntityType<Components>>) {
        staticList.forEach((factory) => {
            this.addStatic(factory() as any);
        });
    }

    buildWorldFromString(worldAsString: string) {
        const rows = worldAsString.split('\n');
        this.height = rows.length;
        this.width = rows[0]?.split(',').length ?? 0;
        rows.forEach((row, rowIndex) => {
            const cells = row.split(',');
            cells.forEach((cell, cellIndex) => {
                const entityFactory = this.entityMap.get(cell);
                if (entityFactory) {
                    const entityWithPosition = entityFactory({ x: cellIndex, y: rowIndex });
                    this.addEntity(entityWithPosition as any);
                }
            });
        });
    }

    getTime() {
        return this.time;
    }

    public tick(): void {
        this.timeThread.tick(this, this.time);
        this.time += 1;
    }

    public print(entityList: EntityList<Positionable & Visualable>, emptyCell = '_') {
        const matrix: number[][] = [];
        for (let y = 0; y < this.height; y++) {
            const row: number[] = [];
            for (let x = 0; x < this.width; x++) {
                const entity = entityList.findWithType<Positionable & Visualable>(
                    (instance): instance is EntityType<Positionable & Visualable> => 'position' in instance.component && 'visual' in instance.component,
                    (instance) => instance.component.position.isEqualValue({ x, y }),
                );
                row.push(entity[0]?.component.visual.current ?? 1);
            }
            matrix.push(row);
        }
        return visualEntitiesAsString(matrix, emptyCell);
    }
}
