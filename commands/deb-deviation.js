const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {getAnnonceChannel} = require('../database/getAnnonceChannel');
const {getLogsChannel} = require('../database/getLogsChannel');
const { hasRole } = require("../roles/hasRole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deb-deviation")
    .setDescription("Débute une déviation")
    .addStringOption(option =>
      option.setName('arret')
        .setDescription("L'arrêt de la déviation qui est impliqué.")
        .setRequired(true)
    ) 
    .addStringOption(option =>
      option.setName('time')
        .setDescription("De quand a quand ?")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('impactedline')
        .setDescription("Ligne impacté.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('arretprovisoir')
        .setDescription("Un arret provisoir")
        .setRequired(false)
    ),

  async execute(interaction) {
    if(!hasRole(interaction)){
      await interaction.reply("Tu n'a pas l'autorisation de faire cela");
      return;
    }
    const arret = interaction.options.getString('arret');
    const arretProvisoir = interaction.options.getString('arretprovisoir');
    const time = interaction.options.getString('time');
    const impactedLine = interaction.options.getString('impactedline');

    const embed = new EmbedBuilder()
	    .setColor(0x00FF99)
	    .setTitle('RATP - Déviation')
	    .setDescription('Une déviation a été signalé par un responsable RATP')
	    .addFields(
	    	{ name: `Arrêt Concerné`, value: arret },
	    	{ name: '\u200B', value: '\u200B' },
	    	{ name: 'Arrêt Provisoire', value: arretProvisoir, inline: true },
	    	{ name: 'Durée', value: time, inline: true },
        { name: 'Ligne Impacté', value: impactedLine, inline: true },
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
	    	{ name: 'Arrêt Provisoire', value: arretProvisoir, inline: true },
	    	{ name: 'Durée', value: time, inline: true },
        { name: 'Ligne Impacté', value: impactedLine, inline: true },
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
