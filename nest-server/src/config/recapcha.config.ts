import { isDev } from '@/libs/common/utils/is-dev.util'
import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

export const getRecaptchaConfig = async (
  config: ConfigService
): Promise<GoogleRecaptchaModuleOptions> => ({
  secretKey: config.getOrThrow<string>('GOOGLE_RECAPCHA_SECRET_KEY'),
  response: req => req.headers.recaptcha,
  skipIf: isDev(config)
})
