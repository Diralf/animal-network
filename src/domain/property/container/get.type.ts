import { PropertyValueType } from '../utils/property-value.type';
import { PropertiesContainerBase } from './properties-container-base.type';

export type Get<Properties extends PropertiesContainerBase<Properties>> = {
    [Key in keyof Properties]: () => PropertyValueType<Properties[Key]>;
};
export const isGetValid = <Properties extends PropertiesContainerBase<Properties>>(
    getInstance: Partial<Get<Properties>>,
    propertyKeys: Array<keyof Properties>,
): getInstance is Get<Properties> => propertyKeys.every((propertyKey) => propertyKey in getInstance);
