import {EntityList} from "../../domain/entity-list/entity-list";
import {Food} from "../../domain/entity/instances/food/food";
import {Animal} from "../../domain/entity/instances/animal/animal";

export class SimpleGrassWorld {
    entityList: EntityList = new EntityList();

    start() {
        this.entityList.addEntity(
            new Food(),
            new Food(),
            new Food(),
            new Food(),
            new Food(),
            new Animal(),
        );
    };
}
