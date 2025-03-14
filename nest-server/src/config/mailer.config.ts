import { isDev } from '@/libs/common/utils/is-dev.util'
import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const getMailerConfig = (config: ConfigService): MailerOptions => ({
  transport: {
    host: config.getOrThrow<string>('MAIL_HOST'),
    port: config.getOrThrow<number>('MAIL_PORT'),
    secure: !isDev(config),
    auth: {
      user: config.getOrThrow<string>('MAIL_LOGIN'),
      pass: config.getOrThrow<string>('MAIL_PASSWORD')
    }
  },
  defaults: {
    from: `TeaCoder Team ${config.getOrThrow<string>('MAIL_LOGIN')}`
  }
})
