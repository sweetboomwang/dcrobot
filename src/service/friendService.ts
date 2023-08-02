
import { member } from '@prisma/client';
import { PointsLackError, FriendLimitError, FriendAlreadyError } from '../entity/bizError.js';
import {prisma} from './../init.js';
import { getMember, initMember } from './memberService.js';

export const FRIEND_POINTS = 30;
export const FRIEND_LIMIT= 2;

/**
 * 扣除积分加好友
 * @param memberId 
 * @param friendId 
 */
export async function addFriend(memberId:bigint,friendId:bigint){
    console.log("addFriend memberId:"+memberId+" friendId:"+friendId);
    let balance = 0;
    try {
        const m1 = await getMember(memberId);
        balance = m1.points;
        console.log("m1.points:"+m1.points);
    } catch (MemberNotExistError) {
        console.error("MemberNotExistError");
    }
    try {
        const m2 = await getMember(friendId);
    } catch (MemberNotExistError) {
        console.error("MemberNotExistError");
    }
     
    
    if(balance < FRIEND_POINTS){
        throw new PointsLackError();
    }

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

    const c3 = await prisma.friend.count({
        where:{
            m1_id:friendId,
            m2_id:memberId,
            status:1
        }
    })
    if(c3 > 0){
        throw new FriendAlreadyError();
    }
    
    const c1 = await prisma.friend.count({
        where:{
            m1_id:memberId,
            status:1
        }
    });
    if(c1 >= FRIEND_LIMIT){
        throw new FriendLimitError();
    }
    
    await prisma.$transaction(async (prisma:any) => {
        //扣减积分
        await prisma.member.update({
            where:{
                member_id:memberId
            },
            data:{
                points:{
                    decrement: Math.abs(FRIEND_POINTS),
                }
            }
        })
        //加好友
        await prisma.friend.create({
            data:{
                m1_id:memberId,
                m2_id:friendId,
                status:1
            }
        })
        //添加记录
        await prisma.points_log.create({
            data:{
                from_id:memberId,
                to_id:0,
                type:1,
                points:-FRIEND_POINTS
            }
        })
        
    });
}

/**
 * 删除好友
 * @param memberId 
 * @param friendId 
 */
export async function removeFriend(memberId:bigint,friendId:bigint){
    console.log("removeFriend memberId:"+memberId+" friendId:"+friendId);
 
    await prisma.$transaction(async (prisma:any) => {
        console.log("friend.update 1");
        await prisma.friend.delete({
            where:{
                m1_id_m2_id:{
                    m1_id:memberId,
                    m2_id:friendId
                }
            }
        });
        console.log("friend.update 2");
        await prisma.friend.delete({
            where:{
                m1_id_m2_id:{
                    m1_id:friendId,
                    m2_id:memberId
                }
            }
        });
        
    });
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
    const f2 = await prisma.friend.findMany({
        where:{
            m2_id:memberId,
            status:1
        }
    })
    let fs = new Array();
    fs.push(f1);
    fs.push(f2);
    if(!fs){
        return new Array();
    }
    const rs = new Array();
    fs.forEach(f => {
        console.log("findFriends-forEach rs:",f);
        rs.push(f.m2_id);
    })
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