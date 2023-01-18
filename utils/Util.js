const { Collection, EmbedBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const generateChartConfig = (options) => {
    return options;
}

const changeVanity = async (client, serverid, token, code) => {
    fetch(`https://discord.com/api/v9/guilds/${serverid}/vanity-url`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US",
            "authorization": token,
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-debug-options": "logOverlayEvents,bugReporterEnabled",
            "x-discord-locale": "en-GB",
            "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDA2Iiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDQiLCJvc19hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiY2xpZW50X2J1aWxkX251bWJlciI6MTUwNzQ4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ=="
        },
        "referrer": "https://discord.com/channels/1015543595584991262/1024332097067941938",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({ code: code }),
        "method": "PATCH",
        "mode": "cors",
        "credentials": "include"
    }).then(x => { return x }).then(x => { return x.status }).then(x => {
        client.consoleLog(x == 200 ? "Promjenjen vanity na serveru." : "Ne mogu promjeniti vanity na serveru.", x == 200 ? "Success" : "Error");
    })
}

const embed = (message, type, author, footer, description, color) => {
    const Embed = new EmbedBuilder()

    Embed.setTimestamp()

    if (author || author.length > 0)
        Embed.setAuthor({ name: author.tag, iconURL: author.displayAvatarURL({ dynamic: true }) });

    if (footer || footer.length > 0)
        Embed.setFooter({ text: footer.tag, iconURL: footer.displayAvatarURL({ dynamic: true }) });

    if (description || description.length > 0)
        Embed.setDescription(description);

    if (color) {
        if (color === "Error") {
            Embed.setColor("#ff3838");
        } else if (color === "Success") {
            Embed.setColor("#33ff81");
        }
    } else {
        Embed.setColor("#9fa8ff");
    }

    if (type === "Send") {
        return message.channel.send({ embeds: [Embed] });
    } else if (type === "Reply") {
        return message.reply({ embeds: [Embed] });
    }
}

const rankCard = async (client, user, rank, level, xp, checkpoint) => {
    let canvas = createCanvas(950, 292);
    let ctx = canvas.getContext("2d");
    let procent = xp / checkpoint * 100

    await loadImage("https://cdn.j122j.me/files/d9faa402.jpeg")
        .then(img => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        });

    await loadImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
        .then(img => {
            ctx.save();
            ctx.drawImage(img, 90, 59.3, 128, 136);
        });

    ctx.font = "28px Impact";
    ctx.fillStyle = "#9fa8ff";
    ctx.textAlign = "center";

    let username = ctx.measureText(user.tag);
    let rankfill = ctx.measureText(`#` + rank);
    let levelfill = ctx.measureText(level);

    ctx.fillText(user.tag, 310 + username.width / 2, 78);
    ctx.fillText(`#` + rank, 392 + rankfill.width / 2, 120);
    ctx.fillText(level, 398 + levelfill.width / 2, 160);

    ctx.font = "28px Impact";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    let ranktext = ctx.measureText("Rank:");
    let leveltext = ctx.measureText("Level:");

    ctx.fillText("Rank:", 310 + ranktext.width / 2, 120);
    ctx.fillText("Level:", 310 + leveltext.width / 2, 160);

    ctx.fillStyle = "#9fa8ff";
    ctx.fillRect(310, 173, procent * 3, 30);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(310, 173, 300, 30);

    ctx.font = "22px Impact";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    let xpfill = ctx.measureText(xp + " / " + checkpoint);

    if (xp >= 1000 && checkpoint >= 1000)
        ctx.fillText(xp + " / " + checkpoint, 405 + xpfill.width / 2, 196);
    else
        ctx.fillText(xp + " / " + checkpoint, 425 + xpfill.width / 2, 196);

    return canvas.toBuffer("image/png");
}

const commandsList = (client, message, category) => {
    const commands = client.commands;
    content = "";

    commands.forEach(c => {
        if (c.category === category)
            content += `\`.${c.name}\` — ${(c.description).charAt(0).toUpperCase() + (c.description).slice(1)}\n`
    })

    return content;
}

const cleanNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const inviteObject = (invite, isVanity) => ({
    code: invite.code,
    uses: invite.uses,
    maxUses: invite.maxUses,
    inviterId: isVanity ? "VANITY" : invite.inviter?.id,
});

async function cacheInvite(client, guild) {
    const invites = await guild.invites.fetch();

    const tempMap = new Collection();

    invites.forEach((inv) => tempMap.set(inv.code, inviteObject(inv)));

    if (guild.vanityURLCode) {
        tempMap.set(guild.vanityURLCode, inviteObject(await guild.fetchVanityData(), true));
    }

    client.invites.set(guild.id, tempMap);
    return tempMap;
}

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const timeFormat = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 30);
    const months = Math.floor((ms / (1000 * 60 * 60 * 24 * 30)) % 12);
    const years = Math.floor((ms / (1000 * 60 * 60 * 24 * 30 * 12)) % 12);

    if (years) {
        let godine = ""
        let mjeseci = ""
        let dani = ""
        let sati = ""
        let minute = ""
        let sekunde = ""

        if (years === 1)
            godine = "godinu"

        else if (years === 2 || years === 3 || years === 4)
            godine = "godine"

        else
            godine = "godina"

        if (months === 1)
            mjeseci = "mjesec"

        else if (months === 2 || months === 3 || months === 4)
            mjeseci = "mjeseca"

        else
            mjeseci = "mjeseci"

        if (days === 1 || days === 21 || days === 31)
            dani = "dan"

        else if (days === 2 || days === 3 || days === 4 || days === 5 || days === 6 || days === 7 || days === 8 || days === 9 || days === 10 || days === 11 || days === 12 || days === 13 || days === 14 || days === 15 || days === 16 || days === 17 || days === 18 || days === 19 || days === 20 || days === 22 || days === 23 || days === 24 || days === 25 || days === 26 || days === 27 || days === 28 || days === 29 || days === 30)
            dani = "dana"

        if (hours === 0 || hours === 5 || hours === 6 || hours === 7 || hours === 8 || hours === 9 || hours === 10 || hours === 11 || hours === 12 || hours === 13 || hours === 14 || hours === 15 || hours === 16 || hours === 17 || hours === 18 || hours === 19 || hours === 20)
            sati = 'sati'

        else if (hours === 1 || hours === 21)
            sati = "sat"

        else if (hours === 2 || hours === 3 || hours === 4 || hours === 22 || hours === 23 || hours === 24)
            sati = "sata"

        if (minutes === 1 || minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51)
            minute = "minut"

        else if (minutes === 0 || minutes === 2 || minutes === 3 || minutes === 4 || minutes === 5 || minutes === 6 || minutes === 7 || minutes === 8 || minutes === 9 || minutes === 10 || minutes === 11 || minutes === 12 || minutes === 13 || minutes === 14 || minutes === 15 || minutes === 16 || minutes === 17 || minutes === 18 || minutes === 19 || minutes === 20 || minutes === 22 || minutes === 23 || minutes === 24 || minutes === 25 || minutes === 26 || minutes === 27 || minutes === 28 || minutes === 29 || minutes === 30 || minutes === 32 || minutes === 33 || minutes === 34 || minutes === 35 || minutes === 36 || minutes === 37 || minutes === 38 || minutes === 39 || minutes === 40 || minutes === 42 || minutes === 43 || minutes === 44 || minutes === 45 || minutes === 46 || minutes === 47 || minutes === 48 || minutes === 49 || minutes === 50 || minutes === 52 || minutes === 53 || minutes === 54 || minutes === 55 || minutes === 56 || minutes === 57 || minutes === 58 || minutes === 59 || minutes === 60)
            minute = "minuta"

        if (seconds === 1)
            sekunde = "sekund"

        else if (seconds === 0 || seconds === 5 || seconds === 6 || seconds === 7 || seconds === 8 || seconds === 9 || seconds === 10 || seconds === 11 || seconds === 12 || seconds === 13 || seconds === 14 || seconds === 15 || seconds === 16 || seconds === 17 || seconds === 18 || seconds === 19 || seconds === 20 || seconds === 25 || seconds === 26 || seconds === 27 || seconds === 28 || seconds === 29 || seconds === 30 || seconds === 35 || seconds === 36 || seconds === 37 || seconds === 38 || seconds === 39 || seconds === 40 || seconds === 45 || seconds === 46 || seconds === 47 || seconds === 48 || seconds === 49 || seconds === 50 || seconds === 55 || seconds === 56 || seconds === 57 || seconds === 58 || seconds === 59 || seconds === 60)
            sekunde = "sekundi"

        else if (seconds === 21 || seconds === 31 || seconds === 41 || seconds === 51)
            sekunde = "sekunda"

        else if (seconds === 2 || seconds === 3 || seconds === 4 || seconds === 22 || seconds === 23 || seconds === 24 || seconds === 32 || seconds === 33 || seconds === 34 || seconds === 42 || seconds === 43 || seconds === 44 || seconds === 52 || seconds === 53 || seconds === 54)
            sekunde = "sekunde"

        if (months === 0 && days === 0 && hours === 0 && minutes === 0 && seconds === 0)
            return `**${years}** ${godine}`
        else if (seconds === 0 && minutes === 0 && hours === 0 && days === 0)
            return `**${years}** ${godine} i **${months}** ${mjeseci}`
        else if (seconds === 0 && minutes === 0 && hours === 0)
            return `**${years}** ${godine}, **${months}** ${mjeseci} i **${days}** ${dani}`
        else if (seconds === 0 && minutes === 0)
            return `**${years}** ${godine}, **${months}** ${mjeseci}, **${days}** ${dani} i **${hours}** ${sati}`
        else if (seconds === 0)
            return `**${years}** ${godine}, **${months}** ${mjeseci}, **${days}** ${dani}, **${hours}** ${sati} i **${minutes}** ${minute}`
        else
            return `**${years}** ${godine}, **${months}** ${mjeseci}, **${days}** ${dani}, **${hours}** ${sati}, **${minutes}** ${minute} i **${seconds}** ${sekunde}`;

    } else if (months) {
        let mjeseci = ""
        let dani = ""
        let sati = ""
        let minute = ""
        let sekunde = ""

        if (months === 1)
            mjeseci = "mjesec"

        else if (months === 2 || months === 3 || months === 4)
            mjeseci = "mjeseca"

        else
            mjeseci = "mjeseci"

        if (days === 1 || days === 21 || days === 31)
            dani = "dan"

        else if (days === 2 || days === 3 || days === 4 || days === 5 || days === 6 || days === 7 || days === 8 || days === 9 || days === 10 || days === 11 || days === 12 || days === 13 || days === 14 || days === 15 || days === 16 || days === 17 || days === 18 || days === 19 || days === 20 || days === 22 || days === 23 || days === 24 || days === 25 || days === 26 || days === 27 || days === 28 || days === 29 || days === 30)
            dani = "dana"

        if (hours === 0 || hours === 5 || hours === 6 || hours === 7 || hours === 8 || hours === 9 || hours === 10 || hours === 11 || hours === 12 || hours === 13 || hours === 14 || hours === 15 || hours === 16 || hours === 17 || hours === 18 || hours === 19 || hours === 20)
            sati = 'sati'

        else if (hours === 1 || hours === 21)
            sati = "sat"

        else if (hours === 2 || hours === 3 || hours === 4 || hours === 22 || hours === 23 || hours === 24)
            sati = "sata"

        if (minutes === 1 || minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51)
            minute = "minut"

        else if (minutes === 0 || minutes === 2 || minutes === 3 || minutes === 4 || minutes === 5 || minutes === 6 || minutes === 7 || minutes === 8 || minutes === 9 || minutes === 10 || minutes === 11 || minutes === 12 || minutes === 13 || minutes === 14 || minutes === 15 || minutes === 16 || minutes === 17 || minutes === 18 || minutes === 19 || minutes === 20 || minutes === 22 || minutes === 23 || minutes === 24 || minutes === 25 || minutes === 26 || minutes === 27 || minutes === 28 || minutes === 29 || minutes === 30 || minutes === 32 || minutes === 33 || minutes === 34 || minutes === 35 || minutes === 36 || minutes === 37 || minutes === 38 || minutes === 39 || minutes === 40 || minutes === 42 || minutes === 43 || minutes === 44 || minutes === 45 || minutes === 46 || minutes === 47 || minutes === 48 || minutes === 49 || minutes === 50 || minutes === 52 || minutes === 53 || minutes === 54 || minutes === 55 || minutes === 56 || minutes === 57 || minutes === 58 || minutes === 59 || minutes === 60)
            minute = "minuta"

        if (seconds === 1)
            sekunde = "sekund"

        else if (seconds === 0 || seconds === 5 || seconds === 6 || seconds === 7 || seconds === 8 || seconds === 9 || seconds === 10 || seconds === 11 || seconds === 12 || seconds === 13 || seconds === 14 || seconds === 15 || seconds === 16 || seconds === 17 || seconds === 18 || seconds === 19 || seconds === 20 || seconds === 25 || seconds === 26 || seconds === 27 || seconds === 28 || seconds === 29 || seconds === 30 || seconds === 35 || seconds === 36 || seconds === 37 || seconds === 38 || seconds === 39 || seconds === 40 || seconds === 45 || seconds === 46 || seconds === 47 || seconds === 48 || seconds === 49 || seconds === 50 || seconds === 55 || seconds === 56 || seconds === 57 || seconds === 58 || seconds === 59 || seconds === 60)
            sekunde = "sekundi"

        else if (seconds === 21 || seconds === 31 || seconds === 41 || seconds === 51)
            sekunde = "sekunda"

        else if (seconds === 2 || seconds === 3 || seconds === 4 || seconds === 22 || seconds === 23 || seconds === 24 || seconds === 32 || seconds === 33 || seconds === 34 || seconds === 42 || seconds === 43 || seconds === 44 || seconds === 52 || seconds === 53 || seconds === 54)
            sekunde = "sekunde"

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0)
            return `**${months}** ${mjeseci}`
        else if (seconds === 0 && minutes === 0 && hours === 0)
            return `**${months}** ${mjeseci} i **${days}** ${dani}`
        else if (seconds === 0 && minutes === 0)
            return `**${months}** ${mjeseci}, **${days}** ${dani} i **${hours}** ${sati}`
        else if (seconds === 0)
            return `**${months}** ${mjeseci}, **${days}** ${dani}, **${hours}** ${sati} i **${minutes}** ${minute}`
        else
            return `**${months}** ${mjeseci}, **${days}** ${dani}, **${hours}** ${sati}, **${minutes}** ${minute} i **${seconds}** ${sekunde}`;

    } else if (days) {
        let dani = ""
        let sati = ""
        let minute = ""
        let sekunde = ""

        if (days === 1 || days === 21 || days === 31)
            dani = "dan"

        else if (days === 2 || days === 3 || days === 4 || days === 5 || days === 6 || days === 7 || days === 8 || days === 9 || days === 10 || days === 11 || days === 12 || days === 13 || days === 14 || days === 15 || days === 16 || days === 17 || days === 18 || days === 19 || days === 20 || days === 22 || days === 23 || days === 24 || days === 25 || days === 26 || days === 27 || days === 28 || days === 29 || days === 30)
            dani = "dana"

        if (hours === 0 || hours === 5 || hours === 6 || hours === 7 || hours === 8 || hours === 9 || hours === 10 || hours === 11 || hours === 12 || hours === 13 || hours === 14 || hours === 15 || hours === 16 || hours === 17 || hours === 18 || hours === 19 || hours === 20)
            sati = 'sati'

        else if (hours === 1 || hours === 21)
            sati = "sat"

        else if (hours === 2 || hours === 3 || hours === 4 || hours === 22 || hours === 23 || hours === 24)
            sati = "sata"

        if (minutes === 1 || minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51)
            minute = "minut"

        else if (minutes === 0 || minutes === 2 || minutes === 3 || minutes === 4 || minutes === 5 || minutes === 6 || minutes === 7 || minutes === 8 || minutes === 9 || minutes === 10 || minutes === 11 || minutes === 12 || minutes === 13 || minutes === 14 || minutes === 15 || minutes === 16 || minutes === 17 || minutes === 18 || minutes === 19 || minutes === 20 || minutes === 22 || minutes === 23 || minutes === 24 || minutes === 25 || minutes === 26 || minutes === 27 || minutes === 28 || minutes === 29 || minutes === 30 || minutes === 32 || minutes === 33 || minutes === 34 || minutes === 35 || minutes === 36 || minutes === 37 || minutes === 38 || minutes === 39 || minutes === 40 || minutes === 42 || minutes === 43 || minutes === 44 || minutes === 45 || minutes === 46 || minutes === 47 || minutes === 48 || minutes === 49 || minutes === 50 || minutes === 52 || minutes === 53 || minutes === 54 || minutes === 55 || minutes === 56 || minutes === 57 || minutes === 58 || minutes === 59 || minutes === 60)
            minute = "minuta"

        if (seconds === 1)
            sekunde = "sekund"

        else if (seconds === 0 || seconds === 5 || seconds === 6 || seconds === 7 || seconds === 8 || seconds === 9 || seconds === 10 || seconds === 11 || seconds === 12 || seconds === 13 || seconds === 14 || seconds === 15 || seconds === 16 || seconds === 17 || seconds === 18 || seconds === 19 || seconds === 20 || seconds === 25 || seconds === 26 || seconds === 27 || seconds === 28 || seconds === 29 || seconds === 30 || seconds === 35 || seconds === 36 || seconds === 37 || seconds === 38 || seconds === 39 || seconds === 40 || seconds === 45 || seconds === 46 || seconds === 47 || seconds === 48 || seconds === 49 || seconds === 50 || seconds === 55 || seconds === 56 || seconds === 57 || seconds === 58 || seconds === 59 || seconds === 60)
            sekunde = "sekundi"

        else if (seconds === 21 || seconds === 31 || seconds === 41 || seconds === 51)
            sekunde = "sekunda"

        else if (seconds === 2 || seconds === 3 || seconds === 4 || seconds === 22 || seconds === 23 || seconds === 24 || seconds === 32 || seconds === 33 || seconds === 34 || seconds === 42 || seconds === 43 || seconds === 44 || seconds === 52 || seconds === 53 || seconds === 54)
            sekunde = "sekunde"

        if (hours === 0 && minutes === 0 && seconds === 0)
            return `**${days}** ${dani}`
        else if (minutes === 0 && seconds === 0)
            return `**${days}** ${dani} i **${hours}** ${sati}`
        else if (seconds === 0)
            return `**${days}** ${dani}, **${hours}** ${sati} i **${minutes}** ${minute}`
        else
            return `**${days}** ${dani}, **${hours}** ${sati}, **${minutes}** ${minute} i **${seconds}** ${sekunde}`;

    } else if (hours) {
        let sati = ""
        let minute = ""
        let sekunde = ""

        if (hours === 0 || hours === 5 || hours === 6 || hours === 7 || hours === 8 || hours === 9 || hours === 10 || hours === 11 || hours === 12 || hours === 13 || hours === 14 || hours === 15 || hours === 16 || hours === 17 || hours === 18 || hours === 19 || hours === 20)
            sati = 'sati'

        else if (hours === 1 || hours === 21)
            sati = "sat"

        else if (hours === 2 || hours === 3 || hours === 4 || hours === 22 || hours === 23 || hours === 24)
            sati = "sata"

        if (minutes === 1 || minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51)
            minute = "minut"

        else if (minutes === 0 || minutes === 2 || minutes === 3 || minutes === 4 || minutes === 5 || minutes === 6 || minutes === 7 || minutes === 8 || minutes === 9 || minutes === 10 || minutes === 11 || minutes === 12 || minutes === 13 || minutes === 14 || minutes === 15 || minutes === 16 || minutes === 17 || minutes === 18 || minutes === 19 || minutes === 20 || minutes === 22 || minutes === 23 || minutes === 24 || minutes === 25 || minutes === 26 || minutes === 27 || minutes === 28 || minutes === 29 || minutes === 30 || minutes === 32 || minutes === 33 || minutes === 34 || minutes === 35 || minutes === 36 || minutes === 37 || minutes === 38 || minutes === 39 || minutes === 40 || minutes === 42 || minutes === 43 || minutes === 44 || minutes === 45 || minutes === 46 || minutes === 47 || minutes === 48 || minutes === 49 || minutes === 50 || minutes === 52 || minutes === 53 || minutes === 54 || minutes === 55 || minutes === 56 || minutes === 57 || minutes === 58 || minutes === 59 || minutes === 60)
            minute = "minuta"

        if (seconds === 1)
            sekunde = "sekund"

        else if (seconds === 0 || seconds === 5 || seconds === 6 || seconds === 7 || seconds === 8 || seconds === 9 || seconds === 10 || seconds === 11 || seconds === 12 || seconds === 13 || seconds === 14 || seconds === 15 || seconds === 16 || seconds === 17 || seconds === 18 || seconds === 19 || seconds === 20 || seconds === 25 || seconds === 26 || seconds === 27 || seconds === 28 || seconds === 29 || seconds === 30 || seconds === 35 || seconds === 36 || seconds === 37 || seconds === 38 || seconds === 39 || seconds === 40 || seconds === 45 || seconds === 46 || seconds === 47 || seconds === 48 || seconds === 49 || seconds === 50 || seconds === 55 || seconds === 56 || seconds === 57 || seconds === 58 || seconds === 59 || seconds === 60)
            sekunde = "sekundi"

        else if (seconds === 21 || seconds === 31 || seconds === 41 || seconds === 51)
            sekunde = "sekunda"

        else if (seconds === 2 || seconds === 3 || seconds === 4 || seconds === 22 || seconds === 23 || seconds === 24 || seconds === 32 || seconds === 33 || seconds === 34 || seconds === 42 || seconds === 43 || seconds === 44 || seconds === 52 || seconds === 53 || seconds === 54)
            sekunde = "sekunde"

        if (minutes === 0 && seconds === 0)
            return `**${hours}** ${sati}`
        else if (seconds === 0)
            return `**${hours}** ${sati} i **${minutes}** ${minute}`
        else
            return `**${hours}** ${sati}, **${minutes}** ${minute} i **${seconds}** ${sekunde}`;
    } else if (minutes) {
        let minute = ""
        let sekunde = ""

        if (minutes === 1 || minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51)
            minute = "minut"

        else if (minutes === 0 || minutes === 2 || minutes === 3 || minutes === 4 || minutes === 5 || minutes === 6 || minutes === 7 || minutes === 8 || minutes === 9 || minutes === 10 || minutes === 11 || minutes === 12 || minutes === 13 || minutes === 14 || minutes === 15 || minutes === 16 || minutes === 17 || minutes === 18 || minutes === 19 || minutes === 20 || minutes === 22 || minutes === 23 || minutes === 24 || minutes === 25 || minutes === 26 || minutes === 27 || minutes === 28 || minutes === 29 || minutes === 30 || minutes === 32 || minutes === 33 || minutes === 34 || minutes === 35 || minutes === 36 || minutes === 37 || minutes === 38 || minutes === 39 || minutes === 40 || minutes === 42 || minutes === 43 || minutes === 44 || minutes === 45 || minutes === 46 || minutes === 47 || minutes === 48 || minutes === 49 || minutes === 50 || minutes === 52 || minutes === 53 || minutes === 54 || minutes === 55 || minutes === 56 || minutes === 57 || minutes === 58 || minutes === 59 || minutes === 60)
            minute = "minuta"

        if (seconds === 1)
            sekunde = "sekund"

        else if (seconds === 0 || seconds === 5 || seconds === 6 || seconds === 7 || seconds === 8 || seconds === 9 || seconds === 10 || seconds === 11 || seconds === 12 || seconds === 13 || seconds === 14 || seconds === 15 || seconds === 16 || seconds === 17 || seconds === 18 || seconds === 19 || seconds === 20 || seconds === 25 || seconds === 26 || seconds === 27 || seconds === 28 || seconds === 29 || seconds === 30 || seconds === 35 || seconds === 36 || seconds === 37 || seconds === 38 || seconds === 39 || seconds === 40 || seconds === 45 || seconds === 46 || seconds === 47 || seconds === 48 || seconds === 49 || seconds === 50 || seconds === 55 || seconds === 56 || seconds === 57 || seconds === 58 || seconds === 59 || seconds === 60)
            sekunde = "sekundi"

        else if (seconds === 21 || seconds === 31 || seconds === 41 || seconds === 51)
            sekunde = "sekunda"

        else if (seconds === 2 || seconds === 3 || seconds === 4 || seconds === 22 || seconds === 23 || seconds === 24 || seconds === 32 || seconds === 33 || seconds === 34 || seconds === 42 || seconds === 43 || seconds === 44 || seconds === 52 || seconds === 53 || seconds === 54)
            sekunde = "sekunde"

        if (seconds === 0)
            return `**${minutes}** ${minute}`
        else
            return `**${minutes}** ${minute} i **${seconds}** ${sekunde}`;
    } else if (seconds) {
        let sekunde = ""

        if (seconds === 1)
            sekunde = "sekund"

        else if (seconds === 0 || seconds === 5 || seconds === 6 || seconds === 7 || seconds === 8 || seconds === 9 || seconds === 10 || seconds === 11 || seconds === 12 || seconds === 13 || seconds === 14 || seconds === 15 || seconds === 16 || seconds === 17 || seconds === 18 || seconds === 19 || seconds === 20 || seconds === 25 || seconds === 26 || seconds === 27 || seconds === 28 || seconds === 29 || seconds === 30 || seconds === 35 || seconds === 36 || seconds === 37 || seconds === 38 || seconds === 39 || seconds === 40 || seconds === 45 || seconds === 46 || seconds === 47 || seconds === 48 || seconds === 49 || seconds === 50 || seconds === 55 || seconds === 56 || seconds === 57 || seconds === 58 || seconds === 59 || seconds === 60)
            sekunde = "sekundi"

        else if (seconds === 21 || seconds === 31 || seconds === 41 || seconds === 51)
            sekunde = "sekunda"

        else if (seconds === 2 || seconds === 3 || seconds === 4 || seconds === 22 || seconds === 23 || seconds === 24 || seconds === 32 || seconds === 33 || seconds === 34 || seconds === 42 || seconds === 43 || seconds === 44 || seconds === 52 || seconds === 53 || seconds === 54)
            sekunde = "sekunde"

        return `**${seconds}** ${sekunde}`;
    } else {
        return `**0** sekundi`;
    }
}

module.exports = {
    sleep,
    commandsList,
    rankCard,
    changeVanity,
    cacheInvite,
    embed,
    cleanNumber,
    generateChartConfig,
    randomNumber,
    timeFormat
}