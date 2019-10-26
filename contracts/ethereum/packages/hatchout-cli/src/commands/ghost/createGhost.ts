import {Command} from '@oclif/command'
import HatchOut from "../../../../hatchout-core/hatchOut";

export default class CreateGhost extends Command {
  static description = 'create a ghost';

  static examples = [
    `$ hatchout-cli ghost:createGhost [gene]`,
  ];

  public static flags = {};
  public static args = [{name: 'gene'}];

  async run() {
    try {
      const {args} = this.parse(CreateGhost);
      if (args.gene === undefined) {
        this.error(`argument missing: gene`)
      }

      const hatchOut: HatchOut = HatchOut.createFromConfig();
      const sig: string = await hatchOut.utils.createGeneSignature(args.gene);
      const owner: string = await hatchOut.utils.loadOwnerAddress();

      this.log(
        JSON.stringify(
          await hatchOut.methods
            .createEgg(args.gene, sig),
          undefined,
          2
        )
      );
    } catch (e) {
      this.error(`failed to run ghost:createGhost command: ${e}`, e)
    }
  }
}
