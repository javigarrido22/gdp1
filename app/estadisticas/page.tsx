"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
}

interface Ingreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

interface Egreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

interface Resumen {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
}

export default function EstadisticasPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [resumen, setResumen] = useState<Resumen>({ totalIngresos: 0, totalEgresos: 0, balance: 0 });
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  const COLORES_INGRESOS = ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
  const COLORES_EGRESOS = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#795548'];

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!usuarioGuardado) {
      router.push('/');
      return;
    }

    const usuarioData = JSON.parse(usuarioGuardado);
    setUsuario(usuarioData);
    cargarDatos(usuarioData.id);
  }, [router]);

  const cargarDatos = async (usuarioId: number) => {
    try {
      const [resIngresos, resEgresos, resResumen] = await Promise.all([
        fetch(`/api/ingresos?usuarioId=${usuarioId}`),
        fetch(`/api/egresos?usuarioId=${usuarioId}`),
        fetch(`/api/resumen?usuarioId=${usuarioId}`)
      ]);

      const dataIngresos = await resIngresos.json();
      const dataEgresos = await resEgresos.json();
      const dataResumen = await resResumen.json();

      if (resIngresos.ok) setIngresos(dataIngresos.ingresos);
      if (resEgresos.ok) setEgresos(dataEgresos.egresos);
      if (resResumen.ok) setResumen(dataResumen);
    } catch (error) {
      console.error('Error al cargar datos:', error);
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

  // Agrupar ingresos por categoría
  const ingresosPorCategoria = ingresos.reduce((acc, ingreso) => {
    const categoria = ingreso.categoria;
    if (!acc[categoria]) {
      acc[categoria] = 0;
    }
    acc[categoria] += Number(ingreso.monto);
    return acc;
  }, {} as Record<string, number>);

  const dataPieIngresos = Object.entries(ingresosPorCategoria).map(([name, value]) => ({
    name,
    value
  }));

  // Agrupar egresos por categoría
  const egresosPorCategoria = egresos.reduce((acc, egreso) => {
    const categoria = egreso.categoria;
    if (!acc[categoria]) {
      acc[categoria] = 0;
    }
    acc[categoria] += Number(egreso.monto);
    return acc;
  }, {} as Record<string, number>);

  const dataPieEgresos = Object.entries(egresosPorCategoria).map(([name, value]) => ({
    name,
    value
  }));

  // Datos para gráfico de barras comparativo
  const dataComparativa = [
    {
      name: 'Total',
      Ingresos: resumen.totalIngresos,
      Egresos: resumen.totalEgresos,
    }
  ];

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
              fontWeight: "500"
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Navegación */}
      <div style={{
        backgroundColor: "white",
        padding: "1rem 2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        display: "flex",
        gap: "1rem"
      }}>
        <Link
          href="/dashboard"
          style={{
            padding: "0.5rem 1rem",
            color: "#666",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          ← Dashboard
        </Link>
        <Link
          href="/ingresos"
          style={{
            padding: "0.5rem 1rem",
            color: "#666",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Ingresos
        </Link>
        <Link
          href="/egresos"
          style={{
            padding: "0.5rem 1rem",
            color: "#666",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Egresos
        </Link>
        <Link
          href="/estadisticas"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#9c27b0",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "500"
          }}
        >
          Estadísticas
        </Link>
      </div>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Encabezado */}
          <h1 style={{ color: "#2c3e50", marginBottom: "2rem" }}>
            📊 Estadísticas Financieras
          </h1>

          {/* Resumen General */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "2px solid #4caf50"
            }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#4caf50" }}>💰 Total Ingresos</h3>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: "#4caf50", margin: 0 }}>
                {formatearMonto(resumen.totalIngresos)}
              </p>
              <p style={{ color: "#666", margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
                {ingresos.length} registro{ingresos.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "2px solid #f44336"
            }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#f44336" }}>💸 Total Egresos</h3>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f44336", margin: 0 }}>
                {formatearMonto(resumen.totalEgresos)}
              </p>
              <p style={{ color: "#666", margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
                {egresos.length} registro{egresos.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: `2px solid ${resumen.balance >= 0 ? "#3498db" : "#f44336"}`
            }}>
              <h3 style={{ margin: "0 0 1rem 0", color: resumen.balance >= 0 ? "#3498db" : "#f44336" }}>
                📈 Balance
              </h3>
              <p style={{ 
                fontSize: "2rem", 
                fontWeight: "700", 
                color: resumen.balance >= 0 ? "#3498db" : "#f44336", 
                margin: 0 
              }}>
                {formatearMonto(resumen.balance)}
              </p>
              <p style={{ color: "#666", margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
                {resumen.balance >= 0 ? "Superávit" : "Déficit"}
              </p>
            </div>
          </div>

          {/* Gráfico Comparativo */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ color: "#2c3e50", marginTop: 0 }}>Comparativa Ingresos vs Egresos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataComparativa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatearMonto(value)} />
                <Legend />
                <Bar dataKey="Ingresos" fill="#4caf50" />
                <Bar dataKey="Egresos" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráficos de Pastel */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem"
          }}>
            {/* Ingresos por Categoría */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ color: "#2c3e50", marginTop: 0 }}>Ingresos por Categoría</h2>
              {dataPieIngresos.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dataPieIngresos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${((entry.value / resumen.totalIngresos) * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataPieIngresos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORES_INGRESOS[index % COLORES_INGRESOS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatearMonto(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: "1rem" }}>
                    {dataPieIngresos.map((item, index) => (
                      <div key={item.name} style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        padding: "0.5rem",
                        backgroundColor: "#f5f5f5",
                        marginBottom: "0.5rem",
                        borderRadius: "4px"
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ 
                            width: "12px", 
                            height: "12px", 
                            backgroundColor: COLORES_INGRESOS[index % COLORES_INGRESOS.length],
                            borderRadius: "2px"
                          }}></div>
                          {item.name}
                        </span>
                        <span style={{ fontWeight: "600" }}>{formatearMonto(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ textAlign: "center", color: "#999", padding: "2rem" }}>
                  No hay datos de ingresos para mostrar
                </p>
              )}
            </div>

            {/* Egresos por Categoría */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ color: "#2c3e50", marginTop: 0 }}>Egresos por Categoría</h2>
              {dataPieEgresos.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dataPieEgresos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${((entry.value / resumen.totalEgresos) * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataPieEgresos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORES_EGRESOS[index % COLORES_EGRESOS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatearMonto(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: "1rem" }}>
                    {dataPieEgresos.map((item, index) => (
                      <div key={item.name} style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        padding: "0.5rem",
                        backgroundColor: "#f5f5f5",
                        marginBottom: "0.5rem",
                        borderRadius: "4px"
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ 
                            width: "12px", 
                            height: "12px", 
                            backgroundColor: COLORES_EGRESOS[index % COLORES_EGRESOS.length],
                            borderRadius: "2px"
                          }}></div>
                          {item.name}
                        </span>
                        <span style={{ fontWeight: "600" }}>{formatearMonto(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ textAlign: "center", color: "#999", padding: "2rem" }}>
                  No hay datos de egresos para mostrar
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "2rem",
        textAlign: "center",
        marginTop: "2rem"
      }}>
        <p style={{ margin: "0 0 0.5rem 0" }}>© 2026 OrdenateYA! - Todos los derechos reservados</p>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#bdc3c7" }}>
          Gestión financiera personal
        </p>
      </footer>
    </div>
  );
}