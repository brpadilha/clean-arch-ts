import { FacebookAuthentication } from '@/domain/features'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuthentication: MockProxy<FacebookAuthentication>

  beforeAll(() => {
    facebookAuthentication = mock()
    sut = new FacebookLoginController(facebookAuthentication)
  })

  beforeEach(() => {
  })

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should call facebook authentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})

class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) { }
  async handle(httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform(
      {
        token: httpRequest.token
      }
    )

    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}
