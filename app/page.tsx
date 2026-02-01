import "./styles.css";
import Link from "next/link";

const datosFinancieros = [
  { id: 1, nombre: "Apple (AAPL)", precio: 185.32, cambio: "+1.2%" },
  { id: 2, nombre: "Microsoft (MSFT)", precio: 412.15, cambio: "-0.5%" },
  { id: 3, nombre: "Bitcoin (BTC)", precio: 43250.00, cambio: "+2.8%" },
  { id: 4, nombre: "Ethereum (ETH)", precio: 3200.50, cambio: "+1.1%" },
  { id: 5, nombre: "Tesla (TSLA)", precio: 245.70, cambio: "-3.2%" },
];

export default function Home() {
  return (
    <div className="App">
      <h1>📈 Dashboard Financiero</h1>
      
<Link href="/ingresos" style={{ 
        display: "inline-block", 
        marginBottom: "1rem",
        marginRight: "1rem", /* Espacio hacia la derecha */
        padding: "0.5rem 1rem",
        backgroundColor: "#4caf50",
        color: "white",
        textDecoration: "none",
        borderRadius: "4px"
      }}>
        Ver Ingresos →
</Link>

<Link href="/egresos" style={{ 
        display: "inline-block", 
        marginBottom: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#4caf50",
        color: "white",
        textDecoration: "none",
        borderRadius: "4px"
      }}>
        Ver Egresos →
</Link>
      
      <div className="carrusel">
        {datosFinancieros.map((item) => (
          <div key={item.id} className="card">
            <h2>{item.nombre}</h2>
            <p>Precio: ${item.precio}</p>
            <p className={item.cambio.startsWith("+") ? "positivo" : "negativo"}>
              Cambio: {item.cambio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

