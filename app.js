const config = require('./Components/config');
const option = require('./Components/option');
const TelegramApi = require('node-telegram-bot-api');
const mysql = require('mysql');

const funcFile = require('./Components/func');

const token = `${config.tokenAPI}`;
const bot = new TelegramApi(token, {polling: true});

const conn = mysql.createConnection(config.databaseLocal);


const query = 'select * from cab_info';
const queryFirstCab = 'select * from cab_info where id_cab = 1';
const querySecondCab = 'select * from cab_info where id_cab = 2';
const queryOtherCom = 'SELECT * from comment';

const startBot = async () => {
    console.log('Bot has been started...')

    const nowDate = new Date().toLocaleDateString();
    const nowTime = new Date().toLocaleTimeString().slice(0, -3);

    let userDataArr = [];

    // Проверка подключения к БД
    conn.connect(err => {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log('Database ----- OK')
        }
    })


    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const {first_name, username} = msg.from;
        // console.log(msg)
        const strComment = '/com';
        const strOffer = '/of';

        const strFIO = '/fio';
        const strNum = '/num';
        const strTXT = '/txt';
        const strData = '/dat';

        switch (text) {
            case '/start':
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d43/740/d4374010-6842-3710-b8f0-115b0c414216/1.webp')
                funcFile.startFunction(conn,query,bot,chatId,nowDate,nowTime);
                break;
            case '/1':
                userDataArr.push('ул.Ванцетти,1/б');
                funcFile.addAdress(bot, chatId);
                break;
            case '/2':
                userDataArr.push('ул.Лазо,17');
                funcFile.addAdress(bot, chatId);
                break;

            default:
                if (text.slice(0, 4) == strComment) {
                    if (text.length == 4) {
                        funcFile.emptyText(bot, chatId);
                    } else {
                        await bot.sendMessage(chatId, `Спасибо за ваш отзыв\n\n"${text.slice(4)}"\n\nЧто бы вернуться в главное меню нажмите:\n/start`);
                        let addCommSQL = `INSERT INTO \`comment\` (\`id_comm\`, \`chatID\`, \`first_name\`, \`username\`, \`text\`, \`dateAdd\`) VALUES (NULL, '${chatId}', '${first_name}', '${username}', '${text.slice(4)}', '${nowDate} ${nowTime}')`;
                        await conn.query(addCommSQL, function (err, results) {
                            if (err) throw err;
                            console.log("Data comment sent...");
                        });
                    }
                } else if (text.slice(0, 3) == strOffer) {
                    if (text.length == 3) {
                        funcFile.emptyText(bot, chatId);
                    } else {
                        await bot.sendMessage(chatId, `Спасибо за ваше предложение\n\n"${text.slice(3)}"\n\nЧто бы вернуться в главное меню нажмите:\n/start`);
                        let addOfferSQL = `INSERT INTO \`offer\` (\`id_offer\`, \`chatID\`, \`first_name\`, \`username\`, \`text\`, \`dateAdd\`) VALUES (NULL, '${chatId}', '${first_name}', '${username}', '${text.slice(3)}', '${nowDate} ${nowTime}')`;
                        await conn.query(addOfferSQL, function (err, results) {
                            if (err) throw err;
                            console.log("Data offer sent...");
                        });
                    }
                } else if (text.slice(0, 4) == strFIO) {
                    if (text.length == 4) {
                        funcFile.emptyText(bot, chatId);
                    } else {
                        userDataArr = [chatId, first_name, username, text.slice(4)];

                        await bot.sendMessage(chatId, `Ваше ФИО успешно добавлено.\n\nТеперь мне необходимо знать как с Вами связаться.\n\nНапишите/скопируйте в поле ввода:\n\n/num\n\nЗатем напишите ваш номер телефона для связи и отправьте.\n\n<strong><ins>Пример:</ins></strong>\n"/num+7(999)670-90-80"`, {parse_mode: 'HTML'});
                    }
                } else if (text.slice(0, 4) == strNum) {
                    userDataArr.push(text.slice(4))
                    if (text.length == 4) {
                        funcFile.emptyText(bot, chatId);
                    } else {
                        await bot.sendMessage(chatId, `Ваш номер успешно добавлен.\n\nТеперь Вам необходимо выбрать адрес дантиста, в который вы хотите обратиться.\n\nНажмите ту цифру, которая соответствует нужному Вам адресу.\n\n/1 - ул.Ванцетти,1/б\n\n/2 - ул.Лазо,17`);

                    }
                } else if (text.slice(0, 4) == strTXT) {
                    userDataArr.push(text.slice(4))
                    if (text.length == 4) {
                        funcFile.emptyText(bot, chatId);
                    } else {
                        if (userDataArr[5] == 'ул.Ванцетти,1/б') {
                            await conn.query(queryFirstCab, (err, result) => {
                                let otvet = bot.sendMessage(chatId, `Ваша проблема успешно добавлена\n\nНапишите, когда вам будет удобно прийти на прием.\n\nНапишите/скопируйте в поле ввода:\n\n/dat\n\nЗатем пишите дату и время в таком формате, как в <strong>ПРИМЕРЕ</strong>.\n\n<strong><ins>Пример:</ins></strong>\n"/dat28.04.2022 12:00-13:00"\n\nНапоминаем часы работы дантиста на ул.Ванцетти,1/б:\n<ins>${result[0]['hours']}</ins> \n\n<pre>Дата: ${nowDate}</pre>\n<pre>Время: ${nowTime}</pre>`, {parse_mode: 'HTML'})
                                return otvet;
                            });

                        } else {
                            await conn.query(querySecondCab, (err, result) => {
                                let otvet = bot.sendMessage(chatId, `Ваша проблема успешно добавлена.\n\nНапишите, когда вам будет удобно прийти на прием.\n\nНапишите/скопируйте в поле ввода:\n\n/dat\n\nЗатем пишите дату и время в таком формате, как в <strong>ПРИМЕРЕ</strong>.\n\n<strong><ins>Пример:</ins></strong>\n"/dat28.04.2022 12:00-13:00"\n\nНапоминаем часы работы дантиста на ул.Лазо,17:\n<ins>${result[0]['hours']}</ins> \n\n<pre>Дата: ${nowDate}</pre>\n<pre>Время: ${nowTime}</pre>`, {parse_mode: 'HTML'})
                                return otvet;
                            });
                        }
                    }
                } else if (text.slice(0, 4) == strData) {
                    userDataArr.push(text.slice(4))
                    if (text.length == 4) {
                        funcFile.emptyText(bot, chatId);
                    } else {
                        // console.log(userDataArr);
                        await bot.sendMessage(chatId, `Ваши данные загружены.\nЧерез некоторое время с Вами свяжется медсестра для подтверждения информации.\n\nЧто бы вернуться на главное меню, нажмите:\n\n/start`);
                        let addNewPatientSQL = `INSERT INTO \`patient\` (\`id_pat\`, \`chatID\`, \`first_name\`, \`username\`, \`full_name\`, \`phone_number\`, \`street\`, \`problem\`, \`data\`,\`data_added\`) VALUES (NULL, '${userDataArr[0]}', '${userDataArr[1]}', '${userDataArr[2]}', '${userDataArr[3]}', '${userDataArr[4]}', '${userDataArr[5]}', '${userDataArr[6]}', '${userDataArr[7]}', '${nowDate} ${nowTime}')`;
                        await conn.query(addNewPatientSQL, function (err, results) {
                            if (err) throw err;
                            console.log("New data patient add...");
                        });
                    }
                } else {
                    bot.sendMessage(chatId, 'Я не понимаю Вас 😢');
                }
        }
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        switch (data) {
            case '/start':
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d43/740/d4374010-6842-3710-b8f0-115b0c414216/1.webp')
                funcFile.startFunction(conn,query,bot,chatId,nowDate,nowTime);
                break;
            case '/firstCab':
                await bot.sendLocation(chatId, 56.08190229330038, 85.9995189472343);
                await conn.query(queryFirstCab, (err, result) => {
                    let otvet = bot.sendMessage(chatId, `🔴 Первый кабинет ${funcFile.textInfoCabs(result, nowDate, nowTime)}`, {
                        parse_mode: 'HTML',
                        reply_markup: option.infoCabOptions.reply_markup
                    });
                    return otvet;
                });
                break;
            case '/secondCab':
                await bot.sendLocation(chatId, 56.05329690351322, 86.02844807387976);
                await conn.query(querySecondCab, (err, result) => {
                    return bot.sendMessage(chatId, `🔵 Второй кабинет ${funcFile.textInfoCabs(result, nowDate, nowTime)}`, {
                        parse_mode: 'HTML',
                        reply_markup: option.infoCabOptions.reply_markup
                    });
                });
                break;
            case '/addOrder':
                await bot.sendMessage(chatId, `📝 Для записи на прием необходимо заполнить небольшую анкету.\n(Нажмите кнопку "Начать заполнение") \n\nОт Вас потребуется ввести:\n -ФИО, \n -контактный телефон, \n -кабинет дантист, \n -причину обращения, \n -удобную дату и время.`, option.addNameOptions)
                break;
            case '/comment':
                await bot.sendMessage(chatId, `Что бы оставить отзыв необходимо в начале предложение написать:\n\n/com (можно скопировать и вставить в поле ввода)\n\nЧто бы оставить предложение необходимо в начале предложение написать:\n\n/of (можно скопировать и вставить в поле ввода)\n\n<strong><ins>Пример:</ins></strong>\n"/comОчень понравилось..." `, {
                    parse_mode: 'HTML',
                    reply_markup: option.infoCommentUsersOptions.reply_markup
                });
                break;
            case '/add_note_name':
                await bot.sendMessage(chatId, `Напишите/скопируйте в поле ввода:\n\n/fio\n\nЗатем напишите ваши полные фамилию имя и отчество и отправьте.\n\n<strong><ins>Пример:</ins></strong>\n"/fioИванов Иван Иванович"`, {parse_mode: 'HTML'})
                break;
            case '/open_other_comment':
                await conn.query(queryOtherCom, (err, result) => {
                    let out =``;
                    for (let i = 0; i < result.length; i++) {
                        out += `${i + 1}. "${result[i]['first_name']}"\n\nОтзыв\n"${result[i]['text']}"\n\nДата публикации:\n${result[i]['dateAdd']}\n\n___________________________\n\n`
                    }
                    return bot.sendMessage(chatId,`${out}` , {
                        parse_mode: 'HTML',
                        reply_markup: option.backPageOption.reply_markup
                    });
                });
                break;
            default:
                bot.sendMessage(chatId, 'Что-то я не пойму Вас =(');
        }
    })
}

startBot();