import { EmbedBuilder,APIEmbed } from 'discord.js';
import { REDIS_BASE_KEY } from '../entity/constants.js';



export function getFormatEmbed(title:string,desc:string):EmbedBuilder{
    return new EmbedBuilder()
      .setColor('#FFBB5C')
      .setTitle(title)
      .setDescription(desc)
      .setTimestamp();
}

/**
 * 封装redis key
 * @param {string[]} keys 参数
 * @return {string} 封装结果key
 */
 export function getRedisKey(keys: Array<string>): string {
  if (keys.length == 0) {
    throw new Error('keys param error');
  }
  let str = REDIS_BASE_KEY;
  for (let i = 0; i < keys.length; i++) {
    str += ':' + keys[i];
  }
  return str;
}