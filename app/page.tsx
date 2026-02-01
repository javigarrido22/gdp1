"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: usuario,
          password: contraseña,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setCargando(false);
        return;
      }

      // Login exitoso - guardar datos del usuario
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Redirigir al dashboard
      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error("Error en el login:", error);
      setError("Hubo un error al iniciar sesión. Intenta nuevamente.");
      setCargando(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh" 
    }}>
      {/* Header  */}
      <header style={{
        backgroundColor: "white",
        padding: "1rem 2rem",
      }}>
        <Image 
          src="/ordenateya.png" 
          alt="OrdenateYA Logo" 
          width={150} 
          height={150}
          style={{ objectFit: "contain" }}
        />
      </header>

      {/* Body principal */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem"
      }}>
        {/* Título centrado */}
        <div style={{
          marginBottom: "3rem",
          textAlign: "center"
        }}>
          <h2
            style={{
              color: "black",
              fontSize: "36px",
              fontWeight: "bold",
              margin: 0,
              display: "inline-flex",
              alignItems: "baseline",
            }}
          >
            <span style={{ 
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
            }}>
              Ordenate
            </span>
            <span style={{ 
              fontFamily: "Lucida Handwriting, cursive",
              fontStyle: "italic",
              marginLeft: "0.2rem",
            }}>
              YA!
            </span>
          </h2>
        </div>

        {/* Formulario de login */}
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "2rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {error && (
            <div style={{
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "4px",
              padding: "0.75rem",
              marginBottom: "1rem",
              color: "#c00",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={manejarEnvio}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Correo Electrónico:
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={cargando}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box",
                  opacity: cargando ? 0.6 : 1
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Contraseña:
              </label>
              <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                disabled={cargando}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box",
                  opacity: cargando ? 0.6 : 1
                }}
              />
            </div>

            <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
              <Link
                href="/registro"
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  color: "#4CAF50",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Registrarse
              </Link>
              
              <Link
                href="/recuperar-password"
                style={{
                  display: "block",
                  color: "#666",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={cargando}
              style={{
                padding: "10px 20px",
                backgroundColor: cargando ? "#ccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: cargando ? "not-allowed" : "pointer",
                fontSize: "16px",
                width: "100%",
              }}
            >
              {cargando ? "Accediendo..." : "Acceder"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "2rem",
        textAlign: "center"
      }}>
        <p style={{ margin: "0 0 0.5rem 0" }}>© 2026 OrdenateYA! - Todos los derechos reservados</p>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#bdc3c7" }}>
          Gestión financiera personal
        </p>
      </footer>
    </div>
  );
}
