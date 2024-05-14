import { PrismaClient } from "@prisma/client";


export default class ProductDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async createProduct(data:{name, weight, count, price, image_link, category_id, account_id}){
        const _product = await this.db.product.create({
            data
        })
        return _product
    }

    public async updateProductById(id, account_id, data:{ name?, weight?, count?, price?, image_link?, category_id?}){
        Object.keys(data).forEach(key => !data[key] && delete data[key])
        const _product = await this.db.product.update({
            where:{
                id,
                account_id
            },
            data: data
        })
        return _product
    }

    public async getProductByIdAndAccountId(id, account_id){
        const _product = await this.db.product.findUnique({
            where: {
                id,
                account_id
            }
        })

        return _product;
    }

    public async getAllProductsByCategoryIdAndAccountId(category_id, account_id){
        const _products = await this.db.product.findMany({
            where: {
                category_id,
                account_id
            }
        })

        return _products;
    }

    public async getAllProductsByAccountId(account_id){
        const _products = await this.db.product.findMany({
            where: {
                account_id
            }
        })

        return _products;
    }

    public async deleteProductById(id, account_id){
        const _product = await this.db.product.delete({
            where:{
                id,
                account_id
            }
        })
        return _product
    }
}