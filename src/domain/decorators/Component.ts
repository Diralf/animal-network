export function Component() {
    return (target: any, propertyKey: string) => {
        target.__components = [...(target.__components ?? []), propertyKey];
    };
}
