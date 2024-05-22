const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config/config.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot is ready');
});

// Command handling
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('message', message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command.');
  }
});

client.login('YOUR_DISCORD_BOT_TOKEN');