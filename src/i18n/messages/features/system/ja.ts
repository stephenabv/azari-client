import type { DeepPartial, Messages } from "../../types";

/** Japanese. Draft translation — have a fluent speaker review before launch. */
export const systemJa: DeepPartial<Messages["system"]> = {
  errorBoundary: {
    title: "問題が発生しました",
    chunkMessage: "アプリの新しいバージョンがあります。続行するにはページを再読み込みしてください。",
    message: "{context}を読み込めませんでした。一時的な問題の可能性があります。",
    defaultContext: "このセクション",
    errorCode: "エラーコード：{code}",
    reload: "ページを再読み込み",
    retry: "もう一度試す",
  },
  systemError: {
    eyebrow: "リクエスト失敗",
    title: "問題が発生しました",
    message: "現在リクエストを処理できません。しばらくしてからもう一度お試しください。",
    checkConnection: "接続を確認してください",
    verifyForm: "入力内容を確認してください",
    trySubmitting: "もう一度送信してください",
    close: "閉じる",
  },
  seconds: {
    count: {
      one: "{n}秒",
      few: "{n}秒",
      many: "{n}秒",
      other: "{n}秒",
    },
    unit: {
      one: "秒",
      few: "秒",
      many: "秒",
      other: "秒",
    },
  },
  rateLimit: {
    ariaLabel: "リクエスト制限を超えました",
    title: "リクエストが多すぎます",
    body: "リクエストが多すぎるため、一時的にアクセスが制限されています。",
    resume: "{time}後に自動的にアクセスが再開されます。",
  },
  comingSoon: {
    title: "Azari Solarは充電中です。",
    body: "よりスマートな太陽光発電システム、省エネ、持続可能なソリューションをご紹介するため、このページを準備しています。",
    redirect: "{time}後にホームへ戻ります。",
    backHome: "ホームに戻る",
  },
  pageLoader: {
    ariaLabel: "ページを読み込み中",
  },
  partners: {
    ariaLabel: "パートナーのロゴ",
  },
  tropics: {
    headerTop: "熱帯のための",
    headerBottom: "太陽光エネルギー",
    climateTitle: "気候への耐性",
    typhoonRacking: "台風対応の架台",
    heatOptimization: "高温環境に最適化",
    assetsDeployed: "設置済みの太陽光設備",
    performanceTitle: "性能保証",
    performanceSubtitle: "お客様の電気代の平均削減率",
  },
  excellence: {
    titleTop: "卓越性のための",
    titleBottom: "エンジニアリング。",
    description:
      "私たちは単にパネルを設置するだけではありません。フィリピンの電力網インフラ特有の課題に合わせて設計された、インテリジェントなエネルギーシステムを統合します。",
  },
  cta: {
    titlePrefix: "自分の手で実現する",
    titleHighlight: "エネルギーの自立、始めませんか？",
  },
  meta: {
    clientJourney: {
      title: "ボホールでの太陽光発電設置の流れ | Azari Solar",
      description:
        "Azari Solarがボホールでご相談から設置までどのようにサポートするかをご紹介します。透明なプロセス、高品質な部品、そしてフィリピン全土での充実したアフターサポート。",
    },
    solarCalculator: {
      title: "無料の太陽光節約シミュレーター — フィリピン・ボホール | Azari Solar",
      description:
        "無料の太陽光シミュレーターで、必要なシステム規模と毎月の節約額を試算できます。電気代を入力して最適なパッケージを見つけましょう — ボホールおよびフィリピン全土に対応。",
    },
    privacyPolicy: {
      title: "プライバシーポリシー — Azari Solar",
      description:
        "フィリピンの2012年データプライバシー法（Data Privacy Act of 2012）に基づき、Azari Solarがお客様の個人データを収集・利用・保護する方法について。",
      shareDescription: "Azari Solarがお客様の個人データを収集・利用・保護する方法について。",
    },
    termsConditions: {
      title: "利用規約 — Azari Solar",
      description:
        "azari.solarのご利用、およびAzari Solarの見積もり・相談・設置サービスに適用される利用規約です。",
      shareDescription: "azari.solarのご利用に適用される利用規約です。",
    },
    projects: {
      title: "フィリピン・ボホールの太陽光発電プロジェクト | Azari Solar",
      description:
        "ボホールおよびフィリピン全土でAzari Solarが手がけた住宅用・商業用の太陽光発電設置事例をご覧ください。実際のプロジェクト、実際の省エネ効果。",
    },
    notFound: {
      title: "ページが見つかりません — Azari Solar",
    },
    projectDetail: {
      title: "{name} — Azari Solar",
      fallbackName: "太陽光発電プロジェクト",
      description: "フィリピン・ボホールのAzari Solarによる{name}。",
      fallbackDescription: "フィリピン・ボホールのAzari Solarによる太陽光発電プロジェクト。",
    },
  },
};
