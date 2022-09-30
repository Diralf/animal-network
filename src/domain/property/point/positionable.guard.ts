import { Entity } from '../../components/components-owner/components-owner';
import { Positionable } from './positionable';

export const positionableGuard = (entity: any): entity is Entity<Positionable> => 'position' in entity.component;
