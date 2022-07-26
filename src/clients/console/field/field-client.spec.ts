import {FieldClient} from "./field-client";

describe('FieldClient', () => {

    class Builder {
        rows: string[] = [];

        row(row: string): Builder {
            this.rows.push(row);
            return this;
        }

        join(): string {
            return this.rows.join('\n');
        }
    }

    it('should have draw field to string with default empty cell', () => {
        const fieldClient = new FieldClient({
            width: 5,
            height: 3,
        });
        const result = fieldClient.toStringField();

        expect(result).toEqual('     \n     \n     ');
        expect(result).toEqual(new Builder()
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
        expect(result).toEqual(new Builder()
            .row('00000')
            .row('00000')
            .row('00000')
            .join());
    });
});
