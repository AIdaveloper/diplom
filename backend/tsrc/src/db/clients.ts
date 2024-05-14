import { PrismaClient } from "@prisma/client";


export default class ClientDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async createClient(data:{telegram_id, bot_id, account_id}){
        const _client = await this.db.client.create({
            data
        })
        return _client
    }

    public async updateClientById(id, account_id, data:{ name?, email?, number?}){
        Object.keys(data).forEach(key => !data[key] && delete data[key])
        const _client = await this.db.client.update({
            where:{
                id,
                account_id
            },
            data: data
        })
        return _client
    }

    public async updateClientPosition(id, account_id, position){
        const _client = await this.db.client.update({
            where: {
                id, 
                account_id
            },
            data: {
                position
            }
        })
        return _client
    }

    public async getClientById(id){
        const _client = await this.db.client.findUnique({
            where: {
                id
            }
        })

        return _client;
    }

    public async getClientByTelegramIdAndAccountId(telegram_id, account_id){
        const _client = await this.db.client.findFirst({
            where:{
                telegram_id,
                account_id
            }
        })

        return _client
    }

    public async getAllClientsByAccountId(account_id){
        const _clients = await this.db.client.findMany({
            where: {
                account_id
            }
        })

        return _clients;
    }

    public async deleteClientById(id, account_id){
        const _client = await this.db.client.delete({
            where:{
                id,
                account_id
            }
        })
        return _client
    }
}