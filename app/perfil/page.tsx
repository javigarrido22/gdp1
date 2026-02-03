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
      console.log("Enviando datos:", {
        id: usuario?.id,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono
      });

      const response = await fetch(`/api/perfil/${usuario?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo: formData.correo,
          telefono: formData.telefono
        }),
      });

      console.log("Status de respuesta:", response.status);

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(data));
        setUsuario(data);
        setMensaje({ 
          tipo: "exito", 
          texto: "Datos actualizados correctamente ✅" 
        });
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje({ tipo: "", texto: "" });
        }, 3000);
      } else {
        setMensaje({ 
          tipo: "error", 
          texto: data.error || data.message || "Error al actualizar los datos ❌" 
        });
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMensaje({ 
        tipo: "error", 
        texto: "Error al conectar con el servidor ❌" 
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
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#096266] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/ordenateya1.png" 
                alt="OrdenateYA Logo" 
                width={120} 
                height={120}
                className="object-contain"
                priority
              />
            </Link>
            
            <Link 
              href="/dashboard" 
              className="hover:text-gray-200 transition px-4 py-2 rounded-lg hover:bg-[#074b4f]"
            >
              ← Vista general
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header con Avatar */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#096266] to-[#0a7d83] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                {obtenerIniciales(usuario.nombres, usuario.apellidos)}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                  👤 Mi Perfil
                </h1>
                <p className="text-gray-600 text-lg">
                  {usuario.nombres} {usuario.apellidos}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📝 Información Personal
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Nombres */}
                <div>
                  <label 
                    htmlFor="nombres"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#096266] focus:outline-none transition"
                  />
                </div>

                {/* Apellidos */}
                <div>
                  <label 
                    htmlFor="apellidos"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#096266] focus:outline-none transition"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label 
                    htmlFor="correo"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#096266] focus:outline-none transition"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label 
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#096266] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Mensaje de éxito/error */}
              {mensaje.texto && (
                <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${
                  mensaje.tipo === "exito" 
                    ? "bg-green-100 text-green-800 border-2 border-green-300" 
                    : "bg-red-100 text-red-800 border-2 border-red-300"
                }`}>
                  {mensaje.texto}
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition text-center"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={guardando}
                  className={`px-6 py-3 font-semibold rounded-lg transition ${
                    guardando
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#096266] hover:bg-[#074b4f] text-white shadow-md"
                  }`}
                >
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mt-6">
            <p className="text-yellow-800 font-bold mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Información importante
            </p>
            <ul className="text-yellow-700 space-y-2 pl-6 list-disc">
              <li>Todos los campos son obligatorios</li>
              <li>El correo electrónico debe ser válido</li>
              <li>Los cambios se guardarán inmediatamente</li>
              <li>Mantén tu información actualizada para una mejor experiencia</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#096266] text-white py-8 mt-8">
        <div className="text-center">
          <p className="font-semibold mb-2">
            © 2026 OrdenateYA! - Todos los derechos reservados
          </p>
          <p className="text-gray-300 text-sm">
            Gestión financiera personal
          </p>
        </div>
      </footer>
    </div>
  );
}