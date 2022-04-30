module.exports = {
    infoCabOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: '🏠 ул.Ванцетти,1/б', callback_data: '/firstCab'}, {
                    text: '🏬 ул.Лазо,17',
                    callback_data: '/secondCab'
                }],
                [{text: '✅Записаться на прием✅', callback_data: '/addOrder'}],
                [{text: '🔊 Отзывы/Предложения', callback_data: '/comment'}]
            ]
        })
    },
    addNameOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Начать заполнение', callback_data: '/add_note_name'}]
            ]
        })
    },
    addStreetOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Выбрать кабинет дантист', callback_data: '/add_note_street'}]
            ]
        })
    },
    infoCommentUsersOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Посмотреть отзывы пациентов', callback_data: '/open_other_comment'}]
            ]
        })
    },
    backPageOption: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Вернуться на главную страницу', callback_data: '/start'}],
                [{text: 'Вернуться назад', callback_data: '/comment'}]
            ]
        })
    }
}