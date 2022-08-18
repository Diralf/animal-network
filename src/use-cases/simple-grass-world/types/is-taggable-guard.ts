import { Taggable } from './taggable';

export const isTaggableGuard = (entity: any): entity is Taggable => 'tags' in entity;
