import {Command} from '@oclif/command'
import HatchOut from "../../../../hatchout-core/hatchOut";
import {Ghost} from "../../../../hatchout-core/types";

export default class LevelUp extends Command {
  static description = 'level up a ghost';

  static examples = [
    `$ hatchout-cli ghost:levelUp [ghostIndex]`,
  ];

  public static flags = {};
  public static args = [{name: 'ghostIndex'}];

  async run() {
    try {
      const {args} = this.parse(LevelUp);
      if (args.ghostIndex === undefined) {
        this.error(`argument missing: ghostIndex`)
      }

      const hatchOut: HatchOut = HatchOut.createFromConfig();
      const ghost: Ghost = await hatchOut.methods.getGhost(args.ghostIndex);
      if (parseInt(ghost.level) > 2){
        this.error(`ghost already has max level: ${ghost.level}`)
      }
      const sig: string = await hatchOut.utils.createLevelUpSignature(args.ghostIndex, ghost.level);
      const owner: string = await hatchOut.utils.loadOwnerAddress();

      this.log(
        JSON.stringify(
          await hatchOut.methods.levelUp(
            args.ghostIndex,
            sig,
            {
              value: hatchOut.utils.toHexWei("1", "szabo")
            }),
          undefined,
          2
        )
      );
    } catch (e) {
      this.error(`failed to run ghost:levelUp command: ${e}`, e)
    }
  }
}
