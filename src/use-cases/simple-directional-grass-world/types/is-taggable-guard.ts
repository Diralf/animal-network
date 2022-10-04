import { EntityType } from '../../../domain/components/component/component';
import { Taggable } from './taggable';

export const isTaggableGuard = (entity: EntityType<any>): entity is EntityType<Taggable> => 'tags' in entity.component;
