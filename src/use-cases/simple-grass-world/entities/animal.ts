import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { CollisionProperty } from '../../../domain/property/collision/collision-property';
import { NumberProperty } from '../../../domain/property/number/number-property';
import { PointProperty } from '../../../domain/property/point/point-property';
import { Positionable } from '../../../domain/property/point/positionable';
import { RawPoint } from '../../../domain/property/point/raw-point';
import { Sightable } from '../../../domain/property/sight/sightable';
import { Visualable } from '../../../domain/property/sight/visualable';
import { OnTick } from '../../../domain/time-thread/on-tick';
import { World } from '../../../domain/world/world';
import { isTaggableGuard } from '../types/is-taggable-guard';
import { Taggable } from '../types/taggable';
import { Grass } from './grass';
import { InstanceTypes } from './instance-types';
import { SightProperty } from '../../../domain/property/sight/sight-property';
import { MovementProperty } from '../../../domain/property/movement/movement-property';

export class Animal implements Positionable, Taggable, Sightable, Visualable, OnTick {
    public readonly tags = [InstanceTypes.ANIMAL];
    public readonly visual = 2;
    public position: PointProperty;
    public size: NumberProperty = new NumberProperty({ current: 1 });
    public sight: SightProperty;
    public movement: MovementProperty;
    public collision: CollisionProperty;

    constructor({ position }: { position: RawPoint }) {
        this.position = new PointProperty(position);
        this.collision = new CollisionProperty((options) => {
            this.handleCollision(options);
        });
        this.sight = new SightProperty({
            range: 2,
        });
        this.movement = new MovementProperty();

        this.collision.owner.ref = this;
        this.sight.owner.ref = this;
        this.movement.owner.ref = this;
    }

    // TODO move to separate property
    private handleCollision({ other, list }: CollisionOptions): void {
        const grass = other.filter((entity) => {
            if (isTaggableGuard(entity)) {
                return entity.tags.includes(InstanceTypes.GRASS);
            }
            return false;
        }) as Grass[];
        const totalScore = grass.reduce((acc, entity) => acc + entity.size.current, 0);
        this.size.current += totalScore;
        list.remove(...grass);
    }

    public tick(world: World<Animal>, time: number): void {
        this.sight.tick(world);
        this.collision.tick(world);
    }
}
