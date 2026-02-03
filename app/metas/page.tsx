"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MetasPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [metas, setMetas] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState({
    titulo: "",
    montoObjetivo: "",
    montoActual: "",
    fechaLimite: ""
  });
  const [metaEditando, setMetaEditando] = useState<number | null>(null);
  const [datosEdicion, setDatosEdicion] = useState({
    titulo: "",
    montoObjetivo: "",
    montoActual: "",
    fechaLimite: ""
  });

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
      cargarMetas();
    }
  }, [usuario]);

  const cargarMetas = async () => {
    if (!usuario) return;

    try {
      const response = await fetch(`/api/metas?usuarioId=${usuario.id}`);
      if (response.ok) {
        const data = await response.json();
        setMetas(data.metas || data);
      }
    } catch (error) {
      console.error("Error al cargar metas:", error);
    }
  };

  const agregarMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) {
      alert("Error: Usuario no encontrado");
      return;
    }

    try {
      const response = await fetch("/api/metas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: nuevaMeta.titulo,
          montoObjetivo: parseFloat(nuevaMeta.montoObjetivo),
          montoActual: parseFloat(nuevaMeta.montoActual || "0"),
          fechaLimite: nuevaMeta.fechaLimite || null,
          usuarioId: usuario.id
        })
      });

      if (response.ok) {
        setNuevaMeta({
          titulo: "",
          montoObjetivo: "",
          montoActual: "",
          fechaLimite: ""
        });
        setMostrarFormulario(false);
        cargarMetas();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'No se pudo guardar la meta'}`);
      }
    } catch (error) {
      console.error("Error al agregar meta:", error);
      alert("Error al guardar la meta");
    }
  };

  const eliminarMeta = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta meta?")) {
      try {
        const response = await fetch(`/api/metas/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          cargarMetas();
        }
      } catch (error) {
        console.error("Error al eliminar meta:", error);
      }
    }
  };

  const iniciarEdicion = (meta: any) => {
    setMetaEditando(meta.id);
    setDatosEdicion({
      titulo: meta.titulo,
      montoObjetivo: meta.montoObjetivo.toString(),
      montoActual: meta.montoActual.toString(),
      fechaLimite: meta.fechaLimite ? meta.fechaLimite.split('T')[0] : ""
    });
  };

  const guardarEdicion = async (id: number) => {
    try {
      const response = await fetch(`/api/metas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: datosEdicion.titulo,
          montoObjetivo: parseFloat(datosEdicion.montoObjetivo),
          montoActual: parseFloat(datosEdicion.montoActual),
          fechaLimite: datosEdicion.fechaLimite || null
        })
      });

      if (response.ok) {
        setMetaEditando(null);
        cargarMetas();
      }
    } catch (error) {
      console.error('Error al actualizar meta:', error);
    }
  };

  const cancelarEdicion = () => {
    setMetaEditando(null);
    setDatosEdicion({
      titulo: "",
      montoObjetivo: "",
      montoActual: "",
      fechaLimite: ""
    });
  };

  const marcarCompletada = async (id: number) => {
    try {
      const response = await fetch(`/api/metas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada: true })
      });

      if (response.ok) {
        cargarMetas();
      }
    } catch (error) {
      console.error('Error al marcar meta como completada:', error);
    }
  };

  const calcularProgreso = (montoActual: number, montoObjetivo: number) => {
    return Math.min((montoActual / montoObjetivo) * 100, 100);
  };

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
              <Link href="/ingresos" className="hover:text-gray-200 transition">
                Ingresos
              </Link>
              <Link href="/egresos" className="hover:text-gray-200 transition">
                Egresos
              </Link>
              <Link href="/metas" className="font-bold border-b-2 border-white">
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
                🎯 Mis Metas
              </h2>
              <p className="text-gray-600 mt-1">
                Define y alcanza tus objetivos financieros
              </p>
            </div>
            
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              {mostrarFormulario ? "Cancelar" : "➕ Nueva Meta"}
            </button>
          </div>

          {/* Formulario */}
          {mostrarFormulario && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Crear Nueva Meta
              </h3>
              
              <form onSubmit={agregarMeta}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Meta
                    </label>
                    <input
                      type="text"
                      value={nuevaMeta.titulo}
                      onChange={(e) => setNuevaMeta({...nuevaMeta, titulo: e.target.value})}
                      required
                      placeholder="Ej: Comprar un auto"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Objetivo
                    </label>
                    <input
                      type="number"
                      value={nuevaMeta.montoObjetivo}
                      onChange={(e) => setNuevaMeta({...nuevaMeta, montoObjetivo: e.target.value})}
                      required
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Actual (opcional)
                    </label>
                    <input
                      type="number"
                      value={nuevaMeta.montoActual}
                      onChange={(e) => setNuevaMeta({...nuevaMeta, montoActual: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Límite (opcional)
                    </label>
                    <input
                      type="date"
                      value={nuevaMeta.fechaLimite}
                      onChange={(e) => setNuevaMeta({...nuevaMeta, fechaLimite: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Guardar Meta
                </button>
              </form>
            </div>
          )}

          {/* Lista de Metas */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Mis Metas de Ahorro
            </h3>

            {metas.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-5xl mb-4">🎯</p>
                <p className="text-xl font-medium mb-2">No hay metas registradas</p>
                <p>Comienza creando tu primera meta financiera</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metas.map((meta) => {
                  const progreso = calcularProgreso(meta.montoActual, meta.montoObjetivo);
                  const completada = meta.completada || progreso >= 100;

                  return (
                    <div
                      key={meta.id}
                      className={`border-2 rounded-xl p-6 transition ${
                        completada
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 bg-white hover:shadow-lg'
                      }`}
                    >
                      {metaEditando === meta.id ? (
                        // Modo edición
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={datosEdicion.titulo}
                            onChange={(e) => setDatosEdicion({...datosEdicion, titulo: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            placeholder="Título"
                          />
                          <input
                            type="number"
                            value={datosEdicion.montoObjetivo}
                            onChange={(e) => setDatosEdicion({...datosEdicion, montoObjetivo: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            placeholder="Monto Objetivo"
                          />
                          <input
                            type="number"
                            value={datosEdicion.montoActual}
                            onChange={(e) => setDatosEdicion({...datosEdicion, montoActual: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                            placeholder="Monto Actual"
                          />
                          <input
                            type="date"
                            value={datosEdicion.fechaLimite}
                            onChange={(e) => setDatosEdicion({...datosEdicion, fechaLimite: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => guardarEdicion(meta.id)}
                              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Modo visualización
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-bold text-gray-800">
                              {meta.titulo}
                            </h4>
                            {completada && (
                              <span className="text-2xl">✅</span>
                            )}
                          </div>

                          <div className="space-y-3 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Progreso</p>
                              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                                <div
                                  className={`h-3 rounded-full transition-all ${
                                    completada ? 'bg-green-500' : 'bg-purple-600'
                                  }`}
                                  style={{ width: `${progreso}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {progreso.toFixed(1)}% completado
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600">Monto Actual</p>
                              <p className="text-xl font-bold text-purple-600">
                                ${meta.montoActual.toLocaleString('es-CL')}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600">Monto Objetivo</p>
                              <p className="text-lg font-semibold text-gray-700">
                                ${meta.montoObjetivo.toLocaleString('es-CL')}
                              </p>
                            </div>

                            {meta.fechaLimite && (
                              <div>
                                <p className="text-sm text-gray-600">Fecha Límite</p>
                                <p className="text-sm text-gray-700">
                                  {new Date(meta.fechaLimite).toLocaleDateString('es-CL')}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {!completada && (
                              <button
                                onClick={() => marcarCompletada(meta.id)}
                                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                              >
                                Marcar Completada
                              </button>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => iniciarEdicion(meta)}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => eliminarMeta(meta.id)}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
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