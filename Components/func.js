const option = require("./option");
module.exports = {
    emptyText: async function (bot, chatId) {
        let eText = await bot.sendMessage(chatId, `К сожалению, вы не заполнили поле ввода.`)
        return eText;
    },
    textInfoCabs: function (result, nowDate, nowTime) {
        return `находится по адресу <strong>${result[0]['adress']}</strong>\n\n<pre>Дата: ${nowDate}</pre>\n<pre>Время: ${nowTime}</pre>\n\n📞 <strong>${result[0]['number']}</strong>\n\n⏰ <strong>График работы:</strong>\n<ins>${result[0]['hours']}</ins>\n\n📌 Мы предоставляем следующие услуги:\n<i>${result[0]['services']}</i>`;
    },
    addAdress: async function (bot, chatId) {
        let addAdressCab = await bot.sendMessage(chatId, `Адрес успешно добавлен.\n\nОпишите, пожалуйста, причину обращения.\n\nНапишите/скопируйте в поле ввода:\n\n/txt\n\nЗатем пишите вашу проблему.\n\n<strong><ins>Пример:</ins></strong>\n"/txtОчень сильно болит зуб.Переодически ноет..."`, {parse_mode: 'HTML'})
        return addAdressCab;
    },
    startFunction: async function (conn,query,bot,chatId,nowDate,nowTime) {
        await conn.query(query, (err, result) => {
            let out = ''
            for (let i = 0; i < result.length; i++) {
                out += result[i]['number'] + ' ';
            }
            return bot.sendMessage(chatId, `🚑 Вас приветствует кабинет дантист ООО"Вита"\n\n<pre>Дата: ${nowDate}</pre>\n<pre>Время: ${nowTime}</pre>\n\n❓Вы можете узнать всю информацию, либо записаться на прием, нажав на кнопки ниже.\n\n❗❗❗ ВАЖНО ❗❗❗\nХотим Вас уведомить, что запись на прием ведется за три дня.\n<ins>Если у вас острая боль, то звоните на телефон - прием вне очереди.</ins>`, {
                parse_mode: 'HTML',
                reply_markup: option.infoCabOptions.reply_markup
            });
        });
    }
}