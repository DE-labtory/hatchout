export class UserDto {
    address: string;
    name: string;
    point: number;
    level: number;

    constructor(address?: string, name?: string, point?: number, level?: number);
    constructor(address?: string, name?: string, point?: number, level?: number) {
        this.address = address;
        this.name = name;
        this.point = point;
        this.level = level;
    }
}
