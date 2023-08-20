import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { SEND_MAIL_QUEUE_NAME, SEND_ONBOARDING_LINK_JOB_NAME } from "src/constants";
import { MailService } from "src/mail/mail.service";

@Processor(SEND_MAIL_QUEUE_NAME)
export class MailerJobConsumer {
    constructor(private readonly mailService: MailService){}

    @Process(SEND_ONBOARDING_LINK_JOB_NAME)
    async processFile(job: Job) {
      const donationReceiver = job.data.donationReceiver
      const onboardingLink = job.data.onboardingLink

      this.mailService.sendStripeConnectOnboardingLink(donationReceiver, onboardingLink)
    }
}