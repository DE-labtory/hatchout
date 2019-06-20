export interface CreateEggState {
    gene: string;
    owner: string;
    trx_id: string;
    indexState: {
        blockNumber: number;
        blockHash: string;
        isReplay: boolean;
        handlerVersionName: string;
    };
}
export interface SendState {
    from: string;
    to: string;
    gene: string;
    trx_id: string;
    indexState: {
        blockNumber: number;
        blockHash: string;
        isReplay: boolean;
        handlerVersionName: string;
    };
}
export interface LevelUpState {
    owner: string;
    gene: string;
    level: number;
    trx_id: string;
    indexState: {
        blockNumber: number;
        blockHash: string;
        isReplay: boolean;
        handlerVersionName: string;
    };
}
export interface AuctionState {
    auctioneer: string;
    gene: string;
    minPrice: number;
    deadline: number;
    trx_id: string;
    indexState: {
        blockNumber: number;
        blockHash: string;
        isReplay: boolean;
        handlerVersionName: string;
    };
}
export interface BidState {
    bidder: string;
    gene: string;
    bid: number;
    trx_id: string;
    indexState: {
        blockNumber: number;
        blockHash: string;
        isReplay: boolean;
        handlerVersionName: string;
    };
}
export interface ClaimState {
    requester: string;
    gene: string;
    trx_id: string;
    indexState: {
        blockNumber: number;
        blockHash: string;
        isReplay: boolean;
        handlerVersionName: string;
    };
}
export interface NodeosActionReaderOptions extends ActionReaderOptions {
    nodeosEndpoint?: string;
}
export interface ActionReaderOptions {
    startAtBlock?: number;
    onlyIrreversible?: boolean;
}
