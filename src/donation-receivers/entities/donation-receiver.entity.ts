import User from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class DonationReceiver {
  @PrimaryGeneratedColumn()
  public id: number;
  
  @Column()
  public email: string

  @Column()
  public businessName: string

  @Column()
  public companyName: string
  
  @Column()
  public country: string

  @Column({nullable: true})
  public onboardingCompleteToken: string

  @Column({default: false})
  public verified: boolean

  @JoinColumn()
  @OneToOne(() => User)
  public user: User;
}
 
export default DonationReceiver;