import { EmbedBuilder,APIEmbed } from 'discord.js';

export function getFormatEmbed(title:string,desc:string):EmbedBuilder{
    return new EmbedBuilder()
      .setColor('#FFBB5C')
      .setTitle(title)
      .setDescription(desc)
      .setTimestamp();
}