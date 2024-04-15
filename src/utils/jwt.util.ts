import jwt from 'jsonwebtoken';

import { JWT_TOKEN_EXP, JWT_SECRET_KEY } from './../configs/config';
export interface ITokenClaims {
    sub: string;
    name?: string;
    role?: string;
    iss?: string;
    aud?: string;
    exp?: number;
    iat?: number;
    nbf?: number;
    jti?: string;
}

export function generateToken(payload: ITokenClaims): string {
    const token: string = jwt.sign(
		{
			...payload
		},
		JWT_SECRET_KEY as string,
		{
			expiresIn: JWT_TOKEN_EXP as string,
		},
	)
	return token
}

// export function verifyToken(token: string): any {
//     try {
//         return jwt.verify(token, JWT_SECRET_KEY);
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         return null;
//     }
// }

// export function decodeToken(token: string): any {
//     try {
//         return jwt.decode(token);
//     } catch (error) {
//         console.error('Error decoding token:', error);
//         return null;
//     }
// }