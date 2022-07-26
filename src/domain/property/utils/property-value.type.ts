import {BaseProperty} from "../base/base-property";

export type PropertyValueType<Property extends BaseProperty<unknown>> = Property['current'];
export type PropertiesValueTypes<Properties extends Record<keyof Properties, BaseProperty<unknown>>> = {
    [Key in keyof Properties]: PropertyValueType<Properties[Key]>;
}
