import * as fs from 'fs';
import pkg from '@prisma/client';
import * as dotenv from 'dotenv'
import { createClient } from 'redis';

// dotenv.config() // Load the environment variables
console.log(`The connection URL is ${process.env.DATABASE_URL}`)

const {PrismaClient} = pkg;

export const prisma = new PrismaClient();

export const redisClient = await initRedis();

await redisClient.connect();
console.log("*********** redisClient connected ***********************");
console.log("*********** redisClient connected ***********************");
console.log("*********** redisClient connected ***********************");


async function initRedis(){
  let redisUrl = process.env.redis_url;
  if(!redisUrl){
    redisUrl = 'redis://:Wch@123456@localhost:6379';
  }
  const client = createClient({url:redisUrl}).on('error', err => console.log('Redis Client Error', err));
  return client;
}