import { World } from '../world/world';

export interface OnTick {
    tick(world: World, time: number): void;
}

export const isOnTickGuard = (value: unknown): value is OnTick => value !== null && typeof value === 'object' && 'tick' in value;
