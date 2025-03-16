import { IsEmail, IsNotEmpty } from 'class-validator'

export class PasswordRecoveryDto {
  @IsEmail({}, { message: 'Введите корректный паспорт электронной почты.' })
  @IsNotEmpty({ message: 'Поле email не может быть пустым' })
  email: string
}
