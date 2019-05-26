export class SignUpPayload {

    data: {
        address: string,
        message: string,
    };
    signature: string;

    constructor(data: {address: string, message: string}, signature: string) {
        this.data = data;
        this.signature = signature;
    }
}
