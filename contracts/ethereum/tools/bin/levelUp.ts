import {HatchOutContract} from "../lib/types";
import HatchOut from "../lib/hatchOut";

async function main() {
  try {
    console.log('executing levelUp Transaction');
    const hatchOut = HatchOut.createFromConfig();
    const tokenId = await hatchOut.utils.toBN(process.argv[2]);
    const level = await hatchOut.utils.toBN(process.argv[3]);
    const owner = '0xDA46CE389670437Aeb5d4a0752B88cf2d4597A4e';
    const hatchOutContract: HatchOutContract = hatchOut
      .factory
      .createDefaultHatchOutContract();

    const signature = await hatchOut
      .utils
      .createLevelUpSignature(tokenId, level);

    const receipt = await hatchOutContract
      .methods
      .levelUp(
        owner,
        tokenId.toString(),
        signature,
        {
          value: hatchOut.utils.toHexWei("1", "szabo")
        }
      );

    console.log(JSON.stringify(receipt, undefined, 2));
  } catch (e) {
    console.error(`failed to execute 'levelUp Transaction'\n`, e);
    process.exit(1);
  }
}

main();