import {HatchOutContract} from "../types";
import {
  CreateEggMethod,
  CreateSaleAuctionMethod,
  CreateSpecialAuctionMethod,
  GetGhostMethod,
  GetGhostsMethod,
  LevelUpMethod
} from "../methods";

export default class MethodFactory {
  private readonly methods: any;
  private readonly hatchOutContract: HatchOutContract;

  constructor(hatchOutContract: HatchOutContract) {
    this.hatchOutContract = hatchOutContract;
    this.methods = {
      createEgg: CreateEggMethod,
      createSaleAuction: CreateSaleAuctionMethod,
      createSpecialAuction: CreateSpecialAuctionMethod,
      getGhost: GetGhostMethod,
      levelUp: LevelUpMethod,
      getGhosts: GetGhostsMethod,
    };
  }

  public createMethod(name: string | number | symbol): any {
    const method = this.methods[name];
    return new method(this.hatchOutContract);
  }
}