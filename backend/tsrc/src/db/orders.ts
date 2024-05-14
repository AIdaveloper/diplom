import { Order, PrismaClient } from "@prisma/client";


export default class OrderDataService {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db;
    }

    public async createOrder(data:{client_id, address}){
        const _order = await this.db.order.create({
            data: {...data, date: new Date()}
        })
        return _order
    }

    public async updateOrderDeliveryById(id, client_id, data: {delivery_id?, status?}){
        Object.keys(data).forEach(key => !data[key] && delete data[key])
        const _order = await this.db.order.update({
            where:{
                id,
                client_id
            },
            data: data
        })
        return _order
    }

    public async changeProductCount(id, client_id, product_id, count){
        let _order = await this.getOrderById(id);
        const i = _order.orderProducts.find(v=> v.product_id == product_id)
        if (i){
            if (count != 0){
                await this.db.orderProducts.update({
                    where: {
                        id: i.id
                    },
                    data: {
                        product_count: count
                    }
                })
            } else {
                await this.db.orderProducts.delete({
                    where: {
                        id: i.id
                    }
                })
            }
        } else if (count != 0) {
            await this.db.order.update({
                where: {
                    id, 
                    client_id
                },
                data: {
                    orderProducts: {
                        create: {
                            product_id: product_id,
                            product_count: count
                        }
                    }
                }
            })
        }
        return await this.getOrderById(id);
    }

    public async getOrderById(id){
        const _order = await this.db.order.findUnique({
            where: {
                id
            },
            include: {
                orderProducts: {
                    include: {
                        product: true
                    }
                }
            }

        })

        return _order;
    }

    public async getAllOrdersByClientId(client_id){
        const _orders = await this.db.order.findMany({
            where: {
                client_id
            },
            include: {
                orderProducts: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return _orders;
    }

    public async getAllOrdersByAccountId(account_id, status?){
        const _account = await this.db.account.findUnique({
            where: {
                id: account_id
            },
            include: {
                bot: {
                    include: {
                        clients: {
                            include: {
                                orders: true
                            }
                        }
                    }
                }
            }
        })
        let _orders: Order[] = []
        _account.bot.clients.map(v=> v.orders.map(o=>_orders.push(o)))

        if (status){
            _orders = _orders.filter(v=> v.status == status)
        }
        return _orders;
    }

    public async deleteOrderById(id, client_id){
        const _order = await this.db.order.delete({
            where:{
                id,
                client_id
            }
        })
        return _order
    }
}