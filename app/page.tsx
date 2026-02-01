"use client";

import { useState } from "react";
import Link from "next/link"; // Importar Link de next/link
import "./styles.css";

const datosFinancieros = [
  { id: 1, nombre: "Apple (AAPL)", precio: 185.32, cambio: "+1.2%" },
  { id: 2, nombre: "Microsoft (MSFT)", precio: 412.15, cambio: "-0.5%" },
  { id: 3, nombre: "Bitcoin (BTC)", precio: 43250.0, cambio: "+2.8%" },
  { id: 4, nombre: "Ethereum (ETH)", precio: 3200.5, cambio: "+1.1%" },
  { id: 5, nombre: "Tesla (TSLA)", precio: 245.7, cambio: "-3.2%" },
];

export default function Home() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuario:", usuario, "Contraseña:", contraseña);
  };

  return (
    <>
      <div className="App">
        <h1>📈 Dashboard Financiero</h1>

        {/* Enlaces a otras páginas */}
        <div style={{ marginBottom: "1rem" }}>
          <Link
            href="/ingresos"
            style={{
              display: "inline-block",
              marginRight: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#4caf50",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Ver Ingresos →
          </Link>

          <Link
            href="/egresos"
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              backgroundColor: "#4caf50",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Ver Egresos →
          </Link>
        </div>

        {/* Carrusel de datos financieros */}
        <div className="carrusel" style={{ marginBottom: "2rem" }}>
          {datosFinancieros.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                // backgroundColor eliminado - sin color de fondo
              }}
            >
              <h2 style={{ margin: "0 0 0.5rem 0" }}>{item.nombre}</h2>
              <p style={{ margin: "0 0 0.5rem 0" }}>Precio: ${item.precio}</p>
              <p
                style={{
                  margin: 0,
                  color: item.cambio.startsWith("+") ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                Cambio: {item.cambio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de inicio de sesión fuera del carrusel */}
      <div
        className="login-box"
        style={{
          maxWidth: "400px",
          margin: "2rem auto",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            color: "black",
            fontSize: "36px",
            fontFamily: "Verdana, sans-serif",
            fontWeight: "bold",
          }}
        >
          Bienvenido a OrdenateYA!
        </h2>
        <form onSubmit={manejarEnvio}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
              Usuario:
            </label>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                color: "black",
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
              Contraseña:
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                color: "black",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "10px",
              width: "100%",
            }}
          >
            Acceder
          </button>
        </form>
      </div>
    </>
  );
}
