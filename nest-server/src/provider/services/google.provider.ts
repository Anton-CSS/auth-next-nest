import { BaseOAuthService } from '@/provider/services/base-oauth.service'
import { TypeProviderOptions } from '@/provider/services/types/provider-options.types'
import { TypeUserInfo } from '@/provider/services/types/user-info.types'

interface GoogleProfile extends Record<string, unknown> {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name?: string
  given_name: string
  hd?: string
  iat: number
  iss: string
  jti?: string
  locale?: string
  name: string
  nbf?: number
  picture: string
  sub: string
  access_token: string
  refresh_token?: string
}

export class GoogleProvider extends BaseOAuthService{
  constructor(options: TypeProviderOptions){
    super({
      name: 'google',
      authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
      access_url: 'https://oauth2.googleapis.com/token',
      profile_url: 'https://googleapis.com/oauth2/v3/userinfo',
      scopes: options.scopes,
      client_id: options.client_id,
      client_secret: options.client_secret
    })
  }
  async extractUserInfo(data: GoogleProfile): Promise<TypeUserInfo> {
  return super.extractUserInfo({
    email: data.email,
    name: data.name,
    picture: data.picture
  })
  }
}