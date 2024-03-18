import { AccessToken } from '@/domain/models'
import { FacebookAuthenticationError } from '@/domain/errors'

export interface FacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | FacebookAuthenticationError
}
