const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "..", "db.json");

function getAnnonceChannel(interaction){
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }

    const guildConfig = config[interaction.guildId];
    if (!guildConfig || !guildConfig.annoChannel) {
      return;
    }

    const annoChannelId = guildConfig.annoChannel;
    const annoChannel = interaction.guild.channels.cache.get(annoChannelId);

    if (!annoChannel) {
      return;
    }
    return annoChannel;
}
module.exports = { getAnnonceChannel };