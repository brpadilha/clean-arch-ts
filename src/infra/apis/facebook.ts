import { FacebookAuthentication } from '@/domain/features'
import { HttpGetClient } from '../http'

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) { }

  async loadUser(params: FacebookAuthentication.Params): Promise<void> {
    // faz chamada http para primeiro token do facebook
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/outh/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credential'
      }
    })

    await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.acess_token,
        input_token: params.token
      }
    })
  }
}
