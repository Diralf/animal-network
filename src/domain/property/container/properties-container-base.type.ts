import { BaseProperty } from '../base/base-property';

export type PropertiesContainerBase<Properties> = Record<keyof Properties, BaseProperty<unknown>>;
