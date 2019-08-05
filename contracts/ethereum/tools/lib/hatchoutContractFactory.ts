import ContractFactory from "./factories/contractFactory";
import VvispStateSupplier from "./suppliers/vvispStateSupplier";
import {GhostAuctionContract, GhostFactoryContract} from "./types";

export default class HatchoutContractFactory {
  private contractFactory: ContractFactory;
  private vvispStateSupplier: VvispStateSupplier;

  constructor(privateKey?: string, endpoint?: string){
    this.contractFactory = new ContractFactory(privateKey, endpoint);
    this.vvispStateSupplier = new VvispStateSupplier();
  }

  public createDefaultGhostFactoryContract(): GhostFactoryContract {
    return this.contractFactory
      .createGhostContract(
        this.vvispStateSupplier.loadContractAddress(
          "GhostFactory",
        )
      );
  }

  public createGhostAuctionContractFromVvispState(): GhostAuctionContract {
    return this.contractFactory
      .createGhostAuction(
        this.vvispStateSupplier.loadContractAddress(
          "GhostAuction",
        ),
      );
  }

  public createGhostFactoryContract(
    contractAddress: string,
    privateKey?: string
  ): GhostFactoryContract {
    return this.contractFactory
      .createGhostContract(contractAddress, privateKey);
  }

  public createGhostAuctionContract(
    contractAddress: string,
    privateKey?: string
  ): GhostAuctionContract {
    return this.contractFactory
      .createGhostAuction(contractAddress, privateKey);
  }
}