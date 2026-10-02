/** English source strings for the "system" namespace. */
export const systemEn = {
  errorBoundary: {
    title: "Something went wrong",
    chunkMessage: "A new version of the app is available. Reload to continue.",
    message: "We couldn't load {context}. This is likely a temporary issue.",
    defaultContext: "this section",
    errorCode: "Error code: {code}",
    reload: "Reload page",
    retry: "Try again",
  },
  systemError: {
    eyebrow: "Request failed",
    title: "Something went wrong",
    message: "We couldn’t process your request right now. Please try again in a moment.",
    checkConnection: "Check your connection",
    verifyForm: "Verify the form data",
    trySubmitting: "Try submitting again",
    close: "Close",
  },
  /** Plural forms follow Intl.PluralRules categories; unused ones may repeat "other". */
  seconds: {
    count: {
      one: "{n} second",
      few: "{n} seconds",
      many: "{n} seconds",
      other: "{n} seconds",
    },
    unit: {
      one: "second",
      few: "seconds",
      many: "seconds",
      other: "seconds",
    },
  },
  rateLimit: {
    ariaLabel: "Rate limit exceeded",
    title: "Too Many Requests",
    body: "You've been temporarily throttled due to too many requests.",
    resume: "Access will automatically resume in {time}.",
  },
  comingSoon: {
    title: "Azari Solar is charging up.",
    body: "We're preparing this page to showcase smarter solar power systems, energy savings, and sustainable solutions.",
    redirect: "Redirecting you back home in {time}.",
    backHome: "Back to Home",
  },
  pageLoader: {
    ariaLabel: "Loading page",
  },
  partners: {
    ariaLabel: "Partner logos",
  },
  tropics: {
    headerTop: "Solar Energy for the",
    headerBottom: "Tropics",
    climateTitle: "Climate Resilience",
    typhoonRacking: "TYPHOON-RATED RACKING",
    heatOptimization: "HIGH-HEAT OPTIMIZATION",
    assetsDeployed: "SOLAR ASSETS DEPLOYED",
    performanceTitle: "Performance Guarantee",
    performanceSubtitle: "AVERAGE ELECTRICITY BILL REDUCTION FOR OUR CLIENTS",
  },
  excellence: {
    titleTop: "Engineered for",
    titleBottom: "Excellence.",
    description:
      "We don't just install panels; we integrate intelligent energy systems designed for the unique challenges of the Philippine grid infrastructure.",
  },
  cta: {
    titlePrefix: "Ready to engineer your",
    titleHighlight: "energy independence?",
  },
  meta: {
    clientJourney: {
      title: "Solar Installation Process in Bohol | Azari Solar",
      description:
        "Learn how Azari Solar guides you from consultation to installation in Bohol. Transparent process, quality components, and full after-sales support across the Philippines.",
    },
    solarCalculator: {
      title: "Free Solar Savings Calculator — Bohol, Philippines | Azari Solar",
      description:
        "Estimate your solar system size and monthly savings with our free solar calculator. Enter your electricity bill to find the right package — serving Bohol & the Philippines.",
    },
    privacyPolicy: {
      title: "Privacy Policy — Azari Solar",
      description:
        "How Azari Solar collects, uses, and protects your personal data, in accordance with the Philippine Data Privacy Act of 2012.",
      shareDescription: "How Azari Solar collects, uses, and protects your personal data.",
    },
    termsConditions: {
      title: "Terms and Conditions — Azari Solar",
      description:
        "The terms and conditions governing your use of azari.solar and Azari Solar's quotation, consultation, and installation services.",
      shareDescription: "The terms and conditions governing your use of azari.solar.",
    },
    projects: {
      title: "Solar Projects in Bohol, Philippines | Azari Solar",
      description:
        "See completed residential and commercial solar installations by Azari Solar across Bohol and the Philippines. Real projects, real energy savings.",
    },
    notFound: {
      title: "Page Not Found — Azari Solar",
    },
    projectDetail: {
      title: "{name} — Azari Solar",
      fallbackName: "Solar Project",
      description: "{name} by Azari Solar in Bohol, Philippines.",
      fallbackDescription: "Solar project by Azari Solar in Bohol, Philippines.",
    },
  },
} as const;
