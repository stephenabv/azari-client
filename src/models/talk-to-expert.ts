import type { FieldErrors } from "./common";

export type TalkInquiryType = "general" | "quote" | "consultation";

export type TalkToExpertFormData = {
  name: string;
  email: string;
  phone: string;
  inquiryType: TalkInquiryType;
  message: string;
};

export type TalkToExpertPayload = {
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  inquiryType: TalkInquiryType;
  message: string;
};

export type TalkToExpertField = keyof TalkToExpertFormData | "province" | "city";

export type AddressConfig = {
  provinces: string[];
  cities: Record<string, string[]>;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^(09|\+639)\d{9}$/;

export function sanitizeTalkToExpertForm(
  form: TalkToExpertFormData
): TalkToExpertFormData {
  return {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim().replace(/\s/g, ""),
    inquiryType: form.inquiryType,
    message: form.message.trim(),
  };
}

export function validateTalkToExpertField(
  field: TalkToExpertField,
  value: string,
  province: string,
  city: string
): string {
  switch (field) {
    case "name":
      return value.trim() ? "" : "Please enter your name.";

    case "email":
      if (!value.trim()) return "Please enter your email address.";
      if (!emailRegex.test(value.trim())) {
        return "Please enter a valid email address.";
      }
      return "";

    case "phone": {
      const cleanPhone = value.replace(/\s/g, "");

      if (!cleanPhone) return "Please enter your mobile number.";
      if (!mobileRegex.test(cleanPhone)) {
        return "Please enter a valid Philippine mobile number.";
      }

      return "";
    }

    case "province":
      return province ? "" : "Please select a province.";

    case "city":
      return city ? "" : "Please select a city.";

    case "message":
      if (!value.trim()) return "Please enter your message.";
      if (value.trim().length < 10) {
        return "Message must be at least 10 characters.";
      }
      return "";

    default:
      return "";
  }
}

export function validateTalkToExpertForm(
  form: TalkToExpertFormData,
  province: string,
  city: string
): FieldErrors<TalkToExpertField> {
  const errors: FieldErrors<TalkToExpertField> = {
    name: validateTalkToExpertField("name", form.name, province, city),
    email: validateTalkToExpertField("email", form.email, province, city),
    phone: validateTalkToExpertField("phone", form.phone, province, city),
    province: validateTalkToExpertField("province", "", province, city),
    city: validateTalkToExpertField("city", "", province, city),
    message: validateTalkToExpertField("message", form.message, province, city),
  };

  Object.keys(errors).forEach((key) => {
    const typedKey = key as TalkToExpertField;

    if (!errors[typedKey]) {
      delete errors[typedKey];
    }
  });

  return errors;
}

export function buildTalkToExpertPayload(
  form: TalkToExpertFormData,
  province: string,
  city: string
): TalkToExpertPayload {
  const sanitized = sanitizeTalkToExpertForm(form);

  return {
    name: sanitized.name,
    email: sanitized.email,
    phone: sanitized.phone,
    city,
    province,
    inquiryType: sanitized.inquiryType,
    message: sanitized.message,
  };
}
