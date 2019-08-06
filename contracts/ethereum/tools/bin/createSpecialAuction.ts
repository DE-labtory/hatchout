import {HatchOutContract} from "../lib/types";
import HatchOut from "../lib/hatchOut";

async function main() {
  try {
    console.log('executing createSpecialAuction Transaction');
    const hatchOut = HatchOut.createFromConfig();
    const tokenId = process.argv[2];
    const hatchOutContract: HatchOutContract = hatchOut
      .factory
      .createDefaultHatchOutContract();
    
    const receipt = await hatchOutContract
      .methods
      .createSpecialAuction(tokenId);
    console.log(JSON.stringify(receipt, undefined, 2));
  } catch (e) {
    console.error(`failed to execute 'createSpecialAuction Transaction'\n`, e);
    process.exit(1);
  }
}

main();