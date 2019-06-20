import * as State from '../../../types/types';
import { BlockInfo } from 'demux';

const account = process.env.CONTRACT;

const parseTokenString = (
    tokenString: string,
): { amount: number; symbol: string } => {
    const [amountString, symbol] = tokenString.split(' ');
    const amount = parseFloat(amountString);
    return { amount, symbol };
};

const updateCreateEggData = (
    state: State.CreateEggState,
    payload: any,
    blockInfo: BlockInfo,
    context: any,
): void => {
    state.gene = payload.data.gene;
    state.owner = payload.data.owner;
    state.trx_id = payload.transactionId;
    state.indexState.blockNumber = blockInfo.blockNumber;
    state.indexState.blockHash = blockInfo.blockHash;

    // database save

    context.stateCopy = JSON.parse(JSON.stringify(state));
};

const updateSendData = (
    state: State.SendState,
    payload: any,
    blockInfo: BlockInfo,
    context: any,
): void => {
    state.from = payload.data.from;
    state.to = payload.data.to;
    state.gene = payload.data.gene;
    state.trx_id = payload.transactionId;
    state.indexState.blockNumber = blockInfo.blockNumber;
    state.indexState.blockHash = blockInfo.blockHash;

    // database save

    context.stateCopy = JSON.parse(JSON.stringify(state));
};

const updateLevelUpData = (
    state: State.LevelUpState,
    payload: any,
    blockInfo: BlockInfo,
    context: any,
): void => {
    state.owner = payload.data.owner;
    state.gene = payload.data.gene;
    state.level = payload.data.level;
    state.trx_id = payload.transactionId;
    state.indexState.blockNumber = blockInfo.blockNumber;
    state.indexState.blockHash = blockInfo.blockHash;

    // database save

    context.stateCopy = JSON.parse(JSON.stringify(state));
};

const updateAuctionData = (
    state: State.AuctionState,
    payload: any,
    blockInfo: BlockInfo,
    context: any,
): void => {
    const { amount, symbol } = parseTokenString(payload.data.min_price);
    state.auctioneer = payload.data.auctioneer;
    state.gene = payload.data.gene;
    state.minPrice = amount;
    state.deadline = payload.data.sec + (Date.now() / 1000);
    state.trx_id = payload.transactionId;
    state.indexState.blockNumber = blockInfo.blockNumber;
    state.indexState.blockHash = blockInfo.blockHash;

    // database save

    context.stateCopy = JSON.parse(JSON.stringify(state));
};

const updateBidData = (
    state: State.BidState,
    payload: any,
    blockInfo: BlockInfo,
    context: any,
): void => {
    const { amount, symbol } = parseTokenString(payload.data.bid);
    state.bidder = payload.data.bidder;
    state.gene = payload.data.gene;
    state.bid = amount;
    state.trx_id = payload.transactionId;
    state.indexState.blockNumber = blockInfo.blockNumber;
    state.indexState.blockHash = blockInfo.blockHash;

    // database save

    context.stateCopy = JSON.parse(JSON.stringify(state));
};

const updateClaimData = (
    state: State.ClaimState,
    payload: any,
    blockInfo: BlockInfo,
    context: any,
): void => {
    state.requester = payload.data.requester;
    state.gene = payload.data.gene;
    state.trx_id = payload.transactionId;
    state.indexState.blockNumber = blockInfo.blockNumber;
    state.indexState.blockHash = blockInfo.blockHash;

    // database save

    context.stateCopy = JSON.parse(JSON.stringify(state));
};

const updaters = [
    {
        actionType: `${account}::createegg`,
        apply: updateCreateEggData,
    },
    {
        actionType: `${account}::send`,
        apply: updateSendData,
    },
    {
        actionType: `${account}::levelup`,
        apply: updateLevelUpData,
    },
    {
        actionType: `${account}::auction`,
        apply: updateAuctionData,
    },
    {
        actionType: `${account}::bid`,
        apply: updateBidData,
    },
    {
        actionType: `${account}::claim`,
        apply: updateClaimData,
    },
];

const logUpdate = (payload: any, blockInfo: BlockInfo, context: any): void => {
    // console.info(
    //     'State updated:\n',
    //     JSON.stringify(context.stateCopy, null, 2),
    // );
};

const effects = [
    {
        actionType: `${account}::createegg`,
        run: logUpdate,
    },
    {
        actionType: `${account}::send`,
        run: logUpdate,
    },
    {
        actionType: `${account}::levelup`,
        run: logUpdate,
    },
    {
        actionType: `${account}::auction`,
        run: logUpdate,
    },
    {
        actionType: `${account}::bid`,
        run: logUpdate,
    },
    {
        actionType: `${account}::claim`,
        run: logUpdate,
    },
];

const handlerVersion = {
    versionName: 'v1',
    updaters,
    effects,
};

export default handlerVersion;
