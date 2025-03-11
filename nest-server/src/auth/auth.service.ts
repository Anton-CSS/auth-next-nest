import { RegisterDto } from '@/auth/dto/auth.dto'
import { UserService } from '@/user/user.service'
import { ConflictException, Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(dto: RegisterDto) {
    const isExist = await this.userService.findByEmail(dto.email)
    if (!isExist) {
      throw new ConflictException(
        'Регистрация не удалась! Пользователь с таким email уже существует. ' +
          'Пожалуйста, используйте другой email или войдите в систему!'
      )
    }
  }
  async login() {}
  async logout() {}
  private async saveSession() {}
}
