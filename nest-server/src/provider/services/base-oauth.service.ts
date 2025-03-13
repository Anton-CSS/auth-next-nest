import { TypesBaseProviderOptions } from '@/provider/services/types/base-provider.options.types'
import { TypeUserInfo } from '@/provider/services/types/user-info.types'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'

@Injectable()
export class BaseOAuthService {
  private BASE_URL: string
  constructor(private readonly options: TypesBaseProviderOptions) {}

  protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
    return {
      ...data,
      provider: this.options.name
    }
  }

  getAuthUrl(): string {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.client_id,
      redirect_url: this.getRedirectUrl(),
      scope: (this.options.scopes ?? []).join(' '),
      access_type: 'offline',
      prompt: 'select_account'
    })
    return `${this.options.authorize_url}?${query}`
  }

  async findUserByCode(code: string): Promise<TypeUserInfo> {
    const client_id = this.options.client_id
    const client_secret = this.options.client_secret

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_url: this.getRedirectUrl(),
      grant_type: 'authorization_code'
    })

    const tokenRequest = await fetch(`${this.options.access_url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: tokenQuery
    })

    if (!tokenRequest.ok) {
      throw new BadRequestException(`
      Не удалось получить пользователя с ${this.options.profile_url}. 
      Проверьте правильность токена доступа
      `)
    }
    const tokens = (await tokenRequest.json()) as {
      access_token: string
      refresh_token: string
      expires_at?: number
      expired_in?: number
    }

    if (!tokens.access_token) {
      throw new BadRequestException(`
      Нет токенов с ${this.options.access_url}. Убедитесь, что код авторизации действителен
        `)
    }

    const userRequest = await fetch(this.options.profile_url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    })

    if (!userRequest.ok) {
      throw new UnauthorizedException(`
      Не удалось получить пользователя с ${this.options.profile_url}.Проверьте правильность токена доступа
      `)
    }

    const user: unknown = await userRequest.json()
    const userData = await this.extractUserInfo(user)
    return {
      ...userData,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at || tokens.expired_in,
      provider: this.options.name
    }
  }

  getRedirectUrl() {
    return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}}`
  }
  set baseUrl(url: string) {
    this.BASE_URL = url
  }

  get name() {
    return this.options.name
  }

  get access_url() {
    return this.options.access_url
  }
  get profile_url() {
    return this.options.profile_url
  }

  get scopes() {
    return this.options.scopes
  }
}
