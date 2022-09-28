import {
    ComponentsOwner,
    ExternalComponentsProps,
} from '../../../domain/components/components-owner/components-owner';
import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { CollisionProperty } from '../../../domain/property/collision/collision-property';
import { DirectionBrainProperty } from '../../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementProperty, DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../../../domain/property/direction-sight/direction-sight-property';
import { DirectionSightable } from '../../../domain/property/direction-sight/direction-sightable';
import { DirectionProperty } from '../../../domain/property/direction/direction-property';
import { Directional } from '../../../domain/property/direction/directional';
import { NumberProperty } from '../../../domain/property/number/number-property';
import { PointProperty } from '../../../domain/property/point/point-property';
import { Positionable } from '../../../domain/property/point/positionable';
import { RawPoint } from '../../../domain/property/point/raw-point';
import { Visualable } from '../../../domain/property/sight/visualable';
import { OnDestroy } from '../../../domain/time-thread/on-destroy';
import { OnTick } from '../../../domain/time-thread/on-tick';
import { World } from '../../../domain/world/world';
import { isTaggableGuard } from '../types/is-taggable-guard';
import { Taggable } from '../types/taggable';
import { Grass } from './grass';
import { InstanceTypes } from '../types/instance-types';
import { Hole } from './hole';

export interface AnimalOptions {
    position: RawPoint;
    sightRange?: [number, number];
    size?: number;
    metabolizeSpeed?: number;
}

export class Animal extends ComponentsOwner<Animal> implements Positionable, Taggable, Directional, DirectionSightable, Visualable, OnTick, OnDestroy {
    public readonly tags = [InstanceTypes.ANIMAL];
    public readonly visual = 6;
    public position: PointProperty = this.createComponent({ owner: this, class: PointProperty, name: 'position' });
    public size: NumberProperty = this.createComponent({ owner: this, class: NumberProperty, name: 'size' });
    public metabolizeSpeed: NumberProperty = this.createComponent({ owner: this, class: NumberProperty, name: 'metabolizeSpeed' });
    public direction: DirectionProperty = this.createComponent({ owner: this, class: DirectionProperty, name: 'direction' });
    public sight: DirectionSightProperty = this.createComponent({ owner: this, class: DirectionSightProperty, props: { range: [5, 2] }, name: 'sight' });
    public movement: DirectionMovementProperty = this.createComponent({ owner: this, class: DirectionMovementProperty });
    public collision: CollisionProperty = this.createComponent({ owner: this, class: CollisionProperty, name: 'collision', props: {
        handler: (options: CollisionOptions) => {
            this.handleCollision(options);
        },
    }});
    public score = 0;
    public fitness = 0;
    public taste = 0;
    public energy: NumberProperty = this.createComponent({ owner: this, class: NumberProperty, name: 'energy', props: {
        min: 0, max: 100, defaultValue: 100,
    }});
    public brain!: DirectionBrainProperty;

    constructor(options?: ExternalComponentsProps<Animal>) {
        super(options);

        this.movement.publisher.subscribe(this.handleMovement);
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
                return entity.tags.includes(InstanceTypes.HOLE);
            }
            return false;
        }) as Hole[];
        if (holes.length > 0) {
            world.removeEntity(this);
        }
        const grass = other.filter((entity) => {
            if (isTaggableGuard(entity)) {
                return entity.tags.includes(InstanceTypes.GRASS);
            }
            return false;
        }) as Grass[];
        if (grass.length > 0) {
            this.taste = 1;
            this.addEnergy(10);
        }
        const totalScore = grass.reduce((acc, entity) => acc + entity.size.current, 0);
        this.size.current += totalScore;
        world.removeEntity(...grass);
    }

    public tick(world: World<Animal>, time: number): void {
        super.tick(world, time);
        this.taste = 0;
        this.score += 1;
        this.size.current -= this.metabolizeSpeed.current;
        if (this.size.current < 0) {
            world.removeEntity(this);
        }
        this.movement.active = this.energy.current > 10;
        this.addEnergy(1);
    }

    private addEnergy(energy: number, onFailed?: number) {
        try {
            this.energy.current += energy;
        } catch (e) {
            if (onFailed) {
                this.energy.current = onFailed;
            }
        }
    }

    onDestroy(world: World<Animal>): void {
        world.savedEntityList.add(this);
        this.movement.publisher.unsubscribe(this.handleMovement);
        super.onDestroy(world);
    }
}
