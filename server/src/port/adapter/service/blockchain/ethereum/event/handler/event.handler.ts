import {EventData} from 'web3-eth-contract';
import {Inject} from '@nestjs/common';
import Web3 from 'web3';
import {ContractFactory} from '../../web3/contract/contract.factory';
import {Contracts} from '../../web3/contract/contracts';

export class EventHandler {
    constructor(@Inject('WEB3') private web3: Web3, private contracts: ContractFactory) {
        this.contractList = contracts.getContracts();
    }

    contractList: Contracts[];

    getContractList(): Contracts[] {
        return this.contractList;
    }

    async getBlockNum(): Promise<number> {
        return await this.web3.eth.getBlockNumber();
    }

    async parseData(datas: EventData[]): Promise<void> {
        let parsedData: { [key: string]: any; };

        for (const data of datas) {
            const hexData = data.raw.data;
            switch (data.event) {
                case 'AuctionCreated':
                    parsedData = await this.web3.eth.abi.decodeParameters([{
                        type: 'uint256',
                        name: 'gene',
                    }, {
                        type: 'uint256',
                        name: 'duration',
                    }, {
                        type: 'uint256',
                        name: 'auctionType',
                    }], hexData);
                    // auctionCreated
                    // createAuction(parsedData.gene, parsedData.duration, parsedData.auctionType);
                    break;
                case 'AuctionSuccessful':
                    parsedData = await this.web3.eth.abi.decodeParameters([{
                        type: 'uint256',
                        name: 'gene',
                    }, {
                        type: 'uint256',
                        name: 'maxPrice',
                    }, {
                        type: 'address',
                        name: 'winner',
                    }], hexData);
                    // auctionSuccessed
                    // updateWinner(parsedData.gene, parsedData.winner, parsedData.maxPrice);
                    break;
                case 'AuctionCancelled':
                    parsedData = await this.web3.eth.abi.decodeParameters([{
                        type: 'uint256',
                        name: 'gene',
                    }], hexData);
                    // auctionCancelled
                    // cancelAuction(parsedData.gene);
                    break;
                case 'Birth':
                    parsedData = await this.web3.eth.abi.decodeParameters([{
                        type: 'address',
                        name: 'owner',
                    }, {
                        type: 'uint256',
                        name: 'tokenId',
                    }, {
                        type: 'uint256',
                        name: 'gene',
                    }], hexData);
                    // 알 생성
                    // createEgg(parsedData.owner, parsedData.gene);
                    break;
                case 'LevelUp':
                    parsedData = await this.web3.eth.abi.decodeParameters([{
                        type: 'address',
                        name: 'owner',
                    }, {
                        type: 'uint256',
                        name: 'gene',
                    }, {
                        type: 'uint256',
                        name: 'level',
                    }], hexData);
                    // level up
                    // levelUp(parsedData.owner, parsedData.gene, parsedData.level);
                    break;
                case 'Transfer':
                    parsedData = await this.web3.eth.abi.decodeParameters([{
                        type: 'address',
                        name: 'from',
                    }, {
                        type: 'address',
                        name: 'to',
                    }, {
                        type: 'uint256',
                        name: 'gene',
                    }], hexData);
                    // transfer
                    // transfer(parsedData.from, parsedData.to, parsedData.gene);
                    break;
                case 'Approval':
                    parsedData = await this.web3.eth.abi.decodeParameters([{
                        type: 'address',
                        name: 'from',
                    }, {
                        type: 'address',
                        name: 'to',
                    }, {
                        type: 'uint256',
                        name: 'tokenId',
                    }], hexData);
                    // approval
                    // ?
                    break;
            }
        }
    }
}
