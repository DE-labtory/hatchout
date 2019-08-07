import {Command, flags} from '@oclif/command'
import HatchOut from "../../../../hatchout-core/hatchOut";

export default class List extends Command {
  static description = 'get list of ghosts';

  static examples = [
    `$ hatchout-cli ghost:list`,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
  };

  public static args = [];

  async run() {
    try {
      const hatchOut: HatchOut = HatchOut.createFromConfig();
      const n = await hatchOut.methods.totalSupply();

      let indices = [];
      for (let i = 0; i < n; i++)
        indices.push(i + 1);

      this.log(
        JSON.stringify(await hatchOut.methods.getGhosts(indices), undefined, 2)
      );
    } catch (e) {
      this.error(`failed to run ghost:list command: ${e}`, e)
    }
  }
}
