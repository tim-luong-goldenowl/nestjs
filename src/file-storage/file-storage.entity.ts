import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class FileStorage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;
}

export default FileStorage;