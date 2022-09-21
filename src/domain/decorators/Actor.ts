import { World } from '../world/world';

export function Actor() {
    return (constructor: Function) => {
        constructor.prototype.componentsInit = function componentsInit() {
            const componentKeys = this.__components ?? [];
            componentKeys.forEach((key: string) => {
                const component = this[key];
                if (component?.owner) {
                    component.owner.ref = this;
                }
            });
        };

        constructor.prototype.componentsTick = function componentsTick(world: World, time: number) {
            const componentKeys = this.__components ?? [];
            componentKeys.forEach((key: string) => {
                if (this[key]?.tick) {
                    this[key].tick(world, time);
                }
            });
        };
    };
}
