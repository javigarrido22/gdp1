"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import IndicadoresEconomicos from "../components/IndicadoresEconomicos";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!usuarioGuardado) {
      router.push('/');
      return;
    }

    setUsuario(JSON.parse(usuarioGuardado));
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    router.push('/');
  };

  const obtenerIniciales = (nombres: string, apellidos: string) => {
    const inicial1 = nombres.charAt(0).toUpperCase();
    const inicial2 = apellidos.charAt(0).toUpperCase();
    return `${inicial1}${inicial2}`;
  };

  if (!usuario) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative"
      }}>
        <Link href="/dashboard">
          <Image 
            src="/ordenateya.png" 
            alt="OrdenateYA Logo" 
            width={120} 
            height={120}
            style={{ objectFit: "contain", cursor: "pointer" }}
          />
        </Link>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Menú de usuario */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#f0f0f0",
                border: "2px solid #e0e0e0",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e8e8e8"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
            >
              {/* Avatar con iniciales */}
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#667eea",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "1rem"
              }}>
                {obtenerIniciales(usuario.nombres, usuario.apellidos)}
              </div>
              
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, color: "#2c3e50", fontWeight: "600", fontSize: "0.95rem" }}>
                  {usuario.nombres} {usuario.apellidos}
                </p>
                <p style={{ margin: 0, color: "#666", fontSize: "0.75rem" }}>
                  {usuario.correo}
                </p>
              </div>

              {/* Icono flecha */}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                style={{
                  transform: menuUsuarioAbierto ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s"
                }}
              >
                <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Menú desplegable */}
            {menuUsuarioAbierto && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                right: 0,
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "250px",
                zIndex: 1000,
                overflow: "hidden"
              }}>
                {/* Información del usuario */}
                <div style={{
                  padding: "1rem",
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#f9f9f9"
                }}>
                  <p style={{ 
                    margin: "0 0 0.25rem 0", 
                    fontWeight: "600", 
                    color: "#2c3e50",
                    fontSize: "1rem"
                  }}>
                    {usuario.nombres} {usuario.apellidos}
                  </p>
                  <p style={{ 
                    margin: "0 0 0.25rem 0", 
                    color: "#666", 
                    fontSize: "0.85rem" 
                  }}>
                    {usuario.correo}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    color: "#666", 
                    fontSize: "0.85rem" 
                  }}>
                    {usuario.telefono}
                  </p>
                </div>

                {/* Opciones del menú */}
                <div style={{ padding: "0.5rem 0" }}>
                  <button
                    onClick={() => {
                      setMenuUsuarioAbierto(false);
                      router.push('/perfil');
                    }}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "transparent",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.95rem",
                      color: "#2c3e50",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span style={{ fontSize: "1.2rem" }}>👤</span>
                    Modificar datos personales
                  </button>

                  <div style={{
                    height: "1px",
                    backgroundColor: "#e0e0e0",
                    margin: "0.5rem 0"
                  }}></div>

                  <button
                    onClick={() => {
                      setMenuUsuarioAbierto(false);
                      cerrarSesion();
                    }}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      backgroundColor: "transparent",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.95rem",
                      color: "#e74c3c",
                      transition: "background-color 0.2s",
                      fontWeight: "500"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span style={{ fontSize: "1.2rem" }}>🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body principal */}
      <main style={{
        flex: 1,
        padding: "2rem 1rem"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Bienvenida */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h1 style={{ 
              color: "#2c3e50", 
              margin: "0 0 0.5rem 0",
              fontSize: "2rem"
            }}>
              ¡Bienvenido/a, {usuario.nombres}! 👋
            </h1>
            <p style={{ color: "#666", margin: 0, fontSize: "1rem" }}>
              Gestiona tus finanzas de manera simple y efectiva
            </p>
          </div>

          {/* Indicadores Económicos */}
          <div style={{ 
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center"
          }}>
            <div style={{ width: "100%" }}>
              <IndicadoresEconomicos />
            </div>
          </div>

          {/* Tarjetas de navegación */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            {/* Tarjeta Ingresos */}
            <Link
              href="/ingresos"
              style={{
                textDecoration: "none",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                border: "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
                e.currentTarget.style.borderColor = "#4caf50";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem", textAlign: "center" }}>
                📈
              </div>
              <h2 style={{ 
                color: "#4caf50", 
                margin: "0 0 0.5rem 0",
                fontSize: "1.5rem",
                textAlign: "center"
              }}>
                Ingresos
              </h2>
              <p style={{ 
                color: "#666", 
                margin: 0,
                textAlign: "center",
                fontSize: "0.95rem"
              }}>
                Registra y visualiza todos tus ingresos mensuales
              </p>
            </Link>

            {/* Tarjeta Egresos */}
            <Link
              href="/egresos"
              style={{
                textDecoration: "none",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                border: "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(244, 67, 54, 0.3)";
                e.currentTarget.style.borderColor = "#f44336";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem", textAlign: "center" }}>
                📉
              </div>
              <h2 style={{ 
                color: "#f44336", 
                margin: "0 0 0.5rem 0",
                fontSize: "1.5rem",
                textAlign: "center"
              }}>
                Egresos
              </h2>
              <p style={{ 
                color: "#666", 
                margin: 0,
                textAlign: "center",
                fontSize: "0.95rem"
              }}>
                Controla y analiza tus gastos diarios
              </p>
            </Link>

            {/* Tarjeta Resumen */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                border: "2px solid #3498db"
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem", textAlign: "center" }}>
                💰
              </div>
              <h2 style={{ 
                color: "#3498db", 
                margin: "0 0 0.5rem 0",
                fontSize: "1.5rem",
                textAlign: "center"
              }}>
                Resumen Financiero
              </h2>
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "4px"
                }}>
                  <span style={{ color: "#2e7d32", fontWeight: "500" }}>Total Ingresos:</span>
                  <span style={{ color: "#2e7d32", fontWeight: "600" }}>$0</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  backgroundColor: "#ffebee",
                  borderRadius: "4px"
                }}>
                  <span style={{ color: "#c62828", fontWeight: "500" }}>Total Egresos:</span>
                  <span style={{ color: "#c62828", fontWeight: "600" }}>$0</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  padding: "0.75rem",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "4px",
                  marginTop: "1rem",
                  borderTop: "2px solid #3498db"
                }}>
                  <span style={{ color: "#1565c0", fontWeight: "600", fontSize: "1.1rem" }}>Balance:</span>
                  <span style={{ color: "#1565c0", fontWeight: "700", fontSize: "1.1rem" }}>$0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acceso rápido */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1.5rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#2c3e50", marginTop: 0, marginBottom: "1rem" }}>
              ⚡ Acciones Rápidas
            </h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/ingresos"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#4caf50",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4caf50"}
              >
                ➕ Agregar Ingreso
              </Link>

              <Link
                href="/egresos"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#f44336",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#da190b"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f44336"}
              >
                ➖ Agregar Egreso
              </Link>
            </div>
          </div>
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