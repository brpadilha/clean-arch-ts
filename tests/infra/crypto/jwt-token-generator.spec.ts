import { JwtTokenGenerator } from '@/infra/crypto'
import jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let fakeJwt: jest.Mocked<typeof jwt>
  let sut: JwtTokenGenerator
  let key: string
  let expirationInMs: number
  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>

    // não pode ser somente um fakeJwt.sign.mockReturnValue('any_value')
    // fakeJwt.sign.mockReturnValue('any_value')
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    key = 'any_key'
    expirationInMs = 1000

    sut = new JwtTokenGenerator('any_secret')
    // fakeJts.sign({}, 'any_key', { expiresIn: 1000 })
  })

  it('should call signin with correct params', async () => {
    await sut.generateToken({ key, expirationInMs })

    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, 'any_secret', { expiresIn: 1 })
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({ key, expirationInMs })

    expect(token).toBe('any_token')
  })
})
