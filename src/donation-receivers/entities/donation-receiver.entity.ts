import Donation from 'src/donation/donation.entity';
import User from 'src/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class DonationReceiver {
  @Index()
  @PrimaryGeneratedColumn()
  public id: number;
  
  @Column({nullable: true})
  public email: string

  @Column({nullable: true})
  public businessName: string

  @Column({nullable: true})
  public companyName: string
  
  @Column({nullable: true})
  public country: string

  @Column({type: 'text', nullable: true})
  public bio: string

  @Column({nullable: true})
  public onboardingCompleteToken: string

  @Column({nullable: true})
  public avatarUrl: string

  @Column({default: false})
  public verified: boolean

  @Column({nullable: true})
  public stripeConnectedAccountId: string

  @JoinColumn()
  @OneToOne(() => User)
  public user: User;
  
  @OneToMany(() => Donation, (donation) => donation.donationReceiver)
  donations: Donation[]
}
 
export default DonationReceiver;