import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {
  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.session)
    if(typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException(
        'Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ'
      )
    }

    const user = await this.userService.findById(request.session.userId ?? '');

    if (!user) {
      throw new UnauthorizedException(
        'Пользователь не найден. Вы используете не правильные учетные данные'
      )
    }
    request.user = user
    return true
  }
}