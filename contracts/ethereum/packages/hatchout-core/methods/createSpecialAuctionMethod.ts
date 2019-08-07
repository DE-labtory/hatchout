import AbstractMethod from "./abstractMethod";
import {HatchOutContract} from "../types";
import Utils from "../utils/utils";

export default class CreateSpecialAuctionMethod extends AbstractMethod {
  constructor(contract: HatchOutContract, utils: Utils) {
    super("createSpecialAuction", contract);
  }


  afterExecution(result: any): any {
    return result;
  }

  beforeExecution(args: any) {
  }
}