import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { MailService } from "src/mail/mail.service";

@Processor('send-mail-queue')
export class MailerJobConsumer {
    constructor(private readonly mailService: MailService){}

    @Process('sendOnboardingLinkMail')
    async processFile(job: Job) {
      const user = job.data.user
      const onboardingLink = job.data.onboardingLink

      this.mailService.sendStripeConnectOnboardingLink(user, onboardingLink)
    }
}