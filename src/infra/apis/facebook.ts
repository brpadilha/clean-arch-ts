import { HttpGetClient } from '../http'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) { }

  async loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    // faz chamada http para primeiro token do facebook
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/outh/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credential'
      }
    })

    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.acess_token,
        input_token: params.token
      }
    })

    const userInfo = await this.httpClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: params.token
      }
    })

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }
}
