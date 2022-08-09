import { BaseProperties } from '../../use-cases/simple-grass-world/entities/base-properties';
import { PropertyContainerList } from '../property-container-list/property-container-list';

export class World {
    public entityList: PropertyContainerList<BaseProperties> = new PropertyContainerList();
}
