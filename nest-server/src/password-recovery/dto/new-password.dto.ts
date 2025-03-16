import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class NewPasswordDto {
  @IsEmail({}, { message: 'Введите корректный паспорт электронной почты.' })
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
  @IsNotEmpty({ message: 'Поле email не может быть пустым' })
  password: string
}
