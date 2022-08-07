import { FieldBuilder } from './field-builder';

describe('FieldBuilder', () => {
    it('should build field ready to console', () => {
        const builtField = new FieldBuilder()
            .row('-----')
            .row('-----')
            .row('-----')
            .join();

        expect(builtField).toEqual('-----\n-----\n-----');
    });

    it('should build field ready to console from template string', () => {
        const builtField = FieldBuilder.build(`
            -----
            -----
            -----
        `);

        expect(builtField).toEqual('-----\n-----\n-----');
    });
});
