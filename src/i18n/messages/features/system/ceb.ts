import type { DeepPartial, Messages } from "../../types";

/** Cebuano. Draft translation — have a fluent speaker review before launch. */
export const systemCeb: DeepPartial<Messages["system"]> = {
  errorBoundary: {
    title: "Naay sayop nga nahitabo",
    chunkMessage: "Naay bag-ong bersyon sa app. I-reload aron makapadayon.",
    message: "Wala namo ma-load ang {context}. Basin temporaryo lang kini nga problema.",
    defaultContext: "kini nga bahin",
    errorCode: "Code sa error: {code}",
    reload: "I-reload ang panid",
    retry: "Sulayi pag-usab",
  },
  systemError: {
    eyebrow: "Wala molampos ang request",
    title: "Naay sayop nga nahitabo",
    message: "Dili namo maproseso ang imong request karon. Palihug sulayi pag-usab sa makadiyot.",
    checkConnection: "Susiha ang imong koneksyon",
    verifyForm: "Siguroha nga sakto ang datos sa form",
    trySubmitting: "Sulayi pagpadala pag-usab",
    close: "Sirado",
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
    ariaLabel: "Milapas sa limitasyon sa request",
    title: "Daghan Kaayong Request",
    body: "Temporaryong gilimitahan ang imong access tungod sa daghan kaayong request.",
    resume: "Awtomatikong mobalik ang access human sa {time}.",
  },
  comingSoon: {
    title: "Nag-charge pa ang Azari Solar.",
    body: "Among giandam kini nga panid aron ipakita ang mas maalamong solar power system, pagdaginot sa enerhiya, ug malungtarong mga solusyon.",
    redirect: "Ibalik ka namo sa home human sa {time}.",
    backHome: "Balik sa Home",
  },
  pageLoader: {
    ariaLabel: "Nag-load ang panid",
  },
  partners: {
    ariaLabel: "Mga logo sa partner",
  },
  tropics: {
    headerTop: "Solar Energy para sa",
    headerBottom: "Tropiko",
    climateTitle: "Kalig-on Batok sa Klima",
    typhoonRacking: "RACKING NGA MOLAHUTAY SA BAGYO",
    heatOptimization: "GI-OPTIMIZE PARA SA GRABENG INIT",
    assetsDeployed: "NA-INSTALL NGA SOLAR ASSETS",
    performanceTitle: "Garantiya sa Performance",
    performanceSubtitle: "AVERAGE NGA PAGKUNHOD SA BILL SA KURYENTE SA AMONG MGA KLIYENTE",
  },
  excellence: {
    titleTop: "Giinhinyero para sa",
    titleBottom: "Kahanas.",
    description:
      "Dili lang mi basta mag-install og panel; among gihiusa ang maalamong energy system nga gidisenyo para sa talagsaong mga hagit sa power grid sa Pilipinas.",
  },
  cta: {
    titlePrefix: "Andam ka na ba nga makab-ot ang",
    titleHighlight: "kagawasan sa enerhiya?",
  },
  meta: {
    clientJourney: {
      title: "Proseso sa Solar Installation sa Bohol | Azari Solar",
      description:
        "Hibal-i kung giunsa ka paggiya sa Azari Solar gikan sa konsultasyon hangtod sa pag-install sa Bohol. Klaro nga proseso, kalidad nga piyesa, ug kompletong after-sales support sa tibuok Pilipinas.",
    },
    solarCalculator: {
      title: "Libreng Solar Savings Calculator — Bohol, Pilipinas | Azari Solar",
      description:
        "Tantiyaha ang gidak-on sa imong solar system ug binulan nga madaginot gamit ang among libreng solar calculator. Isulod ang imong bill sa kuryente aron makit-an ang sakto nga package — para sa Bohol ug tibuok Pilipinas.",
    },
    privacyPolicy: {
      title: "Palisiya sa Privacy — Azari Solar",
      description:
        "Giunsa pagkolekta, paggamit, ug pagpanalipod sa Azari Solar sa imong personal nga datos, subay sa Data Privacy Act of 2012 sa Pilipinas.",
      shareDescription: "Giunsa pagkolekta, paggamit, ug pagpanalipod sa Azari Solar sa imong personal nga datos.",
    },
    termsConditions: {
      title: "Mga Termino ug Kondisyon — Azari Solar",
      description:
        "Ang mga termino ug kondisyon sa imong paggamit sa azari.solar ug sa mga serbisyo sa Azari Solar sa quotation, konsultasyon, ug pag-install.",
      shareDescription: "Ang mga termino ug kondisyon sa imong paggamit sa azari.solar.",
    },
    projects: {
      title: "Mga Solar Project sa Bohol, Pilipinas | Azari Solar",
      description:
        "Tan-awa ang nahuman nga residential ug commercial solar installation sa Azari Solar sa Bohol ug sa tibuok Pilipinas. Tinuod nga proyekto, tinuod nga pagdaginot sa enerhiya.",
    },
    notFound: {
      title: "Wala Makit-i ang Panid — Azari Solar",
    },
    projectDetail: {
      title: "{name} — Azari Solar",
      fallbackName: "Solar Project",
      description: "{name} sa Azari Solar sa Bohol, Pilipinas.",
      fallbackDescription: "Solar project sa Azari Solar sa Bohol, Pilipinas.",
    },
  },
};
