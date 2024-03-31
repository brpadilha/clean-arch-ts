import { FacebookAuthentication } from '@/domain/features'
import { mock } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(
    private readonly httpClient: HttpGetClient
  ) { }

  async loadUser(params: FacebookAuthentication.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/outh/access_token`
    })
  }
}

export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('FacebookApi', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/outh/access_token'
    })
  })
})
