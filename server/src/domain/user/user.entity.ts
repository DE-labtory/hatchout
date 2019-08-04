import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn} from 'typeorm';
import {Max, Min} from 'class-validator';
import {MAX_LEVEL} from './level';
import {MIN_POINT} from './point';
import {ValidationException} from '../exception/ValidationException';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({unique: true})
    address: string;

    @Column({ length: 10, unique: true})
    name: string;

    @Column('int')
    @Min(MIN_POINT)
    point: number;

    @Column('int')
    @Max(MAX_LEVEL)
    level: number;

    constructor(address: string, name: string, point?: number, level?: number);
    constructor(address: string, name: string, point = 0, level = 0) {
        this.setAddress(address);
        this.setName(name);
        this.setPoint(point);
        this.setLevel(level);
    }
    private setAddress(address: string) {
        this.address = address;
    }
    private setName(name: string) {
        this.name = name;
    }
    private setPoint(point: number) {
        this.point = point;
    }
    private setLevel(level: number) {
        this.level = level;
    }
    public getAddress() {
        return this.address;
    }
    public getName() {
        return this.name;
    }
    public getPoint(): number {
        return this.point;
    }
    public getLevel(): number {
        return this.level;
    }
    public increasePoint(amount: number): User {
        if (amount < 0) {
          throw new ValidationException('amount should be positive');
        }

        this.point += amount;
        return this;
    }
    public decreasePoint(amount: number): User {
        if (amount < 0) {
            throw new ValidationException('amount should be positive');
        }
        if (this.point - amount < MIN_POINT) {
            throw new ValidationException('can not decrease point under MIN_POINT');
        }

        this.point -= amount;
        return this;
    }
    public increaseLevel(amount: number): User {
        if (amount < 0) {
            throw new ValidationException('amount should be positive');
        }
        if (MAX_LEVEL < this.level + amount) {
            throw new ValidationException('can not increase level over MAX_LEVEL');
        }

        this.level += amount;
        return this;
    }
}
