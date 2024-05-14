import { PrismaClient } from "@prisma/client";
import AuthDataService from "./auth";
import UserDataService from "./user";
import Utils from "../utils";
import AccountDataService from "./account";
import ProductDataService from "./products";
import BasketDataService from "./baskets";
import BotDataService from "./bot";
import CategoryDataService from "./categories";
import ClientDataService from "./clients";
import OrderDataService from "./orders";
import DeliveryDataService from "./delivery";

export default interface IDatabase {
    authDataService: AuthDataService,
    userDataService: UserDataService,
    accountDataService: AccountDataService,
    productDataService: ProductDataService,
    baskDataService: BasketDataService,
    botDataService: BotDataService,
    categoriesDataService: CategoryDataService,
    clientsDataService: ClientDataService,
    orderDataService: OrderDataService,
    deliveryDataService: DeliveryDataService,
}

export class Database implements IDatabase {
    private db: PrismaClient;
    private utils: Utils;

    constructor(utils: Utils) {
        this.db = new PrismaClient()
        this.utils = utils

        this.authDataService = new AuthDataService(this.db, this.utils);
        this.userDataService = new UserDataService(this.db);
        this.accountDataService = new AccountDataService(this.db);
        this.productDataService = new ProductDataService(this.db);
        this.baskDataService = new BasketDataService(this.db);
        this.botDataService = new BotDataService(this.db)
        this.categoriesDataService = new CategoryDataService(this.db)
        this.clientsDataService = new ClientDataService(this.db)
        this.orderDataService = new OrderDataService(this.db)
        this.deliveryDataService = new DeliveryDataService(this.db)
    }
    deliveryDataService: DeliveryDataService;
    baskDataService: BasketDataService;
    botDataService: BotDataService;
    categoriesDataService: CategoryDataService;
    clientsDataService: ClientDataService;
    orderDataService: OrderDataService;
    accountDataService: AccountDataService;
    productDataService: ProductDataService;
    authDataService: AuthDataService;
    userDataService: UserDataService;

    public getDB(){
        return this.db
    }
}