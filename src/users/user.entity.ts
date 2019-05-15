import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

    constructor();
    constructor(address: string);

    constructor(address?: string) {
        if (typeof address === 'undefined' || address === null) {
            this.address = undefined;
        } else if (typeof address === 'string') {
            this.address = address;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 25 })
    address: string;

    setAddress(address:string) {
        this.address = address;

    }
}
