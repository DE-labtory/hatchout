import {GhostFactoryContract} from "../lib/types";
import Hatchout from "../lib/hatchout";

async function main() {
  try {
    console.log('executing createEgg()');
    const gene = process.argv[2];
    const owner = '0xDA46CE389670437Aeb5d4a0752B88cf2d4597A4e';
    const hatchout = Hatchout.createFromConfig();
    const ghostFactoryContract: GhostFactoryContract = hatchout
      .factory
      .createDefaultGhostFactoryContract();

    const signature = await hatchout
      .utils
      .createSignature(gene);

    const receipt = await ghostFactoryContract
      .methods
      .createEgg(gene, owner, signature);

    console.log(JSON.stringify(receipt,undefined,2));
  } catch (e) {
    console.error('failed to create Egg\n', e);
    process.exit(1);
  }
}

main();