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

interface Resumen {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  cantidadIngresos: number;
  cantidadEgresos: number;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [resumen, setResumen] = useState<Resumen>({
    totalIngresos: 0,
    totalEgresos: 0,
    balance: 0,
    cantidadIngresos: 0,
    cantidadEgresos: 0
  });
  const router = useRouter();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!usuarioGuardado) {
      router.push('/');
      return;
    }

    const usuarioData = JSON.parse(usuarioGuardado);
    setUsuario(usuarioData);
    
    // Aquí puedes cargar el resumen real desde tu API
    cargarResumen(usuarioData.id);
  }, [router]);

  const cargarResumen = async (usuarioId: number) => {
    try {
      const response = await fetch(`/api/resumen?usuarioId=${usuarioId}`);
      if (response.ok) {
        const data = await response.json();
        setResumen(data);
      }
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    router.push('/');
  };

  const obtenerIniciales = (nombres: string, apellidos: string) => {
    const inicial1 = nombres.charAt(0).toUpperCase();
    const inicial2 = apellidos.charAt(0).toUpperCase();
    return `${inicial1}${inicial2}`;
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
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
                color: "#f44336", 
                margin: "0.5rem 0",
                textAlign: "center",
                fontSize: "1.3rem",
                fontWeight: "700"
              }}>
                {formatearMonto(resumen.totalEgresos)}
              </p>
              <p style={{ 
                color: "#666", 
                margin: 0,
                textAlign: "center",
                fontSize: "0.85rem"
              }}>
                {resumen.cantidadEgresos} registro{resumen.cantidadEgresos !== 1 ? 's' : ''}
              </p>
            </Link>

            {/* Tarjeta Balance */}
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
                Balance
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
                  <span style={{ color: "#2e7d32", fontWeight: "500", fontSize: "0.9rem" }}>Ingresos:</span>
                  <span style={{ color: "#2e7d32", fontWeight: "600", fontSize: "0.9rem" }}>
                    {formatearMonto(resumen.totalIngresos)}
                  </span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  backgroundColor: "#ffebee",
                  borderRadius: "4px"
                }}>
                  <span style={{ color: "#c62828", fontWeight: "500", fontSize: "0.9rem" }}>Egresos:</span>
                  <span style={{ color: "#c62828", fontWeight: "600", fontSize: "0.9rem" }}>
                    {formatearMonto(resumen.totalEgresos)}
                  </span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  padding: "0.75rem",
                  backgroundColor: resumen.balance >= 0 ? "#e3f2fd" : "#ffebee",
                  borderRadius: "4px",
                  marginTop: "1rem",
                  borderTop: `2px solid ${resumen.balance >= 0 ? "#3498db" : "#f44336"}`
                }}>
                  <span style={{ 
                    color: resumen.balance >= 0 ? "#1565c0" : "#c62828", 
                    fontWeight: "600", 
                    fontSize: "1.1rem" 
                  }}>
                    Total:
                  </span>
                  <span style={{ 
                    color: resumen.balance >= 0 ? "#1565c0" : "#c62828", 
                    fontWeight: "700", 
                    fontSize: "1.1rem" 
                  }}>
                    {formatearMonto(resumen.balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta Estadísticas */}
            <Link
              href="/estadisticas"
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
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(156, 39, 176, 0.3)";
                e.currentTarget.style.borderColor = "#9c27b0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem", textAlign: "center" }}>
                📊
              </div>
              <h2 style={{ 
                color: "#9c27b0", 
                margin: "0 0 0.5rem 0",
                fontSize: "1.5rem",
                textAlign: "center"
              }}>
                Estadísticas
              </h2>
              <p style={{ 
                color: "#666", 
                margin: 0,
                textAlign: "center",
                fontSize: "0.95rem"
              }}>
                Visualiza tus datos financieros
              </p>
            </Link>

            {/* Tarjeta Metas */}
            <Link
              href="/metas"
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
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 152, 0, 0.3)";
                e.currentTarget.style.borderColor = "#ff9800";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem", textAlign: "center" }}>
                🎯
              </div>
              <h2 style={{ 
                color: "#ff9800", 
                margin: "0 0 0.5rem 0",
                fontSize: "1.5rem",
                textAlign: "center"
              }}>
                Metas
              </h2>
              <p style={{ 
                color: "#666", 
                margin: 0,
                textAlign: "center",
                fontSize: "0.95rem"
              }}>
                Define y alcanza tus objetivos
              </p>
            </Link>
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

              <Link
                href="/metas"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#ff9800",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f57c00"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ff9800"}
              >
                🎯 Nueva Meta
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