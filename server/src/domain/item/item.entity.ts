import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    readonly id: number;
    @Column({unique: true})
    readonly name: string;
    @Column('int')
    private price: number;
    @Column()
    private detail: string;

    constructor(name: string, price: number, detail?: string);
    constructor(name: string, price: number, detail: string) {
        this.name = name;
        this.price = price;
        this.detail = detail;
    }

    public setPrice(price: number) {
        this.price = price;
    }
    public setDetail(detail: string) {
        this.detail = detail;
    }

    public getPrice(): number {
        return this.price;
    }
    public getDetail(): string {
        return this.detail;
    }
}
