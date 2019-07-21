import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Auction {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    gene: string;

    @Column({unique: true})
    tokenId: number;

    @Column()
    sellerId: string;

    @Column()
    duration: number;

    @Column({nullable: true})
    winnerId: string;

    @Column({nullable: true})
    bidAmount: number;

    @Column()
    isEnd: boolean;

    // 0: ongoing auction.
    // 1: cancelled auction.
    // 2: finished auction.
    @Column()
    endType: number;

    // 0: sale auction.
    // 1: special auction.
    @Column()
    auctionType: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    constructor(gene: string, tokenId: number, sellerId: string, duration: number, auctionType: number, winnderId?: string, bidAmount?: number) {
        this.gene = gene;
        this.tokenId = tokenId;
        this.sellerId = sellerId;
        this.duration = duration;
        this.auctionType = auctionType;
        this.isEnd = false;
        this.endType = AuctionEndType.ONGOING;
        this.winnerId = winnderId;
        this.bidAmount = bidAmount;
    }

    public setWinnerId(winnerId: string) {
        this.winnerId = winnerId;
    }

    public setBidAmount(bidAmount: number) {
        this.bidAmount = bidAmount;
    }

    public finish() {
        this.endType = AuctionEndType.SUCCESS;
        this.isEnd = true;
    }

    public cancel() {
        this.endType = AuctionEndType.CANCEL;
        this.isEnd = true;
    }
}

export enum AuctionType {
    SALE_AUCTION = 0,
    SPECIAL_AUCTION = 1,
}

export enum AuctionEndType {
    ONGOING = 0,
    CANCEL = 1,
    SUCCESS = 2,
}
