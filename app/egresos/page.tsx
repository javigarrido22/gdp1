"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
}

interface Egreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

export default function EgresosPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    monto: "",
    fecha: new Date().toISOString().split('T')[0],
    categoria: "Alimentación"
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const router = useRouter();

  const categorias = [
    "Alimentación",
    "Transporte",
    "Vivienda",
    "Servicios",
    "Salud",
    "Educación",
    "Entretenimiento",
    "Ropa",
    "Tecnología",
    "Otro"
  ];

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!usuarioGuardado) {
      router.push('/');
      return;
    }

    const usuarioData = JSON.parse(usuarioGuardado);
    setUsuario(usuarioData);
    cargarEgresos(usuarioData.id);
  }, [router]);

  const cargarEgresos = async (usuarioId: number) => {
    try {
      const response = await fetch(`/api/egresos?usuarioId=${usuarioId}`);
      const data = await response.json();
      
      if (response.ok) {
        setEgresos(data.egresos);
      }
    } catch (error) {
      console.error('Error al cargar egresos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!usuario) return;

    if (!formData.descripcion || !formData.monto) {
      setError("Descripción y monto son requeridos");
      return;
    }

    try {
      const response = await fetch('/api/egresos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          usuarioId: usuario.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al crear egreso');
        return;
      }

      setExito('¡Egreso agregado exitosamente!');
      setFormData({
        descripcion: "",
        monto: "",
        fecha: new Date().toISOString().split('T')[0],
        categoria: "Alimentación"
      });
      setMostrarFormulario(false);
      cargarEgresos(usuario.id);

      setTimeout(() => setExito(""), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al procesar la solicitud');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!usuario) return;
    
    if (!confirm('¿Estás seguro de eliminar este egreso?')) return;

    try {
      const response = await fetch(`/api/egresos?id=${id}&usuarioId=${usuario.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExito('Egreso eliminado exitosamente');
        cargarEgresos(usuario.id);
        setTimeout(() => setExito(""), 3000);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar el egreso');
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

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const totalEgresos = egresos.reduce((sum, egr) => sum + Number(egr.monto), 0);

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
            borderRadius: "4px",
            transition: "background-color 0.2s"
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
            borderRadius: "4px",
            transition: "background-color 0.2s"
          }}
        >
          Ingresos
        </Link>
        <Link
          href="/egresos"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f44336",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "500"
          }}
        >
          Egresos
        </Link>
      </div>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Encabezado */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}>
            <h1 style={{ color: "#2c3e50", margin: 0 }}>
              📉 Mis Egresos
            </h1>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500"
              }}
            >
              {mostrarFormulario ? "✕ Cancelar" : "➕ Nuevo Egreso"}
            </button>
          </div>

          {/* Mensajes */}
          {error && (
            <div style={{
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "4px",
              padding: "0.75rem",
              marginBottom: "1rem",
              color: "#c00"
            }}>
              {error}
            </div>
          )}

          {exito && (
            <div style={{
              backgroundColor: "#efe",
              border: "1px solid #cfc",
              borderRadius: "4px",
              padding: "0.75rem",
              marginBottom: "1rem",
              color: "#090"
            }}>
              {exito}
            </div>
          )}

          {/* Formulario */}
          {mostrarFormulario && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ color: "#2c3e50", marginTop: 0 }}>Agregar Nuevo Egreso</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "500" }}>
                      Descripción *
                    </label>
                    <input
                      type="text"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Ej: Compra en supermercado"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "500" }}>
                      Monto (CLP) *
                    </label>
                    <input
                      type="number"
                      value={formData.monto}
                      onChange={(e) => setFormData({...formData, monto: e.target.value})}
                      placeholder="0"
                      required
                      min="0"
                      step="1"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "500" }}>
                      Categoría
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "500" }}>
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}
                >
                  Guardar Egreso
                </button>
              </form>
            </div>
          )}

          {/* Resumen */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "2px solid #f44336"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#2c3e50" }}>Resumen</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Total de Egresos</p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "2rem", fontWeight: "700", color: "#f44336" }}>
                  {formatearMonto(totalEgresos)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Cantidad de Registros</p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "2rem", fontWeight: "700", color: "#2c3e50" }}>
                  {egresos.length}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de egresos */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1.5rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginTop: 0, color: "#2c3e50" }}>Historial</h3>
            
            {egresos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
                <p style={{ fontSize: "3rem", margin: 0 }}>📊</p>
                <p style={{ fontSize: "1.1rem", margin: "1rem 0 0 0" }}>
                  No hay egresos registrados
                </p>
                <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>
                  Agrega tu primer egreso usando el botón de arriba
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: "600" }}>Fecha</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: "600" }}>Descripción</th>
                      <th style={{ padding: "1rem", textAlign: "left", color: "#666", fontWeight: "600" }}>Categoría</th>
                      <th style={{ padding: "1rem", textAlign: "right", color: "#666", fontWeight: "600" }}>Monto</th>
                      <th style={{ padding: "1rem", textAlign: "center", color: "#666", fontWeight: "600" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {egresos.map((egreso) => (
                      <tr key={egreso.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "1rem", color: "#666" }}>
                          {formatearFecha(egreso.fecha)}
                        </td>
                        <td style={{ padding: "1rem", color: "#2c3e50", fontWeight: "500" }}>
                          {egreso.descripcion}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#ffebee",
                            color: "#c62828",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            fontWeight: "500"
                          }}>
                            {egreso.categoria}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "right", color: "#f44336", fontWeight: "600", fontSize: "1.1rem" }}>
                          {formatearMonto(Number(egreso.monto))}
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <button
                            onClick={() => handleEliminar(egreso.id)}
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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