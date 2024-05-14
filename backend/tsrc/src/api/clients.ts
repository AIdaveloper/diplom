import { StatusCodes } from "http-status-codes";
import Utils from "../utils";
import IDatabase from "../db/db";
import { Router } from "express";
import BotManager from "../bot";
import { UploadedFile } from "express-fileupload";
import fs, { stat } from 'fs'
import CategoryDataService from "../db/categories";

export default class ClientsApi {
    private router: Router;
    constructor(db: IDatabase, botManager: BotManager, utils: Utils){
        this.router = Router()
        this.router.post('/Basket', async (req, res, next) => {
            try {
                const { product_id, count } = req.body;
                const payload = req['payload']


                if (!payload || !product_id || !count ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { product_id, count } are missing',
                    })
                }

                const _client = await db.clientsDataService.getClientById(payload.client_id);
                const _product = await db.productDataService.getProductByIdAndAccountId(Number(product_id), _client.account_id)
                if (!_product) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad product',
                    })
                }
                let _basket = await db.baskDataService.getBasketByProductidAndClientId(Number(product_id), _client.account_id);
                
                if (!_basket) {
                    _basket = await db.baskDataService.createBasket({client_id: _client.id, product_id: _product.id, count})
                } else {
                    if (count < 0 && count >= -1* _basket.count){
                        _basket = await db.baskDataService.deleteBasketById(_basket.id, _client.id)
                    } else {
                        _basket = await db.baskDataService.updateBasketById(_basket.id, _client.id, count);
                    }
                }
                if (!_basket) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad product',
                    })
                }
                botManager.sendMessage(_client.bot_id, _client.id, _client.account_id, `Product added to basket: Name: ${_product.name}, Count: ${count}, Price: ${_product.price*Number(count)}p`);
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _basket
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/Basket', async (req, res, next) => {
            try {
                const payload = req['payload']


                // if (!payload || !product_id || !count ) {
                //     return next({
                //         status: StatusCodes.BAD_REQUEST,
                //         message: 'Some required fields: { product_id, count } are missing',
                //     })
                // }

                const _client = await db.clientsDataService.getClientById(payload.client_id);
                let _basket = await db.baskDataService.getAllBasketsByClientId(_client.id);
                if (!_basket) {
                    return next({
                        status: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: 'internal',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _basket
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.post('/Order', async (req, res, next) => {
            try {
                const { address } = req.body;
                const payload = req['payload']


                if (!payload || !address) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { address } are missing',
                    })
                }

                const _client = await db.clientsDataService.getClientById(payload.client_id);
                let _basket = await db.baskDataService.getAllBasketsByClientId(_client.id);
                if (!_basket) {
                    return next({
                        status: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: 'internal',
                    })
                }
                let _order = await db.orderDataService.createOrder({client_id: _client.id, address})
                for (let product of _basket){
                    let _product = await db.productDataService.getProductByIdAndAccountId(product.product_id, _client.account_id);
                    const pcount = _product.count - product.count 
                    _order = await db.orderDataService.changeProductCount(_order.id, _client.id, product.product_id, pcount >= 0? product.count : _product.count);
                    _product = await db.productDataService.updateProductById(product.product_id, _client.account_id, {count: pcount >= 0? pcount : 0})
                }
                let __order = await db.orderDataService.getOrderById(_order.id);
                let msg = 'Your order created\nYour Products:\n'
                let price = 0
                __order.orderProducts.map(v=>{
                    msg = msg + `Product: ${v.product.name}, Count: ${v.product_count}, Price: ${v.product_count* v.product.price}`;
                    price += v.product_count* v.product.price
                })
                botManager.sendMessage(_client.bot_id, _client.id, _client.account_id, msg);
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _order
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/Products', async (req, res, next) => {
            try {
                const payload = req['payload']
                
    
                // if (!payload ) {
                //     return next({
                //         status: StatusCodes.BAD_REQUEST,
                //         message: 'Some required fields: { name } are missing',
                //     })
                // }
    
                const _user = await db.clientsDataService.getClientById(payload.client_id);
                const _products = await db.productDataService.getAllProductsByAccountId(_user.account_id);
                if (!_products) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad products',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _products
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/Categories', async (req, res, next) => {
            try {
                const payload = req['payload']
                
    
                // if (!payload ) {
                //     return next({
                //         status: StatusCodes.BAD_REQUEST,
                //         message: 'Some required fields: { name } are missing',
                //     })
                // }
    
                const _user = await db.clientsDataService.getClientById(payload.client_id);
                const _categories = await db.categoriesDataService.getAllCategoriesByAccountId(_user.account_id);
                if (!_categories) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad category',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _categories
                });
            } catch (err) {
              return next(err);
            }
        });
    }
    

    public getRoutes(){
        return this.router
    }
}