import { NumberProperty } from "../base/number-property";

export type PropertyValueType<Property extends NumberProperty> = Property['current'];
export type PropertiesValueTypes<Properties extends Record<keyof Properties, NumberProperty>> = {
    [Key in keyof Properties]: PropertyValueType<Properties[Key]>;
}
