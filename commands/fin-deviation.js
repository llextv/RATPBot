const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {getAnnonceChannel} = require('../database/getAnnonceChannel');
const {getLogsChannel} = require('../database/getLogsChannel');
const { hasRole } = require("../roles/hasRole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fin-deviation")
    .setDescription("Débute une déviation")
    .addStringOption(option =>
      option.setName('arret')
        .setDescription("L'arrêt de la déviation qui était impliqué.")
        .setRequired(true)
    ),

  async execute(interaction) {
    if(!hasRole(interaction)){
        await interaction.reply("Tu n'a pas l'autorisation de faire cela");
        return;
    }
    const arret = interaction.options.getString('arret');

    const embed = new EmbedBuilder()
	    .setColor(0x00FF99)
	    .setTitle('RATP - Fin de déviation')
	    .setDescription('Une déviation prend fin')
	    .addFields(
	    	{ name: `Arrêt Concerné`, value: arret },
	    )
	    .setTimestamp()
	    .setFooter({ text: 'RATP Bot by Jonathan SCOTT'});
    
    const annonceChannel = getAnnonceChannel(interaction);
    if(annonceChannel){
      annonceChannel.send({ embeds: [embed] });
    }else{
      await interaction.reply("Error !");
      return;
    }
    const embedLogs = new EmbedBuilder()
	    .setColor(0xEDA866)
	    .setTitle('RATP - Logs Déviation')
	    .setDescription('LOGS - Une déviation a été signalé par un responsable RATP')
	    .addFields(
	    	{ name: `Arrêt Concerné`, value: arret },
        { name: 'Employé', value: interaction.user.displayName, inline: true },
	    )
	    .setTimestamp()
	    .setFooter({ text: 'RATP Bot by Jonathan SCOTT'});

    const logsChannel = getLogsChannel(interaction);
    if(logsChannel){
      logsChannel.send({ embeds: [embedLogs] });
    }else{
      await interaction.reply("Error !");
      return;
    }

    await interaction.reply({ content: "Déviation annoncée dans le channel d'annonces.", ephemeral: true });
    return;
    // 
    
  }
};
