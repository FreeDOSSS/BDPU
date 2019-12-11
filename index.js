const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Markup = require("telegraf/markup");

const btn = require("./helpers/btn");
const {
  sendFile,
  addNewUsers,
  spam,
  sendPayment
} = require("./helpers/helpers");

const bot = new Telegraf(process.env.TOKEN);
const stage = new Stage();

bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => {
  addNewUsers(ctx.chat.id);
  return ctx.reply(
    "Привіт, чим тобі допомогти?",
    // keyboard(btn.message)
    Markup.keyboard(btn.menubtn)
      .oneTime()
      .resize()
      .extra()
  );
});

bot.command("sendNews", ctx => {
  const str = ctx.message.text.replace("/sendNews", "");
  if (str) {
    spam(ctx, str);
  } else {
    ctx.reply("Не вказаний текст повідомлення");
  }
});

bot.hears("Розклад", ctx =>
  ctx.reply(
    "Твій факультет",
    Markup.keyboard(btn.fakeltet)
      .oneTime()
      .resize()
      .extra()
  )
);

bot.hears("Корисне", ctx =>
  ctx.reply("Що переглянемо?", Markup.inlineKeyboard(btn.useful).extra())
);

bot.hears("Реквізити", ctx =>
  ctx.reply(
    "Що потрібно?",
    Markup.keyboard(btn.payment)
      .oneTime()
      .resize()
      .extra()
  )
);

bot.hears("Назад", ctx =>
  ctx.reply(
    "Чем помочь?",
    Markup.keyboard(btn.menubtn)
      .oneTime()
      .resize()
      .extra()
  )
);

bot.hears("ФМКТО", ctx => sendFile(ctx, "ffmkto"));
bot.hears("ФДССО", ctx => sendFile(ctx, "fdsso"));
bot.hears("ФФВ", ctx => sendFile(ctx, "ffv"));
bot.hears("ФППОМ", ctx => sendFile(ctx, "fppom"));
bot.hears("ФФСК", ctx => sendFile(ctx, "ffsk"));
bot.hears("ГЕФ", ctx => sendFile(ctx, "gef"));

bot.hears("ДИПЛОМ", ctx => sendPayment(ctx, "diplom"));
bot.hears("НАВЧАННЯ", ctx => sendPayment(ctx, "teaching"));
bot.hears("ГУРТОЖИТОК", ctx => sendPayment(ctx, "hostel"));
bot.hears("ЕЛЕКТРОЕНЕРГІЯ", ctx => sendPayment(ctx, "electricity"));

bot.launch();
