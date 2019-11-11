import {Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {ValidationException} from '../exception/ValidationException';
import {MAX_LEVEL} from './level';
import {User} from '../user/user.entity';

@Entity()
@Unique(['gene'])
export class Ghost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gene: string;

  @Column({unique: true})
  tokenId: number;

  @Column()
  level: number;

  @Column()
  userAddress: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  constructor(gene: string, tokenId: number, userAddress: string, level = 0) {
    this.gene = gene;
    this.tokenId = tokenId;
    this.level = level;
    this.userAddress = userAddress;
  }
  private setGene(gene: string) {
    this.gene = gene;
  }
  private setTokenId(tokenId) {
    this.tokenId = tokenId;
  }

  private setLevel(level: number) {
    this.level = level;
  }

  private setUserAddress(userAddress: string) {
    this.userAddress = userAddress;
  }
  public getGene() {
    return this.gene;
  }
  public getTokenId() {
    return this.tokenId;
  }
  public getLevel() {
    return this.level;
  }
  public getUserAddress() {
    return this.userAddress;
  }
  public increaseLevel(amount: number): Ghost {
    if (amount < 0) {
      throw new ValidationException('amount should be positive');
    }
    if (MAX_LEVEL < this.level + amount) {
      throw new ValidationException('can not increase level over MAX_LEVEL');
    }
    this.level += amount;
    return this;
  }

  public changeUser(user: User): Ghost {
    const userAddress = user.getAddress();
    if (userAddress === undefined) {
      throw new ValidationException('no userAddress');
    }
    this.setUserAddress(userAddress);
    return this;
  }
}
