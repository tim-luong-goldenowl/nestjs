import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserRegistrationParamsDto } from 'src/auth/dtos/user-registration-params.dto';
import DonationReceiver from 'src/donation-receivers/entities/donation-receiver.entity';
import { S3Service } from 'src/s3/s3.service';
import User from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private s3Service: S3Service,
        @InjectRepository(DonationReceiver) private donationReceiverRepository: Repository<DonationReceiver>,
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
        const user: User = await this.userRepository.findOne({
            where: {
                id
            }
        });

        const userInstance = plainToInstance(User, user, {})

        const donationReceiver = await this.donationReceiverRepository.findOne({
            where: {
                user: user
            }
        });

        const donationReceiverInstance = plainToInstance(DonationReceiver, donationReceiver, {})

        return {
            user: userInstance,
            donationReceiver: donationReceiverInstance
        }
    }

    async updateUser(params: any, avatar: Express.Multer.File): Promise<User> {
        try {
            const tParams: User = {
                ...params,
                dob: new Date(params.dob)
            }

            delete tParams['id']
            const user = await this.userRepository.findOne({
                where: {
                    id: parseInt(params.id)
                }
            });

            const oldAvatarUrl = user.avatarUrl;

            if (avatar) {
                if (oldAvatarUrl) {
                    const oldAvatarFileName = oldAvatarUrl[oldAvatarUrl.length - 1]
                    const uploadFileUrl = await this.s3Service.replaceObject(avatar, oldAvatarFileName)
                    tParams.avatarUrl = uploadFileUrl
                } else {
                    const uploadFileUrl = await this.s3Service.createObject(avatar)
                    tParams.avatarUrl = uploadFileUrl
                }
            }

            return await this.userRepository.save({
                id: user.id,
                ...tParams
            });

        } catch (error) {
            console.log("eee", error)
            throw new BadRequestException
        }
    }
}
