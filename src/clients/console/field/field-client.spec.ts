import {FieldClient} from "./field-client";
import {FieldBuilder} from "../utils/field-builder";

describe('FieldClient', () => {

    it('should have draw field to string with default empty cell', () => {
        const fieldClient = new FieldClient({
            width: 5,
            height: 3,
        });
        const result = fieldClient.toStringField();

        expect(result).toEqual('     \n     \n     ');
        expect(result).toEqual(new FieldBuilder()
            .row('     ')
            .row('     ')
            .row('     ')
            .join());
    });

    it('should have draw field to string with defined empty cell', () => {
        const fieldClient = new FieldClient({
            width: 5,
            height: 3,
            emptyCell: '0'
        });
        const result = fieldClient.toStringField();

        expect(result).toEqual('00000\n00000\n00000');
        expect(result).toEqual(new FieldBuilder()
            .row('00000')
            .row('00000')
            .row('00000')
            .join());
    });
});
