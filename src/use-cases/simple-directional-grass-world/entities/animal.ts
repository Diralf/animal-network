import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { Component } from '../../../domain/components/component/component';
import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { World } from '../../../domain/world/world';
import { componentBuilder, Owner } from '../components/component-builder';
import { isTaggableGuard } from '../types/is-taggable-guard';
import { Grass } from './grass';
import { InstanceTypes } from '../types/instance-types';
import { Hole } from './hole';

class AnimalCollisionComponent extends Component<AnimalCollisionComponent, void, Owner<'collision' | 'taste' | 'size' | 'energy' | 'position'>>() {
    onInit() {
        super.onInit();
        this.owner.component.collision.publisher.subscribe(({ other, world }: CollisionOptions): void => {
            const holes = other.filter((entity) => {
                if (isTaggableGuard(entity)) {
                    return entity.component.tags.current.includes(InstanceTypes.HOLE);
                }
                return false;
            }) as Hole[];
            if (holes.length > 0) {
                world.removeEntity(this.owner);
            }
            const grass = other.filter((entity) => {
                if (isTaggableGuard(entity)) {
                    return entity.component.tags.current.includes(InstanceTypes.GRASS);
                }
                return false;
            }) as Grass[];
            if (grass.length > 0) {
                this.owner.component.taste.current = 1;
                try {
                    this.owner.component.energy.current += 10;
                } catch {}
            }
            const totalScore = grass.reduce((acc, entity) => acc + entity.component.size.current, 0);
            this.owner.component.size.current += totalScore;
            world.removeEntity(...grass);
        })
    }
}

class AnimalMovementComponent extends Component<AnimalMovementComponent, void, Owner<'movement' | 'energy'>>() {
    onInit() {
        super.onInit();
        this.owner.component.movement.publisher.subscribe(this.handleMovement);
    }

    handleMovement = (to: DirectionMovementValue) => {
        let spendEnergy = 0;
        switch (to) {
            case DirectionMovementValue.FORWARD:
                spendEnergy = 5;
                break;
            case DirectionMovementValue.BACK:
                spendEnergy = 5;
                break;
        }
        try {
            this.owner.component.energy.current -= spendEnergy;
        } catch {
            this.owner.component.energy.current = 0;
        }
    }

    public onDestroy(world: World): void {
        this.owner.component.movement.publisher.unsubscribe(this.handleMovement);
        super.onDestroy(world);
    }
}

class AnimalCommonComponent extends Component<AnimalCommonComponent, void, Owner<'taste' | 'size' | 'metabolizeSpeed' | 'movement' | 'energy'>>() {
    public tick(world: World, time: number): void {
        super.tick(world, time);
        this.owner.component.taste.current = 0;
        this.owner.component.size.current -= this.owner.component.metabolizeSpeed.current;
        if (this.owner.component.size.current < 0) {
            world.removeEntity(this.owner);
        }
        this.owner.component.movement.active = this.owner.component.energy.current > 10;
        try {
            this.owner.component.energy.current += 1;
        } catch {}
    }
}

export const Animal = entityBuilder({
    animalCommon: AnimalCommonComponent.build(),
    animalMovement: AnimalMovementComponent.build(),
    animalCollision: AnimalCollisionComponent.build(),
    ...componentBuilder()
        .tags([InstanceTypes.ANIMAL])
        .collision()
        .direction()
        .position()
        .energy({ min: 0, max: 100, defaultValue: 100 })
        .visual({ current: 6 })
        .taste({ current: 0 })
        .metabolizeSpeed({ current: 1 })
        .movement()
        .brain({})
        .size({ current: 10 })
        .sight({ range: [5, 2] })

        .build(),
});

export type Animal = ReturnType<typeof Animal.build>;
