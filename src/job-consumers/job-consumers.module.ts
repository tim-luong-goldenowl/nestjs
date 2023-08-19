import { Module } from '@nestjs/common';
import { MailerJobConsumer } from './mailer-job.consumer';

@Module({
  providers: [MailerJobConsumer],
})
export class JobConsumersModule {}
