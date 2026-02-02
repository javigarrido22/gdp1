"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function IngresosPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoIngreso, setNuevoIngreso] = useState({
    descripcion: "",
    monto: "",
    categoria: "",
    fecha: new Date().toISOString().split('T')[0]
  });
  const [ingresoEditando, setIngresoEditando] = useState<number | null>(null);
  const [datosEdicion, setDatosEdicion] = useState({
    descripcion: "",
    monto: "",
    categoria: "",
    fecha: ""
  });

  // Categorías predefinidas para ingresos
  const categorias = [
    "Salario",
    "Freelance",
    "Inversiones",
    "Negocios",
    "Bonos",
    "Regalos",
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
      cargarIngresos();
    }
  }, [usuario]);

  const cargarIngresos = async () => {
    if (!usuario) return;

    try {
      const response = await fetch(`/api/ingresos?usuarioId=${usuario.id}`);
      if (response.ok) {
        const data = await response.json();
        setIngresos(data.ingresos || data);
      }
    } catch (error) {
      console.error("Error al cargar ingresos:", error);
    }
  };

  const agregarIngreso = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) {
      alert("Error: Usuario no encontrado");
      return;
    }

    try {
      const response = await fetch("/api/ingresos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: nuevoIngreso.descripcion,
          monto: parseFloat(nuevoIngreso.monto),
          categoria: nuevoIngreso.categoria,
          fecha: nuevoIngreso.fecha,
          usuarioId: usuario.id
        })
      });

      if (response.ok) {
        setNuevoIngreso({
          descripcion: "",
          monto: "",
          categoria: "",
          fecha: new Date().toISOString().split('T')[0]
        });
        setMostrarFormulario(false);
        cargarIngresos();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'No se pudo guardar el ingreso'}`);
      }
    } catch (error) {
      console.error("Error al agregar ingreso:", error);
      alert("Error al guardar el ingreso");
    }
  };

  const eliminarIngreso = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este ingreso?")) {
      try {
        const response = await fetch(`/api/ingresos/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          cargarIngresos();
        }
      } catch (error) {
        console.error("Error al eliminar ingreso:", error);
      }
    }
  };

  const iniciarEdicion = (ingreso: any) => {
    setIngresoEditando(ingreso.id);
    setDatosEdicion({
      descripcion: ingreso.descripcion,
      monto: ingreso.monto.toString(),
      categoria: ingreso.categoria || "",
      fecha: ingreso.fecha.split('T')[0]
    });
  };

  const guardarEdicion = async (id: number) => {
    try {
      const response = await fetch(`/api/ingresos/${id}`, {
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
        setIngresoEditando(null);
        cargarIngresos();
      }
    } catch (error) {
      console.error('Error al actualizar ingreso:', error);
    }
  };

  const cancelarEdicion = () => {
    setIngresoEditando(null);
    setDatosEdicion({
      descripcion: "",
      monto: "",
      categoria: "",
      fecha: ""
    });
  };

  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);

  if (!usuario) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar - Responsive */}
      <nav className="bg-[#096266] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h1 className="text-xl font-bold">OrdenateYA</h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="hover:text-gray-200 transition">
                ← Vista general
              </Link>
              <Link href="/ingresos" className="font-bold border-b-2 border-white">
                Ingresos
              </Link>
              <Link href="/egresos" className="hover:text-gray-200 transition">
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
                💵 Mis Ingresos
              </h2>
              <p className="text-gray-600 mt-1">
                Registra y controla tus entradas de dinero
              </p>
            </div>
            
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              {mostrarFormulario ? "Cancelar" : "Nuevo Ingreso"}
            </button>
          </div>

          {/* Resumen */}
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Total Ingresos
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600">
              ${totalIngresos.toLocaleString('es-CL')}
            </p>
          </div>

          {/* Formulario */}
          {mostrarFormulario && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Registrar Nuevo Ingreso
              </h3>
              
              <form onSubmit={agregarIngreso}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={nuevoIngreso.descripcion}
                      onChange={(e) => setNuevoIngreso({...nuevoIngreso, descripcion: e.target.value})}
                      required
                      placeholder="Ej: Salario mensual"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto
                    </label>
                    <input
                      type="number"
                      value={nuevoIngreso.monto}
                      onChange={(e) => setNuevoIngreso({...nuevoIngreso, monto: e.target.value})}
                      required
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={nuevoIngreso.categoria}
                      onChange={(e) => setNuevoIngreso({...nuevoIngreso, categoria: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition cursor-pointer"
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
                      value={nuevoIngreso.fecha}
                      onChange={(e) => setNuevoIngreso({...nuevoIngreso, fecha: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Guardar Ingreso
                </button>
              </form>
            </div>
          )}

          {/* Lista de Ingresos */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Lista de Ingresos
            </h3>

            {ingresos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-xl font-medium mb-2">No hay ingresos registrados</p>
                <p>Comienza agregando tu primer ingreso</p>
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
                    {ingresos.map((ingreso) => (
                      <tr key={ingreso.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        {ingresoEditando === ingreso.id ? (
                          // Modo edición
                          <>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={datosEdicion.descripcion}
                                onChange={(e) => setDatosEdicion({...datosEdicion, descripcion: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={datosEdicion.monto}
                                onChange={(e) => setDatosEdicion({...datosEdicion, monto: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={datosEdicion.categoria}
                                onChange={(e) => setDatosEdicion({...datosEdicion, categoria: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none cursor-pointer"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <button
                                  onClick={() => guardarEdicion(ingreso.id)}
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
                              {ingreso.descripcion}
                            </td>
                            <td className="px-4 py-3 text-green-600 font-semibold">
                              ${ingreso.monto.toLocaleString('es-CL')}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {ingreso.categoria || "Sin categoría"}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {new Date(ingreso.fecha).toLocaleDateString('es-CL')}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <button
                                  onClick={() => iniciarEdicion(ingreso)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => eliminarIngreso(ingreso.id)}
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
      <footer className="bg-[#096266] text-white text-center py-6 mt-auto">
        <p>© 2024 OrdenateYA - Gestión de Finanzas Personales</p>
      </footer>
    </div>
  );
}