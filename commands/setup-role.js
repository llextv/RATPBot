const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "db.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-role")
    .setDescription("Setup globaux des channels"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.member.permissions.has('ManageRoles')) {
      return interaction.editReply({
        content: "Tu n'a pas la permission de modifier cela.",
      });
    }

    const roleName = "WL RATPBot";
    const guild = interaction.guild;

    let existingRole = guild.roles.cache.find(role => role.name === roleName);

    if (existingRole) {
      return interaction.editReply({
        content: `Rôle **${roleName}** existe deja.`,
      });
    }

    try {
      const newRole = await guild.roles.create({
        name: roleName,
        color: '#00bcd4',
        reason: 'Rôle pour intéragir avec RATP bot',
        permissions: [] 
      });
    
      return interaction.editReply({
        content: `Role **${newRole.name}** crée avec succes`,});
    } catch (error) {
      console.error('Erreur lors de la création du role :', error);
      return interaction.editReply({
        content: "Erreur lors de la création du role",
      });
    }
  }
};