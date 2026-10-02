import type { DeepPartial, Messages } from "../../types";

/** Cebuano. Draft translation — have a fluent speaker review before launch. */
export const inquiryCeb: DeepPartial<Messages["inquiry"]> = {
  common: {
    cancel: "Kanselaha",
    close: "Sirad-i",
  },
  talk: {
    closeAria: "Sirad-i ang modal",
    headlineLead: "Magsultihanay ",
    headlineAccent: "Ta",
    headlineTail: ".",
    intro:
      "Naa kay pangutana bahin sa solar? Gusto ka man mahibalo kung pila ang imong matipigan o kung andam na ba ang imong atop, ania mi aron motabang. Walay teknikal nga jargon, matinud-anon nga tambag lang.",
    subheadline: "Simple. Lig-on. Kasaligan.",
    subtext:
      "Gidala namo ang kusog sa adlaw sa matag panimalay nga Pilipino. Kami na ang bahala sa lisod nga bahin—ang mga permit, ang engineering, ug ang koneksyon sa utility—aron ikaw makatagamtam na lang sa tipid.",
    fields: {
      name: "Unsaon man namo pagtawag nimo?",
      email: "Email Address",
      phone: "Numero sa Mobile",
      province: "Probinsya",
      provincePlaceholder: "pananglitan, Metro Manila",
      city: "Siyudad",
      cityPlaceholder: "pananglitan, Cebu City",
      inquiryType: "Unsaon namo pagtabang nimo?",
      message: "Mensahe",
    },
    inquiryTypes: {
      general: "Kinatibuk-ang pangutana",
      quote: "Pangayo og quotation",
      consultation: "Konsultasyon",
    },
    errors: {
      nameRequired: "Palihug isulat ang imong ngalan.",
      emailRequired: "Palihug isulat ang imong email address.",
      emailInvalid: "Palihug isulat ang husto nga email address.",
      phoneRequired: "Palihug isulat ang imong mobile number.",
      phoneInvalid: "Palihug isulat ang husto nga mobile number sa Pilipinas.",
      provinceRequired: "Palihug pagpili og probinsya.",
      cityRequired: "Palihug pagpili og siyudad.",
      messageRequired: "Palihug isulat ang imong mensahe.",
      messageTooShort: "Ang mensahe kinahanglan dili mubo sa 10 ka karakter.",
    },
    send: "Ipadala ang Mensahe",
    sending: "Gipadala...",
    successTitle: "Napadala na ang Mensahe!",
    successBody: "Salamat sa pagkontak. Mobalik kanimo ang among team sulod sa 24 ka oras.",
    done: "Human na",
  },
  package: {
    title: "Pangutana bahin niini nga System",
    intro:
      "Hapit na! Ibutang ang imong mga detalye sa ubos. Mokontak ang among team aron i-iskedyul ang imong libre nga site assessment.",
    system: "System",
    loadCapacity: "Load Capacity: {value}",
    monthlySaving: "Binulan nga Tipid: ₱{min} – ₱{max}",
    componentQtyOne: "{count} ka buok",
    componentQtyMany: "{count} ka buok",
    fields: {
      name: "Ngalan",
      namePlaceholder: "Juan dela Cruz",
      location: "Lokasyon",
      locationPlaceholder: "Pananglitan, Tagbilaran City",
      email: "Email address",
      emailPlaceholder: "juandelacruz@gmail.com",
      phone: "Numero sa telepono",
      phonePlaceholder: "9123456789",
    },
    errors: {
      nameRequired: "Kinahanglan ang ngalan.",
      locationRequired: "Kinahanglan ang lokasyon.",
      emailRequired: "Kinahanglan ang email.",
      emailInvalid: "Pagbutang og husto nga email address.",
      phoneRequired: "Kinahanglan ang numero sa telepono.",
      phoneInvalid: "Pagbutang og husto nga 10-digit nga numero nga nagsugod sa 9.",
      submitFailed: "Adunay sayop nga nahitabo. Palihug sulayi pag-usab.",
    },
    privacy:
      "Gipabilhan namo ang imong privacy. Gamiton lang ang imong impormasyon para sa imong solar assessment ug mga pangutana.",
    submit: "Ipadala ang Inquiry",
    submitting: "Gipadala…",
    successTitle: "Napadala na ang Inquiry",
    successBody:
      "Salamat! Nadawat na namo ang imong inquiry. Mobalik kanimo ang usa sa among mga solar expert sulod sa 1–2 ka adlaw sa trabaho.",
  },
};
