import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module'
import { IS_DEV_ENV } from '@/libs/common/utils/is-dev.util'
import { MailModule } from '@/libs/mail/mail.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProviderModule } from './provider/provider.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProviderModule,
    MailModule,
    EmailConfirmationModule,
    PasswordRecoveryModule
  ]
})
export class AppModule {}
