export interface ValidationService {
    verify(data: {address: string, message: string}, signature: string): boolean;
}
