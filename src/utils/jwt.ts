import jwt from 'jsonwebtoken';
import config from 'config';

export const signJwt = (
  object: jwt.JwtPayload,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions
) => {
  const signingKey = config.get<string>(keyName);

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) => {
  const publicKey = config.get<string>(keyName);

  try {
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
