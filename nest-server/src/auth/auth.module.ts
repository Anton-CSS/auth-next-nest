import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module'
import { getProviderConfig } from '@/config/providers.config'
import { getRecaptchaConfig } from '@/config/recapcha.config'
import { MailService } from '@/libs/mail/mail.service'
import { ProviderModule } from '@/provider/provider.module'
import { UserService } from '@/user/user.service'
import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProviderConfig,
      inject: [ConfigService]
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService]
    }),
    forwardRef(() => EmailConfirmationModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService],
  exports: [AuthService]
})
export class AuthModule {}
