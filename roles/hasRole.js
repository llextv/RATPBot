function hasRole(interaction) {
    return interaction.member.roles.cache.some(role => role.name === "WL RATPBot");
}

module.exports = { hasRole };