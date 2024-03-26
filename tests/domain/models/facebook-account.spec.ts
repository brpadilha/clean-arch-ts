import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  const fbData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData)

    expect(sut).toEqual({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = {
      id: 'any_acc_id'
    }
    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'any_acc_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  it('should not update name if it exists', () => {
    const accountData = {
      id: 'any_acc_id',
      name: 'any_acc_name'
    }
    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: 'any_acc_id',
      name: 'any_acc_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })
})
