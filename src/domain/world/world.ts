import { PropertyContainerList } from '../property-container-list/property-container-list';
import { PropertiesContainerBase } from '../property/container/properties-container-base.type';
import { TimeThread } from '../time-thread/time-thread';

export class World<EntityList extends PropertiesContainerBase<EntityList> = {}, StaticList extends PropertiesContainerBase<StaticList> = {}> {
    private entityList: PropertyContainerList<EntityList> = new PropertyContainerList();
    private staticList: PropertyContainerList<StaticList> = new PropertyContainerList();
    private timeThread = new TimeThread();
    private time = 0;
    public width: number = 0;
    public height: number = 0;

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

    public tick(): void {
        this.timeThread.tick(this, this.time);
        this.time += 1;
    }

    public print() {
        let result = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                // @ts-ignore
                const entity = this.entityList.find({ position: { x, y } });
                // @ts-ignore
                row.push(entity[0]?.get?.visual?.() ?? 0);
            }
            result.push(row.join(','));
        }
        return result.join('\n');
    }
}
