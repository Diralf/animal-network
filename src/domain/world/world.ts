import { BaseProperties } from '../../use-cases/simple-grass-world/entities/base-properties';
import { PropertyContainerList } from '../property-container-list/property-container-list';
import { PropertiesContainer } from '../property/container/properties-container';
import { PropertiesContainerBase } from '../property/container/properties-container-base.type';
import { RawPoint } from '../property/point/raw-point';
import { visualEntitiesAsString } from '../property/utils/visual-entities-as-string';
import { TimeThread } from '../time-thread/time-thread';

export class World<EntityList extends PropertiesContainerBase<EntityList> = {}, StaticList extends PropertiesContainerBase<StaticList> = {}> {
    private entityList: PropertyContainerList<EntityList> = new PropertyContainerList();
    private staticList: PropertyContainerList<StaticList> = new PropertyContainerList();
    private timeThread = new TimeThread();
    private time = 0;
    public width: number = 0;
    public height: number = 0;

    private entityMap: Map<string, (point: RawPoint) => PropertiesContainer<BaseProperties>> = new Map();

    constructor() {
    }

    public addEntity(...instances: Parameters<typeof this.entityList.add>): void {
        this.entityList.add(...instances);
        this.timeThread.addListener(...instances);
    }

    public addStatic(...instances: Parameters<typeof this.staticList.add>): void {
        this.staticList.add(...instances);
        this.timeThread.addListener(...instances);
    }

    public getEntityList() {
        return this.entityList;
    }

    public getStaticList() {
        return this.staticList;
    }

    registerEntities(entityMap: Map<string, (point: RawPoint) => PropertiesContainer<BaseProperties>>) {
        this.entityMap = entityMap;
    }

    registerStatic(staticList: Array<() => PropertiesContainer<{}>>) {
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

    public tick(): void {
        this.timeThread.tick(this, this.time);
        this.time += 1;
    }

    public print() {
        let matrix: number[][] = [];
        for (let y = 0; y < this.height; y++) {
            const row: number[] = [];
            for (let x = 0; x < this.width; x++) {
                // @ts-ignore
                const entity = this.entityList.find({ position: { x, y } });
                // @ts-ignore
                row.push(entity[0]?.get?.visual?.() ?? 0);
            }
            matrix.push(row);
        }
        return visualEntitiesAsString(matrix);
    }

}
