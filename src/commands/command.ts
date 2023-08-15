import { CommandInteraction,Message, Channel,TextChannel,User,GuildMember, Role, ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption, SlashChoice,SimpleCommand,SimpleCommandMessage,SelectMenuComponent,SimpleCommandOption } from 'discordx';
import { time,userMention,channelMention, roleMention } from '@discordjs/builders';
import { getFormatEmbed } from '../tools/tools.js';
import { addFriend, findFriends, removeFriend } from '../service/friendService.js';
import { FriendAddSelfError, FriendAlreadyError, FriendLimitError, FriendNotExistError, LeaderCantAddFriendError, LeaderCantRemoveFriendError, NoUpperFriendError, OnlyOneFriendError, PointsLackError, RemoveFriendCDError } from '../entity/bizError.js';
import { getMember, initMember } from '../service/memberService.js';


@Discord()
class ChannelCommandMessage {

    @Slash({ description: "add-friend", name: "add-friend" })
    async addfriend(
      @SlashOption({ name: "friend",description: "friendid",type:ApplicationCommandOptionType.User,required:true})
      friendId: string,
      command: CommandInteraction): Promise<unknown> {
        try {
          console.log('add-friend userId:'+command.user.id+" friendId:"+friendId+" user.username:"+command.user.username);
          if(!friendId){
            return command.reply({content:'friendId error'});
          }
          
          await addFriend(BigInt(command.user.id),BigInt(friendId));
          let rs = `${friendId} add-friend succeeded`;
          const embed = getFormatEmbed('add-friend',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.log('add-friend error:',error);
          if(error instanceof PointsLackError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',`ERROR:${friendId} insufficient points`)]
            });
          }
          if(error instanceof FriendAddSelfError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',`ERROR:friend can't be yourself`)]
            });
          } 
          if(error instanceof LeaderCantAddFriendError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',`ERROR:The captain can't add friends`)]
            });
          }
          if(error instanceof OnlyOneFriendError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',`ERROR:only one friend can be added`)]
            });
          }
          if(error instanceof FriendAlreadyError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',`ERROR:${friendId} Already added`)]
            });
          }
          if(error instanceof NoUpperFriendError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',`ERROR:your friend has no superior friends`)]
            });
          }
          return command.reply({
            embeds:[getFormatEmbed('add-friend',`ERROR:failed`)]
          });
        }
    }

    @Slash({ description: "remove-friend", name: "remove-friend" })
    async removefriend(
      @SlashOption({ name: "friend",description: "friendid",type:ApplicationCommandOptionType.User,required:true})
      friendId: string,
      command: CommandInteraction): Promise<unknown> {
        try {
          console.log('remove-friend userId:'+command.user.id+" friendId:"+friendId);
          if(!friendId){
            return command.reply({embeds:[getFormatEmbed('remove-friend',`ERROR:friendId error`)]});
          }
          await removeFriend(BigInt(command.user.id),BigInt(friendId));
          let rs = `${friendId} remove-friend succeeded`;
          const embed = getFormatEmbed('remove-friend',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.error('remove-friend error:',error);
          if(error instanceof FriendNotExistError){
            return command.reply({
              embeds:[getFormatEmbed('remove-friend',`ERROR:${friendId} is not your friend`)]
            });
          }
          if(error instanceof LeaderCantRemoveFriendError){
            return command.reply({
              embeds:[getFormatEmbed('remove-friend',`ERROR: the captain cannot remove friends`)]
            });
          } 
          if(error instanceof RemoveFriendCDError){
            error.message
            return command.reply({
              
              embeds:[getFormatEmbed('remove-friend',`ERROR: function unlocked for ${error.message} hours`)]
            });
          }
          return command.reply({
            embeds:[getFormatEmbed('remove-friend',`ERROR:failed`)]
          });
        }
    }

    @Slash({ description: "find-friend", name: "find-friend" })
    async findfriend(
      command: CommandInteraction): Promise<unknown> {
        try {
          console.log('find-friend userId:'+command.user.id);
          const friends = await findFriends(BigInt(command.user.id));
          let rs = `your friends:\n\r`;
          if(friends){
            friends.forEach(f=>{
                const um = userMention(String(f.member_id));
                rs += `${um} \n\r`;
            });
          }
          const embed = getFormatEmbed('find-friend',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.error('find-friend error:',error);
          return command.reply({
            embeds:[getFormatEmbed('find-friend',`ERROR:failed`)]
          });
        }
    }

    // @Slash({ description: "info", name: "info" })
    // async info(
    //   command: CommandInteraction): Promise<unknown> {
    //     try {
    //       console.log('info userId:'+command.user.id);
    //       const m = await getMember(BigInt(command.user.id));
    //       let rs = `personal information:\n\r`;
    //       if(m){
    //         rs += `points:${m.points}\n\r`;
    //       }
    //       const embed = getFormatEmbed('info',rs);
    //       return command.reply({
    //         embeds:[embed]
    //       });
    //     } catch (error) {
    //       console.error('info error:',error);
    //       return command.reply({
    //         embeds:[getFormatEmbed('info',`ERROR:failed`)]
    //       });
    //     }
    // }

    @Slash({ description: "init-member", name: "init-member" })
    async initmember(
      @SlashOption({ name: "friend",description: "friendid",type:ApplicationCommandOptionType.User,required:true})
      user: GuildMember,
      command: CommandInteraction): Promise<unknown> {
        try {
          console.log('init-member userId:'+user.id,user.nickname);
          const userId = user.id.toString();
          const m = await initMember(BigInt(userId),user.displayName);
          let rs = `${userMention(userId)} init-member succeeded`;
          const embed = getFormatEmbed('init-member',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.error('init-member error:',error);
          return command.reply({
            embeds:[getFormatEmbed('init-member',`ERROR:failed`)]
          });
        }
    }
}