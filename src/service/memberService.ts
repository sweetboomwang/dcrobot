
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
    const m = await prisma.member.findUnique({
        where:{
            member_id:memberId
        }
    });
    if(m){
        return m;
    }
    throw new MemberNotExistError();
}


export async function initMember(memberId:bigint):Promise<member>{
    console.log("initMember:",memberId);
    try {
        return await getMember(memberId);
    } catch (MemberNotExistError) {
        await prisma.member.create({
            data:{
                member_id:memberId,
                wallet:"",
                points:200
            }
        })
    }
    return await getMember(memberId);
}
