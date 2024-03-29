export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => Promise<void>
}

namespace TokenGenerator {
  export type Params = {
    key: string
  }
}
