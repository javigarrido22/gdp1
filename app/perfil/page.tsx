"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: ""
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const router = useRouter();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!usuarioGuardado) {
      router.push('/');
      return;
    }

    const usuarioData = JSON.parse(usuarioGuardado);
    setUsuario(usuarioData);
    setFormData({
      nombres: usuarioData.nombres,
      apellidos: usuarioData.apellidos,
      correo: usuarioData.correo,
      telefono: usuarioData.telefono
    });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const response = await fetch('/api/usuario/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: usuario?.id,
          ...formData
        }),
      });

      if (response.ok) {
        const usuarioActualizado = await response.json();
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
        setMensaje({ 
          tipo: "exito", 
          texto: "Datos actualizados correctamente" 
        });
      } else {
        setMensaje({ 
          tipo: "error", 
          texto: "Error al actualizar los datos" 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ 
        tipo: "error", 
        texto: "Error al conectar con el servidor" 
      });
    } finally {
      setGuardando(false);
    }
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
        
        <Link
          href="/dashboard"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#096266",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "500",
            fontSize: "0.95rem",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#04474B"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#096266"}
        >
          ← Volver a vista general
        </Link>
      </header>

      {/* Body principal */}
      <main style={{
        flex: 1,
        padding: "2rem 1rem"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Título */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#096266",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "2rem",
              margin: "0 auto 1rem auto"
            }}>
              {obtenerIniciales(usuario.nombres, usuario.apellidos)}
            </div>
            <h1 style={{ 
              color: "#2c3e50", 
              margin: "0 0 0.5rem 0",
              fontSize: "2rem"
            }}>
              Modificar Datos Personales
            </h1>
            <p style={{ color: "#666", margin: 0, fontSize: "1rem" }}>
              Actualiza tu información personal
            </p>
          </div>

          {/* Formulario */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <form onSubmit={handleSubmit}>
              {/* Nombres */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label 
                  htmlFor="nombres"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#2c3e50",
                    fontWeight: "500",
                    fontSize: "0.95rem"
                  }}
                >
                  Nombres *
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Apellidos */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label 
                  htmlFor="apellidos"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#2c3e50",
                    fontWeight: "500",
                    fontSize: "0.95rem"
                  }}
                >
                  Apellidos *
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Correo */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label 
                  htmlFor="correo"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#2c3e50",
                    fontWeight: "500",
                    fontSize: "0.95rem"
                  }}
                >
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Teléfono */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label 
                  htmlFor="telefono"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#2c3e50",
                    fontWeight: "500",
                    fontSize: "0.95rem"
                  }}
                >
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Mensaje de éxito/error */}
              {mensaje.texto && (
                <div style={{
                  padding: "1rem",
                  borderRadius: "5px",
                  marginBottom: "1.5rem",
                  backgroundColor: mensaje.tipo === "exito" ? "#e8f5e9" : "#ffebee",
                  color: mensaje.tipo === "exito" ? "#2e7d32" : "#c62828",
                  border: `1px solid ${mensaje.tipo === "exito" ? "#4caf50" : "#f44336"}`,
                  fontSize: "0.95rem",
                  textAlign: "center",
                  fontWeight: "500"
                }}>
                  {mensaje.texto}
                </div>
              )}

              {/* Botones */}
              <div style={{ 
                display: "flex", 
                gap: "1rem", 
                justifyContent: "flex-end" 
              }}>
                <Link
                  href="/dashboard"
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#e0e0e0",
                    color: "#2c3e50",
                    textDecoration: "none",
                    borderRadius: "5px",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    transition: "background-color 0.2s",
                    border: "none",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d0d0d0"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={guardando}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: guardando ? "#ccc" : "#096266",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    cursor: guardando ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!guardando) e.currentTarget.style.backgroundColor = "#096266";
                  }}
                  onMouseLeave={(e) => {
                    if (!guardando) e.currentTarget.style.backgroundColor = "#04474B";
                  }}
                >
                  {guardando ? "Guardando..." : "💾 Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            padding: "1rem",
            marginTop: "1.5rem",
            color: "#856404"
          }}>
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>
              ℹ️ Información importante:
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
              <li>Todos los campos son obligatorios</li>
              <li>El correo electrónico debe ser válido</li>
              <li>Los cambios se guardarán inmediatamente</li>
            </ul>
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