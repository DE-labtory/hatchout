export interface BridgeService {
    recover(message: string, signature: string): string;
}
