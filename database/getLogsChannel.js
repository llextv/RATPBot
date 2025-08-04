const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "..", "db.json");

function getLogsChannel(interaction){
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }

    const guildConfig = config[interaction.guildId];
    if (!guildConfig || !guildConfig.logsChannel) {
      return;
    }

    const logsChannelId = guildConfig.logsChannel;
    const logsChannel = interaction.guild.channels.cache.get(logsChannelId);

    if (!logsChannel) {
      return;
    }
    return logsChannel;
}
module.exports = { getLogsChannel };