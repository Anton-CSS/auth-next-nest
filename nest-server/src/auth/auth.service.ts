import { verify } from 'argon2'
import { Request, Response } from 'express'

import { LoginDto, RegisterDto } from '@/auth/dto/auth.dto'
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
    private readonly configService: ConfigService
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

    return this.saveSession(req, newUser)
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
    return this.saveSession(req, user)
  }
  async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.'
            )
          )
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
        resolve()
      })
    })
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id
      req.session.save(error => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить сессию. Проверьте правильно ли настроены параметры сессии'
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
