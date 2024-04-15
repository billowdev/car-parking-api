import jwt from "jsonwebtoken";

import {
  JWT_ACCESS_TOKEN_EXP,
  JWT_REFRESH_TOKEN_EXP,
  JWT_SECRET_KEY,
} from "./../configs/config";

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
  token_type?: string;
}

export interface ITokenPayload {
  sub: string;
  role: string;
  exp: number;
}

export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
}

export function generateToken(payload: ITokenClaims): string {
  const token: string = jwt.sign(
    {
      ...payload,
    },
    JWT_SECRET_KEY as string,
    {
      expiresIn: JWT_ACCESS_TOKEN_EXP as string,
    }
  );
  return token;
}

export function generateTokens(payload: ITokenClaims): ITokenResponse {
  const accessToken = jwt.sign(
    { ...payload, token_type: "access" },
    JWT_SECRET_KEY,
    {
      expiresIn: JWT_ACCESS_TOKEN_EXP,
    }
  );

  const refreshToken = jwt.sign(
    { ...payload, token_type: "refresh" },
    JWT_SECRET_KEY,
    {
      expiresIn: JWT_REFRESH_TOKEN_EXP,
    }
  );

  return { access_token: accessToken, refresh_token: refreshToken };
}

export function verifyToken(token: string): any {
  try {
    const decodedToken = jwt.verify(
      token,
      JWT_SECRET_KEY as string
    ) as ITokenPayload;
    if (new Date().getTime() > decodedToken.exp * 1000) {
      throw new Error("Token expired");
    }
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
