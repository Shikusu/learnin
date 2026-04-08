import { C } from "@/constants/colors";
export  function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 24,
      boxShadow: glow ? `0 0 32px ${C.glow}` : "none",
      ...style
    }}>{children}</div>
  );
}