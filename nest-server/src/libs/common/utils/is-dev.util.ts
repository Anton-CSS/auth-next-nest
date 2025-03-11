import * as dotenv from 'dotenv'
import * as process from 'node:process'

import { ConfigService } from '@nestjs/config'

dotenv.config()

export const isDev = (configService: ConfigService): boolean => {
  return configService.get<string>('NODE_ENV') === 'development'
}

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'
