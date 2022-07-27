export class FieldBuilder {
    private rows: string[] = [];

    row(row: string): FieldBuilder {
        this.rows.push(row);
        return this;
    }

    join(): string {
        return this.rows.join('\n');
    }
}
