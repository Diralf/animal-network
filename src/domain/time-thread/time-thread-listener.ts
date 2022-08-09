import { World } from '../world/world';

export interface TimeThreadListener {
    tick(world: World): void;
}

export const isTimeThreadListener = (value: unknown): value is TimeThreadListener => value !== null && typeof value === 'object' && 'tick' in value;
