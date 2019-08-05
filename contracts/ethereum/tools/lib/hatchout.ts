import HatchoutContractFactory from "./hatchoutContractFactory";
import * as fs from "fs";
import Web3 = require("web3");
import Utils from "./utils/utils";

export default class Hatchout {
  private static VVISP_CONFIG_PATH = __dirname + "/../../vvisp-config.js";
  public factory: HatchoutContractFactory;
  public utils: Utils;
  private web3: Web3;

  public static createFromConfig(): Hatchout {
    if (!fs.existsSync(Hatchout.VVISP_CONFIG_PATH)) {
      throw new Error(`vvisp.config.json file does not exists ${Hatchout.VVISP_CONFIG_PATH}`)
    }
    const vvispConfig = require('../../vvisp-config.js');
    return new Hatchout(
      vvispConfig.from,
      vvispConfig.networks[vvispConfig.network].url
    );
  }

  public static create(privateKey: string, endpoint: string): Hatchout {
    return new Hatchout(privateKey, endpoint);
  }

  constructor(privateKey: string, endpoint: string) {
    this.web3 = new Web3(endpoint);
    this.web3.eth.accounts.wallet.add(privateKey);
    this.factory = new HatchoutContractFactory(privateKey, endpoint);
    this.utils = new Utils(this.web3);
  }
}