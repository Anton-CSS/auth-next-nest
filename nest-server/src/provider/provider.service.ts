import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ProviderOptionsSymbol, TypeOptions } from '@/provider/providers.constant'
import { BaseOAuthService } from '@/provider/services/base-oauth.service'

@Injectable()
export class ProviderService implements OnModuleInit {
  constructor( @Inject(ProviderOptionsSymbol) private readonly options: TypeOptions) {}

  onModuleInit() {
    for(const provider of this.options.services){
      provider.baseUrl = this.options.baseUrl
    }
  }

  findByService(service: string): BaseOAuthService | null{
    return this.options.services.find(s => s.name === service) ?? null
  }
}
