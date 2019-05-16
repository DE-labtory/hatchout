import {Column} from 'typeorm';

export class UserDto {

    @Column({ length: 25 })
    address: string;
}
