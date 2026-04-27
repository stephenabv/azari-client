import { useMemo, useState } from "react";

type AddApplianceFormData = {
  name: string;
  watts: number;
  quantity: number;
  hours: number;
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
  const [frequency, setFrequency] = useState("Daily");
  const [usage, setUsage] = useState("Regular");
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
    const wattsValue = Number(watts);
    const quantityValue = Number(quantity);
    const hoursValue = Number(hours);

    if (!cleanName) {
      setError("Please enter an appliance name.");
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

    onSubmit({
      name: cleanName,
      watts: wattsValue,
      quantity: quantityValue,
      hours: hoursValue,
    });
  };

  return (
    <div className="as-modal-backdrop">
      <div className="as-modal">
        <button className="as-modal-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>Add Appliance</h2>
        <p>
          Add a specific appliance to calculate your load profile more
          accurately.
        </p>

        <div className="as-modal-form">
          <label>
            Appliance / Load Name
            <input
              placeholder="e.g. Air Conditioner"
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
                placeholder="1000"
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
                placeholder="1"
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
              Hours in Use
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
              Estimated Usage
              <input
                value={`${estimatedUsage.toLocaleString("en-US")} Wh/day`}
                readOnly
              />
            </label>
          </div>

          <div className="as-modal-grid">
            <label>
              Frequency
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </label>

            <label>
              Usage
              <select value={usage} onChange={(e) => setUsage(e.target.value)}>
                <option>Regular</option>
                <option>Heavy</option>
                <option>Light</option>
              </select>
            </label>
          </div>

          {error && <small>{error}</small>}
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