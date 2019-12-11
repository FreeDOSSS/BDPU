const fs = require("fs");
const path = require("path");
const Markup = require("telegraf/markup");
const Telegram = require("telegraf/telegram");
const telegram = new Telegram(process.env.TOKEN);

function sendFile(ctx, name) {
  const folderPath = `./db/${name}`;
  if (fs.readdirSync(folderPath).length > 0) {
    fs.readdirSync(folderPath).map(el => {
      const str = path.resolve(path.join(folderPath, el));
      return ctx.replyWithDocument({ source: str });
    });
  } else {
    ctx.reply("Файлы отсутствуют");
  }
}

function sendPayment(ctx, name) {
  const folderPath = `./db/payment/${name}.txt`;
  if (fs.readFileSync(folderPath, "utf-8")) {
    const str = fs.readFileSync(folderPath, "utf-8");
    ctx.reply(str);
  } else {
    ctx.reply("Файл не знайдено");
  }
}

function addNewUsers(id) {
  const data = JSON.parse(fs.readFileSync("./db/user.json", "utf-8"));
  if (!data.some(el => el === id)) {
    data.push(id);
    fs.writeFileSync("./db/user.json", JSON.stringify(data));
  }
}

function spam(ctx, message) {
  const data = JSON.parse(fs.readFileSync("./db/user.json", "utf-8"));
  const arreyPromis = [];
  let sucs = 0;
  const error = [];
  data.forEach(element => {
    arreyPromis.push(
      telegram
        .sendMessage(element, message)
        .then(res => (sucs += 1))
        .catch(err =>
          err.code === 403 ? error.push(err.on.payload.chat_id) : null
        )
    );
  });

  Promise.all(arreyPromis)
    .then()
    .catch()
    .finally(() => {
      console.log(error);
      delUsers(error);
      ctx.reply(`Кількість користувачів які отримали повідомлення  - ${sucs}`);
    });
}

function delUsers(arr) {
  const data = JSON.parse(fs.readFileSync("./db/user.json", "utf-8"));

  arr.forEach(el => {
    data.includes(el);
    if (data.includes(el)) {
      data.splice(data.indexOf(el), 1);
    }
    console.log(data.includes(el));
  });
  fs.writeFileSync("./db/user.json", JSON.stringify(data));
}

module.exports = { sendFile, addNewUsers, spam, sendPayment };
