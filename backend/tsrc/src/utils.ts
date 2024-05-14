import 'dotenv/config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Client } from '@prisma/client';


export default class Utils {
    private JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || 'secret';
    private JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'secret';

    public generateAccessToken(user) {
        return jwt.sign({ user_id: user.id }, this.JWT_ACCESS_SECRET, {
            expiresIn: '2h',
        });
    }

    public generateClientAccessToken(client: Client) {
        return jwt.sign({ client_id: client.id }, this.JWT_ACCESS_SECRET, {
            expiresIn: '30d',
        });
    }

    public generateRefreshToken(user, jti) {
        return jwt.sign({
            user_id: user.id,
            jti
        }, this.JWT_REFRESH_SECRET, {
            expiresIn: '24h',
        });
    }

    public generateTokens(user, jti) {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user, jti);
      
        return {
          accessToken,
          refreshToken,
        };
    }

    public hashToken(token: string) {
        return crypto.createHash('sha512').update(token).digest('hex');
    }

    public isEmail(str: string) {
        const regex = /^(([a-zA-Z0-9]|([a-zA-Z0-9][a-zA-Z0-9._-][a-zA-Z0-9]))+@([a-zA-Z0-9]|([a-zA-Z0-9][a-zA-Z0-9._-]+[a-zA-Z0-9]))+\.([a-zA-Z0-9]|([a-zA-Z0-9][a-zA-Z0-9_-][a-zA-Z0-9]))+)$/gm
        return regex.test(str);
    }
}