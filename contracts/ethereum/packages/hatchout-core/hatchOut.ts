import HatchoutContractFactory from "./factories/hatchoutContractFactory";
import * as fs from "fs";
import Web3 = require("web3");
import Utils from "./utils/utils";
import {
  HatchOutContract,
  HatchOutMethod
} from "./types";
import MethodProxy from "./proxy/methodProxy";
import MethodFactory from "./factories/methodFactory";

export default class HatchOut {
  private static VVISP_CONFIG_PATH = __dirname + "/../../vvisp-config.js";
  public utils: Utils;
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

  public static create(privateKey: string, endpoint: string, address: string): HatchOut {
    return new HatchOut(privateKey, endpoint, address);
  }

  constructor(privateKey: string, endpoint: string, address?: string) {
    this.web3 = new Web3(endpoint);
    this.web3.eth.accounts.wallet.add(privateKey);
    this.utils = new Utils(this.web3);
    this.methods = (new MethodProxy(
        this,
        new MethodFactory(this.resolveContract(privateKey, endpoint, address))) as any
    );
  }

  private resolveContract(privateKey: string, endpoint: string, address?: string): HatchOutContract {
    const factory: HatchoutContractFactory = new HatchoutContractFactory(privateKey, endpoint);
    if (address == undefined) {
      return factory.createDefaultHatchOutContract();
    } else {
      return factory.createHatchOutContract(address, privateKey);
    }
  }
}