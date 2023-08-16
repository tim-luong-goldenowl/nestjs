import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import User from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class StripeConnectCustomer {
    @Index()
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public customerId: string;

    @ManyToOne(() => User, (user: User) => user.stripeConnectCustomers)
    public user: User

    @ManyToOne(() => DonationReceiver, (donationReceiver) => donationReceiver.stripeConnectCustomers)
    public donationReceiver: DonationReceiver
}

export default StripeConnectCustomer;