// import { REST } from '@discordjs/rest';
// import { WebSocketManager } from '@discordjs/ws';
// import { GatewayDispatchEvents, GatewayIntentBits, InteractionType, MessageFlags, Routes, ChannelsAPI } from '@discordjs/core';
import * as dotenv from 'dotenv';
import {initConfig} from './init.js';
import { changePoints,EventTypeEnum,countPoints } from './service/pointsService.js';
// import { SlashCommandBuilder } from '@discordjs/builders';
import { getFormatEmbed } from './tools/tools.js';
// import { EmbedBuilder,APIEmbed,Client } from 'discord.js';
import { Collection, GatewayIntentBits } from 'discord.js';
import { addFriend } from './service/friendService.js';
import 'reflect-metadata';
import {Client} from 'discordx';
import {dirname, importx} from '@discordx/importer';

// const addFriendCommand = new SlashCommandBuilder()
// 	.setName('addFriend')
//     // .setDefaultMemberPermissions(true)
// 	.setDescription('Choose an interesting person to add as a friend')
// 	.addUserOption((option) => option.setName('user').setDescription('friend').setRequired(true));

// const removeFriendCommand = new SlashCommandBuilder()
// 	.setName('removeFriend')
// 	.setDescription('Choose an person to remove')
// 	.addUserOption((option) => option.setName('user').setDescription('friend').setRequired(true));
// const findFriendCommand = new SlashCommandBuilder()
// 	.setName('findFriends')
// 	.setDescription('find your friends');

// Get the final raw data that can be sent to Discord

dotenv.config();
const config = await initConfig();
const botId = String(process.env.bot_id);
const gId = String(process.env.guild_id);
const disToken = String(process.env.DISCORD_TOKEN);


// const gateway = new WebSocketManager({
// 	token: disToken,
// 	intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent |
//     GatewayIntentBits.GuildMessageReactions | GatewayIntentBits.GuildPresences |
//     GatewayIntentBits.GuildIntegrations | GatewayIntentBits.GuildInvites |
//     GatewayIntentBits.GuildMembers | GatewayIntentBits.Guilds,
// 	rest: rest,
// });

// const commands = [];
// commands.push(addFriendCommand.toJSON());
// commands.push(removeFriendCommand.toJSON());
// commands.push(findFriendCommand.toJSON());
// Create a client to emit relevant events.
// export const client = new Client({ rest, gateway });
// await rest.put(Routes.applicationGuildCommands(botId,gId),{body:commands});

export const client = new Client({
    simpleCommand: {
      prefix: new Array('!','++'),
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
    // partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    // If you only want to use global commands only, comment this line
    // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  });





// client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
// 	if (interaction.type !== InteractionType.ApplicationCommand || interaction.data.name == 'ping') {
// 		return;
// 	}
    
//     if(!interaction.member?.user.id){
//         await api.interactions.reply(interaction.id,interaction.token,{content:'error',flags:MessageFlags.Ephemeral});
//         return;
//     }
//     switch(interaction.data.name){
//         case CommandEnum.AddFriend:
//             await api.interactions.reply(
//                 interaction.id,
//                 interaction.token,
//                 {embeds:[getFormatEmbed("addFriend","Successfully added friends!").data]}
//             );
//             return;
//         case CommandEnum.RemoveFriend:
//             await api.interactions.reply(
//                 interaction.id,
//                 interaction.token,
//                 {embeds:[getFormatEmbed("removeFriend","Successfully remove friends!").data]}
//             );
//             return;

//         case CommandEnum.FindFriend:
//             await api.interactions.reply(
//                 interaction.id,
//                 interaction.token,
//                 {embeds:[getFormatEmbed("findFriends","Successfully find friends!").data]}
//             );
//             return;
//         default:

//         await api.interactions.reply(interaction.id, interaction.token, { content: 'wrong command!', flags: MessageFlags.Ephemeral });
//         return;
//     }
// });
client.on("ready", async () => {
    console.log(">> Bot started");
  
    // to create/update/delete discord application commands
    await client.initApplicationCommands();
  });
  
async function run() {
    // with ems
    await importx(
        dirname(import.meta.url) + '/{events,commands,api}/**/*.{ts,js}'
    );
    if (!disToken) {
      throw Error('Could not find BOT_TOKEN in your environment');
    }
    await client.login(disToken); // provide your bot token
}

run();