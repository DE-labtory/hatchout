import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn} from 'typeorm';
import {Max, Min, validate} from 'class-validator';
import {MAX_LEVEL} from './level';
import {MIN_POINT} from './point';

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
        this.point += amount;
        return this;
    }
    public async decreasePoint(amount: number): Promise<User> {
        if (this.canDecreasePoint(amount).length !== 0) {
            throw new Error('can not decrease point with the amount');
        }
        this.point -= amount;
        return this;
    }
    public canDecreasePoint(amount: number) {
        let errors: Error[];
        errors = [];
        if (this.point - amount < MIN_POINT) {
            errors.push(new Error('point can not be less than MIN_POINT'));
        }
        return errors;
    }
    public async increaseLevel(amount: number): Promise<User> {
        if (this.canIncreaseLevel(amount).length !== 0) {
            throw new Error('can not increase level with the amount');
        }

        this.level += amount;
        return this;
    }
    public canIncreaseLevel(amount: number): Error[] {
        let errors: Error[];
        errors = [];
        if (MAX_LEVEL < this.level + amount) {
            errors.push(new Error('level can not exceed MAX_LEVEL'));
        }

        return errors;
    }
}
