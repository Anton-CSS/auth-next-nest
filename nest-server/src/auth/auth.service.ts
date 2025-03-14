import { verify } from 'argon2'
import { Request, Response } from 'express'

import { LoginDto, RegisterDto } from '@/auth/dto/auth.dto'
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service'
import { PrismaService } from '@/prisma/prisma.service'
import { ProviderService } from '@/provider/provider.service'
import { UserService } from '@/user/user.service'
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod, User } from '@prisma/__generated__'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly prismaService: PrismaService
  ) {}
  async register(req: Request, dto: RegisterDto) {
    const isExist = await this.userService.findByEmail(dto.email)

    if (isExist) {
      throw new ConflictException(
        'Регистрация не удалась! Пользователь с таким email уже существует. ' +
          'Пожалуйста, используйте другой email или войдите в систему!'
      )
    }
    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false
    )
    await this.emailConfirmationService.sendVerificationToken(newUser)

    return {
      message:
        'Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. ' +
        'Сообщение было отправлено на ваш почтовый адрес'
    }
  }

  async extractProfileFromCode(req: Request, provider: string, code: string) {
    const providerInstance = this.providerService.findByService(provider)
    const profile = await providerInstance?.findUserByCode(code)
    const account = await this.prismaService.account.findFirst({
      where: { id: profile?.id, provider: profile?.provider }
    })
    let user = account?.userId
      ? await this.userService.findById(account.userId)
      : null
    if (user) return this.saveSession(req, user)
    user = await this.userService.create(
      profile?.email ?? '',
      '',
      profile?.name ?? '',
      profile?.picture ?? '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      AuthMethod[profile?.provider?.toUpperCase() ?? 'YANDEX'],
      true
    )
    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile?.provider ?? '',
          accessToken: profile?.access_token,
          refreshToken: profile?.refresh_token,
          expiredAt: profile?.expires_at ?? 0
        }
      })
    }
    return this.saveSession(req, user)
  }

  async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user || !user.password) {
      return new NotFoundException(
        'Пользователь не найден. Пожалуйста проверьте введенные данные'
      )
    }

    const isValidPassword = await verify(user.password, dto.password)
    if (!isValidPassword) {
      return new UnauthorizedException(
        'Неверный пароль. Пожалуйста, попробуйте ещё раз или восстановите пароль, если забыли его'
      )
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user)
      throw new UnauthorizedException(
        'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес'
      )
    }
    return this.saveSession(req, user)
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. ' +
                'Возможно, возникла проблема с сервером или сессия уже была завершена.'
            )
          )
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
        resolve()
      })
    })
  }

  public async saveSession(req: Request & { userId?: string }, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id

      req.session.save(err => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить сессию. ' +
                'Проверьте, правильно ли настроены параметры сессии.'
            )
          )
        }
        resolve({
          user
        })
      })
    })
  }
}
