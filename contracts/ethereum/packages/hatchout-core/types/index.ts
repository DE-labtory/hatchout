import {TransactionReceipt} from "web3/types";
import BN = require("bn.js");

export interface HatchOutMethod {
  getGhost(index: string): Ghost;

  getGhosts(indices: number[]): Ghost[];

  levelUp(owner: string, tokenId: string, signature: string, options?: any): TransactionReceipt;

  setSpecialAuctionAddress(address: string): TransactionReceipt;

  setSaleAuctionAddress(address: string): TransactionReceipt;

  createSaleAuction(tokenId: string, buyer: string, amount: string): TransactionReceipt;

  createSpecialAuction(tokenId: string): TransactionReceipt;

  totalSupply(): number;
}

export interface Ghost {
  gene: string;
  birthTime: string;
  level: string;
}

export interface HatchOutContract extends BaseContract {
  methods: BaseMethod & GhostAuctionContractMethod & GhostFactoryContractMethod
}

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

export interface GhostFactoryContractMethod {
  ghosts(index: string): Ghost;

  getGhosts(indices: number[]): [string[], string[], string[]]

  levelUp(owner: string, tokenId: string, signature: string, options?: any): TransactionReceipt;

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

export type Mixed =
  | string
  | number
  | BN
  | {
  type: string;
  value: string;
}
  | {
  t: string;
  v: string;
};

export type Unit =
  | "noether"
  | "wei"
  | "kwei"
  | "Kwei"
  | "babbage"
  | "femtoether"
  | "mwei"
  | "Mwei"
  | "lovelace"
  | "picoether"
  | "gwei"
  | "Gwei"
  | "shannon"
  | "nanoether"
  | "nano"
  | "szabo"
  | "microether"
  | "micro"
  | "finney"
  | "milliether"
  | "milli"
  | "ether"
  | "kether"
  | "grand"
  | "mether"
  | "gether"
  | "tether";