import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor(private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) { }

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      await this.userAccount.load({ email: fbData.email })
      await this.userAccount.createFromFacebook(fbData)
    }

    return new AuthenticationError()
  }
}
