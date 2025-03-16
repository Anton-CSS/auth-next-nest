import * as React from 'react'
import { Html } from '@react-email/html'
import { Heading, Link, Text, Body, Tailwind } from '@react-email/components'

type Props = {
  domain: string
  token: string
}
export const ResetTemplate = ({ domain, token }: Props) => {
  const resetLink = `${domain}/auth/new-verification?token=${token}`
  return (
    <Tailwind>
      <Html>
        {/* eslint-disable-next-line prettier/prettier */}
        <Body className="text-black">
          <Heading>Сброс пароля</Heading>
          <Text>Привет! Вы запросили сброс пароля. Перейдите по следующей ссылки чтобы создать новый пароль:</Text>
          <Link href={resetLink}>Подтвердить сброс пароля</Link>
          <Text>Эта ссылка действительна в течении часа. Если вы не запрашивали
            подтверждение, просто проигнорируйте это сообщение</Text>
        </Body>
      </Html>
    </Tailwind>
)
}