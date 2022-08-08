import { PropertyValueType } from '../utils/property-value.type';
import { WritableKeys } from '../utils/writable-keys.type';
import { PropertiesContainerBase } from './properties-container-base.type';

type Set<Properties extends PropertiesContainerBase<Properties>> = {
    [Key in keyof Properties]: (value: PropertyValueType<Properties[Key]>) => void;
};
export type SetWritable<Properties extends PropertiesContainerBase<Properties>> = Set<Pick<Properties, WritableKeys<Properties>>>;
export const isSetValid = <Properties extends PropertiesContainerBase<Properties>>(
    getInstance: Partial<SetWritable<Properties>>,
    propertyKeys: Array<keyof Properties>,
): getInstance is SetWritable<Properties> => propertyKeys.every((propertyKey) => propertyKey in getInstance);
