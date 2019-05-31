export class AuctionDto {
    readonly gene: string;
    readonly seller: string;
    readonly duration: number;
    readonly type: number;
    readonly winner: string;
    readonly bidAmount: number;

    constructor(gene?: string, seller?: string, duration?: number, type?: number, winner?: string, bidAmount?: number) {
        this.gene = gene;
        this.seller = seller;
        this.duration = duration;
        this.type = type;
        this.winner = winner;
        this.bidAmount = bidAmount;
    }
}
