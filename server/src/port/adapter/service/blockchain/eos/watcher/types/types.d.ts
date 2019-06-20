export interface State {
    trx_id: string;
    indexState: {
        blockNumber: number;
        blockHash: string;
        isReplay: boolean;
        handlerVersionName: string;
    };
}
export interface CreateEggState extends State {
    gene: string;
    owner: string;
}
export interface SendState extends State {
    from: string;
    to: string;
    gene: string;
}
export interface LevelUpState extends State {
    owner: string;
    gene: string;
    level: number;
}
export interface AuctionState extends State {
    auctioneer: string;
    gene: string;
    minPrice: number;
    deadline: number;
}
export interface BidState extends State {
    bidder: string;
    gene: string;
    bid: number;
}
export interface ClaimState extends State {
    requester: string;
    gene: string;
}
export interface NodeosActionReaderOptions extends ActionReaderOptions {
    nodeosEndpoint?: string;
}
export interface ActionReaderOptions {
    startAtBlock?: number;
    onlyIrreversible?: boolean;
}
