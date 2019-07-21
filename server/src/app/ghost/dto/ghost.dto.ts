export class GhostDto {
    readonly owner: string;
    readonly gene: string;
    readonly tokenId: number;

    constructor(owner?: string, gene?: string, tokenId?: number) {
        this.owner = owner;
        this.gene = gene;
        this.tokenId = tokenId;
    }
}
