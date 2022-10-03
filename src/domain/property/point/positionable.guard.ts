import { Entity } from '../../components/entity-builder/entity-builder';
import { Positionable } from './positionable';

export const positionableGuard = (entity: any): entity is Entity<Positionable> => 'position' in entity.component;
