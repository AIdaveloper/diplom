import Utils from "./utils";
import Api from "./api";
import { Database } from "./db/db";
import TelegramBot from "node-telegram-bot-api";
import BotManager from "./bot";

async function main() {
  const utils = new Utils();
  const db = new Database(utils);
  const botManager = new BotManager(db, utils);
  const api = new Api(db, botManager, utils)
  api.init()
  botManager.init()

  // let scenario = {1: {}}
  // let users = []
  // const bot = new TelegramBot('7074419488:AAEfsMrfSxVsmBTdJDlQUJ7dO7CUQCOveMg', {

  //   polling: {
  //     interval: 300,
  //     autoStart: true
  //   }
  
  // });
  // console.log(await bot.getMe())
  // bot.on("polling_error", err => {
  //   console.log(err);
  //   bot.stopPolling()
  // });
  // bot.on('text', async msg => {

  //   console.log(msg);
  //   bot.sendMessage(msg.chat.id, msg.text, {reply_markup: {
  //     keyboard: [[{text:'asd'}]]
  //   }})
  //   bot.sendMessage(msg.chat.id, msg.text, {reply_markup: {
  //     keyboard: [[{
  //       text: 'string',
  //       web_app: {url:'https://stackoverflow.com/questions/45520706/how-to-kill-nodemon-process-on-mac'}
  //     }]]
  //   }})
  // })

}

main()