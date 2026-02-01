"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegistroPage() {
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
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.telefono)) {
      nuevosErrores.push("El teléfono no es válido");
    }
    if (!formData.aceptaTerminos) {
      nuevosErrores.push("Debes aceptar los términos y condiciones");
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevosErrores = validarFormulario();
    
    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores([]);

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          password: formData.password,
          telefono: formData.telefono,
        }),
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Respuesta no es JSON:", await response.text());
        setErrores(["Error del servidor. Por favor intenta nuevamente."]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrores([data.error || 'Error al procesar el registro']);
        return;
      }

      // Registro exitoso
      setExitoso(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
      
    } catch (error) {
      console.error("Error en el registro:", error);
      setErrores(["Hubo un error al procesar el registro. Intenta nuevamente."]);
    }
  };

  if (exitoso) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh" 
      }}>
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

        <main style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem"
        }}>
          <div style={{
            maxWidth: "500px",
            width: "100%",
            padding: "3rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ color: "#4CAF50", marginBottom: "1rem" }}>¡Registro Exitoso!</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              Se ha enviado un correo de confirmación a <strong>{formData.correo}</strong>
            </p>
            <p style={{ color: "#999", fontSize: "0.9rem" }}>
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh" 
    }}>
      <header style={{
        backgroundColor: "white",
        padding: "1rem 2rem",
      }}>
        <Link href="/">
          <Image 
            src="/ordenateya.png" 
            alt="OrdenateYA Logo" 
            width={150} 
            height={150}
            style={{ objectFit: "contain", cursor: "pointer" }}
          />
        </Link>
      </header>

      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem"
      }}>
        <div style={{
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          <h2 style={{
            color: "black",
            fontSize: "32px",
            fontWeight: "bold",
            margin: 0,
          }}>
            Crear Cuenta
          </h2>
        </div>

        <div style={{
          maxWidth: "500px",
          width: "100%",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}>
          {errores.length > 0 && (
            <div style={{
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "1.5rem"
            }}>
              {errores.map((error, index) => (
                <p key={index} style={{ color: "#c00", margin: "0.25rem 0", fontSize: "0.9rem" }}>
                  • {error}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Ingresa tus nombres"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ingresa tus apellidos"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "black" }}>
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem", marginTop: "1.5rem" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center", 
                color: "black",
                cursor: "pointer"
              }}>
                <input
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  style={{ marginRight: "0.5rem", cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.9rem" }}>
                  Acepto los{" "}
                  <Link href="/terminos" style={{ color: "#4CAF50", textDecoration: "underline" }}>
                    términos y condiciones
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%",
                fontWeight: "500"
              }}
            >
              Registrar
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              ¿Ya tienes cuenta?{" "}
              <Link href="/" style={{ color: "#4CAF50", textDecoration: "none", fontWeight: "500" }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </main>

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