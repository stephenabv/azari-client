import { useMemo, useState } from "react";
import { calculateDayNightHours, DAY_BOUNDARY } from "../../models/calculation";
import { formatLocalTime, type QuotationAppliance } from "../../models/quotation";
import iconDropdown from "../../assets/icons/icon-dropdown.svg";
import { useLocale, useT, type MessageKey } from "../../i18n";

type AddApplianceModalProps = {
  onClose: () => void;
  onSubmit: (item: Omit<QuotationAppliance, "id" | "usage" | "dayUsage" | "nightUsage">) => void;
  initial?: QuotationAppliance;
};

type ScheduleItem = {
  from: string;
  to: string;
};

type RatingUnit = "W" | "HP" | "Ton";
type ScheduleType = "scheduled" | "estimate" | "always-on";

type ApplianceError = {
  key: Extract<MessageKey, `quotation.appliance.errors.${string}`>;
  params?: Readonly<Record<string, string | number>>;
};

const ALWAYS_ON_DAY_HOURS = (DAY_BOUNDARY.endMinutes - DAY_BOUNDARY.startMinutes) / 60;
const ALWAYS_ON_NIGHT_HOURS = 24 - ALWAYS_ON_DAY_HOURS;

const RATING_UNITS: { value: RatingUnit; labelKey: MessageKey; hintKey: MessageKey }[] = [
  { value: "W", labelKey: "quotation.appliance.units.watts", hintKey: "quotation.appliance.hintWatts" },
  { value: "HP", labelKey: "quotation.appliance.units.hp", hintKey: "quotation.appliance.hintHp" },
  { value: "Ton", labelKey: "quotation.appliance.units.ton", hintKey: "quotation.appliance.hintTon" },
];

/** Day/night windows shown next to hour totals (mirrors DAY_BOUNDARY). */
const DAY_RANGE = "08:00–18:00";
const NIGHT_RANGE = "18:00–08:00";

