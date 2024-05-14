import express, { Router, Express } from "express";
import Utils from "../utils";
import AuthApi from "./auth";
import IDatabase from "../db/db";
import errorMiddleware from "./middlewares/error";
import cors from 'cors';

import multer from 'multer'
import fs from 'fs'
import fileUpload, { UploadedFile } from "express-fileupload";
import UserApi from "./users";
import BotManager from "../bot";
import isAuthenticated from "./middlewares/auth";
import isClientAuthenticated from "./middlewares/clientAuth";
import ClientsApi from "./clients";
import { StatusCodes } from "http-status-codes";
// import path from 'path'



export default class Api {
    // private router: Router;
    private app: Express;
    private authApi: AuthApi;
    private userApi: UserApi;
    private clientsApi: ClientsApi;

    constructor(db: IDatabase, botManager: BotManager, utils: Utils){
        // this.router = Router()
        this.authApi = new AuthApi(db, utils)
        this.userApi = new UserApi(db, botManager, utils);
        this.clientsApi = new ClientsApi(db, botManager, utils);

    }

    public async init(){
        const port = process.env.PORT || 3000;
        this.app = express();
        this.app.use(cors({
            origin: ['http://localhost:3001', 'http://localhost:8080', ]
          }));
        this.app.use(express.json())

        // -------------------------------

        // this.app.use(multer().single('photos'))

        
        // this.app.use(function(req, res, next) {
        //     res.header("Access-Control-Allow-Origin", "http://localhost:8081");
        //     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     next();
        // });
        this.app.use(fileUpload());
        

        // this.app.post('/upload', (req, res) => {
        //     if (!req.files || Object.keys(req.files).length === 0) {
        //       return res.status(400).send('No files were uploaded.');
        //     }
          
        //     let uploadedFiles: UploadedFile | UploadedFile[] = req.files['uploadedFiles'];
          
        //     if (!Array.isArray(uploadedFiles)) {
        //       uploadedFiles = [uploadedFiles];
        //     }
          
        //     (uploadedFiles as UploadedFile[]).forEach((file: UploadedFile) => {
        //         if (!fs.existsSync('image_folder/1/')){
        //             fs.mkdirSync('image_folder/1/');
        //         }
        //         file.mv(`image_folder/1/${file.name}`, (err) => {
        //             if (err) {
        //             return res.status(500).send(err);
        //             }
        //         });
        //     });
          
        //     res.send('Files uploaded!');
        //   });

        // -------------------------------

        this.app.use('/auth', this.authApi.getRoutes());
        this.app.use('/user', isAuthenticated, this.userApi.getRoutes());
        this.app.use('/clients', isClientAuthenticated, this.clientsApi.getRoutes());


        this.app.get("/", (req, res) => {
            res.send("Express + TypeScript Server");
        });
        this.app.post('/logout', (req, res) => {
            res.send("Express + TypeScript Server");
        });

        this.app.get("/image/:account/:id", (req, res, next) => {
            const {account, id} = req.params
            try{
                if (!fs.existsSync(`image_folder/${account}/${id}`)){
                    throw new Error('no image')
                }
                res.sendFile(`image_folder/${account}/${id}`, {root:'.'});
            } catch(e){
                
                return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'No image',
                })
            }
        });
        
        this.app.use(errorMiddleware)

        this.app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    }
}