export class SignUpRequestDto {
  name: string;
  address: string;
  message: string;
  signature: string;

  constructor(name: string, address: string, message: string, signature: string) {
    this.name = name;
    this.address = address;
    this.message = message;
    this.signature = signature;
  }
}
