import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

export default class UserDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db
    }

    public async createUserByEmailAndPassword(user: {name:string, email: string, password: string}) {
        user.password = bcrypt.hashSync(user.password, 12);
        const account_id: number = (await this.db.account.create({
            data: {
                organisation_name: 'default name',
                sub: true
            }
        })).id
        const _user: typeof user & {account_id:number} = {...user, account_id} 
        const __user = await this.db.user.create({
            data: _user,
        });

        await this.db.account.update({
            where: {
                id: account_id
            },
            data: {
                owner_id: __user.id
            }
        })

        return __user
    }

    public async findUserById(id: number) {
        return await this.db.user.findUnique({
            where: {
                id,
            },
        });
    }

    public async findUserByEmail(email) {
        return await this.db.user.findUnique({
            where: {
                email,
            },
        });
    }
}