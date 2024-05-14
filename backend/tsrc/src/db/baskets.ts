import { PrismaClient } from "@prisma/client";


export default class BasketDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async createBasket(data:{client_id, product_id, count}){
        const _basket = await this.db.basket.create({
            data
        })
        return _basket
    }

    public async updateBasketById(id, client_id, count){
        const _basket = await this.db.basket.update({
            where:{
                id,
                client_id
            },
            data: {count}
        })
        return _basket
    }

    public async getBasketByIdAndClientId(id, client_id){
        const _basket = await this.db.basket.findUnique({
            where: {
                id,
                client_id
            }
        })

        return _basket;
    }

    public async getBasketByProductidAndClientId(product_id, client_id){
        const _basket = await this.db.basket.findFirst({
            where: {
                product_id,
                client_id
            }
        })

        return _basket;
    }

    public async getAllBasketsByClientId(client_id){
        const _baskets = await this.db.basket.findMany({
            where: {
                client_id
            },
            include: {
                product: true
            }
        })

        return _baskets;
    }

    public async deleteBasketById(id, client_id){
        const _basket = await this.db.basket.delete({
            where:{
                id,
                client_id
            }
        })
        return _basket
    }
}