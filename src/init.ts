import * as fs from 'fs';
import pkg from '@prisma/client';
import * as dotenv from 'dotenv'

dotenv.config() // Load the environment variables
console.log(`The connection URL is ${process.env.DATABASE_URL}`)

const {PrismaClient} = pkg;

export const prisma = new PrismaClient();
export const config = initConfig();

// await redisClient.connect();
/**
 * 初始化配置
 * @return {any}
 */
 export function initConfig() : any {
    // let file = 'config_test.json';
    // let flag = !process.env.flag && process.env.flag =='prod';
    // flag = true;
    // if(flag){
    //   file = 'config.json';
    //   console.log('start in prod with config.json');
    // }else{
    //   console.log('start in test with config_test.json');
    // }
    let file = process.env.config_json;
    file = 'config.json';
    console.log('start with:'+file);
    if(!file){
      file = 'config_test.json';
    }
    return JSON.parse(fs.readFileSync('./src/config/'+ file, 'utf8'));
  }
  