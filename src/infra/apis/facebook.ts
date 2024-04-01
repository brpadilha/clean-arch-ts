import { HttpGetClient } from '../http'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

type AppToken = {
  acess_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type GetUserInfo = {
  id: string
  email: string
  name: string
}

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) { }

  async loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token)

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }

  private async getUserInfo(clientToken: string): Promise<GetUserInfo> {
    const debugToken = await this.getDebugToken(clientToken)

    return this.httpClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()

    return this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.acess_token,
        input_token: clientToken
      }
    })
  }

  private async getAppToken(): Promise<AppToken> {
    // faz chamada http para primeiro token do facebook
    return this.httpClient.get({
      url: `${this.baseUrl}/outh/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credential'
      }
    })
  }
}
