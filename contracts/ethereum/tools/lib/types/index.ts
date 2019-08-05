import {TransactionReceipt} from "web3/types";

export interface BaseContract {
  at(address: string);

  getAddress(): string;
}

export interface BaseMethod {
  supportsInterface(interfaceId: string);

  name(): string;

  ceoAddress(): string;

  getGene(tokenId: string): string;

  totalSupply(): number;

  ownerOf(tokenId: string): string;

  ghostIndexToOwner(index: string): string;

  ghostIndexToApproved(index: string): string;

  approve(to: string, tokenId: string): TransactionReceipt;

  setLevelLimit(limit: number): TransactionReceipt;
}

export interface GhostFactoryContract extends BaseContract {
  methods: BaseMethod & GhostFactoryContractMethod;
}

export interface GhostFactoryContractMethod {
  levelUp(owner: string, tokenId: string, signature: string): TransactionReceipt;

  transferFrom(from: string, to: string, tokenId: string): TransactionReceipt;

  setCEO(address: string): TransactionReceipt;

  transfer(to: string, tokenId: string): TransactionReceipt;

  createEgg(gene: string, owner: string, signature: string): TransactionReceipt;
}

export interface GhostAuctionContractMethod {
  specialAuction(): string

  saleAuction(): string

  setSpecialAuctionAddress(address: string): TransactionReceipt;

  setSaleAuctionAddress(address: string): TransactionReceipt;

  createSaleAuction(tokenId: string, buyer: string, amount: string): TransactionReceipt;

  createSpecialAuction(tokenId: string): TransactionReceipt;
}

export interface GhostAuctionContract extends BaseContract {
  methods: BaseMethod & GhostAuctionContractMethod;
}