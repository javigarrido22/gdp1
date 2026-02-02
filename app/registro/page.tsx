"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
    confirmarPassword: "",
    telefono: "",
    aceptaTerminos: false,
  });

  const [errores, setErrores] = useState<string[]>([]);
  const [exitoso, setExitoso] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validarFormulario = () => {
    const nuevosErrores: string[] = [];

    if (!formData.nombres.trim()) nuevosErrores.push("Los nombres son requeridos");
    if (!formData.apellidos.trim()) nuevosErrores.push("Los apellidos son requeridos");
    if (!formData.correo.trim()) {
      nuevosErrores.push("El correo es requerido");
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.push("El correo no es válido");
    }
    if (!formData.password) {
      nuevosErrores.push("La contraseña es requerida");
    } else if (formData.password.length < 6) {
      nuevosErrores.push("La contraseña debe tener al menos 6 caracteres");
    }
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.push("Las contraseñas no coinciden");
    }
    if (!formData.telefono.trim()) {
      nuevosErrores.push("El teléfono es requerido");
    }
    if (!formData.aceptaTerminos) {
      nuevosErrores.push("Debes aceptar los términos y condiciones");
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores([]);

    const nuevosErrores = validarFormulario();
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: `${formData.nombres} ${formData.apellidos}`,
          email: formData.correo,
          password: formData.password,
          telefono: formData.telefono,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrores([data.error || "Error al procesar el registro"]);
        setCargando(false);
        return;
      }

      setExitoso(true);

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error en el registro:", error);
      setErrores(["Hubo un error al procesar el registro. Intenta nuevamente."]);
      setCargando(false);
    }
  };

  if (exitoso) {
    return (
      <div style={{ 
        display: "flex", 
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          maxWidth: "500px",
          width: "100%",
          padding: "3rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ color: "#4CAF50", marginBottom: "1rem", fontSize: "1.8rem" }}>
            ¡Registro Exitoso!
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Se ha enviado un correo de confirmación a <strong>{formData.correo}</strong>
          </p>
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      {/* Panel izquierdo - Imagen */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #04474B 0%, #096266 100%)",
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
            ¡Únete a OrdenateYA!
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            opacity: 0.9,
            maxWidth: "400px",
            lineHeight: "1.6",
            margin: "0 auto"  
          }}>
            Crea tu cuenta y comienza a gestionar tus finanzas de manera inteligente
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario de Registro */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        overflowY: "auto"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "3rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            textAlign: "center",
            color: "#2c3e50",
            marginBottom: "0.5rem",
            fontSize: "1.8rem"
          }}>
            Crear Cuenta
          </h2>

          <p style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "2rem",
            fontSize: "0.95rem"
          }}>
            Completa tus datos para registrarte
          </p>

          {/* Mensajes de error */}
          {errores.length > 0 && (
            <div style={{
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem"
            }}>
              {errores.map((error, index) => (
                <p key={index} style={{
                  color: "#c00",
                  fontSize: "0.9rem",
                  margin: "0.25rem 0"
                }}>
                  • {error}
                </p>
              ))}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Nombres */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500",
                fontSize: "0.95rem"
              }}>
                Nombres
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Ingresa tus nombres"
                required
                disabled={cargando}
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

            {/* Apellidos */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500",
                fontSize: "0.95rem"
              }}>
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ingresa tus apellidos"
                required
                disabled={cargando}
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

            {/* Correo */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500",
                fontSize: "0.95rem"
              }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="tu@ejemplo.com"
                required
                disabled={cargando}
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

            {/* Teléfono */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500",
                fontSize: "0.95rem"
              }}>
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+56912345678"
                required
                disabled={cargando}
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

            {/* Contraseña */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500",
                fontSize: "0.95rem"
              }}>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={cargando}
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

            {/* Confirmar Contraseña */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#2c3e50",
                fontWeight: "500",
                fontSize: "0.95rem"
              }}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                disabled={cargando}
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

            {/* Términos y Condiciones */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "flex",
                alignItems: "flex-start",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#666"
              }}>
                <input
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  disabled={cargando}
                  style={{
                    marginRight: "0.5rem",
                    marginTop: "0.25rem",
                    cursor: "pointer"
                  }}
                />
                <span>
                  Acepto los{" "}
                  <Link
                    href="/terminos"
                    style={{
                      color: "#667eea",
                      textDecoration: "none",
                      fontWeight: "500"
                    }}
                  >
                    términos y condiciones
                  </Link>
                </span>
              </label>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={cargando}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: cargando ? "#ccc" : "#096266",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: cargando ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
                marginBottom: "1rem"
              }}
              onMouseEnter={(e) => !cargando && (e.currentTarget.style.backgroundColor = "#04474b")}
              onMouseLeave={(e) => !cargando && (e.currentTarget.style.backgroundColor = "#096266")}
            >
              {cargando ? "Registrando..." : "Crear Cuenta"}
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

          {/* Enlace a Login */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#666", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
              ¿Ya tienes una cuenta?
            </p>
            <Link
              href="/"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              Inicia sesión aquí
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