export interface ValidationService {
    verify(address: string, message: string, signature: string): boolean;
}
