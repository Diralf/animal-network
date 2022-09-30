import { Entity } from '../../../domain/components/components-owner/components-owner';
import { Taggable } from './taggable';

export const isTaggableGuard = (entity: Entity<any>): entity is Entity<Taggable> => 'tags' in entity.component;
