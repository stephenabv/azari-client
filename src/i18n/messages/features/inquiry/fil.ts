import type { DeepPartial, Messages } from "../../types";

/** Filipino. Draft translation — have a fluent speaker review before launch. */
export const inquiryFil: DeepPartial<Messages["inquiry"]> = {
  common: {
    cancel: "Kanselahin",
    close: "Isara",
  },
  talk: {
    closeAria: "Isara ang modal",
    headlineLead: "Tayo'y ",
    headlineAccent: "Mag-usap",
    headlineTail: ".",
    intro:
      "May tanong ka ba tungkol sa solar? Gusto mo mang malaman kung magkano ang matitipid mo o kung handa na ang bubong mo, nandito kami para tumulong. Walang teknikal na jargon, tapat na payo lang.",
    subheadline: "Simple. Matibay. Maaasahan.",
    subtext:
      "Dinadala namin ang lakas ng araw sa bawat tahanang Pilipino. Kami na ang bahala sa mahihirap na bahagi—ang mga permit, ang engineering, at ang koneksyon sa utility—para matamasa mo na lang ang tipid.",
    fields: {
      name: "Paano ka namin tatawagin?",
      email: "Email Address",
      phone: "Numero ng Mobile",
      province: "Probinsya",
      provincePlaceholder: "hal., Metro Manila",
      city: "Lungsod",
      cityPlaceholder: "hal., Cebu City",
      inquiryType: "Paano kami makakatulong?",
      message: "Mensahe",
    },
    inquiryTypes: {
      general: "Pangkalahatang tanong",
      quote: "Humingi ng quotation",
      consultation: "Konsultasyon",
    },
    errors: {
      nameRequired: "Pakilagay ang iyong pangalan.",
      emailRequired: "Pakilagay ang iyong email address.",
      emailInvalid: "Pakilagay ang wastong email address.",
      phoneRequired: "Pakilagay ang iyong mobile number.",
      phoneInvalid: "Pakilagay ang wastong mobile number sa Pilipinas.",
      provinceRequired: "Pakipili ang probinsya.",
      cityRequired: "Pakipili ang lungsod.",
      messageRequired: "Pakilagay ang iyong mensahe.",
      messageTooShort: "Dapat hindi bababa sa 10 character ang mensahe.",
    },
    send: "Ipadala ang Mensahe",
    sending: "Ipinapadala...",
    successTitle: "Naipadala na ang Mensahe!",
    successBody: "Salamat sa pakikipag-ugnayan. Babalikan ka ng aming team sa loob ng 24 na oras.",
    done: "Tapos na",
  },
  package: {
    title: "Magtanong tungkol sa System na Ito",
    intro:
      "Malapit na! Ilagay ang iyong mga detalye sa ibaba. Makikipag-ugnayan ang aming team para i-iskedyul ang iyong libreng site assessment.",
    system: "System",
    loadCapacity: "Load Capacity: {value}",
    monthlySaving: "Buwanang Tipid: ₱{min} – ₱{max}",
    componentQtyOne: "{count} piraso",
    componentQtyMany: "{count} piraso",
    fields: {
      name: "Pangalan",
      namePlaceholder: "Juan dela Cruz",
      location: "Lokasyon",
      locationPlaceholder: "Hal. Tagbilaran City",
      email: "Email address",
      emailPlaceholder: "juandelacruz@gmail.com",
      phone: "Numero ng telepono",
      phonePlaceholder: "9123456789",
    },
    errors: {
      nameRequired: "Kailangan ang pangalan.",
      locationRequired: "Kailangan ang lokasyon.",
      emailRequired: "Kailangan ang email.",
      emailInvalid: "Maglagay ng wastong email address.",
      phoneRequired: "Kailangan ang numero ng telepono.",
      phoneInvalid: "Maglagay ng wastong 10-digit na numerong nagsisimula sa 9.",
      submitFailed: "May nangyaring mali. Pakisubukang muli.",
    },
    privacy:
      "Pinahahalagahan namin ang iyong privacy. Gagamitin lang ang iyong impormasyon para sa iyong solar assessment at mga tanong.",
    submit: "Ipadala ang Inquiry",
    submitting: "Ipinapadala…",
    successTitle: "Naipadala na ang Inquiry",
    successBody:
      "Salamat! Natanggap na namin ang iyong inquiry. Babalikan ka ng isa sa aming mga solar expert sa loob ng 1–2 araw ng trabaho.",
  },
};
