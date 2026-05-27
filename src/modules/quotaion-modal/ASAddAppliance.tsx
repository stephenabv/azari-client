import { useMemo, useState } from "react";
import {
  calculateDayNightHours,
  DAY_BOUNDARY,
} from "../../models/calculation";
import type { QuotationAppliance } from "../../models/quotation";

type AddApplianceModalProps = {
  onClose: () => void;
  onSubmit: (item: Omit<QuotationAppliance, "id" | "usage" | "dayUsage" | "nightUsage">) => void;
  initial?: QuotationAppliance;
};

type ScheduleItem = {
  from: string;
  to: string;
};

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
  const [quantity, setQuantity] = useState(() => initial ? String(initial.quantity) : "");
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() =>
    initial?.scheduleItems?.length
      ? initial.scheduleItems
      : [{ from: "08:30", to: "18:00" }]
  );
  const [error, setError] = useState("");

  const { totalHours, totalDayHours, totalNightHours } = useMemo(() => {
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
  }, [schedules]);

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    setSchedules((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
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
    const wattsValue = Number(watts);
    const quantityValue = Number(quantity);

    const validSchedules = schedules.filter((item) => item.from && item.to);

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

    if (!validSchedules.length) {
      setError("Please add at least one complete schedule usage.");
      return;
    }

    if (totalHours <= 0 || totalHours > 24) {
      setError("Total schedule usage must be between 1 and 24 hours.");
      return;
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
          Tell us about your appliances and how long you use them. This helps
          our engineers design a system sized perfectly to wipe out your monthly
          electricity bill.
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

                <small>Watts</small>
              </div>

              <em>Check the sticker on your unit.</em>
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
            <p>SCHEDULE USAGE</p>

            {schedules.map((item, index) => (
              <div className="as-schedule-row" key={index}>
                <label>
                  <span>From</span>

                  <input
                    type="time"
                    value={item.from}
                    onChange={(e) =>
                      handleScheduleChange(index, "from", e.target.value)
                    }
                  />
                </label>

                <label>
                  <span>To</span>

                  <input
                    type="time"
                    value={item.to}
                    onChange={(e) =>
                      handleScheduleChange(index, "to", e.target.value)
                    }
                  />
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
              </div>
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
