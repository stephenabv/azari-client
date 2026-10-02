import type { DeepPartial, Messages } from "../../types";

/** Korean. Draft translation — have a fluent speaker review before launch. */
export const inquiryKo: DeepPartial<Messages["inquiry"]> = {
  common: {
    cancel: "취소",
    close: "닫기",
  },
  talk: {
    closeAria: "창 닫기",
    headlineLead: "지금 ",
    headlineAccent: "연결하세요",
    headlineTail: ".",
    intro:
      "태양광에 대해 궁금한 점이 있으신가요? 절감액이 궁금하시든, 지붕이 설치에 적합한지 알고 싶으시든 언제든 도와드립니다. 어려운 전문 용어 없이, 솔직한 조언만 드립니다.",
    subheadline: "단순하게. 튼튼하게. 믿을 수 있게.",
    subtext:
      "모든 필리핀 가정에 태양의 힘을 전합니다. 인허가, 설계, 전력망 연계 같은 어려운 일은 저희가 맡을 테니 고객님은 절감 효과만 누리세요.",
    fields: {
      name: "어떻게 불러 드릴까요?",
      email: "이메일 주소",
      phone: "휴대폰 번호",
      province: "주(Province)",
      provincePlaceholder: "예: Metro Manila",
      city: "도시",
      cityPlaceholder: "예: Cebu City",
      inquiryType: "무엇을 도와드릴까요?",
      message: "메시지",
    },
    inquiryTypes: {
      general: "일반 문의",
      quote: "견적 요청",
      consultation: "상담",
    },
    errors: {
      nameRequired: "이름을 입력해 주세요.",
      emailRequired: "이메일 주소를 입력해 주세요.",
      emailInvalid: "올바른 이메일 주소를 입력해 주세요.",
      phoneRequired: "휴대폰 번호를 입력해 주세요.",
      phoneInvalid: "올바른 필리핀 휴대폰 번호를 입력해 주세요.",
      provinceRequired: "주를 선택해 주세요.",
      cityRequired: "도시를 선택해 주세요.",
      messageRequired: "메시지를 입력해 주세요.",
      messageTooShort: "메시지는 10자 이상이어야 합니다.",
    },
    send: "메시지 보내기",
    sending: "보내는 중...",
    successTitle: "메시지를 보냈습니다!",
    successBody: "문의해 주셔서 감사합니다. 24시간 이내에 담당 팀이 연락드리겠습니다.",
    done: "완료",
  },
  package: {
    title: "이 시스템 문의하기",
    intro:
      "거의 다 되었습니다! 아래에 정보를 입력해 주세요. 담당 팀이 무료 현장 점검 일정을 잡기 위해 연락드리겠습니다.",
    system: "시스템",
    loadCapacity: "부하 용량: {value}",
    monthlySaving: "월 절감액: ₱{min} – ₱{max}",
    componentQtyOne: "{count}개",
    componentQtyMany: "{count}개",
    fields: {
      name: "이름",
      namePlaceholder: "Juan dela Cruz",
      location: "위치",
      locationPlaceholder: "예: Tagbilaran City",
      email: "이메일 주소",
      emailPlaceholder: "juandelacruz@gmail.com",
      phone: "전화번호",
      phonePlaceholder: "9123456789",
    },
    errors: {
      nameRequired: "이름을 입력해 주세요.",
      locationRequired: "위치를 입력해 주세요.",
      emailRequired: "이메일을 입력해 주세요.",
      emailInvalid: "올바른 이메일 주소를 입력해 주세요.",
      phoneRequired: "전화번호를 입력해 주세요.",
      phoneInvalid: "9로 시작하는 10자리 번호를 입력해 주세요.",
      submitFailed: "문제가 발생했습니다. 다시 시도해 주세요.",
    },
    privacy: "고객님의 개인정보를 소중히 여깁니다. 입력하신 정보는 태양광 점검 및 문의 응대에만 사용됩니다.",
    submit: "문의 보내기",
    submitting: "제출 중…",
    successTitle: "문의가 접수되었습니다",
    successBody:
      "감사합니다! 문의를 잘 받았습니다. 영업일 기준 1–2일 이내에 태양광 전문가가 연락드리겠습니다.",
  },
};
