
import { member } from '@prisma/client';
import { PointsLackError, FriendLimitError, FriendAlreadyError, FriendAddError, FriendNotExistError } from '../entity/bizError.js';
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
    if(memberId == friendId){
        throw new FriendAddError();
    }
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
        console.error("removeFriend1:",error);
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
        console.error("removeFriend2:",error);
    }
 
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