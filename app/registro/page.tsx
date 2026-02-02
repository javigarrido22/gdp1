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
      // Enviar con los nombres de campos que espera la API
      const datosRegistro = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo.trim(),
        password: formData.password,
        telefono: formData.telefono.trim(),
      };

      console.log('Datos a enviar:', datosRegistro);

      const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosRegistro),
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-3">
            ¡Registro Exitoso!
          </h2>
          <p className="text-gray-600 mb-4">
            Se ha enviado un correo de confirmación a <strong>{formData.correo}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Panel izquierdo - Oculto en móvil, visible en desktop */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#04474B] to-[#096266] items-center justify-center p-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)"
          }}
        />
        
        <div className="z-10 text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <h1 className="text-4xl font-bold mb-4">
            ¡Únete a OrdenateYA!
          </h1>
          <p className="text-lg opacity-90 max-w-md mx-auto leading-relaxed">
            Crea tu cuenta y comienza a gestionar tus finanzas de manera inteligente
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario (Siempre visible) */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 sm:p-8">
          {/* Título móvil */}
          <div className="lg:hidden text-center mb-6">
            <div className="text-4xl mb-2">💰</div>
            <h1 className="text-2xl font-bold text-gray-800">OrdenateYA</h1>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
            Crear Cuenta
          </h2>

          <p className="text-center text-gray-600 mb-6 text-sm">
            Completa tus datos para registrarte
          </p>

          {/* Mensajes de error */}
          {errores.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              {errores.map((error, index) => (
                <p key={index} className="text-red-700 text-sm mb-1">
                  • {error}
                </p>
              ))}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100"
              />
            </div>

            {/* Términos y Condiciones */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
                disabled={cargando}
                className="mt-1 mr-2 cursor-pointer"
              />
              <label className="text-sm text-gray-600 cursor-pointer">
                Acepto los{" "}
                <Link
                  href="/terminos"
                  className="text-blue-600 hover:underline font-medium"
                >
                  términos y condiciones
                </Link>
              </label>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#096266] hover:bg-[#04474b] text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {cargando ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">o</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Link a Login */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              ¿Ya tienes una cuenta?
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}