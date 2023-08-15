
import { member } from '@prisma/client';
import { PointsLackError, FriendLimitError, FriendAlreadyError, FriendNotExistError, LeaderCantAddFriendError, OnlyOneFriendError, NoUpperFriendError, LeaderCantRemoveFriendError, RemoveFriendCDError, FriendAddSelfError } from '../entity/bizError.js';
import { REDIS_REMOVE_FRIEND_TTL } from '../entity/constants.js';
import {prisma, redisClient} from './../init.js';
import { getMember, initMember } from './memberService.js';

export const FRIEND_POINTS = 30;
export const FRIEND_LIMIT= 2;

const teamLeaders = [
    //大航海 - 0xcjl.eth   jialin
    "692748111608545361",
    //康师傅   - jamk
    "816550901715828787",
    //LeDAO - picrnicrsaisai
    "1106099404034818078",
    //PFPDAO - _scoluo
    "770287671699701770",
    //Crypto Bar - clivedavis
    "873058288680468542",
    //NovaDAO - sevenyang
    "1039807128631771218",
    //weeping club - mailajinbao
    "1125680403794112523"
];

/**
 * 扣除积分加好友
 * @param memberId 
 * @param friendId 
 */
export async function addFriend(memberId:bigint,friendId:bigint){
    console.log("addFriend memberId:"+memberId+" friendId:"+friendId);
    if(memberId == friendId){
        throw new FriendAddSelfError();
    }
    let balance = 0;

    if(isTeamLeader(memberId)){
        throw new LeaderCantAddFriendError();
    }

    try {
        const m1 = await getMember(memberId);
    } catch (MemberNotExistError) {
        console.error("MemberNotExistError");
    }
    try {
        const m2 = await getMember(friendId);
    } catch (MemberNotExistError) {
        console.error("MemberNotExistError");
    }

    //判断是否有好友
    const c1 = await prisma.friend.count({
        where:{
            m1_id:memberId,
            status:1
        }
    })
    if(c1 > 0){
        throw new OnlyOneFriendError();
    }

    //判断是否已经是好友
    const c2 = await prisma.friend.count({
        where:{
            m1_id:memberId,
            m2_id:friendId,
            status:1
        }
    })
    if(c2 > 0){
        throw new FriendAlreadyError();
    }

    if(!teamLeaders.includes(String(friendId))){
        //如果被加好友不是队长
        const c3 = await prisma.friend.count({
            where:{
                m1_id:friendId,
                status:1
            }
        })
        if(c3 == 0){
            throw new NoUpperFriendError();
        }
    }

    await addToDao(memberId,friendId);
   
}


async function addToDao(memberId:bigint,friendId:bigint){
    await prisma.friend.create({
        data:{
            m1_id:memberId,
            m2_id:friendId,
            status:1
        }
    })
}

function isTeamLeader(memberId:bigint){
    return teamLeaders.includes(String(memberId));
}

/**
 * 删除好友
 * @param memberId 
 * @param friendId 
 */
export async function removeFriend(memberId:bigint,friendId:bigint){
    if(isTeamLeader(memberId)){
        throw new LeaderCantRemoveFriendError();
    }
    const r = await redisClient.ttl(formatKey(REDIS_REMOVE_FRIEND_TTL,String(memberId)));
    if(r > 0){
        const h = Math.ceil(r/3600);
        throw new RemoveFriendCDError(`${h}`);
    }
    const rs1 = await prisma.friend.findFirst({
        where:{
            m1_id:memberId,
            m2_id:friendId
        }
    })
    const rs2 = await prisma.friend.findFirst({
        where:{
            m1_id:friendId,
            m2_id:memberId
        }
    })
    if(!rs1 && !rs2){
        throw new FriendNotExistError();
    }
    console.log("removeFriend memberId:"+memberId+" friendId:"+friendId);
    try {
        await prisma.friend.delete({
            where:{
                m1_id_m2_id:{
                    m1_id:memberId,
                    m2_id:friendId
                }
            }
        });
    } catch (error) {
        // console.error("removeFriend1:",error);
    }
    try {
        await prisma.friend.delete({
            where:{
                m1_id_m2_id:{
                    m1_id:friendId,
                    m2_id:memberId
                }
            }
        });
    } catch (error) {
        // console.error("removeFriend2:",error);
    }
    await redisClient.setEx(formatKey(REDIS_REMOVE_FRIEND_TTL,String(memberId)),30*24*3600,"1");
}

/**
 * 根据memberId查询相关好友
 * @param memberId 
 * @returns 
 */
export async function findFriends(memberId:bigint):Promise<Array<member>>{
    const f1 = await prisma.friend.findMany({
        where:{
            m1_id:memberId,
            status:1
        }
    })
    const rs = new Array();
    f1.forEach(f => {
        console.log("findFriends-forEach rs:",f);
        rs.push(f.m2_id);
    })

    const f2 = await prisma.friend.findMany({
        where:{
            m2_id:memberId,
            status:1
        }
    })
    f2.forEach(f => {
        console.log("findFriends-forEach rs:",f);
        rs.push(f.m1_id);
    })
    if(!rs){
        return rs;
    }
    const members = await prisma.member.findMany({
        where:{
            member_id:{
                in:rs
            }
        },
    });
    console.log("findFriends-members:",members);
    return members;

}

function formatKey(a:string,b:string){
    return a + ":" + b;
}