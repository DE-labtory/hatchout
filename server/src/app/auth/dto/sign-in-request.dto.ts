export class SignInRequestDto {
    address: string;
    message: string;
    signature: string;

    constructor(address: string, message: string, signature: string) {
        this.address = address;
        this.message = message;
        this.signature = signature;
    }
}
