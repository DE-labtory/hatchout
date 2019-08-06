import ContractFactory from "./factories/contractFactory";
import VvispStateSupplier from "./suppliers/vvispStateSupplier";
import {HatchOutContract} from "./types";

export default class HatchoutContractFactory {
  private contractFactory: ContractFactory;
  private vvispStateSupplier: VvispStateSupplier;

  constructor(privateKey?: string, endpoint?: string) {
    this.contractFactory = new ContractFactory(privateKey, endpoint);
    this.vvispStateSupplier = new VvispStateSupplier();
  }

  public createDefaultHatchOutContract(): HatchOutContract {
    return this.contractFactory
      .createHatchOutContract(
        this.vvispStateSupplier.loadContractAddress(
          "HatchOut",
        )
      );
  }

  public createHatchOutContract(
    contractAddress: string,
    privateKey?: string
  ): HatchOutContract {
    return this.contractFactory
      .createHatchOutContract(contractAddress, privateKey);
  }
}