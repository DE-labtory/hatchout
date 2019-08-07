import Web3 = require("web3");
import BN = require("bn.js");
import {Mixed, Unit} from "../types";

export default class Utils {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  private async loadOwner(): Promise<string> {
    const defaultOwner = await this.web3.eth.accounts.wallet[0].address;
    if (defaultOwner === undefined) {
      throw new Error('at least one wallet must exist');
    }

    return defaultOwner
  }

  public async createGeneSignature(gene: Mixed): Promise<string> {
    return await this.createSignature(gene, await this.loadOwner())
  }

  public async createLevelUpSignature(tokenId: Mixed, level: Mixed): Promise<string> {
    return await this.createSignature(tokenId, level)
  }

  private async createSignature(...val: Mixed[]): Promise<string> {
    const defaultOwner = await this.loadOwner();
    const hash = await this.web3.utils.soliditySha3(...val);
    return await this.web3.eth.sign(hash, defaultOwner);
  }

  public toHexWei(val: string, unit?: Unit): string {
    return '0x' + parseInt(this.web3.utils.toWei(val, unit)).toString(16);
  }

  public async toBN(n: string): Promise<BN> {
    return this.web3.utils.toBN(n);
  }
}