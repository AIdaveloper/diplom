import { StatusCodes } from "http-status-codes";
import Utils from "../utils";
import IDatabase from "../db/db";
import { Router } from "express";
import BotManager from "../bot";
import { UploadedFile } from "express-fileupload";
import fs, { stat } from 'fs'

export default class UserApi {
    private router: Router;
    constructor(db: IDatabase, botManager: BotManager, utils: Utils){
        this.router = Router()  
        this.router.get('/', async (req, res, next) => {
            try {
                const payload = req['payload']
                const _user = await db.userDataService.findUserById(payload.user_id);
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _user
                });
            } catch (err) {
                return next(err);
            }
            
        })
        this.router.post('/logout', async (req, res, next) => {
            res.send("Express + TypeScript Server");
            
        })
        this.router.get('/getBot', async (req, res, next) => {
            try{
                const payload = req['payload']
                const _user = await db.userDataService.findUserById(payload.user_id);
                let _bot = await db.botDataService.getBotAccountId(_user.account_id);

                if (!_bot){
                    return next({
                        status: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: 'Internal error',
                    })

                }
                res.status(StatusCodes.OK)
                    return res.json({
                        ok: true,
                        data: _bot
                    });
            } catch (err) {
              return next(err);
            }
        })
        this.router.post('/setBotToken', async (req, res, next) => {
            try {
                const { token } = req.body;
                const payload = req['payload']
                console.log(req.body)
                console.log(payload)


                if (!payload || !token) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: {token} are missing',
                    })
                }

                const _user = await db.userDataService.findUserById(payload.user_id);
                let _bot = await db.botDataService.getBotAccountId(_user.account_id);
                _bot = await db.botDataService.updateBotTokenById(_bot.id, _bot.account_id, token);  
                try {
                    const bot = await botManager.startBot(_bot.id, _bot.account_id);
                    const id = (await bot.getMe()).id
                } catch(e) {
                    _bot = await db.botDataService.updateBotTokenById(_bot.id, _bot.account_id, null);  
                    await botManager.stopBot(_bot.id, _bot.account_id);
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Incorrect token',
                    })
                }
                // const bot
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.post('/setBotWelcomeText', async (req, res, next) => {
            try {
                const { text } = req.body;
                const payload = req['payload']
                console.log(req.body)
                console.log(payload)


                if (!payload || !text) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: {text} are missing',
                    })
                }

                const _user = await db.userDataService.findUserById(payload.user_id);
                let _bot = await db.botDataService.getBotAccountId(_user.account_id);
                _bot = await db.botDataService.updateBotScenarioTokenById(_bot.id, _bot.account_id, {
                    "1": {
                      "next": "2",
                      "text": text,
                      "type": "msg"
                    },
                    "2": {
                      "btns": {
                        "ref": {
                          "asd": "2",
                          "start": "1",
                          "menu": "2"
                        },
                        "btns": {
                          "reply_markup": {
                            "keyboard": [
                              [
                                {
                                  "text": "menu"
                                },
                                {
                                  "text": "start"
                                }
                              ],
                              [
                                {
                                  "text": "App",
                                  "web_app": {
                                    "url": "https://mcn-dev.zoup.online/clients/"
                                  }
                                }
                              ]
                            ]
                          }
                        }
                      },
                      "text": "Open this app",
                      "type": "btns"
                    }
                }); 
                // console.log('asd')
            
                res.status(StatusCodes.OK)
                res.json({
                    ok: true
                });
                return 
            } catch (err) {
              return next(err);
            }
        });
        this.router.post('/createProduct', async (req, res, next) => {
            try {
                let { name, weight, count, price, category_id } = req.body;
                const payload = req['payload']
                // console.log(req.body)
                // console.log(req.files)
                if (!req.files || Object.keys(req.files).length === 0) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: "No image were uploaded."
                    })
                    return res.status(400).send('No files were uploaded.');
                }


                if (!payload || !name || !weight || !count || !price || !category_id ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { name, weight, count, price, category_id } are missing',
                    })
                }
                weight = Number(weight)
                count = Number(count)
                price = Number(price)
                category_id = Number(category_id)

                const _user = await db.userDataService.findUserById(payload.user_id);
                const _category = await db.categoriesDataService.getCategoryByIdAndAccountId(category_id, _user.account_id);
                if (!_category) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad category',
                    })
                }
                let _product = await db.productDataService.createProduct({name, weight, count, price, image_link: '', category_id, account_id: _user.account_id});
                if (!_category) {
                    return next({
                        status: StatusCodes.INTERNAL_SERVER_ERROR,
                        message: 'Internal error',
                    })
                }
                // let _bot = await db.botDataService.getBotAccountId(_user.account_id);
                // _bot = await db.botDataService.updateBotTokenById(_bot.id, _bot.account_id, token);  
                // if (!req.files || Object.keys(req.files).length === 0) {
                //     return res.status(400).send('No files were uploaded.');
                // }
                
                let uploadedFiles: UploadedFile | UploadedFile[] = req.files['uploadedFiles'];
                // console.log(JSON.stringify(uploadedFiles))
                if (!Array.isArray(uploadedFiles)) {
                  uploadedFiles = [uploadedFiles];
                }
                let file = null
                for (file of (uploadedFiles as UploadedFile[])){
                    if (!fs.existsSync(`image_folder/${_user.account_id}/`)){
                        fs.mkdirSync(`image_folder/${_user.account_id}/`);
                    }
                    // console.log(file)
                    file.mv(`image_folder/${_user.account_id}/${_product.id}.${file.name.split('.')[file.name.split('.').length-1]}`, (err) => {
                        if (err) {
                        return res.status(500).send(err);
                        }
                    });
                }
                _product = await db.productDataService.updateProductById(_product.id, _product.account_id, {image_link: `${_user.account_id}/${_product.id}.${file.name.split('.')[file.name.split('.').length-1]}`})
                // const bot
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _product
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/getProduct/:product_id', async (req, res, next) => {
            try {
                const { product_id } = req.params;
                const payload = req['payload']
                

                if (!payload || !product_id ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { product_id } are missing',
                    })
                }

                const _user = await db.userDataService.findUserById(payload.user_id);
                const _product = await db.productDataService.getProductByIdAndAccountId(product_id, _user.account_id);
                if (!_product) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad product id',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _product
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.delete('/deleteProduct/:product_id', async (req, res, next) => {
            try {
                let { product_id } = req.params;
                const payload = req['payload']
                

                if (!payload || !product_id ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { product_id } are missing',
                    })
                }

                const _user = await db.userDataService.findUserById(payload.user_id);
                const _product = await db.productDataService.deleteProductById(Number(product_id), _user.account_id);
                if (!_product) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad product id',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _product
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.post('/changeProduct:product_id', async (req, res, next) => {
            try {
                const { product_id } = req.params;
                const {name, weight, count, price, category_id} = req.body
                const payload = req['payload']
                

                if (!payload || !product_id ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { product_id } are missing',
                    })
                }

                const _user = await db.userDataService.findUserById(payload.user_id);
                const _product = await db.productDataService.updateProductById(Number(product_id), _user.account_id, {name, weight, count, price, category_id});
                if (!_product) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad product id',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _product
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.post('/createCategory', async (req, res, next) => {
            try {
                const { name } = req.body;
                const payload = req['payload']
                
    
                if (!payload || !name ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { name } are missing',
                    })
                }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
                const _category = await db.categoriesDataService.createCategory({name, account_id: _user.account_id});
                if (!_category) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad category name',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _category
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.delete('/deleteCategory/:category_id', async (req, res, next) => {
            try {
                const { category_id } = req.params;
                const payload = req['payload']
                

                if (!payload || !category_id ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { category_id } are missing',
                    })
                }

                const _user = await db.userDataService.findUserById(payload.user_id);
                const _category = await db.categoriesDataService.deleteCategoryById(Number(category_id), _user.account_id);
                if (!_category) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad _category id',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _category
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/getCategories', async (req, res, next) => {
            try {
                const payload = req['payload']
                
    
                // if (!payload ) {
                //     return next({
                //         status: StatusCodes.BAD_REQUEST,
                //         message: 'Some required fields: { name } are missing',
                //     })
                // }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
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
        this.router.get('/getAllProducts', async (req, res, next) => {
            try {
                const payload = req['payload']
                
    
                // if (!payload ) {
                //     return next({
                //         status: StatusCodes.BAD_REQUEST,
                //         message: 'Some required fields: { name } are missing',
                //     })
                // }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
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
        this.router.get('/getAllProducts/:category', async (req, res, next) => {
            try {
                const {category} = req.params
                const payload = req['payload']
                
    
                if (!payload || !category) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { category } are missing',
                    })
                }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
                const _products = await db.productDataService.getAllProductsByCategoryIdAndAccountId(category, _user.account_id);
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
        this.router.post('/createDelivery', async (req, res, next) => {
            try {
                const { name } = req.body;
                const payload = req['payload']
                
    
                if (!payload || !name ) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { name } are missing',
                    })
                }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
                const _delivery = await db.deliveryDataService.createDelivery({name, account_id: _user.account_id});
                if (!_delivery) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad category name',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _delivery
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/getDeliveries', async (req, res, next) => {
            try {
                const payload = req['payload']
                
    
                // if (!payload ) {
                //     return next({
                //         status: StatusCodes.BAD_REQUEST,
                //         message: 'Some required fields: { name } are missing',
                //     })
                // }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
                const _deliveries = await db.deliveryDataService.getAllCategoriesByAccountId(_user.account_id);
                if (!_deliveries) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad category',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _deliveries
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.post('/setOrderStatus', async (req, res, next) => {
            try {
                const {status, order_id, delivery_id} = req.body
                const payload = req['payload']
                
    
                if (!payload || !status) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { status } are missing',
                    })
                }
                if (["prepare", "cooking", "wating", "delivery", "delivered"].indexOf(status) == -1){

                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Incorrect status',
                    })
                }

                if (status == "delivery" && !delivery_id){
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { status, delivery_id } are missing',
                    })

                }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
                let _order = await db.orderDataService.getOrderById(Number(order_id));
                if (!_order) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad order_id',
                    })
                }
                let _delivery = null;
                if (delivery_id){
                    _delivery = await db.deliveryDataService.getDeliveryByIdAndAccountId(Number(delivery_id), _user.account_id);
                    if (!_delivery){
                        return next({
                            status: StatusCodes.BAD_REQUEST,
                            message: 'Bad delivery_id',
                        })
                    }
                }
                let _client = await db.clientsDataService.getClientById(_order.client_id);
                if (!_client) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad order_id',
                    })
                }
                let __order = await db.orderDataService.updateOrderDeliveryById(_order.id, _client.id, {status: status, delivery_id: _delivery? _delivery.id : _order.delivery_id});
            
                const _bot = await db.botDataService.getBotAccountId(_user.account_id);
                if (status == "cooking"){
                    botManager.sendMessage(_bot.id, _client.id, _user.account_id, "Your order cooking")
                } else if (status == "wating"){
                    botManager.sendMessage(_bot.id, _client.id, _user.account_id, "Your order waiting for delivery")
                } else if (status == "delivery"){
                    botManager.sendMessage(_bot.id, _client.id, _user.account_id, `Your order delivered by ${_delivery.name}`)
                } else if (status == "delivery"){
                    botManager.sendMessage(_bot.id, _client.id, _user.account_id, `Your order delivered. Thank you`)
                }


                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: __order
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/getOrders', async (req, res, next) => {
            try {
                const payload = req['payload']
                const {status } = req.body
    
                // if (!payload ) {
                //     return next({
                //         status: StatusCodes.BAD_REQUEST,
                //         message: 'Some required fields: { name } are missing',
                //     })
                // }
                // console.log(status)
                if (status && ["prepare", "cooking", "wating", "delivery", "delivered"].indexOf(status) == -1){

                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Incorrect status',
                    })
                }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
                const _orders = await db.orderDataService.getAllOrdersByAccountId(_user.account_id, status);
                if (!_orders) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad orders',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _orders
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.get('/Order/:id', async (req, res, next) => {
            try {
                const payload = req['payload']
                const {id } = req.params
    
                if (!payload || !id) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: { id } are missing',
                    })
                }
    
                const _user = await db.userDataService.findUserById(payload.user_id);
                const _order = await db.orderDataService.getOrderById(Number(id));
                if (!_order) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Bad orders',
                    })
                }
            
                res.status(StatusCodes.OK)
                return res.json({
                    ok: true,
                    data: _order
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