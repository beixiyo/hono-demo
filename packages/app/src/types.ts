export type AppEnv = {
  Variables: {
    requestId: string
    jwtPayload: {
      sub: string
      role: string
      exp: number
    }
  }
}
