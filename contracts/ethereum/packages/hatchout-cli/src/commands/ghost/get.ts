import {Command, flags} from '@oclif/command'
import HatchOut from "../../../../hatchout-core/hatchOut";

export default class Get extends Command {
  static description = 'get a ghost';

  static examples = [
    `$ hatchout-cli ghost:get [ghostIndex]`,
  ];

  public static flags = {};
  public static args = [{ name: 'ghostIndex' }];

  async run() {
    try {
      const { args } = this.parse(Get);
      if (args.ghostIndex === undefined) {
        this.error(`argument missing: ghostIndex`)
      }

      const hatchOut: HatchOut = HatchOut.createFromConfig();

      this.log(
        JSON.stringify(await hatchOut.methods.getGhost(args.ghostIndex), undefined, 2)
      );
    } catch (e) {
      this.error(`failed to run ghost:list command: ${e}`, e)
    }
  }
}
