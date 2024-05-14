import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import Utils from "../utils";

export default class AuthDataService {
    private db: PrismaClient;
    private utils: Utils;

    constructor(db: PrismaClient, utils: Utils){
        this.db = db;
        this.utils = utils;
    }

    public async addRefreshTokenToWhitelist(jwtRT: { jti: string, refreshToken: string, user_id: number }) {
        return await this.db.refreshToken.create({
          data: {
            id: jwtRT.jti,
            hashedToken: this.utils.hashToken(jwtRT.refreshToken),
            user_id: jwtRT.user_id
          },
        });
    }

    public async findRefreshTokenById(id) {
        return await this.db.refreshToken.findUnique({
            where: {
                id,
            },
        });
    }

    public async deleteRefreshToken(id) {
        return await this.db.refreshToken.update({
            where: {
                id,
            },
            data: {
                revoked: true
            }
        });
    }

    public async revokeTokens(user_id) {
        return await this.db.refreshToken.updateMany({
            where: {
                user_id
            },
            data: {
                revoked: true
            }
        });
    }
}