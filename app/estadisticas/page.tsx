"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
}

interface Ingreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

interface Egreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

export default function EstadisticasPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [egresos, setEgresos] = useState<Egreso[]>([]);

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
      cargarDatos();
    }
  }, [usuario]);

  const cargarDatos = async () => {
    if (!usuario) return;

    try {
      const [ingresosRes, egresosRes] = await Promise.all([
        fetch(`/api/ingresos?usuarioId=${usuario.id}`),
        fetch(`/api/egresos?usuarioId=${usuario.id}`)
      ]);

      if (ingresosRes.ok) {
        const dataIngresos = await ingresosRes.json();
        setIngresos(dataIngresos.ingresos || dataIngresos);
      }

      if (egresosRes.ok) {
        const dataEgresos = await egresosRes.json();
        setEgresos(dataEgresos.egresos || dataEgresos);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  // Cálculos
  const totalIngresos = ingresos.reduce((sum, ing) => sum + ing.monto, 0);
  const totalEgresos = egresos.reduce((sum, eg) => sum + eg.monto, 0);
  const balance = totalIngresos - totalEgresos;

  // Datos para gráfico de pastel - Egresos por categoría
  const egresosPorCategoria = egresos.reduce((acc: any, egreso) => {
    const cat = egreso.categoria || "Sin categoría";
    if (!acc[cat]) {
      acc[cat] = 0;
    }
    acc[cat] += egreso.monto;
    return acc;
  }, {});

  const dataPieEgresos = Object.keys(egresosPorCategoria).map(cat => ({
    name: cat,
    value: egresosPorCategoria[cat]
  }));

  // Datos para gráfico de pastel - Ingresos por categoría
  const ingresosPorCategoria = ingresos.reduce((acc: any, ingreso) => {
    const cat = ingreso.categoria || "Sin categoría";
    if (!acc[cat]) {
      acc[cat] = 0;
    }
    acc[cat] += ingreso.monto;
    return acc;
  }, {});

  const dataPieIngresos = Object.keys(ingresosPorCategoria).map(cat => ({
    name: cat,
    value: ingresosPorCategoria[cat]
  }));

  // Datos para gráfico de barras comparativo
  const dataBarras = [
    {
      name: 'Finanzas',
      Ingresos: totalIngresos,
      Egresos: totalEgresos
    }
  ];

  const COLORS_EGRESOS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'];
  const COLORS_INGRESOS = ['#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

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
              <Link href="/metas" className="hover:text-gray-200 transition">
                Metas
              </Link>
              <Link href="/estadisticas" className="font-bold border-b-2 border-white">
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
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              📊 Estadísticas Financieras
            </h2>
            <p className="text-gray-600 mt-1">
              Visualiza y analiza tus finanzas
            </p>
          </div>

          {/* Resumen Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Total Ingresos */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Ingresos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    ${totalIngresos.toLocaleString('es-CL')}
                  </p>
                </div>
                <div className="text-4xl">💵</div>
              </div>
            </div>

            {/* Total Egresos */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Egresos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    ${totalEgresos.toLocaleString('es-CL')}
                  </p>
                </div>
                <div className="text-4xl">💸</div>
              </div>
            </div>

            {/* Balance */}
            <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${balance >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Balance</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ${balance.toLocaleString('es-CL')}
                  </p>
                </div>
                <div className="text-4xl">{balance >= 0 ? '📈' : '📉'}</div>
              </div>
            </div>
          </div>

          {/* Gráfico de Barras Comparativo */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Comparación Ingresos vs Egresos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataBarras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-CL')}`} />
                <Legend />
                <Bar dataKey="Ingresos" fill="#22c55e" />
                <Bar dataKey="Egresos" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráficos de Pastel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Egresos por Categoría */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Egresos por Categoría
              </h3>
              {dataPieEgresos.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dataPieEgresos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataPieEgresos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_EGRESOS[index % COLORS_EGRESOS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-CL')}`} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => `${value}: $${entry.payload.value.toLocaleString('es-CL')}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-3xl mb-2">📊</p>
                  <p>No hay datos de egresos</p>
                </div>
              )}
            </div>

            {/* Ingresos por Categoría */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Ingresos por Categoría
              </h3>
              {dataPieIngresos.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dataPieIngresos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataPieIngresos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_INGRESOS[index % COLORS_INGRESOS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-CL')}`} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => `${value}: $${entry.payload.value.toLocaleString('es-CL')}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-3xl mb-2">📊</p>
                  <p>No hay datos de ingresos</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Categorías */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Egresos */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Top 5 Categorías de Egresos
              </h3>
              <div className="space-y-3">
                {dataPieEgresos
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <span className="font-bold text-red-600">
                        ${cat.value.toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                {dataPieEgresos.length === 0 && (
                  <p className="text-center text-gray-400 py-4">No hay datos disponibles</p>
                )}
              </div>
            </div>

            {/* Top Ingresos */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Top 5 Categorías de Ingresos
              </h3>
              <div className="space-y-3">
                {dataPieIngresos
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <span className="font-bold text-green-600">
                        ${cat.value.toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                {dataPieIngresos.length === 0 && (
                  <p className="text-center text-gray-400 py-4">No hay datos disponibles</p>
                )}
              </div>
            </div>
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