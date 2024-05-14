import { PrismaClient } from "@prisma/client";


export default class CategoryDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async createCategory(data:{name, account_id}){
        const _category = await this.db.category.create({
            data
        })
        return _category
    }

    public async getCategoryByIdAndAccountId(id, account_id){
        const _category = await this.db.category.findUnique({
            where: {
                id,
                account_id
            }
        })

        return _category;
    }

    public async getAllCategoriesByAccountId(account_id){
        const _categories = await this.db.category.findMany({
            where: {
                account_id
            }
        })

        return _categories;
    }

    public async deleteCategoryById(id, account_id){
        const _category = await this.db.category.delete({
            where:{
                id,
                account_id
            }
        })
        return _category
    }

}