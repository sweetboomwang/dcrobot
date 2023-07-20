import {prisma} from './../init.js';

export enum EventTypeEnum{
    Other,
    Friend,
}

export async function changePoints(from_id:bigint,to_id:bigint,points:number,eventType:EventTypeEnum){
    try {
        return await prisma.points_log.create({
            data:{
                from_id:from_id,
                to_id:to_id,
                type:eventType,
                points:points
            }
        });
    } catch (error) {
        console.log('changePoints error:',error);
    }
}

export async function countPoints():Promise<Number>{
    try {
        return await prisma.points_log.count({

        })
    } catch (error) {
        console.log('changePoints error:',error);
    }
    return 0;
}