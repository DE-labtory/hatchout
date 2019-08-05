import Web3 = require("web3");
import BN = require("bn.js");

export default class Utils {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  public async createSignature(gene: any): Promise<string> {
    const defaultOwner = await this.web3.eth.accounts.wallet[0].address;
    if (defaultOwner === undefined){
      throw new Error('at least one wallet must exist');
    }
    const hash = await this.web3.utils.soliditySha3(gene, defaultOwner);
    return await this.web3.eth.sign(hash, defaultOwner);
  }

  public async toBN(n: string): Promise<BN>{
    // @ts-ignore
    return new this.web3.utils.BN(n);
  }
}