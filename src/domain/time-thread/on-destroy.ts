import { World } from '../world/world';

export interface OnDestroy {
    onDestroy(world: World): void;
}
