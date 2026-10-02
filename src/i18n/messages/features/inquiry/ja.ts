import type { DeepPartial, Messages } from "../../types";

/** Japanese. Draft translation — have a fluent speaker review before launch. */
export const inquiryJa: DeepPartial<Messages["inquiry"]> = {
  common: {
    cancel: "キャンセル",
    close: "閉じる",
  },
  talk: {
    closeAria: "ウィンドウを閉じる",
    headlineLead: "お気軽に",
    headlineAccent: "ご相談",
    headlineTail: "ください。",
    intro:
      "太陽光についてご質問はありますか？節約額が気になる方も、ご自宅の屋根が設置に向いているか知りたい方も、お気軽にご相談ください。専門用語は使わず、正直にアドバイスします。",
    subheadline: "シンプル。タフ。信頼できる。",
    subtext:
      "フィリピンのすべての家庭に太陽の力を。許認可、設計、電力網との連系といった面倒なことはすべて私たちにお任せください。お客様は節約を楽しむだけです。",
    fields: {
      name: "お名前（呼び方）",
      email: "メールアドレス",
      phone: "携帯電話番号",
      province: "州",
      provincePlaceholder: "例：Metro Manila",
      city: "市",
      cityPlaceholder: "例：Cebu City",
      inquiryType: "ご用件",
      message: "メッセージ",
    },
    inquiryTypes: {
      general: "一般的なお問い合わせ",
      quote: "見積もり依頼",
      consultation: "ご相談",
    },
    errors: {
      nameRequired: "お名前を入力してください。",
      emailRequired: "メールアドレスを入力してください。",
      emailInvalid: "有効なメールアドレスを入力してください。",
      phoneRequired: "携帯電話番号を入力してください。",
      phoneInvalid: "有効なフィリピンの携帯電話番号を入力してください。",
      provinceRequired: "州を選択してください。",
      cityRequired: "市を選択してください。",
      messageRequired: "メッセージを入力してください。",
      messageTooShort: "メッセージは10文字以上で入力してください。",
    },
    send: "メッセージを送信",
    sending: "送信中...",
    successTitle: "送信しました！",
    successBody: "お問い合わせありがとうございます。24時間以内に担当チームよりご連絡いたします。",
    done: "完了",
  },
  package: {
    title: "このシステムについて問い合わせる",
    intro:
      "あと少しです！以下にお客様の情報をご入力ください。無料の現地調査の日程調整のため、担当チームよりご連絡いたします。",
    system: "システム",
    loadCapacity: "負荷容量：{value}",
    monthlySaving: "月間節約額：₱{min} – ₱{max}",
    componentQtyOne: "{count}個",
    componentQtyMany: "{count}個",
    fields: {
      name: "お名前",
      namePlaceholder: "Juan dela Cruz",
      location: "所在地",
      locationPlaceholder: "例：Tagbilaran City",
      email: "メールアドレス",
      emailPlaceholder: "juandelacruz@gmail.com",
      phone: "電話番号",
      phonePlaceholder: "9123456789",
    },
    errors: {
      nameRequired: "お名前は必須です。",
      locationRequired: "所在地は必須です。",
      emailRequired: "メールアドレスは必須です。",
      emailInvalid: "有効なメールアドレスを入力してください。",
      phoneRequired: "電話番号は必須です。",
      phoneInvalid: "9から始まる10桁の番号を入力してください。",
      submitFailed: "問題が発生しました。もう一度お試しください。",
    },
    privacy: "お客様のプライバシーを尊重します。ご入力いただいた情報は、太陽光の現地調査とお問い合わせへの対応にのみ使用します。",
    submit: "問い合わせを送信",
    submitting: "送信中…",
    successTitle: "お問い合わせを受け付けました",
    successBody:
      "ありがとうございます！お問い合わせを受け付けました。1～2営業日以内に太陽光の専門スタッフよりご連絡いたします。",
  },
};
