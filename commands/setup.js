const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "db.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup globaux des channels")
    .addStringOption(option =>
      option.setName('annochannel')
        .setDescription("Channel des annonces")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('logschannel')
        .setDescription("Channel de logs")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ManageRoles')) {
      return interaction.reply({
        content: "Tu n'a pas la permission de modifier cela.",
      });
    }
    const annoChannel = interaction.options.getString('annochannel');
    const logsChannel = interaction.options.getString('logschannel');

    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }

    config[interaction.guildId] = {
      annoChannel,
      logsChannel
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");

    await interaction.reply({
      content: `✅ Channels enregistrés !`,
      ephemeral: true
    });
  }
};