"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function EgresosPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [egresos, setEgresos] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoEgreso, setNuevoEgreso] = useState({
    descripcion: "",
    monto: "",
    categoria: "",
    fecha: new Date().toISOString().split('T')[0]
  });
  const [egresoEditando, setEgresoEditando] = useState<number | null>(null);
  const [datosEdicion, setDatosEdicion] = useState({
    descripcion: "",
    monto: "",
    categoria: "",
    fecha: ""
  });

  // Categorías predefinidas
  const categorias = [
    "Ahorro e inversiones",
    "Alimentación",
    "Créditos y préstamos",
    "Educación",
    "Entretenimiento",
    "Ropa",
    "Salud",
    "Servicios",
    "Tarjeta de créditos",
    "Tecnología",
    "Transporte",
    "Vivienda",
    "Otros"
  ];

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      router.push("/");
    } else {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      cargarEgresos();
    }
  }, [usuario]);

  const cargarEgresos = async () => {
    if (!usuario) return;

    try {
      const response = await fetch(`/api/egresos?usuarioId=${usuario.id}`);
      if (response.ok) {
        const data = await response.json();
        setEgresos(data.egresos || data);
      }
    } catch (error) {
      console.error("Error al cargar egresos:", error);
    }
  };

  const agregarEgreso = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) {
      alert("Error: Usuario no encontrado");
      return;
    }

    try {
      const response = await fetch("/api/egresos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: nuevoEgreso.descripcion,
          monto: parseFloat(nuevoEgreso.monto),
          categoria: nuevoEgreso.categoria,
          fecha: nuevoEgreso.fecha,
          usuarioId: usuario.id
        })
      });

      if (response.ok) {
        setNuevoEgreso({
          descripcion: "",
          monto: "",
          categoria: "",
          fecha: new Date().toISOString().split('T')[0]
        });
        setMostrarFormulario(false);
        cargarEgresos();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'No se pudo guardar el egreso'}`);
      }
    } catch (error) {
      console.error("Error al agregar egreso:", error);
      alert("Error al guardar el egreso");
    }
  };

  const eliminarEgreso = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este egreso?")) {
      try {
        const response = await fetch(`/api/egresos/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          cargarEgresos();
        }
      } catch (error) {
        console.error("Error al eliminar egreso:", error);
      }
    }
  };

  const iniciarEdicion = (egreso: any) => {
    setEgresoEditando(egreso.id);
    setDatosEdicion({
      descripcion: egreso.descripcion,
      monto: egreso.monto.toString(),
      categoria: egreso.categoria || "",
      fecha: egreso.fecha.split('T')[0]
    });
  };

  const guardarEdicion = async (id: number) => {
    try {
      const response = await fetch(`/api/egresos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: datosEdicion.descripcion,
          monto: parseFloat(datosEdicion.monto),
          categoria: datosEdicion.categoria,
          fecha: datosEdicion.fecha
        })
      });

      if (response.ok) {
        setEgresoEditando(null);
        cargarEgresos();
      }
    } catch (error) {
      console.error('Error al actualizar egreso:', error);
    }
  };

  const cancelarEdicion = () => {
    setEgresoEditando(null);
    setDatosEdicion({
      descripcion: "",
      monto: "",
      categoria: "",
      fecha: ""
    });
  };

  const totalEgresos = egresos.reduce((sum, egreso) => sum + egreso.monto, 0);

  if (!usuario) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar - Responsive */}
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
              <h1 className="text-xl font-bold"></h1>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="hover:text-gray-200 transition">
                ← Vista general
              </Link>
              <Link href="/ingresos" className="hover:text-gray-200 transition">
                Ingresos
              </Link>
              <Link href="/egresos" className="font-bold border-b-2 border-white">
                Egresos
              </Link>
              <Link href="/metas" className="hover:text-gray-200 transition">
                Metas
              </Link>
              <Link href="/estadisticas" className="hover:text-gray-200 transition">
                Estadísticas
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2">
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                💸 Mis Egresos
              </h2>
              <p className="text-gray-600 mt-1">
                Registra y controla tus gastos
              </p>
            </div>
            
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              {mostrarFormulario ? "Cancelar" : "➕ Nuevo Egreso"}
            </button>
          </div>

          {/* Resumen */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Total Egresos
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-red-600">
              ${totalEgresos.toLocaleString('es-CL')}
            </p>
          </div>

          {/* Formulario */}
          {mostrarFormulario && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Registrar Nuevo Egreso
              </h3>
              
              <form onSubmit={agregarEgreso}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={nuevoEgreso.descripcion}
                      onChange={(e) => setNuevoEgreso({...nuevoEgreso, descripcion: e.target.value})}
                      required
                      placeholder="Ej: Supermercado"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto
                    </label>
                    <input
                      type="number"
                      value={nuevoEgreso.monto}
                      onChange={(e) => setNuevoEgreso({...nuevoEgreso, monto: e.target.value})}
                      required
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={nuevoEgreso.categoria}
                      onChange={(e) => setNuevoEgreso({...nuevoEgreso, categoria: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition cursor-pointer"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={nuevoEgreso.fecha}
                      onChange={(e) => setNuevoEgreso({...nuevoEgreso, fecha: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Guardar Egreso
                </button>
              </form>
            </div>
          )}

          {/* Lista de Egresos */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Lista de Egresos
            </h3>

            {egresos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-xl font-medium mb-2">No hay egresos registrados</p>
                <p>Comienza agregando tu primer gasto</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Descripción
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Monto
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Categoría
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {egresos.map((egreso) => (
                      <tr key={egreso.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        {egresoEditando === egreso.id ? (
                          // Modo edición
                          <>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={datosEdicion.descripcion}
                                onChange={(e) => setDatosEdicion({...datosEdicion, descripcion: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={datosEdicion.monto}
                                onChange={(e) => setDatosEdicion({...datosEdicion, monto: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={datosEdicion.categoria}
                                onChange={(e) => setDatosEdicion({...datosEdicion, categoria: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none cursor-pointer"
                              >
                                <option value="">Selecciona categoría</option>
                                {categorias.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="date"
                                value={datosEdicion.fecha}
                                onChange={(e) => setDatosEdicion({...datosEdicion, fecha: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <button
                                  onClick={() => guardarEdicion(egreso.id)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={cancelarEdicion}
                                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          // Modo visualización
                          <>
                            <td className="px-4 py-3 text-gray-800">
                              {egreso.descripcion}
                            </td>
                            <td className="px-4 py-3 text-red-600 font-semibold">
                              ${egreso.monto.toLocaleString('es-CL')}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {egreso.categoria || "Sin categoría"}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {new Date(egreso.fecha).toLocaleDateString('es-CL')}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <button
                                  onClick={() => iniciarEdicion(egreso)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => eliminarEgreso(egreso.id)}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </>
                        )}
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
        backgroundColor: "#096266",
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