import { client } from "./../main.js";
import type {ArgsOf} from 'discordx';
import {Discord, On, Client,Once} from 'discordx';
import {Permissions, Message,MessageReaction,ButtonInteraction, MessageType} from 'discord.js'
// import { GatewayDispatchEvents, InteractionType, MessageFlags } from '@discordjs/core';
import {changePoints, EventTypeEnum} from '../service/pointsService';
import { initMember } from "../service/memberService.js";

@Discord()
export abstract class AppDiscord {
  /**使用中 */
  @On({event:'messageCreate'})
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: Client) {
    // await client.executeCommand(message);
    if(message.content.startsWith('!')){
      return;
    }

    if(message.content.startsWith('++')){
      client.executeCommand(message);
      return;
    }

    if(message.member?.roles.botRole){
      return;
    }

    const m = message.member;
    if(m){
      console.log("member:",m.id,m.nickname,m.displayName);
      await initMember(BigInt(m.id),m.displayName);
    }


    // const userId = String(message.member?.id);
    // const adminMembers = message.member?.roles.cache.find(r => r.id === '944171010553446421' || r.id === '946322545781669928');
    // if(message.member?.roles.botRole !== null || typeof adminMembers !== 'undefined'){
    //   return;
    // }
    
  }


  
  @On({event:'interactionCreate'})
  async interactionCreate([message]: ArgsOf<'interactionCreate'>, client: Client) {

  
    if(message.isCommand()){
      await client.executeInteraction(message);
    }
  }
}
