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

interface Meta {
  id: number;
  nombre: string;
  descripcion: string;
  montoObjetivo: number;
  montoActual: number;
  fechaInicio: string;
  fechaLimite: string;
  categoria: string;
  completada: boolean;
}

export default function MetasPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    montoObjetivo: "",
    fechaLimite: "",
    categoria: "Ahorro"
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const router = useRouter();

  const categorias = [
    "Ahorro",
    "Viaje",
    "Compra",
    "Inversión",
    "Educación",
    "Hogar",
    "Emergencia",
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
    cargarMetas(usuarioData.id);
  }, [router]);

  const cargarMetas = async (usuarioId: number) => {
    try {
      const response = await fetch(`/api/metas?usuarioId=${usuarioId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMetas(data.metas);
      }
    } catch (error) {
      console.error('Error al cargar metas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!usuario) return;

    if (!formData.nombre || !formData.montoObjetivo || !formData.fechaLimite) {
      setError("Nombre, monto objetivo y fecha límite son requeridos");
      return;
    }

    try {
      const response = await fetch('/api/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          usuarioId: usuario.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al crear meta');
        return;
      }

      setExito('¡Meta creada exitosamente!');
      setFormData({
        nombre: "",
        descripcion: "",
        montoObjetivo: "",
        fechaLimite: "",
        categoria: "Ahorro"
      });
      setMostrarFormulario(false);
      cargarMetas(usuario.id);

      setTimeout(() => setExito(""), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al procesar la solicitud');
    }
  };

  const handleAgregarMonto = async (metaId: number, montoActual: number, montoObjetivo: number) => {
    if (!usuario) return;

    const montoAgregar = prompt('¿Cuánto deseas agregar a esta meta?');
    if (!montoAgregar || isNaN(Number(montoAgregar))) return;

    const nuevoMonto = montoActual + Number(montoAgregar);
    const completada = nuevoMonto >= montoObjetivo;

    try {
      const response = await fetch('/api/metas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: metaId,
          montoActual: nuevoMonto,
          completada,
          usuarioId: usuario.id,
        }),
      });

      if (response.ok) {
        setExito(completada ? '¡Felicitaciones! Meta completada 🎉' : 'Monto agregado exitosamente');
        cargarMetas(usuario.id);
        setTimeout(() => setExito(""), 3000);
      }
    } catch (error) {
      console.error('Error al actualizar meta:', error);
      setError('Error al actualizar la meta');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!usuario) return;
    
    if (!confirm('¿Estás seguro de eliminar esta meta?')) return;

    try {
      const response = await fetch(`/api/metas?id=${id}&usuarioId=${usuario.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExito('Meta eliminada exitosamente');
        cargarMetas(usuario.id);
        setTimeout(() => setExito(""), 3000);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar la meta');
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

  const calcularProgreso = (actual: number, objetivo: number) => {
    return Math.min((actual / objetivo) * 100, 100);
  };

  const diasRestantes = (fechaLimite: string) => {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diferencia = limite.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias;
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

  const metasActivas = metas.filter(m => !m.completada);
  const metasCompletadas = metas.filter(m => m.completada);

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
          ← Vista general
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
            color: "#666",
            textDecoration: "none",
            borderRadius: "4px"
          }}
        >
          Estadísticas
        </Link>
        <Link
          href="/metas"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ff9800",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "500"
          }}
        >
          Metas
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
              🎯 Mis Metas Financieras
            </h1>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500"
              }}
            >
              {mostrarFormulario ? "✕ Cancelar" : "➕ Nueva Meta"}
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
              <h2 style={{ color: "#2c3e50", marginTop: 0 }}>Crear Nueva Meta</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "500" }}>
                      Nombre de la Meta *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Vacaciones 2025"
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
                      Monto Objetivo (CLP) *
                    </label>
                    <input
                      type="number"
                      value={formData.montoObjetivo}
                      onChange={(e) => setFormData({...formData, montoObjetivo: e.target.value})}
                      placeholder="0"
                      required
                      min="0"
                      step="1000"
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
                      Fecha Límite *
                    </label>
                    <input
                      type="date"
                      value={formData.fechaLimite}
                      onChange={(e) => setFormData({...formData, fechaLimite: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
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

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#2c3e50", fontWeight: "500" }}>
                      Descripción (Opcional)
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Describe tu meta..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                        resize: "vertical"
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: "#ff9800",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}
                >
                  Crear Meta
                </button>
              </form>
            </div>
          )}

          {/* Metas Activas */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
              Metas en Progreso ({metasActivas.length})
            </h2>
            
            {metasActivas.length === 0 ? (
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "3rem",
                textAlign: "center",
                color: "#999",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <p style={{ fontSize: "3rem", margin: 0 }}>🎯</p>
                <p style={{ fontSize: "1.1rem", margin: "1rem 0 0 0" }}>
                  No tienes metas activas
                </p>
                <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>
                  Crea tu primera meta usando el botón de arriba
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem"
              }}>
                {metasActivas.map((meta) => {
                  const progreso = calcularProgreso(meta.montoActual, meta.montoObjetivo);
                  const dias = diasRestantes(meta.fechaLimite);
                  
                  return (
                    <div key={meta.id} style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "1.5rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      border: "2px solid #ff9800"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50", fontSize: "1.2rem" }}>
                            {meta.nombre}
                          </h3>
                          <span style={{
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#fff3e0",
                            color: "#e65100",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "500"
                          }}>
                            {meta.categoria}
                          </span>
                        </div>
                      </div>

                      {meta.descripcion && (
                        <p style={{ color: "#666", fontSize: "0.9rem", margin: "0.5rem 0 1rem 0" }}>
                          {meta.descripcion}
                        </p>
                      )}

                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <span style={{ fontSize: "0.9rem", color: "#666" }}>Progreso</span>
                          <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#ff9800" }}>
                            {progreso.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px",
                          overflow: "hidden"
                        }}>
                          <div style={{
                            width: `${progreso}%`,
                            height: "100%",
                            backgroundColor: "#ff9800",
                            transition: "width 0.3s"
                          }}></div>
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <span style={{ fontSize: "0.9rem", color: "#666" }}>Ahorrado</span>
                          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#4caf50" }}>
                            {formatearMonto(meta.montoActual)}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.9rem", color: "#666" }}>Objetivo</span>
                          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#2c3e50" }}>
                            {formatearMonto(meta.montoObjetivo)}
                          </span>
                        </div>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          marginTop: "0.5rem",
                          paddingTop: "0.5rem",
                          borderTop: "1px solid #e0e0e0"
                        }}>
                          <span style={{ fontSize: "0.9rem", color: "#666" }}>Falta</span>
                          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#f44336" }}>
                            {formatearMonto(meta.montoObjetivo - meta.montoActual)}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: dias < 30 ? "#ffebee" : "#e8f5e9",
                        padding: "0.75rem",
                        borderRadius: "4px",
                        marginBottom: "1rem"
                      }}>
                        <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
                          Fecha límite: {formatearFecha(meta.fechaLimite)}
                        </div>
                        <div style={{ 
                          fontSize: "0.9rem", 
                          fontWeight: "600",
                          color: dias < 30 ? "#c62828" : "#2e7d32"
                        }}>
                          {dias > 0 ? `${dias} días restantes` : 'Fecha vencida'}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleAgregarMonto(meta.id, meta.montoActual, meta.montoObjetivo)}
                          style={{
                            flex: 1,
                            padding: "0.75rem",
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500"
                          }}
                        >
                          💰 Agregar Monto
                        </button>
                        <button
                          onClick={() => handleEliminar(meta.id)}
                          style={{
                            padding: "0.75rem 1rem",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Metas Completadas */}
          {metasCompletadas.length > 0 && (
            <div>
              <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
                🎉 Metas Completadas ({metasCompletadas.length})
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem"
              }}>
                {metasCompletadas.map((meta) => (
                  <div key={meta.id} style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    border: "2px solid #4caf50",
                    opacity: 0.8
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50", fontSize: "1.2rem" }}>
                          {meta.nombre} ✅
                        </h3>
                        <span style={{
                          padding: "0.25rem 0.75rem",
                          backgroundColor: "#e8f5e9",
                          color: "#2e7d32",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          {meta.categoria}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: "#e8f5e9",
                      padding: "1rem",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginBottom: "1rem"
                    }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎯</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#2e7d32" }}>
                        Meta Alcanzada
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#4caf50", marginTop: "0.5rem" }}>
                        {formatearMonto(meta.montoObjetivo)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleEliminar(meta.id)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#096266",
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