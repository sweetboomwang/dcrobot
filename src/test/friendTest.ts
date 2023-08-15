import { member } from "@prisma/client";
import { addFriend, findFriends, removeFriend } from "../service/friendService.js";


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

async function addSameFriendTest(){
    console.log("addSameFriendTest start");
    await addFriend(BigInt(692748111608545361),BigInt(692748111608545361));
    console.log("addSameFriendTest end");

    
}

async function teamLeaderAddFriendTest(){
    console.log("teamLeaderAddFriendTest start");
    await addFriend(BigInt("930795498338672660"),BigInt("692748111608545361"));
    console.log("teamLeaderAddFriendTest end");
}

async function OnlyOneFriendErrorTest(){
    console.log("OnlyOneFriendErrorTest start");
    await addFriend(BigInt("930795498338672660"),BigInt("692748111608545361"));
    console.log("OnlyOneFriendErrorTest end");
}

async function NoUpperFriendErrorTest(){
    console.log("NoUpperFriendErrorTest start");
    await addFriend(BigInt("823176071116488764"),BigInt("930795498338672660"));
    console.log("NoUpperFriendErrorTest end");
}

async function removeFriendErrorTest(){
    console.log("removeFriendErrorTest start");
    await removeFriend(BigInt("823176071116488764"),BigInt("930795498338672660"));
    console.log("removeFriendErrorTest end");
}

//692748111608545361 leader
//team member
//930795498338672660
//613023202075213885
//769851786336141363
//823176071116488764



// await NoUpperFriendErrorTest();

// await removeFriendErrorTest();
