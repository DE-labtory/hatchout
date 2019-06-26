import {Contract} from 'web3-eth-contract';

export class Contracts {
    contractName: string;
    blockNum: number;
    contract: Contract;

    constructor(contractName, blockNum, contract) {
        this.contractName = contractName;
        this.blockNum = blockNum;
        this.contract = contract;
    }
}
