import { PrismaClient } from "@prisma/client";


export default class AccountDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async updateAccountNameByIdAndOwnerId(account_id: number, owner_id: number, name: string) {
        const _account = await this.db.account.update({
            where: {
                owner_id: owner_id,
                id: account_id,
            },
            data: {
                organisation_name: name
            }
        }) 

        if (!_account) throw new Error("account not found or user not owner");

        return _account;
    }

}