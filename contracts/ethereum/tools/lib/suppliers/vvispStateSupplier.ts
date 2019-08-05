import * as fs from 'fs'

export default class VvispStateSupplier {
  private static VVISP_STATE_CONFIG_PATH = __dirname + "/../../../state.vvisp.json";

  public loadContractAddress(
    contract: string,
    vvispStatePath: string = VvispStateSupplier.VVISP_STATE_CONFIG_PATH
  ): string {
    if (!fs.existsSync(vvispStatePath)) {
      throw new Error(`state.vvisp.json file does not exists ${vvispStatePath}`)
    }

    let vvispState = "";
    try {
      vvispState = JSON.parse(fs.readFileSync(vvispStatePath).toString());
    } catch (e) {
      throw new Error('state.vvisp.json is not json format')
    }

    if (vvispState["contracts"][contract] === undefined) {
      throw new Error(`${contract} contract does not exists in state.vvisp.json`)
    }
    return vvispState["contracts"][contract].address;
  }
}