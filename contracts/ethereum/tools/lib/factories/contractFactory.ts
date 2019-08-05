import {GhostAuctionContract, GhostFactoryContract} from "../types";

export default class ContractFactory {
  private defaultPrivateKey!: string;
  private readonly endpoint!: string;

  constructor(privateKey: string, endpoint: string) {
    this.defaultPrivateKey = privateKey;
    this.endpoint = endpoint;
  }

  public createGhostContract(
    contractAddress: string,
    privateKey: string = this.defaultPrivateKey
  ): GhostFactoryContract {
    const {GhostFactory} = require('../../../contractApis/back')(
      {
        from: privateKey,
      },
      this.endpoint,
    );
    return new GhostFactory(contractAddress);
  }

  public createGhostAuction(
    contractAddress: string,
    privateKey: string = this.defaultPrivateKey
  ): GhostAuctionContract {
    const {GhostAuction} = require('../../../contractApis/back')(
      {
        from: privateKey,
      },
      this.endpoint,
    );
    return new GhostAuction(contractAddress);
  }
}