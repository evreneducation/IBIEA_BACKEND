import jwt from "jsonwebtoken";

//Token types
export type TokenPayload ={
  adminId: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "2h"}
  )
}

export const generateRefreshToken = (payLoad: TokenPayload): string => {
  return jwt.sign(
    payLoad,
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d"}
  )
}

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
}
