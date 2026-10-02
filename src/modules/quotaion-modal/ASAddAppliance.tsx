import { useMemo, useState } from "react";
import { calculateDayNightHours, DAY_BOUNDARY } from "../../models/calculation";
import type { QuotationAppliance } from "../../models/quotation";
import iconDropdown from "../../assets/icons/icon-dropdown.svg";

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

const ALWAYS_ON_DAY_HOURS = (DAY_BOUNDARY.endMinutes - DAY_BOUNDARY.startMinutes) / 60;
const ALWAYS_ON_NIGHT_HOURS = 24 - ALWAYS_ON_DAY_HOURS;

const RATING_UNITS: { value: RatingUnit; label: string }[] = [
  { value: "W", label: "Watts" },
  { value: "HP", label: "HP" },
  { value: "Ton", label: "Ton" },
];

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
  const isEditing = !!initial;

  const [name, setName] = useState(() => initial?.name ?? "");
  const [watts, setWatts] = useState(() => initial ? String(initial.watts) : "");
  const [ratingUnit, setRatingUnit] = useState<RatingUnit>("W");
  const [quantity, setQuantity] = useState(() => initial ? String(initial.quantity) : "");
  const [error, setError] = useState("");

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
    setError("");
  };

  const handleAddSchedule = () => {
    setSchedules((current) => [...current, { from: "", to: "" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules((current) => current.filter((_, i) => i !== index));
    setError("");
  };

  const handleSubmit = () => {
    const cleanName = name.trim();
    const wattsValue = Number(watts) * TO_WATTS[ratingUnit];
    const quantityValue = Number(quantity);

    if (!cleanName) {
      setError("Please enter an appliance name.");
      return;
    }
    if (cleanName.length > 80) {
      setError("Appliance name must not exceed 80 characters.");
      return;
    }
    if (Number.isNaN(wattsValue) || wattsValue <= 0) {
      setError("Please enter a valid watt rating.");
      return;
    }
    if (Number.isNaN(quantityValue) || quantityValue <= 0) {
      setError("Please enter a valid quantity.");
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
        setError("Total estimated usage must be between 1 and 24 hours.");
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
      setError("Please add at least one complete schedule usage.");
      return;
    }
    if (totalHours <= 0 || totalHours > 24) {
      setError("Total schedule usage must be between 1 and 24 hours.");
      return;
    }
    for (let i = 0; i < validSchedules.length; i++) {
      for (let j = i + 1; j < validSchedules.length; j++) {
        if (schedulesOverlap(validSchedules[i], validSchedules[j])) {
          setError(
            `Schedule entries overlap: ${formatTimeDisplay(validSchedules[i].from)}–${formatTimeDisplay(validSchedules[i].to)} conflicts with ${formatTimeDisplay(validSchedules[j].from)}–${formatTimeDisplay(validSchedules[j].to)}.`
          );
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

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal as-appliance-modal">
        <button className="as-modal-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>{isEditing ? "Edit Appliance" : "Add Appliance"}</h2>

        <p>
          Tell us about your appliances and how long you use them.
          This helps our engineers design a system sized perfectly to wipe out your monthly electricity bill.
        </p>

        <div className="as-appliance-form">
          <label className="as-appliance-field as-appliance-field-full">
            <span>Appliance / Load Name</span>
            <input
              placeholder="Ex. 1.5HP Inverter Aircon"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </label>

          <div className="as-appliance-grid">
            <label className="as-appliance-field">
              <span>Rating (Watts)</span>

              <div className="as-appliance-input-with-unit">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={watts}
                  onChange={(e) => {
                    setWatts(normalizeDecimalInput(e.target.value));
                    setError("");
                  }}
                />

                <div className="as-appliance-unit-select">
                  <select
                    value={ratingUnit}
                    onChange={(e) => {
                      setRatingUnit(e.target.value as RatingUnit);
                      setError("");
                    }}
                  >
                    {RATING_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                  <img src={iconDropdown} alt="" aria-hidden="true" className="as-appliance-unit-select-icon" />
                </div>
              </div>

              <em>
                {ratingUnit === "W" && "Check the sticker on your unit."}
                {ratingUnit === "HP" && "1 HP = 746 W. Common for motors and compressors."}
                {ratingUnit === "Ton" && "1 Ton = 3,517 W. Common for AC cooling capacity."}
              </em>
            </label>

            <label className="as-appliance-field">
              <span>Quantity</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={quantity}
                onChange={(e) => {
                  setQuantity(normalizeDecimalInput(e.target.value));
                  setError("");
                }}
              />
            </label>
          </div>

          <div className="as-appliance-schedule">
            <p>SCHEDULE TYPES</p>

            <div className="as-schedule-type-selector">
              <label className="as-schedule-type-option">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "scheduled"}
                  onChange={() => { setScheduleType("scheduled"); setError(""); }}
                />
                <span>Schedule Usage</span>
              </label>
              <label className="as-schedule-type-option">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "estimate"}
                  onChange={() => { setScheduleType("estimate"); setError(""); }}
                />
                <span>Estimate Usage per day</span>
              </label>
              <label className="as-schedule-type-option">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "always-on"}
                  onChange={() => { setScheduleType("always-on"); setError(""); }}
                />
                <span>Running 24/7</span>
              </label>
            </div>

            {scheduleType === "scheduled" ? (
              <>
                {schedules.map((item, index) => (
                  <div className="as-schedule-row" key={index}>
                    <label>
                      <span>From</span>
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
                      <span>To</span>
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
                  + Add Schedule Usage
                </button>

                {totalHours > 0 && (
                  <div className="as-schedule-summary">
                    <span>Day (08:00–18:00): <strong>{totalDayHours.toFixed(1)}h</strong></span>
                    <span>Night (18:00–08:00): <strong>{totalNightHours.toFixed(1)}h</strong></span>
                    <span>Total: <strong>{totalHours.toFixed(1)}h</strong></span>
                  </div>
                )}
              </>
            ) : scheduleType === "estimate" ? (
              <>
                <div className="as-appliance-grid">
                  <label className="as-appliance-field">
                    <span>Day Time Usage <em style={{ fontStyle: "normal", opacity: 0.6, fontWeight: 400 }}>(08:00–18:00)</em></span>
                    <div className="as-appliance-input-with-unit">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={dayEstimateHours}
                        onChange={(e) => {
                          setDayEstimateHours(normalizeDecimalInput(e.target.value));
                          setError("");
                        }}
                      />
                      <small>hour</small>
                    </div>
                  </label>

                  <label className="as-appliance-field">
                    <span>Night Time Usage <em style={{ fontStyle: "normal", opacity: 0.6, fontWeight: 400 }}>(18:00–08:00)</em></span>
                    <div className="as-appliance-input-with-unit">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={nightEstimateHours}
                        onChange={(e) => {
                          setNightEstimateHours(normalizeDecimalInput(e.target.value));
                          setError("");
                        }}
                      />
                      <small>hour</small>
                    </div>
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>Quick presets:</span>
                  <button
                    type="button"
                    className="as-add-schedule-btn"
                    style={{ padding: "3px 10px", fontSize: 11, marginTop: 0 }}
                    onClick={() => { setDayEstimateHours("10"); setNightEstimateHours("0"); setError(""); }}
                  >
                    Day only (10h)
                  </button>
                  <button
                    type="button"
                    className="as-add-schedule-btn"
                    style={{ padding: "3px 10px", fontSize: 11, marginTop: 0 }}
                    onClick={() => { setDayEstimateHours("0"); setNightEstimateHours("14"); setError(""); }}
                  >
                    Night only (14h)
                  </button>
                </div>

                {totalHours > 0 && (
                  <div className="as-schedule-summary">
                    <span>Day (08:00–18:00): <strong>{totalDayHours.toFixed(1)}h</strong></span>
                    <span>Night (18:00–08:00): <strong>{totalNightHours.toFixed(1)}h</strong></span>
                    <span>Total: <strong>{totalHours.toFixed(1)}h</strong></span>
                  </div>
                )}
              </>
            ) : (
              <>
                <p style={{ fontSize: 12, opacity: 0.7, margin: "4px 0 0" }}>
                  This appliance runs continuously, so usage is fixed at the full day/night split.
                </p>
                <div className="as-schedule-summary">
                  <span>Day (08:00–18:00): <strong>{totalDayHours.toFixed(1)}h</strong></span>
                  <span>Night (18:00–08:00): <strong>{totalNightHours.toFixed(1)}h</strong></span>
                  <span>Total: <strong>{totalHours.toFixed(1)}h</strong></span>
                </div>
              </>
            )}
          </div>

          {error && <small className="as-field-error">{error}</small>}
        </div>

        <div className="as-modal-actions">
          <button className="as-btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>

          <button
            className="as-btn-primary"
            onClick={handleSubmit}
            type="button"
          >
            {isEditing ? "Save Changes" : "Add Appliance"}
          </button>
        </div>
      </div>
    </div>
  );
}
