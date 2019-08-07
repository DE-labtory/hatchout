import HatchoutContractFactory from "./hatchoutContractFactory";
import * as fs from "fs";
import Web3 = require("web3");
import Utils from "./utils/utils";
import {HatchOutContract, HatchOutMethod} from "./types";
import MethodProxy from "./proxy/MethodProxy";
import MethodFactory from "./factories/methodFactory";

export default class HatchOut {
  private static VVISP_CONFIG_PATH = __dirname + "/../../vvisp-config.js";
  private factory: HatchoutContractFactory;
  public utils: Utils;
  public contract: HatchOutContract;
  public methods: HatchOutMethod;
  private readonly web3: Web3;

  public static createFromConfig(): HatchOut {
    if (!fs.existsSync(HatchOut.VVISP_CONFIG_PATH)) {
      throw new Error(`vvisp.config.json file does not exists ${HatchOut.VVISP_CONFIG_PATH}`)
    }
    const vvispConfig = require('../../vvisp-config.js');
    return new HatchOut(
      vvispConfig.from,
      vvispConfig.networks[vvispConfig.network].url
    );
  }

  public static create(privateKey: string, endpoint: string): HatchOut {
    return new HatchOut(privateKey, endpoint);
  }

  constructor(privateKey: string, endpoint: string) {
    this.web3 = new Web3(endpoint);
    this.utils = new Utils(this.web3);
    this.web3.eth.accounts.wallet.add(privateKey);
    this.factory = new HatchoutContractFactory(privateKey, endpoint);
    this.contract = this.factory.createDefaultHatchOutContract();
    this.methods = (new MethodProxy(this, new MethodFactory(this.contract)) as any);
  }
}