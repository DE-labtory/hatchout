import {Column, PrimaryGeneratedColumn} from 'typeorm';

export class UserDto {

    @Column({ length: 25 })
    address: string;
}
