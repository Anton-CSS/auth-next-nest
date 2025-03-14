import * as React from 'react'
import { Html } from '@react-email/html'
import { Heading, Link, Text, Body, Tailwind } from '@react-email/components'

type Props = {
  domain: string
  token: string
}
export const ConfirmationTemplate = ({ domain, token }: Props) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`
  return (
    <Tailwind>
      <Html>
        {/* eslint-disable-next-line prettier/prettier */}
        <Body className="text-black">
          <Heading>Подтверждение почты!</Heading>
          <Text>Привет! Чтобы подтвердить свой адрес электронной почты, пожалуйста,
            перейдите по следующей ссылке:</Text>
          <Link href={confirmLink}>Подтвердить почту</Link>
          <Text>Эта ссылка действительна в течении часа. Если вы не запрашивали
            подтверждение, просто проигнорируйте это сообщение</Text>
          <Text>Спасибо за использование вашего сервиса</Text>
        </Body>
      </Html>
    </Tailwind>
  )
}
