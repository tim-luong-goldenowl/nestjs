import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import User from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Donation {
    @Index()
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public message: string;

    @Column()
    public value: number;

    @ManyToOne(() => User, (user) => user.donations)
    public user: User

    @ManyToOne(() => DonationReceiver, (donationReceiver) => donationReceiver.donations)
    public donationReceiver: DonationReceiver
}

export default Donation;