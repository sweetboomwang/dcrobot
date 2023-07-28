
import { member } from '@prisma/client';
import { MemberNotExistError } from '../entity/bizError.js';
import {prisma} from './../init.js';


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
    await initMember(memberId);
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


export async function initMember(memberId:bigint):Promise<void>{
    console.log("initMember:",memberId);
    try {
        await prisma.member.create({
            data:{
                member_id:memberId,
                wallet:"",
                points:200
            }
        })
    } catch (error) {
        console.error(error);
    }
}
