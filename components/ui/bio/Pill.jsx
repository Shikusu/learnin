import { C } from "@/constants/colors"; 
export function Pill({ val, label, color = C.accent1 }) {
  return (
    <div style={{
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 12, padding: "12px 20px", textAlign: "center",
      minWidth: 100
    }}>
      <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: "monospace" }}>{val}</div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}