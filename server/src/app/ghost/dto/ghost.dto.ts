export class GhostDto {
    readonly owner: string;
    readonly gene: string;

    constructor(owner?: string, gene?: string) {
        this.owner = owner;
        this.gene = gene;
    }
}
