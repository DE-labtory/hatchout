import {HatchOutContract} from "../types";
import {cloneDeep} from 'lodash';

export default abstract class AbstractMethod {
  private readonly method: string;
  private contract: HatchOutContract;

  protected constructor(method: string, contract: HatchOutContract) {
    this.method = method;
    this.contract = contract;
  }

  public async execute(args: any): Promise<any> {
    this.beforeExecution(args);
    let parameters = cloneDeep([...args]);

    try {
      const result = await this.contract.methods[this.method](...parameters);
      return this.afterExecution(result);
    } catch (e) {
      throw new Error(`failed to execute ${this.method} transaction`)
    }
  }

  abstract beforeExecution(args: any);

  abstract afterExecution(result: any): any
}