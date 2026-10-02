import type { DeepPartial, Messages } from "../../types";

/** Korean. Draft translation — have a fluent speaker review before launch. */
export const systemKo: DeepPartial<Messages["system"]> = {
  errorBoundary: {
    title: "문제가 발생했습니다",
    chunkMessage: "새 버전의 앱을 사용할 수 있습니다. 계속하려면 새로고침하세요.",
    message: "{context}을(를) 불러오지 못했습니다. 일시적인 문제일 가능성이 높습니다.",
    defaultContext: "이 섹션",
    errorCode: "오류 코드: {code}",
    reload: "페이지 새로고침",
    retry: "다시 시도",
  },
  systemError: {
    eyebrow: "요청 실패",
    title: "문제가 발생했습니다",
    message: "지금은 요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    checkConnection: "인터넷 연결을 확인하세요",
    verifyForm: "입력한 정보를 확인하세요",
    trySubmitting: "다시 제출해 보세요",
    close: "닫기",
  },
  seconds: {
    count: {
      one: "{n}초",
      few: "{n}초",
      many: "{n}초",
      other: "{n}초",
    },
    unit: {
      one: "초",
      few: "초",
      many: "초",
      other: "초",
    },
  },
  rateLimit: {
    ariaLabel: "요청 한도 초과",
    title: "요청이 너무 많습니다",
    body: "요청이 너무 많아 일시적으로 접속이 제한되었습니다.",
    resume: "{time} 후에 자동으로 접속이 재개됩니다.",
  },
  comingSoon: {
    title: "Azari Solar가 충전 중입니다.",
    body: "더 스마트한 태양광 발전 시스템, 에너지 절감, 지속 가능한 솔루션을 소개하기 위해 이 페이지를 준비하고 있습니다.",
    redirect: "{time} 후에 홈으로 이동합니다.",
    backHome: "홈으로 돌아가기",
  },
  pageLoader: {
    ariaLabel: "페이지 로딩 중",
  },
  partners: {
    ariaLabel: "파트너 로고",
  },
  tropics: {
    headerTop: "열대 기후를 위한",
    headerBottom: "태양광 에너지",
    climateTitle: "기후 회복력",
    typhoonRacking: "태풍 등급 거치대",
    heatOptimization: "고온 환경 최적화",
    assetsDeployed: "설치된 태양광 설비",
    performanceTitle: "성능 보장",
    performanceSubtitle: "고객의 평균 전기요금 절감률",
  },
  excellence: {
    titleTop: "탁월함을 위한",
    titleBottom: "엔지니어링.",
    description:
      "저희는 단순히 패널만 설치하지 않습니다. 필리핀 전력망 인프라의 고유한 과제에 맞게 설계된 지능형 에너지 시스템을 통합합니다.",
  },
  cta: {
    titlePrefix: "직접 설계하는",
    titleHighlight: "에너지 자립, 준비되셨나요?",
  },
  meta: {
    clientJourney: {
      title: "보홀 태양광 설치 과정 | Azari Solar",
      description:
        "Azari Solar가 보홀에서 상담부터 설치까지 어떻게 안내하는지 알아보세요. 투명한 절차, 고품질 부품, 필리핀 전역의 완벽한 사후 지원을 제공합니다.",
    },
    solarCalculator: {
      title: "무료 태양광 절감 계산기 — 필리핀 보홀 | Azari Solar",
      description:
        "무료 태양광 계산기로 필요한 시스템 규모와 월 절감액을 예상해 보세요. 전기요금을 입력하면 알맞은 패키지를 찾아 드립니다 — 보홀 및 필리핀 전역 서비스.",
    },
    privacyPolicy: {
      title: "개인정보 처리방침 — Azari Solar",
      description:
        "Azari Solar가 필리핀 2012년 데이터 개인정보 보호법(Data Privacy Act of 2012)에 따라 고객의 개인정보를 수집, 이용, 보호하는 방법입니다.",
      shareDescription: "Azari Solar가 고객의 개인정보를 수집, 이용, 보호하는 방법입니다.",
    },
    termsConditions: {
      title: "이용약관 — Azari Solar",
      description:
        "azari.solar 이용 및 Azari Solar의 견적, 상담, 설치 서비스 이용에 적용되는 약관입니다.",
      shareDescription: "azari.solar 이용에 적용되는 약관입니다.",
    },
    projects: {
      title: "필리핀 보홀 태양광 프로젝트 | Azari Solar",
      description:
        "보홀과 필리핀 전역에서 Azari Solar가 완료한 주거용 및 상업용 태양광 설치 사례를 확인하세요. 실제 프로젝트, 실제 에너지 절감.",
    },
    notFound: {
      title: "페이지를 찾을 수 없습니다 — Azari Solar",
    },
    projectDetail: {
      title: "{name} — Azari Solar",
      fallbackName: "태양광 프로젝트",
      description: "필리핀 보홀의 Azari Solar {name}.",
      fallbackDescription: "필리핀 보홀의 Azari Solar 태양광 프로젝트.",
    },
  },
};
