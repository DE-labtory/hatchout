import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    readonly id: number;
    @Column()
    readonly blockHash: string;
    @Column('int')
    readonly blockNumber: number;
    @Column({unique: true})
    readonly txHash: string;
    @Column('int')
    readonly txIndex: number;
    @Column()
    readonly from: string;
    @Column()
    readonly to: string;
    @Column()
    readonly contractAddress: string;
    @Column()
    readonly status: string;

    constructor(
        blockHash: string,
        blockNumber: number,
        txHash: string,
        txIndex: number,
        from: string,
        to: string,
        contractAddress: string,
        status: string,
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
