import { PropertiesContainerBase } from '../container/properties-container-base.type';
import { PropertyOwner } from './property-owner';

export interface PropertyWithOwner<Owner extends PropertiesContainerBase<Owner>> {
    owner: PropertyOwner<Owner>;
}

export const isPropertyWithOwner = <Owner extends PropertiesContainerBase<Owner>>(
    property: Object,
): property is PropertyWithOwner<Owner> => {
    return 'owner' in property;
}
