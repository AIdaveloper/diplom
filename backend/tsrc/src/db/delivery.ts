import { PrismaClient } from "@prisma/client";


export default class DeliveryDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async createDelivery(data:{name, account_id}){
        const _delivery = await this.db.delivery.create({
            data
        })
        return _delivery
    }

    public async getDeliveryByIdAndAccountId(id, account_id){
        const _delivery = await this.db.delivery.findUnique({
            where: {
                id,
                account_id
            }
        })

        return _delivery;
    }

    public async getAllCategoriesByAccountId(account_id){
        const _categories = await this.db.delivery.findMany({
            where: {
                account_id
            }
        })

        return _categories;
    }

    public async deleteDeliveryById(id, account_id){
        const _delivery = await this.db.delivery.delete({
            where:{
                id,
                account_id
            }
        })
        return _delivery
    }

}