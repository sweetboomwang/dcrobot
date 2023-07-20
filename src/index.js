import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { GatewayDispatchEvents, GatewayIntentBits, InteractionType, MessageFlags, Client } from '@discordjs/core';

// Create REST and WebSocket managers directly
const token = 'MTEyNjE5Mzg5ODkyMjk3NTI3Mg.Gqv32C.jMtErzt3J7hIycg0K3rBI7Q615Io5lbGsPbZlE';
const rest = new REST({ version: '10' }).setToken(token);
console.log(token);

const gateway = new WebSocketManager({
	token,
	intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent | 
	GatewayIntentBits.GuildIntegrations,
	rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

// Listen for interactions
// Each event contains an `api` prop along with the event data that allows you to interface with the Discord REST API
client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
	console.log(123);
	if (interaction.type !== InteractionType.ApplicationCommand || interaction.data.name !== 'ping') {
		return;
	}

	await api.interactions.reply(interaction.id, interaction.token, { content: 'Pong!', flags: MessageFlags.Ephemeral });
});

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, () => console.log('Ready!'));

// Start the WebSocket connection.
gateway.connect();
console.log("connected")