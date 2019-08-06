import {HatchOutContract} from "../types";

export default class ContractFactory {
  private defaultPrivateKey!: string;
  private readonly endpoint!: string;

  constructor(privateKey: string, endpoint: string) {
    this.defaultPrivateKey = privateKey;
    this.endpoint = endpoint;
  }

  public createHatchOutContract(
    contractAddress: string,
    privateKey: string = this.defaultPrivateKey
  ): HatchOutContract {
    const {HatchOut} = require('../../../contractApis/back')(
      {
        from: privateKey,
      },
      this.endpoint,
    );
    return new HatchOut(contractAddress);
  }
}