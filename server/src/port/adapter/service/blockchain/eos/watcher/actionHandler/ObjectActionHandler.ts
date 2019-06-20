import {
    AbstractActionHandler,
    IndexState,
    Block,
    NextBlock,
    VersionedAction
} from "demux";
import { State } from "../types/types";

export class ObjectActionHandler extends AbstractActionHandler {
    constructor([handleVersion]: any, stopAt: number) {
        super([handleVersion]);
        this.stopAt = stopAt;
        this.state = {
            trx_id: "",
            indexState: {
                blockNumber: 0,
                blockHash: "",
                isReplay: false,
                handlerVersionName: "v1"
            }
        }
    }
    public stopService = (blockNumber: number) => {
        // Function stop the service when meet the stopAt block number
        if (blockNumber >= this.stopAt) {
            // console.log('\n####################\n# STOP AT: ', blockNumber);
            // console.log('####################\n');
            process.exit(1);
        }
    };

    private state: State;
    private hashHistory: { [key: number]: string } = { 0: "" };
    private stopAt: number;

    get _handlerVersionName() {
        return this.handlerVersionName;
    }

    // tslint:disable-next-line
    public async handleWithState(handle: (state: any) => void) {
        try {
            await handle(this.state);
        } catch (err) {
            throw new Error("handle state err");
        }
    }

    public async rollbackTo(blockNumber: number) {
        this.setLastProcessedBlockNumber(blockNumber);
        this.setLastProcessedBlockHash(this.hashHistory[blockNumber]);
        this.state.indexState = {
            ...this.state.indexState,
            blockNumber,
            blockHash: this.hashHistory[blockNumber]
        };
    }

    public setLastProcessedBlockHash(hash: string) {
        this.lastProcessedBlockHash = hash;
    }

    public setLastProcessedBlockNumber(num: number) {
        this.lastProcessedBlockNumber = num;
    }

    public async _applyUpdaters(
        state: any,
        block: Block,
        context: any,
        isReplay: boolean
    ): Promise<VersionedAction[]> {
        return this.applyUpdaters(state, block, context, isReplay);
    }

    public _runEffects(
        versionedActions: VersionedAction[],
        context: any,
        nextBlock: NextBlock
    ) {
        this.runEffects(versionedActions, context, nextBlock);
    }

    protected async loadIndexState(): Promise<IndexState> {
        return this.state.indexState;
    }

    public async handleBlock(
        nextBlock: NextBlock,
        isReplay: boolean
    ): Promise<number | null> {
        const { blockNumber, blockHash } = nextBlock.block.blockInfo;
        this.hashHistory[blockNumber] = blockHash;
        return super.handleBlock(nextBlock, isReplay);
    }

    protected async updateIndexState(
        state: any,
        block: Block,
        isReplay: boolean,
        handlerVersionName: string
    ) {
        // console.log("Processing block: ", block.blockInfo.blockNumber);
        const { blockNumber, blockHash } = block.blockInfo;

        state.indexState = {
            blockNumber,
            blockHash,
            isReplay,
            handlerVersionName
        };
        if (this.stopAt) {
            this.stopService(blockNumber);
        }
    }

    protected async setup(): Promise<void> {}
}
