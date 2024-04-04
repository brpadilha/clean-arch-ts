import { getRepository, getConnection, Repository } from 'typeorm'

import { IBackup } from 'pg-mem'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { PgUser } from '@/infra/postgres/entities'
import { makeFakeDb } from '@/tests/infra/postgres/mocks/connection'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup
  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    // criando um ponto de backup para depois resetarmos o banco antes de cada teste
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })
  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual(undefined)
    })
  })

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        facebookId: 'any_facebook_id',
        name: 'any_name',
        email: 'any_email'
      })

      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })

      expect(pgUser?.id).toBe(1)
      expect(id).toBe('1')
    })
    it('should update account if id is defined', async () => {
      await sut.saveWithFacebook({
        facebookId: 'any_facebook_id',
        name: 'any_name',
        email: 'any_email'
      })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        facebookId: 'new_facebook_id',
        name: 'new_name',
        email: 'new_email'
      })

      const pgUser = await pgUserRepo.findOne({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        name: 'any_name',
        email: 'new_email',
        facebookId: 'new_facebook_id'
      })
      expect(id).toBe('1')
    })
  })
})
