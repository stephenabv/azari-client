import type { DeepPartial, Messages } from "../../types";

/** Filipino. Draft translation — have a fluent speaker review before launch. */
export const systemFil: DeepPartial<Messages["system"]> = {
  errorBoundary: {
    title: "May nangyaring mali",
    chunkMessage: "May bagong bersyon ng app. I-reload para magpatuloy.",
    message: "Hindi namin ma-load ang {context}. Malamang pansamantalang problema lang ito.",
    defaultContext: "bahaging ito",
    errorCode: "Code ng error: {code}",
    reload: "I-reload ang pahina",
    retry: "Subukang muli",
  },
  systemError: {
    eyebrow: "Hindi natuloy ang request",
    title: "May nangyaring mali",
    message: "Hindi namin maproseso ang iyong request sa ngayon. Pakisubukang muli maya-maya.",
    checkConnection: "Suriin ang iyong koneksyon",
    verifyForm: "Tiyaking tama ang datos sa form",
    trySubmitting: "Subukang ipadala muli",
    close: "Isara",
  },
  seconds: {
    count: {
      one: "{n} segundo",
      few: "{n} segundo",
      many: "{n} segundo",
      other: "{n} segundo",
    },
    unit: {
      one: "segundo",
      few: "segundo",
      many: "segundo",
      other: "segundo",
    },
  },
  rateLimit: {
    ariaLabel: "Lumampas sa limitasyon ng request",
    title: "Masyadong Maraming Request",
    body: "Pansamantalang nilimitahan ang iyong access dahil sa sobrang daming request.",
    resume: "Awtomatikong babalik ang access sa loob ng {time}.",
  },
  comingSoon: {
    title: "Nagcha-charge pa ang Azari Solar.",
    body: "Inihahanda namin ang pahinang ito para ipakita ang mas matatalinong solar power system, pagtitipid sa enerhiya, at mga sustainable na solusyon.",
    redirect: "Ibabalik ka namin sa home sa loob ng {time}.",
    backHome: "Bumalik sa Home",
  },
  pageLoader: {
    ariaLabel: "Nilo-load ang pahina",
  },
  partners: {
    ariaLabel: "Mga logo ng partner",
  },
  tropics: {
    headerTop: "Solar Energy para sa",
    headerBottom: "Tropiko",
    climateTitle: "Katatagan sa Klima",
    typhoonRacking: "RACKING NA PANLABAN SA BAGYO",
    heatOptimization: "OPTIMISADO PARA SA MATINDING INIT",
    assetsDeployed: "NAKA-INSTALL NA SOLAR ASSETS",
    performanceTitle: "Garantiya sa Performance",
    performanceSubtitle: "KARANIWANG BAWAS SA BILL NG KURYENTE NG AMING MGA KLIYENTE",
  },
  excellence: {
    titleTop: "Ininhinyero para sa",
    titleBottom: "Kahusayan.",
    description:
      "Hindi lang kami basta nag-i-install ng panel; nagsasama kami ng matatalinong energy system na idinisenyo para sa natatanging hamon ng power grid ng Pilipinas.",
  },
  cta: {
    titlePrefix: "Handa ka na bang makamit ang",
    titleHighlight: "kalayaan sa enerhiya?",
  },
  meta: {
    clientJourney: {
      title: "Proseso ng Solar Installation sa Bohol | Azari Solar",
      description:
        "Alamin kung paano ka ginagabayan ng Azari Solar mula konsultasyon hanggang pag-install sa Bohol. Malinaw na proseso, de-kalidad na piyesa, at buong after-sales support sa buong Pilipinas.",
    },
    solarCalculator: {
      title: "Libreng Solar Savings Calculator — Bohol, Pilipinas | Azari Solar",
      description:
        "Tantyahin ang laki ng iyong solar system at buwanang matitipid gamit ang aming libreng solar calculator. Ilagay ang iyong bill ng kuryente para mahanap ang tamang package — para sa Bohol at buong Pilipinas.",
    },
    privacyPolicy: {
      title: "Patakaran sa Privacy — Azari Solar",
      description:
        "Paano kinokolekta, ginagamit, at pinoprotektahan ng Azari Solar ang iyong personal na datos, alinsunod sa Data Privacy Act of 2012 ng Pilipinas.",
      shareDescription: "Paano kinokolekta, ginagamit, at pinoprotektahan ng Azari Solar ang iyong personal na datos.",
    },
    termsConditions: {
      title: "Mga Tuntunin at Kundisyon — Azari Solar",
      description:
        "Ang mga tuntunin at kundisyon sa paggamit mo ng azari.solar at ng mga serbisyo ng Azari Solar sa quotation, konsultasyon, at pag-install.",
      shareDescription: "Ang mga tuntunin at kundisyon sa paggamit mo ng azari.solar.",
    },
    projects: {
      title: "Mga Solar Project sa Bohol, Pilipinas | Azari Solar",
      description:
        "Tingnan ang mga natapos na residential at commercial solar installation ng Azari Solar sa Bohol at buong Pilipinas. Totoong proyekto, totoong tipid sa enerhiya.",
    },
    notFound: {
      title: "Hindi Nahanap ang Pahina — Azari Solar",
    },
    projectDetail: {
      title: "{name} — Azari Solar",
      fallbackName: "Solar Project",
      description: "{name} ng Azari Solar sa Bohol, Pilipinas.",
      fallbackDescription: "Solar project ng Azari Solar sa Bohol, Pilipinas.",
    },
  },
};
