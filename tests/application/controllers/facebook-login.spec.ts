describe('FacebookLoginController', () => {
  let sut: FacebookLoginController

  beforeAll(() => {
    sut = new FacebookLoginController()
  })

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handler({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handler({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handler({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
})

class FacebookLoginController {
  async handler(params: any): Promise<HttpResponse> {
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
