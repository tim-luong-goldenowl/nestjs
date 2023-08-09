import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
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

  @Column({nullable: true})
  public avatarUrl: string

  @OneToOne(() => DonationReceiver, (donationReceiver: DonationReceiver) => donationReceiver.user)
  public donationReceiver: DonationReceiver;
}

export default User;