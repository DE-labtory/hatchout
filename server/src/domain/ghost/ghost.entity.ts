import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ghost {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  gene: string;

  @Column()
  level: number;
}
