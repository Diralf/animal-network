export class FieldBuilder {
    private rows: string[] = [];

    public row(row: string): FieldBuilder {
        this.rows.push(row);
        return this;
    }

    public join(): string {
        return this.rows.join('\n');
    }

    public static build(field: string): string {
        return field
            .trim()
            .split('\n')
            .map((part) => part.trim())
            .join('\n');
    }
}
