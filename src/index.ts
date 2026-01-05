import { Client, Events, GatewayIntentBits } from "discord.js";

import { config } from "dotenv";
config();

const intents: GatewayIntentBits[] = [
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates
]

const client = new Client({ intents });

const toRemove = new Map<string, NodeJS.Timeout>();

function debugLog(...content: any[]) {
  if (process.env.DEBUG === "true")
    console.log(...content);
}

client.on(Events.ClientReady, me => {
  console.log(`Successfully logged in as ${me.user.username}`);
});

client.on(Events.MessageCreate, async message => {
  if (message.content === "~dontkick") {
    let role = message.guild?.roles.cache.find(a => a.name == process.env.LONER_ROLE_NAME);
    if (!role) await message.guild?.roles.create({ name: process.env.LONER_ROLE_NAME as string });
    const user = await message.guild?.members.fetch(message.author.id);
    if (!role) {
      message.reply(`Failed to create ${process.env.LONER_ROLE_NAME} role, please try again.`)
      return;
    }
    const resolvedRole = user?.roles.cache.some(hasRole => hasRole.name === role.name);
    if (resolvedRole) {
      user?.roles.remove(role)
      message.reply(`Successfully taken ${process.env.LONER_ROLE_NAME} role`)
    } else {
      user?.roles.add(role)
      message.reply(`Successfully given ${process.env.LONER_ROLE_NAME} role`)
    }
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelId == newState.channelId)
    return;
  const newChannel = newState.channel;
  if (newChannel) {
    const remove = toRemove.get(newChannel.id);
    if (!remove) return;
    if (newChannel.members.size == 1) return;
    clearInterval(remove);
    toRemove.delete(newChannel.id);
    debugLog("Removed Interval");
  }
  if (oldState != null) {
    const oldChannel = oldState.channel;
    if (!oldChannel) return;
    if (oldChannel.members.size !== 1) return;
    const kick_ms = (parseInt(process.env.KICK_MIN as string) * 60 * 1000);
    const last_user = oldChannel.members.first();
    if (!last_user) return;
    if (last_user.roles.cache.some(r => r.name === process.env.LONER_ROLE_NAME)) {
      debugLog("Last user has loner role... ignoring.");
      return;
    }
    debugLog(`Started timer on ${last_user.user.username}`);
    const timer = setTimeout(() => {
      oldChannel.members.first()?.voice.disconnect(`You've been in VC for longer than ${process.env.KICK_MIN} mins`);
      toRemove.delete(oldChannel.id);
    }, kick_ms);
    toRemove.set(oldChannel.id, timer);
  }
});

client.login(process.env.TOKEN)