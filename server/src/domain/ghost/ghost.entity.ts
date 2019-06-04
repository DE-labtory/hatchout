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

  constructor(id: number, gene: string, level: number, userId: string) {
    this.id = id;
    this.gene = gene;
    this.level = level;
    this.userId = userId;
  }
}
