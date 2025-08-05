const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {getAnnonceChannel} = require('../database/getAnnonceChannel');
const {getLogsChannel} = require('../database/getLogsChannel');
const { hasRole } = require("../roles/hasRole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modif-ligne")
    .setDescription("Modification définitive d'une ligne")
    .addStringOption(option =>
      option.setName('cat')
        .setDescription("Catégorie")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('ligne')
        .setDescription("Ligne")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('arretret')
        .setDescription("Arrêt(s) retiré(s)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('arretadd')
        .setDescription("Arrêt ajouté(s)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const cat = interaction.options.getString('cat');
    const ligne = interaction.options.getString('ligne');
    const arretret = interaction.options.getString('arretret');
    const arretadd = interaction.options.getString('arretadd');

    if(!hasRole(interaction)){
        await interaction.reply("Tu n'a pas l'autorisation de faire cela");
        return;
    }
    const embed = new EmbedBuilder()
	    .setColor(0x00FF99)
	    .setTitle("RATP - Changement définitif d'une ligne.")
	    .setDescription("Changement définitif d'une Ligne RATP")
	    .addFields(
	    	{ name: `Catégorie`, value: cat },
            { name: `Ligne`, value: ligne },
            { name: `Arrêt(s) retiré(s)`, value: arretret },
            { name: `Arrêt ajouté(s)`, value: arretadd },
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
	    .setTitle("RATP - Logs Changement définitif d'une ligne")
	    .setDescription("LOGS - Changement définitif d'une Ligne RATP")
	    .addFields(
	    	{ name: `Catégorie`, value: cat },
            { name: `Ligne`, value: ligne },
            { name: `Arrêt(s) retiré(s)`, value: arretret },
            { name: `Arrêt ajouté(s)`, value: arretadd },
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
