import { CommandInteraction,Message, Channel,TextChannel,User,GuildMember, Role, ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption, SlashChoice,SimpleCommand,SimpleCommandMessage,SelectMenuComponent,SimpleCommandOption } from 'discordx';
import { time,userMention,channelMention, roleMention } from '@discordjs/builders';
import { getFormatEmbed } from '../tools/tools.js';
import { addFriend, findFriends, removeFriend } from '../service/friendService.js';
import { FriendAlreadyError, FriendLimitError } from '../entity/bizError.js';
import { getMember } from '../service/memberService.js';


@Discord()
class ChannelCommandMessage {

    @Slash({ description: "add-friend", name: "add-friend" })
    async addfriend(
      @SlashOption({ name: "friend",description: "friendid",type:ApplicationCommandOptionType.User})
      friendId: string,
      command: CommandInteraction): Promise<unknown> {
        try {
          console.log('add-friend userId:'+command.user.id+" friendId:"+friendId);
          if(!friendId){
            return command.reply({content:'friendId error'});
          }
          await addFriend(BigInt(command.user.id),BigInt(friendId));
        //   await bindWalletAddress(BigInt(command.user.id),address);
          let rs = `add-friend succeeded`;
          const embed = getFormatEmbed('add-friend',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.log('add-friend error:',error);
          if(error instanceof FriendAlreadyError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',`Already added`)]
            });
          }
          if(error instanceof FriendLimitError){
            return command.reply({
              embeds:[getFormatEmbed('add-friend',` has reached the limit`)]
            });
          }
          return command.reply({
            embeds:[getFormatEmbed('add-friend',`failed`)]
          });
        }
    }

    @Slash({ description: "remove-friend", name: "remove-friend" })
    async removefriend(
      @SlashOption({ name: "friend",description: "friendid",type:ApplicationCommandOptionType.User})
      friendId: string,
      command: CommandInteraction): Promise<unknown> {
        try {
          console.log('remove-friend userId:'+command.user.id+" friendId:"+friendId);
          if(!friendId){
            return command.reply({content:'friendId error'});
          }
          await removeFriend(BigInt(command.user.id),BigInt(friendId));
        //   await bindWalletAddress(BigInt(command.user.id),address);
          let rs = `removefriend succeeded`;
          const embed = getFormatEmbed('remove-friend',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.error('remove-friend error:',error);
          return command.reply({
            embeds:[getFormatEmbed('remove-friend',`failed`)]
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
                const userMetion = userMention(String(f.member_id));
                rs += `${userMetion} \n\r`;
            });
          }
          const embed = getFormatEmbed('find-friend',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.error('find-friend error:',error);
          return command.reply({
            embeds:[getFormatEmbed('find-friend',`failed`)]
          });
        }
    }

    @Slash({ description: "info", name: "info" })
    async info(
      command: CommandInteraction): Promise<unknown> {
        try {
          console.log('info userId:'+command.user.id);
          const m = await getMember(BigInt(command.user.id));
          let rs = `personal information:\n\r`;
          if(m){
            rs += `points:${m.points}\n\r`;
            rs += `wallet:${m.wallet}\n\r`;
          }
          const embed = getFormatEmbed('info',rs);
          return command.reply({
            embeds:[embed]
          });
        } catch (error) {
          console.error('info error:',error);
          return command.reply({
            embeds:[getFormatEmbed('info',`failed`)]
          });
        }
    }
}