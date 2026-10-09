/**
 * Artwork for the empty packages page: a house with a solar roof under the
 * sun, in front of placeholder package cards still being prepared. Line work
 * uses currentColor and the accent uses --as-brand-action, so it follows the
 * site theme without separate light/dark assets.
 */
export default function PackagesEmptyIllustration() {
  return (
    <svg className="as-pkg-empty-art" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
      {/* Placeholder package cards */}
      <g className="as-pkg-empty-art-cards" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6">
        <rect x="8" y="70" width="76" height="98" rx="12" />
        <rect x="236" y="70" width="76" height="98" rx="12" />
      </g>
      <g className="as-pkg-empty-art-lines" fill="currentColor">
        <rect x="20" y="84" width="34" height="6" rx="3" />
        <rect x="20" y="98" width="52" height="5" rx="2.5" />
        <rect x="20" y="110" width="44" height="5" rx="2.5" />
        <rect x="248" y="84" width="34" height="6" rx="3" />
        <rect x="248" y="98" width="52" height="5" rx="2.5" />
        <rect x="248" y="110" width="44" height="5" rx="2.5" />
      </g>

      {/* Sun */}
      <g className="as-pkg-empty-art-sun">
        <circle cx="262" cy="34" r="13" fill="var(--as-brand-action)" />
        <path
          d="M262 12v-6M262 62v-6M240 34h-6M290 34h-6M246.4 18.4l-4.2-4.2M281.8 53.8l-4.2-4.2M246.4 49.6l-4.2 4.2M281.8 14.2l-4.2 4.2"
          stroke="var(--as-brand-action)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* House */}
      <g className="as-pkg-empty-art-house" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M96 112 160 62l64 50" />
        <path d="M108 103v73h104v-73" />
        <rect x="148" y="142" width="24" height="34" rx="2" />
        <rect x="122" y="122" width="16" height="16" rx="2" />
      </g>

      {/* Solar array on the roof */}
      <g className="as-pkg-empty-art-panels" stroke="var(--as-brand-action)" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M173.4 68.6 214.4 100.6 220.6 92.7 179.6 60.7z" fill="var(--as-brand-action)" fillOpacity="0.2" />
        <path d="M187.1 79.3 193.3 71.4M200.7 89.9 206.9 82M176.5 64.6 217.5 96.6" />
      </g>

      {/* Ground */}
      <path d="M30 176h260" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M70 188h50M200 188h50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
    </svg>
  );
}
