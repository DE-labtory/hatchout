import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

    // constructor(address: string) {
    //     this.address = address;
    // }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 25 })
    address: string;
}
