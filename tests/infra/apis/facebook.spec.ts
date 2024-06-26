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
    httpClient.get
      .mockResolvedValueOnce({
        acess_token: 'any_app_token'
      })
      .mockResolvedValueOnce({
        data: {
          user_id: 'any_user_id'
        }
      })
      .mockResolvedValueOnce(
        {
          id: 'any_fb_id',
          name: 'any_fb_name',
          email: 'any_fb_email'
        }
      )
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

  it('should get user data', async () => {
    await sut.loadUser({ token })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })

  it('should return facebook user', async () => {
    const fbUserInfo = await sut.loadUser({ token })

    expect(fbUserInfo).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
  })
})
