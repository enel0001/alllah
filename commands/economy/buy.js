const Base = require("../../base/util/client");
const CommandInterface = require("../../base/templates/command");
const { EmbedBuilder } = require("discord.js")

module.exports = class Economy extends CommandInterface {
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    constructor(client) {
        super();
        this.client = client;
        this.name = "buy",
            this.category = "economy",
            this.description = "Kupite stvar iz prodavnice."
    };
    /**
     * @param {Base} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args) {
        const slot = Number.parseInt(args[0]);
        const userData = await this.client.database.economy.findOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (!slot || slot < 1 || slot > 25)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Morate uneti broj između **1** i **25**.`,
                "Error",
            )

        if (!userData)
            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                "Error",
            )

        if (slot === 1) {
            if (userData.XPBooster === true)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate **xp booster**.`,
                    "Error",
                )

            if (userData.Cash < 100000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            userData.XPBooster = true;
            userData.XPBoosterMultiplier = 2;
            userData.XPBoosterEnd = Date.now() + 86400000;
            userData.Cash -= 100000;
            userData.Transactions.push(`> **[-]** Kupljen **xp booster x2** iz prodavnice za **100,000$**.`)

            await userData.save();

            this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili **xp booster x2**.`,
                "Success",
            )

            return setTimeout(async () => {
                userData.XPBooster = false;
                userData.XPBoosterEnd = "";
                userData.XPBoosterMultiplier = 1;

                await userData.save();
            }, 86400000);
        } else if (slot === 2) {
            if (userData.XPBooster === true)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate **xp booster**.`,
                    "Error",
                )

            if (userData.Cash < 200000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            userData.XPBooster = true;
            userData.XPBoosterMultiplier = 3;
            userData.XPBoosterEnd = Date.now() + 86400000;
            userData.Cash -= 200000;
            userData.Transactions.push(`> **[-]** Kupljen **xp booster x3** iz prodavnice za **200,000$**.`)

            await userData.save();

            this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili **xp booster x3**.`,
                "Success",
            )

            return setTimeout(async () => {
                userData.XPBooster = false;
                userData.XPBoosterEnd = "";
                userData.XPBoosterMultiplier = 1;

                await userData.save();
            }, 86400000);
        } else if (slot === 3) {
            if (userData.XPBooster === true)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate **xp booster**.`,
                    "Error",
                )

            if (userData.Cash < 300000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            userData.XPBooster = true;
            userData.XPBoosterMultiplier = 4;
            userData.XPBoosterEnd = Date.now() + 86400000;
            userData.Cash -= 300000;
            userData.Transactions.push(`> **[-]** Kupljen **xp booster x4** iz prodavnice za **300,000$**.`)

            await userData.save();

            this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili **xp booster x4**.`,
                "Success",
            )

            return setTimeout(async () => {
                userData.XPBooster = false;
                userData.XPBoosterEnd = "";
                userData.XPBoosterMultiplier = 1;

                await userData.save();
            }, 86400000);
        } else if (slot === 4) {
            if (userData.EconomyBooster === true)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate **economy booster**.`,
                    "Error",
                )

            if (userData.Cash < 150000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            userData.EconomyBooster = true;
            userData.EconomyBoosterMultiplier = 2;
            userData.EconomyBoosterEnd = Date.now() + 86400000;
            userData.Cash -= 150000;
            userData.Transactions.push(`> **[-]** Kupljen **economy booster x2** iz prodavnice za **150,000$**.`)

            await userData.save();

            this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili **economy booster x2**.`,
                "Success",
            )

            return setTimeout(async () => {
                userData.EconomyBooster = false;
                userData.EconomyBoosterEnd = "";
                userData.EconomyBoosterMultiplier = 1;

                await userData.save();
            }, 86400000);
        } else if (slot === 5) {
            if (userData.EconomyBooster === true)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate **economy booster**.`,
                    "Error",
                )

            if (userData.Cash < 300000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            userData.EconomyBooster = true;
            userData.EconomyBoosterMultiplier = 3;
            userData.EconomyBoosterEnd = Date.now() + 86400000;
            userData.Cash -= 300000;
            userData.Transactions.push(`> **[-]** Kupljen **economy booster x3** iz prodavnice za **300,000$**.`)

            await userData.save();

            this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili **economy booster x3**.`,
                "Success",
            )

            return setTimeout(async () => {
                userData.EconomyBooster = false;
                userData.EconomyBoosterEnd = "";
                userData.EconomyBoosterMultiplier = 1;

                await userData.save();
            }, 86400000);
        } else if (slot === 6) {
            if (userData.EconomyBooster === true)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate **economy booster**.`,
                    "Error",
                )

            if (userData.Cash < 500000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            userData.EconomyBooster = true;
            userData.EconomyBoosterMultiplier = 4;
            userData.EconomyBoosterEnd = Date.now() + 86400000;
            userData.Cash -= 500000;
            userData.Transactions.push(`> **[-]** Kupljen **economy booster x4** iz prodavnice za **500,000$**.`)

            await userData.save();

            this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili **economy booster x4**.`,
                "Success",
            )

            return setTimeout(async () => {
                userData.EconomyBooster = false;
                userData.EconomyBoosterEnd = "";
                userData.EconomyBoosterMultiplier = 1;

                await userData.save();
            }, 86400000);
        } else if (slot === 7) {
            if (message.member.roles.cache.has("1024295442592317541"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 100000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295442592317541").catch({});

            userData.Cash -= 100000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295442592317541> iz prodavnice za **100,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295442592317541> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 8) {
            if (message.member.roles.cache.has("1024295467586170950"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 200000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295467586170950").catch({});

            userData.Cash -= 200000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295467586170950> iz prodavnice za **200,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295467586170950>s iz prodavnice.`,
                "Success",
            )
        } else if (slot === 9) {
            if (message.member.roles.cache.has("1024295452058857503"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 300000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295452058857503").catch({});

            userData.Cash -= 300000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295452058857503> iz prodavnice za **300,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295452058857503> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 10) {
            if (message.member.roles.cache.has("1024295461609279568"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 400000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295461609279568").catch({});

            userData.Cash -= 400000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295461609279568> iz prodavnice za **400,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295461609279568> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 11) {
            if (message.member.roles.cache.has("1024295445645770833"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 500000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295445645770833").catch({});

            userData.Cash -= 500000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295445645770833> iz prodavnice za **500,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295445645770833> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 12) {
            if (message.member.roles.cache.has("1024295455506575370"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 600000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295455506575370").catch({});

            userData.Cash -= 600000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295455506575370> iz prodavnice za **600,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295455506575370> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 13) {
            if (message.member.roles.cache.has("1024295464507551745"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 700000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295464507551745").catch({});

            userData.Cash -= 700000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295464507551745> iz prodavnice za **700,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295464507551745> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 14) {
            if (message.member.roles.cache.has("1024295436816748654"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 800000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295436816748654").catch({});

            userData.Cash -= 800000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295436816748654> iz prodavnice za **800,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295436816748654> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 15) {
            if (message.member.roles.cache.has("1024295448925704283"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 900000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295448925704283").catch({});

            userData.Cash -= 900000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295448925704283> iz prodavnice za **900,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295448925704283> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 16) {
            if (message.member.roles.cache.has("1024295458635530270"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 1000000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024295458635530270").catch({});

            userData.Cash -= 1000000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024295458635530270> iz prodavnice za **1,000,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024295458635530270> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 17) {
            if (message.member.roles.cache.has("1024296024111587389"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024296024111587389").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024296024111587389> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024296024111587389> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 18) {
            if (message.member.roles.cache.has("1024296024992387162"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024296024992387162").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024296024992387162> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024296024992387162> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 19) {
            if (message.member.roles.cache.has("1024296023398555670"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024296023398555670").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024296023398555670> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024296023398555670> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 20) {
            if (message.member.roles.cache.has("1024296029119598672"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024296029119598672").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024296029119598672> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024296029119598672> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 21) {
            if (message.member.roles.cache.has("1024296029555798037"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024296029555798037").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024296029555798037> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024296029555798037> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 22) {
            if (message.member.roles.cache.has("1025521884269379594"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1025521884269379594").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1025521884269379594> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1025521884269379594> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 23) {
            if (message.member.roles.cache.has("1024662789580660769"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024662789580660769").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024662789580660769> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024662789580660769> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 24) {
            if (message.member.roles.cache.has("1024296022941376642"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024296022941376642").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024296022941376642> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024296022941376642> iz prodavnice.`,
                "Success",
            )
        } else if (slot === 25) {
            if (message.member.roles.cache.has("1024296022295445564"))
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Već imate ovaj role.`,
                    "Error",
                )

            if (userData.Cash < 10000)
                return this.client.util.embed(
                    message,
                    "Reply",
                    message.author,
                    "",
                    `${this.client.emoji.no} Nemate dovoljno novca da kupite stvar.`,
                    "Error",
                )

            await message.member.roles.add("1024296022295445564").catch({});

            userData.Cash -= 10000;
            userData.Transactions.push(`> **[-]** Kupljen role <@&1024296022295445564> iz prodavnice za **10,000$**.`)

            await userData.save();

            return this.client.util.embed(
                message,
                "Reply",
                message.author,
                "",
                `${this.client.emoji.yes} Uspešno ste kupili role <@&1024296022295445564> iz prodavnice.`,
                "Success",
            )
        }
    }
}