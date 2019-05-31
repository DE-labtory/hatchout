export class ItemDto {
    readonly name: string;
    readonly price: number;
    readonly detail: string;

    constructor(name?: string, price?: number, detail?: string) {
        this.name = name;
        this.price = price;
        this.detail = detail;
    }
}
