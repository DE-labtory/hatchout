import AbstractMethod from "./abstractMethod";
import {Ghost, HatchOutContract} from "../types";
import Utils from "../utils/utils";

export default class GetGhostMethod extends AbstractMethod {
  constructor(contract: HatchOutContract, utils: Utils) {
    super("ghosts", contract);
  }

  afterExecution(result: any): any {
    if (result.gene === undefined && result.level === undefined && result.birthTime === undefined) {
      throw new Error(`invalid ghost format error: ${result}`)
    }

    return {
      level: result.level,
      gene: result.gene,
      birthTime: result.birthTime,
    } as Ghost;
  }

  beforeExecution(args: any) {
  }
}