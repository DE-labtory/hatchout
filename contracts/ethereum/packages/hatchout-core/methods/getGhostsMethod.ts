import AbstractMethod from "./abstractMethod";
import {Ghost, HatchOutContract} from "../types";
import Utils from "../utils/utils";

export default class GetGhostsMethod extends AbstractMethod {
  constructor(contract: HatchOutContract, utils: Utils) {
    super("getGhosts", contract);
  }

  afterExecution(result: any): any {
    const genes = result['0'];
    const birthTimes = result['1'];
    const levels = result['2'];

    let ghosts: Ghost[] = [];
    for (let i = 0; i < genes.length; i++) {
      ghosts.push(
        {
          gene: genes[i],
          birthTime: birthTimes[i],
          level: levels[i],
        } as Ghost)
    }

    return ghosts
  }

  beforeExecution(args: any) {
  }
}