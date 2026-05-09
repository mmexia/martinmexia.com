type IconProps = { size?: number; color?: string };

export const Cross = ({ size = 24, color = "var(--azul-deep)" }: IconProps) => (
  <svg width={size * 0.75} height={size} viewBox="0 0 24 32" fill="none">
    <line x1="12" y1="3" x2="12" y2="29" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <line x1="4" y1="11" x2="20" y2="11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const PinFlag = ({ size = 28, color = "var(--azul-deep)" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <line x1="9" y1="3" x2="9" y2="29" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9 4 L22 7 L9 11 Z" fill={color} opacity=".85" />
    <ellipse cx="11" cy="29" rx="6" ry="1.2" fill={color} opacity=".25" />
  </svg>
);

export const Laurel = ({
  side = "left",
  color = "var(--azul-polvo)",
  size = 80,
}: IconProps & { side?: "left" | "right" }) => (
  <svg
    width={size}
    height={size * 1.6}
    viewBox="0 0 50 80"
    fill="none"
    style={{ transform: side === "right" ? "scaleX(-1)" : "none" }}
  >
    <path d="M25 4 Q25 40 25 76" stroke={color} strokeWidth="1" strokeLinecap="round" />
    {[10, 20, 30, 40, 50, 60, 70].map((y, i) => (
      <ellipse
        key={i}
        cx={25 - 7}
        cy={y}
        rx="7"
        ry="3"
        fill={color}
        opacity=".55"
        transform={`rotate(${-25 - i * 2} ${25 - 7} ${y})`}
      />
    ))}
    {[14, 24, 34, 44, 54, 64].map((y, i) => (
      <ellipse
        key={`r${i}`}
        cx={25 + 7}
        cy={y}
        rx="7"
        ry="3"
        fill={color}
        opacity=".55"
        transform={`rotate(${25 + i * 2} ${25 + 7} ${y})`}
      />
    ))}
  </svg>
);

export const Fairway = ({ color = "var(--azul-polvo)" }: { color?: string }) => (
  <svg
    viewBox="0 0 1200 100"
    preserveAspectRatio="none"
    style={{ width: "100%", height: 80, display: "block" }}
  >
    <path
      d="M0 60 Q200 20 400 50 T800 40 T1200 55 L1200 100 L0 100 Z"
      fill={color}
      opacity=".18"
    />
    <path
      d="M0 75 Q300 50 600 70 T1200 70 L1200 100 L0 100 Z"
      fill={color}
      opacity=".28"
    />
  </svg>
);

export const ChurchIcon = ({ color = "var(--azul-deep)" }: { color?: string }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <line x1="16" y1="2" x2="16" y2="8" stroke={color} strokeWidth="1.2" />
    <line x1="13" y1="5" x2="19" y2="5" stroke={color} strokeWidth="1.2" />
    <path d="M8 14 L16 8 L24 14 L24 28 L8 28 Z" stroke={color} strokeWidth="1.2" fill="none" />
    <rect x="14" y="20" width="4" height="8" stroke={color} strokeWidth="1" fill="none" />
    <circle cx="16" cy="17" r="1.5" fill={color} opacity=".5" />
  </svg>
);

export const WazeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M19.6 7.5c-.4-.7-.9-1.3-1.4-1.8C16.7 4.4 14.4 3.6 12 3.6 7.6 3.6 4 7.2 4 11.6c0 .9.1 1.7.4 2.5-.5.5-.8 1.2-.8 2 0 1.5 1.2 2.7 2.7 2.7.6 0 1.1-.2 1.6-.5.7.2 1.4.3 2.1.3h6.5c2.5 0 4.5-2 4.5-4.5v-3.7c0-.9-.5-2-1.4-2.9z"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
    />
    <circle cx="9.5" cy="11" r="1" fill="currentColor" />
    <circle cx="14.5" cy="11" r="1" fill="currentColor" />
  </svg>
);

export const MapsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C8 2 5 5 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-4-3-7-7-7z"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
    />
    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
  </svg>
);
