import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';
import { builder } from '../components-owner/entity-builder';
import { ComponentManager, componentManager } from './component-manager';

describe('ComponentManager', () => {
    class StringComponent extends Component<StringComponent, string>() implements OnTick {
        tick(world: World, time: number) {}
    }
    interface Owner {
        street: StringComponent;
    }
    class NumberComponent extends Component<NumberComponent, number, Owner>() {}

    interface Components {
        name: StringComponent;
        street: StringComponent;
        age: NumberComponent;
    }

    const componentBuilder = () => builder<Components>({
        name: StringComponent.builder(),
        age: NumberComponent.builder(),
        street: StringComponent.builder(),
    });

    it('should define actor with components using composition', () => {
        class Actor {
            public componentManager = componentManager(componentBuilder()
                .age(2)
                .street('Avenue')
                .build());
        }

        const actorBuilder = new Actor();
        const actor = actorBuilder.componentManager.build({
            street: '123',
            age: 1,
            // @ts-expect-error
            name: '123',
        });

        expect(actor.component.street.getProps()).toEqual('123');
    });

    it('using functional paradigm', () => {
        const Actor = () => componentManager(componentBuilder()
            .age(2)
            .street('Avenue')
            .build());

        const actor = Actor().build({
            street: '123',
            age: 1,
            // @ts-expect-error
            name: '123',
        });

        expect(actor.component.street.getProps()).toEqual('123');
    });
});
