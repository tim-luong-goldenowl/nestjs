import { HttpException, Injectable } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    PutObjectCommand,
    DeleteObjectCommand
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

    async replaceObject(file: Express.Multer.File, oldFileKey: string): Promise<string> {
        const bucket = this.configService.get<string>('S3_BUCKET_NAME');

        if(oldFileKey) {
            const deleteResult = await this.deleteObject(oldFileKey)

            if (!deleteResult) {
                return
            }
        }
        
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9)
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

            const fileUrl = `https://${bucket}.s3.${this.region}.amazonaws.com/${fileName}`

            return fileUrl
        } catch (error) {
            throw new HttpException(error, null)
        }
    }

    async deleteObject(fileKey: string) {
        const bucket = this.configService.get<string>('S3_BUCKET_NAME');

        const deleteInput = {
            "Bucket": bucket,
            "Key": fileKey
        };

        const deleteCommand = new DeleteObjectCommand(deleteInput);

        return await this.s3Client.send(deleteCommand);
    }
}
