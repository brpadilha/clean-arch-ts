import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<CreateFacebookAccountRepository & LoadUserAccountRepository & UpdateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  beforeEach(() => {
    facebookApi = mock()

    // remover o mockResolvedValueOnce e passar para mockResolvedValue
    // para que quando formos mockar novamente para undefined com o mockResolvedValueOnce ele não empilhe ou sobrescreva
    facebookApi.loadUser.mockResolvedValue({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
  })

  it('should call LoadFacebookUserApi api with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authentication error when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email'
    })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateAccountRepo when LoadUserAccountRepo returns data', async () => {
    facebookApi.loadUser.mockResolvedValueOnce({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_email'
    })

    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      facebookId: 'any_fb_id',
      name: 'any_name'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    facebookApi.loadUser.mockResolvedValueOnce({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_email'
    })

    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.perform({ token })

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      facebookId: 'any_fb_id',
      name: 'any_fb_name'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
