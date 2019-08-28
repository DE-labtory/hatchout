export class AuctionDto {
    readonly gene: string;
    readonly tokenId: number;
    readonly seller: string;
    readonly duration: number;
    readonly type: number;
    readonly winner: string;
    readonly bidAmount: number;

    constructor(gene?: string, tokenId?: number, seller?: string, duration?: number, type?: number, winner?: string, bidAmount?: number) {
        this.gene = gene;
        this.tokenId = tokenId;
        this.seller = seller;
        this.duration = duration;
        this.type = type;
        this.winner = winner;
        this.bidAmount = bidAmount;
    }
}
