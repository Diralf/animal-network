import {Food} from "./food";

describe('Food', () => {
    it('should be truthy', () => {
        const food = new Food();

        expect(food).toBeTruthy();
    });
});
