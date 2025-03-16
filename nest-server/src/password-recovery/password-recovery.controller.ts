import { NewPasswordDto } from '@/password-recovery/dto/new-password.dto'
import { PasswordRecoveryDto } from '@/password-recovery/dto/reset-password.dto'
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'

import { PasswordRecoveryService } from './password-recovery.service'

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService
  ) {}

  @Recaptcha()
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: PasswordRecoveryDto) {
    this.passwordRecoveryService.resetPassword(dto)
  }

  @Recaptcha()
  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  newPassword(@Body() dto: NewPasswordDto, @Param('token') token: string) {
    this.passwordRecoveryService.newPassword(dto, token)
  }
}
