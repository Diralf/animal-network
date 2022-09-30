import { ComponentsOwner, UnknownComponent } from './components-owner';

export function ComponentOwnerDecorator() {
    return function<
        Components extends Record<keyof Components, UnknownComponent>,
        Actor extends ComponentsOwner<Components>,
        Ctor extends new (...args: any) => Actor
    >(
        Constructor: Ctor,
    ): new (...args: any) => any {
        // @ts-ignore
        return class extends Constructor {
            // @ts-ignore
            private __ = this.buildComponents();
        };
    };
}
