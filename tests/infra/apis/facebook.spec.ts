import { FacebookAuthentication } from '@/domain/features'
import { mock, MockProxy } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) { }

  async loadUser(params: FacebookAuthentication.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/outh/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credential'
      }
    })
  }
}

export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

describe('FacebookApi', () => {
  let httpClient: MockProxy<HttpGetClient>
  let token: string
  beforeAll(() => {
    httpClient = mock()
    token = 'any_client_token'
  })
  it('should get app token', async () => {
    const clientId = 'any_client_id'
    const clientSecret = 'any_client_secret'

    const sut = new FacebookApi(httpClient, clientId, clientSecret)

    await sut.loadUser({ token })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/outh/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credential'
      }
    })
  })
})
