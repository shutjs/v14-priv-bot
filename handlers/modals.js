const fs = require("fs");

module.exports = (client, config) => {
    console.log("Modals Handler:".blue);

    const modals = fs.readdirSync(`./modals/`).filter(file => file.endsWith('.js'));

    for (let file of modals) {

        let pull = require(`../modals/${file}`);
        if (pull.id) {
            client.modals.set(pull.id, pull);
            console.log(`[HANDLER - MODALS] bir dosya yüklendi: ${file}`.brightGreen)
        } else {
            console.log(`[HANDLER - MODALS] dosya yüklenemedi ${file}. Modal kimlik eksik.`.red)
            continue;
        }
    }
};
