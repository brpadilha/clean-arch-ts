export class FacebookAuthenticationError extends Error {
  constructor () {
    super('Authetication failed')
    this.name = 'FacebookAuthenticationError'
  }
}
