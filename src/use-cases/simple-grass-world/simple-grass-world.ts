import {EntityList} from "../../domain/entity-list/entity-list";
import {Food} from "../../domain/entity/instances/food/food";
import {Animal} from "../../domain/entity/instances/animal/animal";

export class SimpleGrassWorld {
    entityList: EntityList = new EntityList();

    start() {
        this.entityList.addEntity(
            new Food({position: {x: 0, y: 1}}),
            new Food({position: {x: 1, y: 1}}),
            new Food({position: {x: 1, y: 2}}),
            new Food({position: {x: 2, y: 2}}),
            new Food({position: {x: 2, y: 3}}),
            new Animal(),
        );
    };
}
