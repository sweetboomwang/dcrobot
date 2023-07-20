import { member } from "@prisma/client";
import { addFriend, findFriends } from "../service/friendService.js";


async function addFriendTest(m1Id:bigint,m2Id:bigint){
    console.log("addFriend:",m1Id,m2Id);
    await addFriend(m1Id,m2Id);
}

async function findFriendTest(memberId:bigint){
    console.log("findFriend:",memberId);
    const rs = await findFriends(memberId);
    console.log("findFriend rs:",rs);
    rs.forEach(r =>{
        console.log("friend:",r.member_id,r.points);
    })
}


addFriendTest(BigInt(930795498338672660),BigInt(1119932890726277130));


findFriendTest(BigInt(930795498338672660));
