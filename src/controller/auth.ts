import jwt from 'jsonwebtoken'
import {vars} from "../env";

export function createAccessToken(uid: string, fullName: string) {
    const iat = Math.floor(Date.now() / 1000)

    const token = jwt.sign({uid, fullName, iat}, vars.ACCESS_TOKEN_SECRET, {
        expiresIn: vars.AT_EXPIRY,
    })

    return {token, iat}
}


export const createRefreshToken = (uid: string, fullName: string) => {
    const iat = Math.floor(Date.now() / 1000)

    const token = jwt.sign({uid, fullName, iat}, vars.REFRESH_TOKEN_SECRET, {
        expiresIn: vars.RT_EXPIRY,
    })

    return {token, iat}
}

export type TokenData = {
    iat: number
    uid: string
    fullName: string
    exp: number
}

export type TokenError = {
    name: 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError'
}

export type TokenResult = TokenData | TokenError

export function tokenIsError(token: TokenResult): token is TokenError {
    return (token as TokenError).name !== undefined
}

export function verifyAccessToken(token: string): TokenResult {
    try {
        const decoded = jwt.verify(token, vars.ACCESS_TOKEN_SECRET)
        return decoded as TokenData
    } catch (error) {
        if (error.name == 'JsonWebTokenError') {
            return {
                name: 'JsonWebTokenError',
            } as TokenError
        } else if (error.name == 'TokenExpiredError') {
            return {
                name: 'TokenExpiredError',
            } as TokenError
        } else if (error.name == 'NotBeforeError') {
            return {
                name: 'NotBeforeError',
            } as TokenError
        } else {
            return {
                name: 'JsonWebTokenError',
            } as TokenError
        }
    }
}