import { PrismaClient } from "@prisma/client";


export default class BotDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async createBot(data:{account_id, token?}){
        const _bot = await this.db.bot.create({
            data: data
        })
        return _bot
    }

    public async updateBotTokenById(id, account_id, token){
        const _bot = await this.db.bot.update({
            where:{
                id,
                account_id
            },
            data: {token}
        })
        return _bot
    }

    public async updateBotScenarioTokenById(id, account_id, scenario){
        const _bot = await this.db.bot.update({
            where:{
                id,
                account_id
            },
            data: {scenario}
        })
        return _bot
    }

    public async getBotAccountId(account_id){
        const _bot = await this.db.bot.findUnique({
            where: {
                account_id
            }

        })

        return _bot;
    }

    public async getBotByIdAndAccountId(id, account_id){
        const _bot = await this.db.bot.findUnique({
            where: {
                id,
                account_id
            },
            include: {
                clients: true
            }

        })

        return _bot;
    }

    public async getAllBotsWithAccount(){
        const _bots = await this.db.bot.findMany({
            where: {
                token: {
                    not: null
                },
                account: {
                    sub: true
                }
            },
            include: {
                account: true
            }
        })

        return _bots;
    }
}