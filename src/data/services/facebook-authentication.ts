import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor(private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  ) { }

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccount.load({ email: fbData.email })
      if (accountData !== undefined) {
        await this.userAccount.updateWithFacebook({
          id: accountData.id,
          facebookId: fbData.facebookId,
          name: accountData.name
        })
      } else {
        await this.userAccount.createFromFacebook(fbData)
      }
    }

    return new AuthenticationError()
  }
}
