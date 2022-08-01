import {PropertyContainerList} from "../../domain/property-container-list/property-container-list";
import {BaseProperties} from "./entities/base-properties";
import {Grass} from "./entities/grass";
import {Animal} from "./entities/animal";

export class SimpleGrassWorld {
    entityList: PropertyContainerList<BaseProperties> = new PropertyContainerList();

    start() {
        const grassList = new Array(5).fill(0)
            .map((zero, index) => new Grass({ position: { x: 0, y: index}}));

        const entities = [
            ...grassList,
            new Animal({ position: { x: 0, y: 5 }}),
        ];

        this.entityList.add(...entities);
    };
}
