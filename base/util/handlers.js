const Base = require("./client");
const glob = require("glob");

module.exports = class Handlers {
    /**
     * @param {Base} client 
     */
    constructor(client) {
        this.client = client;
    }

    loadCommands() {
        glob(`${process.cwd()}/src/commands/**/*.js`, (err, files) => {
            files.forEach((file) => {
                const command = new (require(file))(this.client);
                if (!command.name) return delete require.cache[require.resolve(file)] && this.client.logError(`${file.split("/").pop()} nema svoje ime, uklanjam komandu.`);
                this.client.publicCommands.push(command);
                this.client.commands.set(command.name, command);

                return delete require.cache[require.resolve(file)];
            });
        });
    }

    loadEvents() {
        glob(`${process.cwd()}/src/events/**/*.js`, (err, files) => {
            files.forEach((file) => {
                const event = new (require(file))(this.client);
                if (!event.name) return delete require.cache[require.resolve(file)] && this.client.logError(`${file.split("/").pop()} nema svoje ime, uklanjam event.`);

                const execute = (...args) => event.execute(...args);
                if (event.once) this.client.once(event.name, execute);
                else this.client.on(event.name, execute)
                this.client.events.set(event.name, execute);

                return delete require.cache[require.resolve(file)];
            });
        });
    }
}