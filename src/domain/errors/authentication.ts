export class AuthenticationError extends Error {
  constructor () {
    super('Authetication failed')
    this.name = 'FacebookAuthenticationError'
  }
}