const TO_WATTS: Record<RatingUnit, number> = {
  W: 1,
  HP: 746,
  Ton: 3517,
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function schedulesOverlap(a: ScheduleItem, b: ScheduleItem): boolean {
  if (!a.from || !a.to || !b.from || !b.to) return false;
  const aFrom = timeToMinutes(a.from);
  const aTo = timeToMinutes(a.to);
  const bFrom = timeToMinutes(b.from);
  const bTo = timeToMinutes(b.to);
  const aIntervals: [number, number][] = aFrom < aTo ? [[aFrom, aTo]] : [[aFrom, 1440], [0, aTo]];
  const bIntervals: [number, number][] = bFrom < bTo ? [[bFrom, bTo]] : [[bFrom, 1440], [0, bTo]];
  for (const [s1, e1] of aIntervals) {
    for (const [s2, e2] of bIntervals) {
      if (s1 < e2 && e1 > s2) return true;
    }
  }
  return false;
}

function normalizeDecimalInput(value: string) {
  let cleaned = value.replace(/[^\d.]/g, "");
  cleaned = cleaned.replace(/(\..*?)\..*/g, "$1");
  cleaned = cleaned.replace(/^0+(?=\d)/, "");
  return cleaned;
}

/**
 * English "hh:mm AM" text. Used for the submitted `schedule` value, which
 * must stay English regardless of the visitor's language.
 */
function formatTimeDisplay(value: string) {
  if (!value) return "--:-- --";
  const [hourRaw, minute] = value.split(":").map(Number);
  const period = hourRaw >= 12 ? "PM" : "AM";
  const hour = hourRaw % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

export default function AddApplianceModal({
  onClose,
  onSubmit,
  initial,
}: AddApplianceModalProps) {
  const t = useT();
  const { tag: localeTag } = useLocale();
  const isEditing = !!initial;

  const [name, setName] = useState(() => initial?.name ?? "");
  const [watts, setWatts] = useState(() => initial ? String(initial.watts) : "");
  const [ratingUnit, setRatingUnit] = useState<RatingUnit>("W");
  const [quantity, setQuantity] = useState(() => initial ? String(initial.quantity) : "");
  const [error, setErrorState] = useState<ApplianceError | null>(null);
  const setError = (key: ApplianceError["key"] | null, params?: ApplianceError["params"]) =>
    setErrorState(key ? { key, params } : null);

  const [scheduleType, setScheduleType] = useState<ScheduleType>(() => {
    if (initial?.usageType === "24/7") return "always-on";
    if (initial?.usageType === "Estimated") return "estimate";
    return "scheduled";
  });
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() =>
    initial?.scheduleItems?.length
      ? initial.scheduleItems
      : [{ from: "08:30", to: "18:00" }]
  );
  const [dayEstimateHours, setDayEstimateHours] = useState(() =>
    initial?.usageType === "Estimated" ? String(initial.dayHours) : "1"
  );
  const [nightEstimateHours, setNightEstimateHours] = useState(() =>
    initial?.usageType === "Estimated" ? String(initial.nightHours) : "1"
  );

  const { totalHours, totalDayHours, totalNightHours } = useMemo(() => {
    if (scheduleType === "always-on") {
      return {
        totalHours: ALWAYS_ON_DAY_HOURS + ALWAYS_ON_NIGHT_HOURS,
        totalDayHours: ALWAYS_ON_DAY_HOURS,
        totalNightHours: ALWAYS_ON_NIGHT_HOURS,
      };
    }
    if (scheduleType === "estimate") {
      const dayH = Math.max(0, Number(dayEstimateHours) || 0);
      const nightH = Math.max(0, Number(nightEstimateHours) || 0);
      return { totalHours: dayH + nightH, totalDayHours: dayH, totalNightHours: nightH };
    }
    let hours = 0;
    let dayH = 0;
    let nightH = 0;
    for (const item of schedules) {
      const { dayHours, nightHours } = calculateDayNightHours(item.from, item.to);
      dayH += dayHours;
      nightH += nightHours;
      hours += dayHours + nightHours;
    }
    return { totalHours: hours, totalDayHours: dayH, totalNightHours: nightH };
  }, [schedules, scheduleType, dayEstimateHours, nightEstimateHours]);

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    setSchedules((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    setError(null);
  };

  const handleAddSchedule = () => {
    setSchedules((current) => [...current, { from: "", to: "" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules((current) => current.filter((_, i) => i !== index));
    setError(null);
  };

  const handleSubmit = () => {
    const cleanName = name.trim();
    const wattsValue = Number(watts) * TO_WATTS[ratingUnit];
    const quantityValue = Number(quantity);

    if (!cleanName) {
      setError("quotation.appliance.errors.name");
      return;
    }
    if (cleanName.length > 80) {
      setError("quotation.appliance.errors.nameLength");
      return;
    }
    if (Number.isNaN(wattsValue) || wattsValue <= 0) {
      setError("quotation.appliance.errors.watts");
      return;
    }
    if (Number.isNaN(quantityValue) || quantityValue <= 0) {
      setError("quotation.appliance.errors.quantity");
      return;
    }

    if (scheduleType === "always-on") {
      onSubmit({
        name: cleanName,
        watts: wattsValue,
        quantity: quantityValue,
        hours: Number(totalHours.toFixed(2)),
        dayHours: Number(totalDayHours.toFixed(2)),
        nightHours: Number(totalNightHours.toFixed(2)),
        schedule: "Running 24/7",
        scheduleItems: [],
        usageType: "24/7",
      });
      return;
    }

    if (scheduleType === "estimate") {
      if (totalHours <= 0 || totalHours > 24) {
        setError("quotation.appliance.errors.estimateRange");
        return;
      }
      onSubmit({
        name: cleanName,
        watts: wattsValue,
        quantity: quantityValue,
        hours: Number(totalHours.toFixed(2)),
        dayHours: Number(totalDayHours.toFixed(2)),
        nightHours: Number(totalNightHours.toFixed(2)),
        schedule: "Estimated",
        scheduleItems: [],
        usageType: "Estimated",
      });
      return;
    }

    const validSchedules = schedules.filter((item) => item.from && item.to);
    if (!validSchedules.length) {
      setError("quotation.appliance.errors.scheduleMissing");
      return;
    }
    if (totalHours <= 0 || totalHours > 24) {
      setError("quotation.appliance.errors.scheduleRange");
      return;
    }
    for (let i = 0; i < validSchedules.length; i++) {
      for (let j = i + 1; j < validSchedules.length; j++) {
        if (schedulesOverlap(validSchedules[i], validSchedules[j])) {
          const range = (item: ScheduleItem) =>
            `${formatLocalTime(item.from, localeTag)}–${formatLocalTime(item.to, localeTag)}`;
          setError("quotation.appliance.errors.overlap", {
            first: range(validSchedules[i]),
            second: range(validSchedules[j]),
          });
          return;
        }
      }
    }

    const scheduleText = validSchedules
      .map((item) => `${formatTimeDisplay(item.from)} - ${formatTimeDisplay(item.to)}`)
      .join(", ");

    onSubmit({
      name: cleanName,
      watts: wattsValue,
      quantity: quantityValue,
      hours: Number(totalHours.toFixed(2)),
      dayHours: Number(totalDayHours.toFixed(2)),
      nightHours: Number(totalNightHours.toFixed(2)),
      schedule: scheduleText,
      scheduleItems: validSchedules,
      usageType: "Scheduled",
    });
  };

  const hours = (value: number) => t("quotation.appliance.hoursValue", { value: value.toFixed(1) });

  const scheduleSummary = (
    <div className="as-schedule-summary">
      <span>
        {t("quotation.appliance.summaryDay", { range: DAY_RANGE })} <strong>{hours(totalDayHours)}</strong>
      </span>
      <span>
        {t("quotation.appliance.summaryNight", { range: NIGHT_RANGE })} <strong>{hours(totalNightHours)}</strong>
      </span>
      <span>
        {t("quotation.appliance.summaryTotal")} <strong>{hours(totalHours)}</strong>
      </span>
    </div>
  );

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal as-appliance-modal">
        <button
          className="as-modal-close"
          onClick={onClose}
          type="button"
          aria-label={t("quotation.common.close")}
        >
          ×
        </button>

        <h2>{t(isEditing ? "quotation.appliance.editTitle" : "quotation.appliance.addTitle")}</h2>

        <p>{t("quotation.appliance.intro")}</p>

        <div className="as-appliance-form">
          <label className="as-appliance-field as-appliance-field-full">
            <span>{t("quotation.appliance.nameLabel")}</span>
            <input
              placeholder={t("quotation.appliance.namePlaceholder")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
            />
          </label>

          <div className="as-appliance-grid">
            <label className="as-appliance-field">
              <span>{t("quotation.appliance.ratingLabel")}</span>

              <div className="as-appliance-input-with-unit">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={watts}
                  onChange={(e) => {
                    setWatts(normalizeDecimalInput(e.target.value));
                    setError(null);
                  }}
                />

                <div className="as-appliance-unit-select">
                  <select
                    value={ratingUnit}
                    aria-label={t("quotation.appliance.unitLabel")}
                    onChange={(e) => {
                      setRatingUnit(e.target.value as RatingUnit);
                      setError(null);
                    }}
                  >
                    {RATING_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>{t(u.labelKey)}</option>
                    ))}
                  </select>
                  <img src={iconDropdown} alt="" aria-hidden="true" className="as-appliance-unit-select-icon" />
                </div>
              </div>

              <em>
                {t(RATING_UNITS.find((u) => u.value === ratingUnit)?.hintKey ?? "quotation.appliance.hintWatts")}
              </em>
            </label>

            <label className="as-appliance-field">
              <span>{t("quotation.appliance.quantity")}</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={quantity}
                onChange={(e) => {
                  setQuantity(normalizeDecimalInput(e.target.value));
                  setError(null);
                }}
              />
            </label>
          </div>

          <div className="as-appliance-schedule">
            <p>{t("quotation.appliance.scheduleTypes")}</p>

            <div className="as-schedule-type-selector">
              <label className="as-schedule-type-option">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "scheduled"}
                  onChange={() => { setScheduleType("scheduled"); setError(null); }}
                />
                <span>{t("quotation.appliance.typeScheduled")}</span>
              </label>
              <label className="as-schedule-type-option">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "estimate"}
                  onChange={() => { setScheduleType("estimate"); setError(null); }}
                />
                <span>{t("quotation.appliance.typeEstimate")}</span>
              </label>
              <label className="as-schedule-type-option">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "always-on"}
                  onChange={() => { setScheduleType("always-on"); setError(null); }}
                />
                <span>{t("quotation.appliance.typeAlwaysOn")}</span>
              </label>
            </div>

            {scheduleType === "scheduled" ? (
              <>
                {schedules.map((item, index) => (
                  <div className="as-schedule-row" key={index}>
                    <label>
                      <span>{t("quotation.appliance.from")}</span>
                      <div className="as-appliance-time-select">
                        <input
                          type="time"
                          value={item.from}
                          onChange={(e) => handleScheduleChange(index, "from", e.target.value)}
                        />
                        <img src={iconDropdown} alt="" aria-hidden="true" className="as-appliance-time-select-icon" />
                      </div>
                    </label>

                    <label>
                      <span>{t("quotation.appliance.to")}</span>
                      <div className="as-appliance-time-select">
                        <input
                          type="time"
                          value={item.to}
                          onChange={(e) => handleScheduleChange(index, "to", e.target.value)}
                        />
                        <img src={iconDropdown} alt="" aria-hidden="true" className="as-appliance-time-select-icon" />
                      </div>
                    </label>

                    {index > 0 && (
                      <button
                        type="button"
                        className="as-schedule-remove"
                        aria-label={t("quotation.appliance.removeSchedule")}
                        onClick={() => handleRemoveSchedule(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="as-add-schedule-btn"
                  onClick={handleAddSchedule}
                >
                  {t("quotation.appliance.addSchedule")}
                </button>

                {totalHours > 0 && scheduleSummary}
              </>
            ) : scheduleType === "estimate" ? (
              <>
                <div className="as-appliance-grid">
                  <label className="as-appliance-field">
                    <span>{t("quotation.appliance.dayUsage")} <em style={{ fontStyle: "normal", opacity: 0.6, fontWeight: 400 }}>({DAY_RANGE})</em></span>
                    <div className="as-appliance-input-with-unit">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={dayEstimateHours}
                        onChange={(e) => {
                          setDayEstimateHours(normalizeDecimalInput(e.target.value));
                          setError(null);
                        }}
                      />
                      <small>{t("quotation.appliance.hourUnit")}</small>
                    </div>
                  </label>

                  <label className="as-appliance-field">
                    <span>{t("quotation.appliance.nightUsage")} <em style={{ fontStyle: "normal", opacity: 0.6, fontWeight: 400 }}>({NIGHT_RANGE})</em></span>
                    <div className="as-appliance-input-with-unit">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={nightEstimateHours}
                        onChange={(e) => {
                          setNightEstimateHours(normalizeDecimalInput(e.target.value));
                          setError(null);
                        }}
                      />
                      <small>{t("quotation.appliance.hourUnit")}</small>
                    </div>
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{t("quotation.appliance.presets")}</span>
                  <button
                    type="button"
                    className="as-add-schedule-btn"
                    style={{ padding: "3px 10px", fontSize: 11, marginTop: 0 }}
                    onClick={() => { setDayEstimateHours("10"); setNightEstimateHours("0"); setError(null); }}
                  >
                    {t("quotation.appliance.presetDay")}
                  </button>
                  <button
                    type="button"
                    className="as-add-schedule-btn"
                    style={{ padding: "3px 10px", fontSize: 11, marginTop: 0 }}
                    onClick={() => { setDayEstimateHours("0"); setNightEstimateHours("14"); setError(null); }}
                  >
                    {t("quotation.appliance.presetNight")}
                  </button>
                </div>

                {totalHours > 0 && scheduleSummary}
              </>
            ) : (
              <>
                <p style={{ fontSize: 12, opacity: 0.7, margin: "4px 0 0" }}>
                  {t("quotation.appliance.alwaysOnNote")}
                </p>
                {scheduleSummary}
              </>
            )}
          </div>

          {error && <small className="as-field-error">{t(error.key, error.params)}</small>}
        </div>

        <div className="as-modal-actions">
          <button className="as-btn-secondary" onClick={onClose} type="button">
            {t("quotation.common.cancel")}
          </button>

          <button
            className="as-btn-primary"
            onClick={handleSubmit}
            type="button"
          >
            {t(isEditing ? "quotation.appliance.save" : "quotation.appliance.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
