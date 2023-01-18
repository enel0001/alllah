const Base = require("../../base/util/client");
const EventInterface = require("../../base/templates/event");
const { EmbedBuilder } = require('discord.js')

module.exports = class ClientEvent extends EventInterface {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        super()
        this.client = client;
        this.name = "interactionCreate"
    };

    async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId === "checkpoints") {
                const data = await this.client.database.user.findOne({ User: interaction.user.id, Guild: interaction.guild.id })

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`${this.client.emoji.yes} Vi trenutno imate **${data && data.Points ? data.Points : "0"}** skupljenih pointsa.`)
                            .setColor("#9fa8ff")
                            .setTimestamp()
                    ],
                    ephemeral: true
                })
            }
        }
    }
}