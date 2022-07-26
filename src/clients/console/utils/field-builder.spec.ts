import {FieldClient} from "../field/field-client";
import {FieldBuilder} from "./field-builder";

describe('FieldBuilder', () => {
    it('should build field ready to console', () => {
        const fieldClient = new FieldClient({
            width: 5,
            height: 3,
            emptyCell: '-',
        });
        const builtField = new FieldBuilder()
            .row('-----')
            .row('-----')
            .row('-----')
            .join();

        expect(builtField).toEqual(fieldClient.toStringField());
    });
});
