import { Exclude } from 'class-transformer';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import Donation from 'src/donation/donation.entity';
import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
class User {
  @Index()
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
  @Exclude()
  public password: string

  @Column({nullable: true})
  public stripeCustomerId: string

  @Column({nullable: true})
  public avatarUrl: string

  @OneToOne(() => DonationReceiver, (donationReceiver: DonationReceiver) => donationReceiver.user)
  public donationReceiver: DonationReceiver;

  @OneToMany(() => Donation, (donation) => donation.user)
  donations: Donation[]
}

export default User;