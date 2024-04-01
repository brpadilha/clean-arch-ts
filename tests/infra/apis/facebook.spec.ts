import { FacebookApi } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let httpClient: MockProxy<HttpGetClient>
  let token: string
  let sut: FacebookApi
  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock()
    token = 'any_client_token'
  })

  beforeEach(() => {
    httpClient.get.mockResolvedValueOnce({
      acess_token: 'any_app_token'
    })
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })
  it('should get app token', async () => {
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

  it('should get debug_token', async () => {
    await sut.loadUser({ token })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: token
      }
    })
  })
})
