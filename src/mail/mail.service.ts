import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService
  ) {}

  async sendResetCode(email: string, code: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.config.get<string>('EMAIL_USER'),
        subject: 'Your Password Reset Code (valid for 10 min)',
        template: 'reset-password',
        context: { code, name }
      })
    } catch (err) {
      console.log(err);
      throw new RequestTimeoutException();
    }
  }
}
