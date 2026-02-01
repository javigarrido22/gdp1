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
  const [resumen, setResumen] = useState<Resumen>({
    totalIngresos: 0,
    totalEgresos: 0,
    balance: 0,
    cantidadIngresos: 0,
    cantidadEgresos: 0
  });
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!usuarioGuardado) {
      router.push('/');
      return;
    }

    const usuarioData = JSON.parse(usuarioGuardado);
    setUsuario(usuarioData);
    cargarResumen(usuarioData.id);
  }, [router]);

  const cargarResumen = async (usuarioId: number) => {
    try {
      const response = await fetch(`/api/resumen?usuarioId=${usuarioId}`);
      const data = await response.json();
      
      if (response.ok) {
        setResumen(data);
      }
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    router.push('/');
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };

  if (!usuario || cargando) {
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
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "black", fontWeight: "600", fontSize: "1rem" }}>
              {usuario.nombres} {usuario.apellidos}
            </p>
            <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>
              {usuario.correo}
            </p>
          </div>
          <button
            onClick={cerrarSesion}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
          >
            Cerrar Sesión
          </button>
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

          {/* Indicadores Económicos - Centrados */}
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
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            {/* Primera fila - 4 tarjetas */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem"
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
                  color: "#4caf50", 
                  margin: "0.5rem 0",
                  textAlign: "center",
                  fontSize: "1.3rem",
                  fontWeight: "700"
                }}>
                  {formatearMonto(resumen.totalIngresos)}
                </p>
                <p style={{ 
                  color: "#666", 
                  margin: 0,
                  textAlign: "center",
                  fontSize: "0.85rem"
                }}>
                  {resumen.cantidadIngresos} registro{resumen.cantidadIngresos !== 1 ? 's' : ''}
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

              {/* Tarjeta placeholder para mantener grid de 4 */}
              <div style={{ minWidth: "250px" }}></div>
            </div>

            {/* Segunda fila - 2 tarjetas centradas */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap"
            }}>
              {/* Estadísticas */}
              <Link
                href="/estadisticas"
                style={{
                  width: "calc(25% - 1.125rem)",
                  minWidth: "250px",
                  textDecoration: "none",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "2rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "2px solid #9c27b0",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(156, 39, 176, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
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

              {/* Metas */}
              <Link
                href="/metas"
                style={{
                  width: "calc(25% - 1.125rem)",
                  minWidth: "250px",
                  textDecoration: "none",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "2rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "2px solid #ff9800",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 152, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
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
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
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