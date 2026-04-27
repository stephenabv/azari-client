import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ASComingSoon() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const goHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <section className="as-coming-soon">
      <div className="as-coming-soon-card">
        <p className="as-coming-soon-eyebrow">Coming Soon</p>

        <h1 className="as-coming-soon-title">
          This page is currently under development.
        </h1>

        <p className="as-coming-soon-text">
          Don&apos;t worry, we&apos;ll finish this soon. Redirecting you back to
          home in <span>{countdown}</span> seconds.
        </p>

        <button className="as-coming-soon-button" onClick={goHome}>
          Back to Home
        </button>
      </div>
    </section>
  );
}