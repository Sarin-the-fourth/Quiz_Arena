import jwt from "jsonwebtoken";
import env from "../config/env.js";

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET!, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES!,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET!, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES!,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET!) as TokenPayload;
};
