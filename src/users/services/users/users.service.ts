import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegistrationParamsDto } from 'src/auth/dtos/user-registration-params.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { UserDto } from 'src/users/dtos/user.dto';
import User from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(DonationReceiver) private donationReceiverRepository: Repository<DonationReceiver>
    ) { }

    async createUser(params: UserRegistrationParamsDto): Promise<User> {
        const user = await this.userRepository.create(params);
        this.userRepository.save(user);
        return user
    }

    async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });

        return user;
    }

    async getProfiles(id: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });

        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                user: user
            }
        });

        return {
            user,
            donationReceiver
        }
    }

    async updateUser(params: any): Promise<User> {
        try {
            const tParams = {
                ...params,
                dob: new Date(params.dob)
            }
            
            delete tParams['id']
            const user = await this.userRepository.findOne({
                where: {
                    id: parseInt(params.id)
                }
            });

            return await this.userRepository.save({
                id: user.id,
                ...tParams
            });
        } catch (error) {
            throw  new BadRequestException
        }
    }
}
