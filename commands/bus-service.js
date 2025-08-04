const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {getAnnonceChannel} = require('../database/getAnnonceChannel');
const {getLogsChannel} = require('../database/getLogsChannel');
const { hasRole } = require("../roles/hasRole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bus-service")
    .setDescription("Affiche le nombre de bus en service.")
    .addStringOption(option =>
      option.setName('bus')
        .setDescription("Nombre de bus en service.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const bus = interaction.options.getString('bus');
    if(!hasRole(interaction)){
        await interaction.reply("Tu n'a pas l'autorisation de faire cela");
        return;
    }
    const embed = new EmbedBuilder()
	    .setColor(0x00FF99)
	    .setTitle('RATP - Bus')
	    .setDescription("État des bus en ce moment")
	    .addFields(
	    	{ name: `Nombre de bus en service`, value: bus },
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
	    .setTitle('RATP - Logs Bus')
	    .setDescription("LOGS - État des bus en ce moment")
	    .addFields(
	    	{ name: `Nombre de bus`, value: bus },
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

    await interaction.reply({ content: "Nombre de bus envoyé dans le channel d'annonces.", ephemeral: true });
    return;
    // 
    
  }
};
