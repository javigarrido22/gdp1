"use client";

import { useState } from "react";
import "./styles.css";

const datosFinancieros = [
  { id: 1, nombre: "Apple (AAPL)", precio: 185.32, cambio: "+1.2%" },
  { id: 2, nombre: "Microsoft (MSFT)", precio: 412.15, cambio: "-0.5%" },
  { id: 3, nombre: "Bitcoin (BTC)", precio: 43250.00, cambio: "+2.8%" },
  { id: 4, nombre: "Ethereum (ETH)", precio: 3200.50, cambio: "+1.1%" },
  { id: 5, nombre: "Tesla (TSLA)", precio: 245.70, cambio: "-3.2%" },
];

export default function Home() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuario:", usuario, "Contraseña:", contraseña);
  };

  return (
    <div className="App">
      <h1>📈 Dashboard Financiero</h1>

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

      <div className="login-box">
        <h2>Bienvenido a Ordenate</h2>
        <form onSubmit={manejarEnvio}>
          <div className="form-group">
            <label>Usuario:</label>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}


