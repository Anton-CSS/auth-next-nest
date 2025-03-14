import { TypeOptions } from '@/provider/providers.constant'
import { GoogleProvider } from '@/provider/services/google.provider'
import { YandexProvider } from '@/provider/services/yandex.provider'
import { ConfigService } from '@nestjs/config'

export const getProviderConfig = (config: ConfigService): TypeOptions => ({
  baseUrl: config.getOrThrow<string>('APP_URL'),
  services: [
    new GoogleProvider({
      client_id: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      client_secret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile']
    }),
    new YandexProvider({
      client_id: config.getOrThrow<string>('YANDEX_CLIENT_ID'),
      client_secret: config.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
      scopes: ['login:email', 'login:avatar', 'login:info']
    })
  ]
})
