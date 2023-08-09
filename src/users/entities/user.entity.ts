import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import FileStorage from 'src/file-storage/file-storage.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({unique: true})
  public email: string;

  @Column({nullable: true})
  public dob: Date;

  @Column()
  public password: string

  public avatar?: FileStorage;

  @OneToOne(() => DonationReceiver, (donationReceiver: DonationReceiver) => donationReceiver.user)
  public donationReceiver: DonationReceiver;
}

export default User;