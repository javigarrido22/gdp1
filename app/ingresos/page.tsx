import Link from "next/link";

export default function Ingresos() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>📊 Ingresos</h1>
      <p>Página de ingresos financieros</p>
      
      <Link href="/" style={{ 
        display: "inline-block", 
        marginTop: "1rem", 
        padding: "0.5rem 1rem",
        backgroundColor: "#0070f3",
        color: "white",
        textDecoration: "none",
        borderRadius: "4px"
      }}>
        ← Volver al Dashboard
      </Link>
    </div>
  );
}
