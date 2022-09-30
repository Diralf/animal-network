import { PropertyOwner } from './property-owner';

export interface PropertyWithOwner<Owner> {
    _owner: PropertyOwner<Owner>;
}

export const isPropertyWithOwner = <Owner>(property: any): property is PropertyWithOwner<Owner> => 'owner' in property;
