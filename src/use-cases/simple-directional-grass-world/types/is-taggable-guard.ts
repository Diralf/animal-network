import { Entity } from '../../../domain/components/entity-builder/entity-builder';
import { Taggable } from './taggable';

export const isTaggableGuard = (entity: Entity<any>): entity is Entity<Taggable> => 'tags' in entity.component;
