"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RecuperarPasswordPage() {
  const [paso, setPaso] = useState(1); // 1: datos, 2: código, 3: nueva contraseña
  const [formData, setFormData] = useState({
    correo: "",
    telefono: "",
    codigo: "",
    nuevaPassword: "",
    confirmarPassword: ""
  });
  const [correoEnviado, setCorreoEnviado] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    if (!formData.correo || !formData.telefono) {
      setError("Por favor completa todos los campos");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch('/api/recuperar-password/enviar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formData.correo,
          telefono: formData.telefono,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al enviar el código');
        setCargando(false);
        return;
      }

      setCorreoEnviado(data.correoEnviado);
      setExito('¡Código enviado! Revisa tu correo electrónico.');
      setPaso(2);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al procesar la solicitud');
    } finally {
      setCargando(false);
    }
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.codigo) {
      setError("Por favor ingresa el código");
      return;
    }

    if (formData.codigo.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    setPaso(3);
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    if (!formData.nuevaPassword || !formData.confirmarPassword) {
      setError("Por favor completa todos los campos");
      setCargando(false);
      return;
    }

    if (formData.nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setCargando(false);
      return;
    }

    if (formData.nuevaPassword !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch('/api/recuperar-password/verificar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formData.correo,
          codigo: formData.codigo,
          nuevaPassword: formData.nuevaPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al cambiar la contraseña');
        setCargando(false);
        return;
      }

      setExito('¡Contraseña cambiada exitosamente! Redirigiendo...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
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
      {/* Panel izquierdo */}
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
            {paso === 1 && "🔒"}
            {paso === 2 && "📧"}
            {paso === 3 && "🔑"}
          </div>
          <h1 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "1rem",
            fontWeight: "700"
          }}>
            {paso === 1 && "Recupera tu Cuenta"}
            {paso === 2 && "Verifica tu Correo"}
            {paso === 3 && "Nueva Contraseña"}
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            opacity: 0.9,
            maxWidth: "400px",
            lineHeight: "1.6"
          }}>
            {paso === 1 && "Te enviaremos un código de verificación a tu correo"}
            {paso === 2 && "Ingresa el código de 6 dígitos que enviamos"}
            {paso === 3 && "Crea una contraseña segura para tu cuenta"}
          </p>
        </div>
      </div>

      {/* Panel derecho */}
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

          {/* Indicador de pasos */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
            gap: "0.5rem",
            alignItems: "center"
          }}>
            {[1, 2, 3].map((num) => (
              <>
                <div key={num} style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: paso >= num ? "#667eea" : "#e0e0e0",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  transition: "all 0.3s"
                }}>
                  {num}
                </div>
                {num < 3 && (
                  <div style={{
                    width: "40px",
                    height: "4px",
                    backgroundColor: paso > num ? "#667eea" : "#e0e0e0",
                    borderRadius: "2px",
                    transition: "all 0.3s"
                  }}></div>
                )}
              </>
            ))}
          </div>

          {/* Mensajes */}
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

          {exito && (
            <div style={{
              backgroundColor: "#efe",
              border: "1px solid #cfc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              color: "#090",
              fontSize: "0.9rem",
              textAlign: "center"
            }}>
              {exito}
            </div>
          )}

          {/* Paso 1: Datos del usuario */}
          {paso === 1 && (
            <form onSubmit={handleEnviarCodigo}>
              <h2 style={{ color: "#2c3e50", marginBottom: "1rem", fontSize: "1.5rem" }}>
                Ingresa tus datos
              </h2>
              
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

              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#2c3e50",
                  fontWeight: "500"
                }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  placeholder="+56912345678"
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
                  transition: "background-color 0.3s"
                }}
              >
                {cargando ? "Enviando código..." : "Enviar Código"}
              </button>
            </form>
          )}

          {/* Paso 2: Verificar código */}
          {paso === 2 && (
            <form onSubmit={handleVerificarCodigo}>
              <h2 style={{ color: "#2c3e50", marginBottom: "1rem", fontSize: "1.5rem" }}>
                Ingresa el código
              </h2>
              <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                Enviamos un código de 6 dígitos a<br/>
                <strong>{correoEnviado}</strong>
              </p>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#2c3e50",
                  fontWeight: "500"
                }}>
                  Código de Verificación
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                  placeholder="000000"
                  required
                  maxLength={6}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "2rem",
                    textAlign: "center",
                    letterSpacing: "0.5rem",
                    fontWeight: "bold",
                    transition: "border-color 0.3s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
                <small style={{ color: "#666", fontSize: "0.85rem" }}>
                  El código expira en 10 minutos
                </small>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setPaso(1);
                    setError("");
                    setExito("");
                  }}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    backgroundColor: "#e0e0e0",
                    color: "#666",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Volver
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: "1rem",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                  }}
                >
                  Verificar Código
                </button>
              </div>

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleEnviarCodigo}
                  disabled={cargando}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#667eea",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </div>
            </form>
          )}

          {/* Paso 3: Nueva contraseña */}
          {paso === 3 && (
            <form onSubmit={handleCambiarPassword}>
              <h2 style={{ color: "#2c3e50", marginBottom: "1rem", fontSize: "1.5rem" }}>
                Crea tu nueva contraseña
              </h2>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#2c3e50",
                  fontWeight: "500"
                }}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={formData.nuevaPassword}
                  onChange={(e) => setFormData({...formData, nuevaPassword: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
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

              <div style={{ marginBottom: "2rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#2c3e50",
                  fontWeight: "500"
                }}>
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={formData.confirmarPassword}
                  onChange={(e) => setFormData({...formData, confirmarPassword: e.target.value})}
                  placeholder="Repite tu contraseña"
                  required
                  minLength={6}
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
                  transition: "background-color 0.3s"
                }}
              >
                {cargando ? "Cambiando contraseña..." : "Cambiar Contraseña"}
              </button>
            </form>
          )}

          {/* Link volver al login */}
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link
              href="/"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: "500"
              }}
            >
              ← Volver al inicio de sesión
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