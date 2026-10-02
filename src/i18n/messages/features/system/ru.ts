import type { DeepPartial, Messages } from "../../types";

/** Russian. Draft translation — have a fluent speaker review before launch. */
export const systemRu: DeepPartial<Messages["system"]> = {
  errorBoundary: {
    title: "Что-то пошло не так",
    chunkMessage: "Доступна новая версия приложения. Перезагрузите страницу, чтобы продолжить.",
    message: "Не удалось загрузить {context}. Скорее всего, это временная проблема.",
    defaultContext: "этот раздел",
    errorCode: "Код ошибки: {code}",
    reload: "Перезагрузить страницу",
    retry: "Повторить",
  },
  systemError: {
    eyebrow: "Запрос не выполнен",
    title: "Что-то пошло не так",
    message: "Сейчас мы не можем обработать ваш запрос. Пожалуйста, повторите попытку чуть позже.",
    checkConnection: "Проверьте подключение",
    verifyForm: "Проверьте данные формы",
    trySubmitting: "Отправьте ещё раз",
    close: "Закрыть",
  },
  seconds: {
    count: {
      one: "{n} секунду",
      few: "{n} секунды",
      many: "{n} секунд",
      other: "{n} секунды",
    },
    unit: {
      one: "секунда",
      few: "секунды",
      many: "секунд",
      other: "секунды",
    },
  },
  rateLimit: {
    ariaLabel: "Превышен лимит запросов",
    title: "Слишком много запросов",
    body: "Доступ временно ограничен из-за слишком большого количества запросов.",
    resume: "Доступ автоматически возобновится через {time}.",
  },
  comingSoon: {
    title: "Azari Solar заряжается.",
    body: "Мы готовим эту страницу, чтобы рассказать о более умных солнечных электростанциях, экономии энергии и экологичных решениях.",
    redirect: "Вы вернётесь на главную через {time}.",
    backHome: "На главную",
  },
  pageLoader: {
    ariaLabel: "Загрузка страницы",
  },
  partners: {
    ariaLabel: "Логотипы партнёров",
  },
  tropics: {
    headerTop: "Солнечная энергия",
    headerBottom: "для тропиков",
    climateTitle: "Устойчивость к климату",
    typhoonRacking: "КРЕПЛЕНИЯ, УСТОЙЧИВЫЕ К ТАЙФУНАМ",
    heatOptimization: "ОПТИМИЗАЦИЯ ДЛЯ СИЛЬНОЙ ЖАРЫ",
    assetsDeployed: "УСТАНОВЛЕННЫЕ СОЛНЕЧНЫЕ МОЩНОСТИ",
    performanceTitle: "Гарантия эффективности",
    performanceSubtitle: "СРЕДНЕЕ СНИЖЕНИЕ СЧЕТОВ ЗА ЭЛЕКТРИЧЕСТВО У НАШИХ КЛИЕНТОВ",
  },
  excellence: {
    titleTop: "Инженерия",
    titleBottom: "совершенства.",
    description:
      "Мы не просто устанавливаем панели — мы внедряем интеллектуальные энергосистемы, созданные с учётом особенностей энергосети Филиппин.",
  },
  cta: {
    titlePrefix: "Готовы обеспечить свою",
    titleHighlight: "энергетическую независимость?",
  },
  meta: {
    clientJourney: {
      title: "Как проходит установка солнечных панелей на Бохоле | Azari Solar",
      description:
        "Узнайте, как Azari Solar сопровождает вас от консультации до установки на Бохоле. Прозрачный процесс, качественные комплектующие и полная послепродажная поддержка по всем Филиппинам.",
    },
    solarCalculator: {
      title: "Бесплатный калькулятор экономии на солнечной энергии — Бохол, Филиппины | Azari Solar",
      description:
        "Рассчитайте размер солнечной системы и ежемесячную экономию с помощью нашего бесплатного калькулятора. Укажите сумму счёта за электричество, чтобы подобрать подходящий пакет, — работаем на Бохоле и по всем Филиппинам.",
    },
    privacyPolicy: {
      title: "Политика конфиденциальности — Azari Solar",
      description:
        "Как Azari Solar собирает, использует и защищает ваши персональные данные в соответствии с Законом Филиппин о защите данных 2012 года (Data Privacy Act of 2012).",
      shareDescription: "Как Azari Solar собирает, использует и защищает ваши персональные данные.",
    },
    termsConditions: {
      title: "Условия использования — Azari Solar",
      description:
        "Условия использования сайта azari.solar и услуг Azari Solar по расчёту стоимости, консультациям и установке.",
      shareDescription: "Условия использования сайта azari.solar.",
    },
    projects: {
      title: "Солнечные проекты на Бохоле, Филиппины | Azari Solar",
      description:
        "Посмотрите завершённые жилые и коммерческие солнечные установки Azari Solar на Бохоле и по всем Филиппинам. Реальные проекты, реальная экономия энергии.",
    },
    notFound: {
      title: "Страница не найдена — Azari Solar",
    },
    projectDetail: {
      title: "{name} — Azari Solar",
      fallbackName: "Солнечный проект",
      description: "{name} — проект Azari Solar на Бохоле, Филиппины.",
      fallbackDescription: "Солнечный проект Azari Solar на Бохоле, Филиппины.",
    },
  },
};
