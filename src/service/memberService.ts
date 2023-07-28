
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
    return initMember(memberId);
    // throw new MemberNotExistError();
}


export async function initMember(memberId:bigint):Promise<member>{
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
    return await getMember(memberId);
}
