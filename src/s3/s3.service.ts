import { HttpException, Injectable } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    PutObjectCommand
} from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private region: string

    constructor(private configService: ConfigService) {
        this.region = this.configService.get('S3_REGION')

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
            }
        })
    }

    async uploadObject(file: Express.Multer.File): Promise<string> {
        const bucket = this.configService.get<string>('S3_BUCKET_NAME');
        const fileName = 'xxxxx'

        const uploadInput: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: bucket,
            Key: fileName,
            ContentType: file.mimetype
        }

        try {
            const res: PutObjectCommandOutput = await this.s3Client.send(
                new PutObjectCommand(uploadInput)
            )

            return `https://${bucket}.s3.${this.region}.amazonaws.com/${fileName}`
        } catch (error) {
            throw new HttpException(error, null)
        }
    }
}
