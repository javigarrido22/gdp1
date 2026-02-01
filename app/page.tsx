"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    correo: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    if (!formData.correo || !formData.password) {
      setError("Por favor completa todos los campos");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setCargando(false);
        return;
      }

      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al procesar la solicitud');
      setCargando(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      {/* Panel izquierdo - Imagen */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: "url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)"
        }}></div>
        
        <div style={{ 
          zIndex: 1, 
          textAlign: "center",
          color: "white"
        }}>
          <div style={{ 
            fontSize: "4rem", 
            marginBottom: "1rem",
            animation: "float 3s ease-in-out infinite"
          }}>
            💰
          </div>
          <h1 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "1rem",
            fontWeight: "700"
          }}>
            ¡Bienvenido de nuevo!
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            opacity: 0.9,
            maxWidth: "400px",
            lineHeight: "1.6"
          }}>
            Gestiona tus finanzas de manera inteligente y alcanza tus metas financieras
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario de Login */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "3rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Image 
              src="/ordenateya.png" 
              alt="OrdenateYA Logo" 
              width={150} 
              height={150}
              style={{ objectFit: "contain" }}
            />
          </div>

          <h2 style={{
            textAlign: "center",
            color: "#2c3e50",
            marginBottom: "0.5rem",
            fontSize: "1.8rem"
          }}>
            Iniciar Sesión
          </h2>

          <p style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "2rem",
            fontSize: "0.95rem"
          }}>
            Accede a tu cuenta para gestionar tus finanzas
          </p>

          {/* Mensaje de error */}
          {error && (
            <div style={{
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              color: "#c00",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500"
              }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
                placeholder="tu@ejemplo.com"
                required
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.3s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500"
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Tu contraseña"
                required
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.3s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            {/* Enlace Olvidé mi contraseña */}
            <div style={{
              marginBottom: "1.5rem",
              textAlign: "right"
            }}>
              <Link
                href="/recuperar-password"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={cargando}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: cargando ? "#ccc" : "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: cargando ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
                marginBottom: "1rem"
              }}
              onMouseEnter={(e) => !cargando && (e.currentTarget.style.backgroundColor = "#5568d3")}
              onMouseLeave={(e) => !cargando && (e.currentTarget.style.backgroundColor = "#667eea")}
            >
              {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Separador */}
          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "1.5rem 0",
            gap: "1rem"
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }}></div>
            <span style={{ color: "#999", fontSize: "0.9rem" }}>o</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }}></div>
          </div>

          {/* Enlace a registro */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#666", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
              ¿No tienes una cuenta?
            </p>
            <Link
              href="/register"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
