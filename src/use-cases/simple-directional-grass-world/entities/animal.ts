import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { CollisionProperty } from '../../../domain/property/collision/collision-property';
import { DirectionMovementProperty } from '../../../domain/property/direction-movement/direction-movement-property';
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

export class Animal implements Positionable, Taggable, Directional, DirectionSightable, Visualable, OnTick, OnDestroy {
    public readonly tags = [InstanceTypes.ANIMAL];
    public readonly visual = 6;
    public position: PointProperty;
    public size: NumberProperty = new NumberProperty();
    public metabolizeSpeed;
    public direction: DirectionProperty;
    public sight: DirectionSightProperty;
    public movement: DirectionMovementProperty;
    public collision: CollisionProperty;
    public score = 0;
    public fitness = 0;

    constructor({ position, sightRange = [5, 2], size = 10, metabolizeSpeed = 1 }: AnimalOptions) {
        this.position = new PointProperty(position);
        this.size.current = size;
        this.metabolizeSpeed = metabolizeSpeed;
        this.collision = new CollisionProperty((options) => {
            this.handleCollision(options);
        });
        this.direction = new DirectionProperty();
        this.sight = new DirectionSightProperty({
            range: sightRange,
        });
        this.movement = new DirectionMovementProperty();

        this.collision.owner.ref = this;
        this.sight.owner.ref = this;
        this.movement.owner.ref = this;
    }

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
        const totalScore = grass.reduce((acc, entity) => acc + entity.size.current, 0);
        this.size.current += totalScore;
        world.removeEntity(...grass);
    }

    public tick(world: World<Animal>, time: number): void {
        this.score += 1;
        this.sight.tick(world);
        this.collision.tick(world);
        this.size.current -= this.metabolizeSpeed;
        if (this.size.current < 0) {
            world.removeEntity(this);
        }
    }

    onDestroy(world: World<Animal>): void {
        world.savedEntityList.add(this);
    }
}
