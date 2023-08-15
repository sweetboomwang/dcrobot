
import { member } from '@prisma/client';
import { MemberNotExistError } from '../entity/bizError.js';
import {prisma, redisClient} from './../init.js';

import { userMention } from '@discordjs/builders';
import { getRedisKey } from '../tools/tools.js';
import { REDIS_INIT_STATUS } from '../entity/constants.js';



export async function getMemberPoints(memberId:bigint):Promise<number>{

    const m = await getMember(memberId);
    if(m){
        return m.points;
    }
    return 0;
}

export async function getMember(memberId:bigint):Promise<member>{
    let m = await prisma.member.findFirst({
        where:{
            member_id:memberId
        }
    });
    if(m){
        return m;
    }
    // await initMember(memberId);
    m = await prisma.member.findFirst({
        where:{
            member_id:memberId
        }
    });
    if(m){
        return m;
    }
    throw new MemberNotExistError();
}


export async function initMember(memberId:bigint,nickname:string):Promise<void>{
    const status = await redisClient.hGet(getRedisKey([REDIS_INIT_STATUS]),String(memberId));
    if(status){
        return;
    }
    console.log("initMember:",memberId,nickname);
    try {
        const m = await prisma.member.findFirst({
            where:{
                member_id:memberId
            }
        })
        if(m){
            await prisma.member.update({
                data:{
                    nickname:nickname
                },
                where:{
                    member_id:memberId
                }
            })
        }else{
            await prisma.member.create({
                data:{
                    member_id:memberId,
                    wallet:"",
                    points:200,
                    nickname:nickname
                }
            })
        }
    } catch (error) {
        console.error(error);
    }finally{
        await redisClient.hSet(getRedisKey([REDIS_INIT_STATUS]),String(memberId),"1");
    }
}
