import { PropertyContainerList } from '../../property-container-list/property-container-list';
import { PropertiesContainer } from '../container/properties-container';
import { CollisionOwner } from './collision-owner';

export interface CollisionOptions {
    other: Array<PropertiesContainer<CollisionOwner>>;
    list: PropertyContainerList<CollisionOwner>;
}
