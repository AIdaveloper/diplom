import TelegramBot from "node-telegram-bot-api";
import IDatabase from "../db/db";
import { Bot, Client } from "@prisma/client";
import BotDataService from "../db/bot";
import { makeStrictEnum } from "@prisma/client/runtime/library";
import { kMaxLength } from "buffer";
import Utils from "../utils";

type blockType = {
    type: 'msg',
    text: string,
    next: string
} | {
    type: 'btns',
    text: string,
    btns: {
        btns: any,
        ref: any
    }
};

export default class BotManager {
    private db: IDatabase;
    private launchedBots: TelegramBot[];
    private utils: Utils;

    constructor(db: IDatabase, utils: Utils){
        this.db = db;
        this.launchedBots = []
        this.utils = utils
    }

    public async init(){
        const bots = await this.db.botDataService.getAllBotsWithAccount();
        bots.forEach(bot => {
            try {
                const _bot = this.initNewBot(bot);
                this.launchedBots[bot.id] = _bot;
            } catch(e){
                console.log(e)
            }
              
        });
    }

    private async messageSender(bot:TelegramBot, d_bot:Bot, client:Client){
        if (!client.position){
            let start: blockType = d_bot.scenario['1']
            if(!start) {
                bot.sendMessage(client.telegram_id, 'no bot scenario')
                return
            } else {
                client = await this.db.clientsDataService.updateClientPosition(client.id, client.account_id, '1')
                if (start.type == 'msg') {
                    bot.sendMessage(client.telegram_id, start.text || 'no text')
                    if (start.next){
                        this.messageSender(bot, d_bot, client);
                    } else {
                        bot.sendMessage(client.telegram_id, 'bot end')
                    }
                    return
                } else if(start.type == 'btns') {
                    bot.sendMessage(client.telegram_id, start.text || 'no text', start.btns.btns)
                    return
                }
                return
            }
        }
        let block: blockType = d_bot.scenario[client.position]
        if (!block){
            bot.sendMessage(client.telegram_id, 'bot end')
            client = await this.db.clientsDataService.updateClientPosition(client.id, client.account_id, null)
            return
        }
        if (block.type == 'msg'){
            bot.sendMessage(client.telegram_id, block.text || 'no text')
            client = await this.db.clientsDataService.updateClientPosition(client.id, client.account_id, block.next)
            this.messageSender(bot, d_bot, client);
            return
        } else if(block.type == 'btns'){
            // client = await this.db.clientsDataService.updateClientPosition(client.id, client.account_id, d_bot.scenario[block.next])
            let btns = block.btns.btns
            let rreply_markup = btns.reply_markup.keyboard
            for (let i = 0; i < rreply_markup.length; i++){
                for (let j =0; j< rreply_markup[i].length; j++){
                    if (rreply_markup[i][j]["web_app"]){
                        const t =  btns.reply_markup.keyboard[i][j]["web_app"]["url"]
                        const token = this.utils.generateClientAccessToken(client)
                        console.log(token)
                        btns.reply_markup.keyboard[i][j]["web_app"]["url"] = t + `?token=${token}` 
                    }
                }
            }
            bot.sendMessage(client.telegram_id, block.text || 'no text', btns)
            return

        }

    }

    private initNewBot(bot: Bot){
        const _bot = new TelegramBot(bot.token, {
            polling: {
              interval: 300,
              autoStart: true
            }
        });

        
        _bot.on("polling_error", err => {
            console.log(err);
            if (err.message.indexOf('401') != -1){
                _bot.stopPolling() 
            }
            // bot.stopPolling()
        });
        _bot.on('text', async msg => {
            console.log(msg);
            try {
                const t_bot = await this.db.botDataService.getBotByIdAndAccountId(bot.id, bot.account_id);
                let t_client = await this.db.clientsDataService.getClientByTelegramIdAndAccountId(msg.from.id, t_bot.account_id);
                if (!t_client){
                    t_client = await this.db.clientsDataService.createClient({telegram_id: msg.from.id, bot_id: t_bot.id, account_id: t_bot.account_id});
                    this.messageSender(_bot, t_bot, t_client)
                    return
                }
                let element: blockType = t_bot.scenario[t_client.position]
                if (element.type == 'btns'){
                    if (!element.btns.ref || !Object.keys(element.btns.ref).length){
                        _bot.sendMessage(t_client.telegram_id, 'bot end')
                        t_client = await this.db.clientsDataService.updateClientPosition(t_client.id, t_client.account_id, null)
                        return
                    } else {
                        if (element.btns.ref[msg.text]){
                            if (t_bot.scenario[element.btns.ref[msg.text]]){
                                t_client = await this.db.clientsDataService.updateClientPosition(t_client.id, t_client.account_id, element.btns.ref[msg.text])
                                this.messageSender(_bot, t_bot, t_client)
                                return
                            } else {
                                _bot.sendMessage(t_client.telegram_id, 'bot end')
                                t_client = await this.db.clientsDataService.updateClientPosition(t_client.id, t_client.account_id, null)
                                return
                            }
                        }
                    }
                }
            } catch(e){
                console.log(e)
            }

      
        })

        return _bot
    }

    public async sendMessage(bot_id, client_id, account_id, message){
        const client = await this.db.clientsDataService.getClientById(client_id);
        if (this.launchedBots[bot_id]) {
            this.launchedBots[bot_id].sendMessage(client.telegram_id, message)
        }
    }

    public async startBot(bot_id, account_id){
        const _bot = await this.db.botDataService.getBotByIdAndAccountId(bot_id, account_id);
        if (this.launchedBots[bot_id]) {
            this.stopBot(bot_id, account_id);
            delete this.launchedBots[bot_id];
        }
        let bot: TelegramBot | null
        try{
            bot = this.initNewBot(_bot)
            this.launchedBots[bot_id] = bot;
        } catch(e) {

        }
        return bot
    }

    // public async restartBot(bot_id, account_id){
    //     this.stopBot(bot_id, account_id);
    //     await this.startBot(bot_id, account_id);
    // }

    public stopBot(bot_id, account_id){
        const bot = this.launchedBots[bot_id]
        if (bot){
            bot.stopPolling()
        }
        return bot
    }
}