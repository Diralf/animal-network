import { PropertyContainerList } from '../property-container-list/property-container-list';
import { PropertiesContainerBase } from '../property/container/properties-container-base.type';
import { TimeThread } from '../time-thread/time-thread';

export class World<EntityList extends PropertiesContainerBase<EntityList> = {}, StaticList extends PropertiesContainerBase<StaticList> = {}> {
    private entityList: PropertyContainerList<EntityList> = new PropertyContainerList();
    private staticList: PropertyContainerList<StaticList> = new PropertyContainerList();
    private timeThread = new TimeThread();
    private time = 0;

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
}
