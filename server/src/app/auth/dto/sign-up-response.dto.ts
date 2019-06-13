export class SignUpResponseDto {
    jwt: string;
    address: string;
    name: string;

    constructor(jwt: string, address: string, name: string) {
        this.jwt = jwt;
        this.address = address;
        this.name = name;
    }
}
