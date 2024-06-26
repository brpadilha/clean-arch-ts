import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result
export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)
  async load(params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      id = pgUser.id.toString()
    } else {
      id = params.id
      await this.pgUserRepo.update({
        id: 1
      }, {
        email: params.email,
        facebookId: params.facebookId
      })
    }
    return {
      id
    }
  }
}
