import type { DeepPartial, Messages } from "../../types";

/** Russian. Draft translation — have a fluent speaker review before launch. */
export const inquiryRu: DeepPartial<Messages["inquiry"]> = {
  common: {
    cancel: "Отмена",
    close: "Закрыть",
  },
  talk: {
    closeAria: "Закрыть окно",
    headlineLead: "Давайте ",
    headlineAccent: "свяжемся",
    headlineTail: ".",
    intro:
      "Есть вопросы о солнечной энергии? Хотите узнать, сколько можно сэкономить, или проверить, подходит ли ваша крыша, — мы поможем. Без технического жаргона, только честные советы.",
    subheadline: "Просто. Надёжно. Прочно.",
    subtext:
      "Несём энергию солнца в каждый филиппинский дом. Самое сложное — разрешения, проектирование и подключение к сети — мы берём на себя, а вы просто наслаждаетесь экономией.",
    fields: {
      name: "Как к вам обращаться?",
      email: "Электронная почта",
      phone: "Мобильный телефон",
      province: "Провинция",
      provincePlaceholder: "напр., Metro Manila",
      city: "Город",
      cityPlaceholder: "напр., Cebu City",
      inquiryType: "Чем мы можем помочь?",
      message: "Сообщение",
    },
    inquiryTypes: {
      general: "Общий вопрос",
      quote: "Запросить расчёт стоимости",
      consultation: "Консультация",
    },
    errors: {
      nameRequired: "Пожалуйста, укажите ваше имя.",
      emailRequired: "Пожалуйста, укажите адрес электронной почты.",
      emailInvalid: "Пожалуйста, укажите корректный адрес электронной почты.",
      phoneRequired: "Пожалуйста, укажите номер мобильного телефона.",
      phoneInvalid: "Пожалуйста, укажите корректный филиппинский мобильный номер.",
      provinceRequired: "Пожалуйста, выберите провинцию.",
      cityRequired: "Пожалуйста, выберите город.",
      messageRequired: "Пожалуйста, введите сообщение.",
      messageTooShort: "Сообщение должно содержать не менее 10 символов.",
    },
    send: "Отправить сообщение",
    sending: "Отправка...",
    successTitle: "Сообщение отправлено!",
    successBody: "Спасибо, что обратились к нам. Наша команда ответит вам в течение 24 часов.",
    done: "Готово",
  },
  package: {
    title: "Запрос по этой системе",
    intro:
      "Почти готово! Укажите свои данные ниже. Наша команда свяжется с вами, чтобы назначить бесплатный осмотр объекта.",
    system: "Система",
    loadCapacity: "Мощность нагрузки: {value}",
    monthlySaving: "Экономия в месяц: ₱{min} – ₱{max}",
    componentQtyOne: "{count} шт.",
    componentQtyMany: "{count} шт.",
    fields: {
      name: "Имя",
      namePlaceholder: "Juan dela Cruz",
      location: "Местоположение",
      locationPlaceholder: "напр., Tagbilaran City",
      email: "Электронная почта",
      emailPlaceholder: "juandelacruz@gmail.com",
      phone: "Номер телефона",
      phonePlaceholder: "9123456789",
    },
    errors: {
      nameRequired: "Укажите имя.",
      locationRequired: "Укажите местоположение.",
      emailRequired: "Укажите электронную почту.",
      emailInvalid: "Введите корректный адрес электронной почты.",
      phoneRequired: "Укажите номер телефона.",
      phoneInvalid: "Введите 10-значный номер, начинающийся с 9.",
      submitFailed: "Что-то пошло не так. Пожалуйста, попробуйте ещё раз.",
    },
    privacy:
      "Мы ценим вашу конфиденциальность. Ваши данные используются только для оценки солнечной системы и ответов на ваши запросы.",
    submit: "Отправить запрос",
    submitting: "Отправка…",
    successTitle: "Запрос отправлен",
    successBody:
      "Спасибо! Мы получили ваш запрос. Один из наших специалистов по солнечной энергетике свяжется с вами в течение 1–2 рабочих дней.",
  },
};
