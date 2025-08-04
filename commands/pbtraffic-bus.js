const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {getAnnonceChannel} = require('../database/getAnnonceChannel');
const {getLogsChannel} = require('../database/getLogsChannel');
const { hasRole } = require("../roles/hasRole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pb-bus")
    .setDescription("Prévenir un problème traffic avec un bus.")
    .addStringOption(option =>
      option.setName('bus')
        .setDescription("Bus concerné")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('ligne')
        .setDescription("Ligne concernée")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('traffic')
        .setDescription("État du traffic")
        .setRequired(true)
    ),

  async execute(interaction) {
    if(!hasRole(interaction)){
        await interaction.reply("Tu n'a pas l'autorisation de faire cela");
        return;
    }
    const bus = interaction.options.getString('bus');
    const traffic = interaction.options.getString('traffic');
    const ligne = interaction.options.getString('ligne');

    const embed = new EmbedBuilder()
	    .setColor(0x00FF99)
	    .setTitle('RATP - Info Traffic Bus')
	    .setDescription("Un problème d'info traffic a été détécté dans un bus RATP.")
	    .addFields(
	    	{ name: `Bus Concerné`, value: bus },
            { name: `Ligne concernée`, value: ligne },
            { name: `Info Traffic`, value: traffic },
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
	    .setTitle('RATP - Logs Info Traffic Bus')
	    .setDescription("LOGS - Un problème d'info traffic a été détécté dans un bus RATP.")
	    .addFields(
	    	{ name: `Bus Concerné`, value: bus },
            { name: `Ligne concernée`, value: ligne },
            { name: `Info Traffic`, value: traffic },
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

    await interaction.reply({ content: "Infos traffic envoyé dans le channel d'annonces.", ephemeral: true });
    return;
    // 
    
  }
};
