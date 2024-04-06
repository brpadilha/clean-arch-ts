export class AccessToken {
  constructor(readonly value: string) { }

  static get expirationInMs(): number {
    // 30 minutes * 60 seconds * 1000 milisegundos
    // 1800000 ms
    return 30 * 60 * 1000
  }
}
