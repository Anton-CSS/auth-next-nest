import { RedisStore } from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import IORedis from 'ioredis'

import { ms, StringValue } from '@/libs/common/utils/ms.util'
import { parseBoolean } from '@/libs/common/utils/parse-boolean.util'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

const start = async () => {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const redisUrl = `redis://${config.getOrThrow<string>('REDIS_USER')}:${config.getOrThrow<string>('REDIS_PASSWORD')}@${config.getOrThrow<string>('REDIS_HOST')}:${config.getOrThrow<string>('REDIS_PORT')}`
  console.log(redisUrl)
  const redis = new IORedis(redisUrl)
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )
  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax'
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER')
      })
    })
  )
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposeHeaders: ['set-cookie']
  })
  await app.listen(config.getOrThrow<number>('PORT'), () =>
    console.log(`Server started on port ${config.getOrThrow<number>('PORT')}`)
  )
}

start()
