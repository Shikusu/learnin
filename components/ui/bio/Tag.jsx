import { C } from "@/constants/colors";
export  function Tag({ children, color = C.accent1 }) {
  return (
    <span style={{
      background: `${color}22`, border: `1px solid ${color}55`,
      color, borderRadius: 6, padding: "2px 10px", fontSize: 12,
      fontWeight: 700, letterSpacing: 1, textTransform: "uppercase"
    }}>{children}</span>
  );
}