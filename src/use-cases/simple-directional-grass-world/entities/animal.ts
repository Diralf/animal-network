import { ComponentsOwner, ComponentsOptions } from '../../../domain/components/components-owner/components-owner';
import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { CollisionProperty } from '../../../domain/property/collision/collision-property';
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
    public position: PointProperty;
    public size: NumberProperty = new NumberProperty();
    public metabolizeSpeed: number;
    public direction: DirectionProperty;
    public sight: DirectionSightProperty;
    public movement: DirectionMovementProperty = this.createComponent({ owner: this, class: DirectionMovementProperty });
    public collision: CollisionProperty = this.createComponent({ owner: this, class: CollisionProperty, options: (options: CollisionOptions) => {
        this.handleCollision(options);
    }});
    public score = 0;
    public fitness = 0;
    public taste = 0;
    public energy: NumberProperty = new NumberProperty({ min: 0, max: 100, defaultValue: 100 });

    constructor(
        { position, sightRange = [5, 2], size = 10, metabolizeSpeed = 1 }: AnimalOptions,
        options?: Partial<Omit<ComponentsOptions<Animal>, 'collision'>>,
    ) {
        super();
        this.sight = this.createComponent({ owner: this, class: DirectionSightProperty, options: options?.sight ?? { range: [5, 2] } });
        this.direction = this.createComponent({ owner: this, class: DirectionProperty, options: options?.direction });

        this.position = new PointProperty(position);
        this.size.current = size;
        this.metabolizeSpeed = metabolizeSpeed;

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
        this.size.current -= this.metabolizeSpeed;
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
    }
}
