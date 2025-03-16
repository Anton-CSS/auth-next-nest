import { ConfirmationTemplate } from '@/libs/mail/templates/confirmation.template'
import { ResetTemplate } from '@/libs/mail/templates/reset.template'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService, // Убедитесь, что это правильный сервис
    private readonly config: ConfigService
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const domain = this.config.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(ConfirmationTemplate({ domain, token }))
    await this.sendEmail(email, 'Подтверждение почты', html)
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.config.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(ResetTemplate({ domain, token }))
    await this.sendEmail(email, 'Сброс пароля', html)
  }

  private async sendEmail(
    email: string,
    subject: string,
    html: string
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject,
      html
    })
  }
}
