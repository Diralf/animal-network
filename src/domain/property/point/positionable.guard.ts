import { Positionable } from './positionable';

export const positionableGuard = (entity: any): entity is Positionable => 'position' in entity;
