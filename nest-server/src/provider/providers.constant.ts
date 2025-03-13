import { BaseOAuthService } from '@/provider/services/base-oauth.service'
import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export const ProviderOptionsSymbol = Symbol()

export type TypeOptions = {
  baseUrl: string
  services: BaseOAuthService[]
}

export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>