import { ComponentOwnerDecorator } from '../../../domain/components/components-owner/component-owner.decorator';
import { ComponentsOwner, ComponentsBuilders } from '../../../domain/components/components-owner/components-owner';
import { Property } from '../../../domain/property/base/base-property';
import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { CollisionProperty } from '../../../domain/property/collision/collision-property';
import { DirectionBrainProperty, BrainCommandsOther } from '../../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementProperty, DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../../../domain/property/direction-sight/direction-sight-property';
import { DirectionProperty } from '../../../domain/property/direction/direction-property';
import { NumberProperty } from '../../../domain/property/number/number-property';
import { PointProperty } from '../../../domain/property/point/point-property';
import { OnDestroy } from '../../../domain/time-thread/on-destroy';
import { OnTick } from '../../../domain/time-thread/on-tick';
import { World } from '../../../domain/world/world';
import { isTaggableGuard } from '../types/is-taggable-guard';
import { Grass } from './grass';
import { InstanceTypes } from '../types/instance-types';
import { Hole } from './hole';

interface Components {
    tags: Property<InstanceTypes[]>;
    visual: NumberProperty;
    position: PointProperty;
    size: NumberProperty;
    metabolizeSpeed: NumberProperty;
    direction: DirectionProperty;
    sight: DirectionSightProperty;
    movement: DirectionMovementProperty;
    collision: CollisionProperty;
    energy: NumberProperty;
    brain: DirectionBrainProperty;
    taste: NumberProperty;
}

export type AnimalComponents = Components;

@ComponentOwnerDecorator()
export class Animal extends ComponentsOwner<Components> implements OnTick, OnDestroy {
    public score = 0;
    public fitness = 0;
    public taste = 0;

    protected onInit(): void {
        this.component.movement.publisher.subscribe(this.handleMovement);
    }

    protected components(): ComponentsBuilders<Components> {
        return {
            tags: Property<InstanceTypes[]>().build([InstanceTypes.ANIMAL]),
            visual: NumberProperty.build({ current: 6 }),
            position: PointProperty.build(),
            size: NumberProperty.build(),
            metabolizeSpeed: NumberProperty.build(),
            direction: DirectionProperty.build(),
            sight: DirectionSightProperty.build({ range: [5, 2] }),
            movement: DirectionMovementProperty.build(),
            collision: CollisionProperty.build({
                handler: (options: CollisionOptions) => {
                    this.handleCollision(options);
                },
            }),
            energy: NumberProperty.build({
                min: 0,
                max: 100,
                defaultValue: 100,
            }),
            taste: NumberProperty.build({ current: 0 }),
            brain: DirectionBrainProperty.build({ handler: () => BrainCommandsOther.STAND }),
        };
    }

    private handleMovement = (to: DirectionMovementValue) => {
        let spendEnergy = 0;
        switch (to) {
            case DirectionMovementValue.FORWARD:
                spendEnergy = 5;
                break;
            case DirectionMovementValue.BACK:
                spendEnergy = 5;
                break;
        }
        this.addEnergy(-spendEnergy, 0);
    };

    // TODO move to separate property
    private handleCollision({ other, world }: CollisionOptions): void {
        const holes = other.filter((entity) => {
            if (isTaggableGuard(entity)) {
                return entity.tags.current.includes(InstanceTypes.HOLE);
            }
            return false;
        }) as Hole[];
        if (holes.length > 0) {
            world.removeEntity(this);
        }
        const grass = other.filter((entity) => {
            if (isTaggableGuard(entity)) {
                return entity.tags.current.includes(InstanceTypes.GRASS);
            }
            return false;
        }) as Grass[];
        if (grass.length > 0) {
            this.taste = 1;
            this.addEnergy(10);
        }
        const totalScore = grass.reduce((acc, entity) => acc + entity.component.size.current, 0);
        this.component.size.current += totalScore;
        world.removeEntity(...grass);
    }

    public tick(world: World<Components>, time: number): void {
        super.tick(world, time);
        this.taste = 0;
        this.score += 1;
        this.component.size.current -= this.component.metabolizeSpeed.current;
        if (this.component.size.current < 0) {
            world.removeEntity(this);
        }
        this.component.movement.active = this.component.energy.current > 10;
        this.addEnergy(1);
    }

    private addEnergy(energy: number, onFailed?: number) {
        try {
            this.component.energy.current += energy;
        } catch (e) {
            if (onFailed) {
                this.component.energy.current = onFailed;
            }
        }
    }

    onDestroy(world: World<Components>): void {
        world.savedEntityList.add(this);
        this.component.movement.publisher.unsubscribe(this.handleMovement);
        super.onDestroy(world);
    }
}
