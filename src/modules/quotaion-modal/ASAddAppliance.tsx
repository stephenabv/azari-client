import { useMemo, useState } from "react";

type AddApplianceFormData = {
  name: string;
  watts: number;
  quantity: number;
  hours: number;
  schedule: string;
  usageType: string;
};

type AddApplianceModalProps = {
  onClose: () => void;
  onSubmit: (item: AddApplianceFormData) => void;
};

export default function AddApplianceModal({
  onClose,
  onSubmit,
}: AddApplianceModalProps) {
  const [name, setName] = useState("");
  const [watts, setWatts] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [hours, setHours] = useState("");
  const [schedule, setSchedule] = useState(
    "8-9:30am, 12:15pm-2:20pm, 4:30pm-8:45pm"
  );
  const [usageType, setUsageType] = useState("Regular");
  const [error, setError] = useState("");

  const estimatedUsage = useMemo(() => {
    const wattsValue = Number(watts);
    const quantityValue = Number(quantity);
    const hoursValue = Number(hours);

    if (
      Number.isNaN(wattsValue) ||
      Number.isNaN(quantityValue) ||
      Number.isNaN(hoursValue)
    ) {
      return 0;
    }

    return wattsValue * quantityValue * hoursValue;
  }, [watts, quantity, hours]);

  const handleSubmit = () => {
    const cleanName = name.trim();
    const cleanSchedule = schedule.trim();
    const wattsValue = Number(watts);
    const quantityValue = Number(quantity);
    const hoursValue = Number(hours);

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

    if (Number.isNaN(hoursValue) || hoursValue <= 0 || hoursValue > 24) {
      setError("Please enter valid daily usage hours from 1 to 24.");
      return;
    }

    if (!cleanSchedule) {
      setError("Please enter the appliance usage schedule.");
      return;
    }

    onSubmit({
      name: cleanName,
      watts: wattsValue,
      quantity: quantityValue,
      hours: hoursValue,
      schedule: cleanSchedule,
      usageType,
    });
  };

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal as-appliance-modal">
        <button className="as-modal-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>Add Appliance</h2>
        <p>Add an appliance or electrical load to estimate daily consumption.</p>

        <div className="as-modal-form">
          <label>
            Appliance / Load Name
            <input
              placeholder="Air Conditioning Unit (2.0 HP)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </label>

          <div className="as-modal-grid">
            <label>
              Rating Watts
              <input
                type="number"
                min="1"
                placeholder="1500"
                value={watts}
                onChange={(e) => {
                  setWatts(e.target.value);
                  setError("");
                }}
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                placeholder="2"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError("");
                }}
              />
            </label>
          </div>

          <div className="as-modal-grid">
            <label>
              Hours / Day
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                placeholder="8"
                value={hours}
                onChange={(e) => {
                  setHours(e.target.value);
                  setError("");
                }}
              />
            </label>

            <label>
              Daily Wh
              <input
                value={`${estimatedUsage.toLocaleString("en-US")} Wh/day`}
                readOnly
              />
            </label>
          </div>

          <label>
            Usage Schedule
            <input
              placeholder="8-9:30am, 12:15pm-2:20pm, 4:30pm-8:45pm"
              value={schedule}
              onChange={(e) => {
                setSchedule(e.target.value);
                setError("");
              }}
            />
          </label>

          <label>
            Usage Type
            <select
              value={usageType}
              onChange={(e) => {
                setUsageType(e.target.value);
                setError("");
              }}
            >
              <option>Regular</option>
              <option>Heavy</option>
              <option>Light</option>
              <option>Standby</option>
              <option>Intermittent</option>
            </select>
          </label>

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
            Add Appliance
          </button>
        </div>
      </div>
    </div>
  );
}