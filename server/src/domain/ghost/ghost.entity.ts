import {Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
@Unique(['gene'])
export class Ghost {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  gene: string;

  @Column()
  level: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  constructor(gene: string, level: number, userId: string) {
    this.gene = gene;
    this.level = level;
    this.userId = userId;
  }

  public setLevel(level: number) {
    this.level = level;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }
}
