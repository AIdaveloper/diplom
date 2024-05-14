import { PrismaClient } from "@prisma/client";
import { AuthController } from "./auth";


export class Controller {
    private db: PrismaClient;
    public auth: AuthController;

    constructor(db: PrismaClient){
        this.db = db
        this.auth = new AuthController(this.db);
    }
}