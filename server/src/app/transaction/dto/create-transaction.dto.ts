export class CreateTransactionDto {
    readonly blockHash: string;
    readonly blockNumber: number;
    readonly txHash: string;
    readonly txIndex: number;
    readonly from: string;
    readonly to: string;
    readonly contractAddress: string;
    readonly status: string;

    constructor(
        blockHash?: string,
        blockNumber?: number,
        txHash?: string,
        txIndex?: number,
        from?: string,
        to?: string,
        contractAddress?: string,
        status?: string,
    ) {
        this.blockHash = blockHash;
        this.blockNumber = blockNumber;
        this.txHash = txHash;
        this.txIndex = txIndex;
        this.from = from;
        this.to = to;
        this.contractAddress = contractAddress;
        this.status = status;
    }
}
