"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import IndicadoresEconomicos from "../components/IndicadoresEconomicos";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

interface Resumen {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  cantidadIngresos: number;
  cantidadEgresos: number;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [resumen, setResumen] = useState<Resumen>({
    totalIngresos: 0,
    totalEgresos: 0,
    balance: 0,
    cantidadIngresos: 0,
    cantidadEgresos: 0
  });
  const router = useRouter();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!usuarioGuardado) {
      router.push('/');
      return;
    }

    const usuarioData = JSON.parse(usuarioGuardado);
    setUsuario(usuarioData);
    
    cargarResumen(usuarioData.id);
  }, [router]);

  const cargarResumen = async (usuarioId: number) => {
    try {
      const response = await fetch(`/api/resumen?usuarioId=${usuarioId}`);
      if (response.ok) {
        const data = await response.json();
        setResumen(data);
      }
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    router.push('/');
  };

  const obtenerIniciales = (nombres: string, apellidos: string) => {
    const inicial1 = nombres.charAt(0).toUpperCase();
    const inicial2 = apellidos.charAt(0).toUpperCase();
    return `${inicial1}${inicial2}`;
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };

  if (!usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-600">
        Cargando...
      </div>
    );
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
              />
              <h1 className="text-xl font-bold"></h1>
            </Link>
            
            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-sm">
                  {obtenerIniciales(usuario.nombres, usuario.apellidos)}
                </div>
                
                <div className="hidden md:block text-left">
                  <p className="font-semibold text-sm">{usuario.nombres} {usuario.apellidos}</p>
                  <p className="text-xs text-white/70">{usuario.correo}</p>
                </div>

                <svg 
                  className={`w-4 h-4 transition-transform ${menuUsuarioAbierto ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuUsuarioAbierto && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-4 bg-gray-50 border-b">
                    <p className="font-semibold text-gray-800">{usuario.nombres} {usuario.apellidos}</p>
                    <p className="text-sm text-gray-600">{usuario.correo}</p>
                    <p className="text-sm text-gray-600">{usuario.telefono}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        setMenuUsuarioAbierto(false);
                        router.push('/perfil');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-xl">👤</span>
                      <span className="text-gray-700">Modificar datos personales</span>
                    </button>

                    <hr className="my-2" />

                    <button
                      onClick={() => {
                        setMenuUsuarioAbierto(false);
                        cerrarSesion();
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600"
                    >
                      <span className="text-xl">🚪</span>
                      <span className="font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Bienvenida */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 text-center border-t-4 border-[#096266]">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              ¡Bienvenido/a, {usuario.nombres}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona tus finanzas de manera simple y efectiva
            </p>
          </div>

          {/* Indicadores Económicos */}
          <div className="mb-6">
            <IndicadoresEconomicos />
          </div>

          {/* Tarjetas de navegación */}
          <div className="space-y-6">
            {/* Primera fila: 4 tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tarjeta Ingresos */}
              <Link
                href="/ingresos"
                className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border-2 border-transparent hover:border-green-500 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">💵</div>
                  <h2 className="text-xl font-bold text-green-600 mb-2">Ingresos</h2>
                  <p className="text-2xl font-bold text-green-700 mb-2">
                    {formatearMonto(resumen.totalIngresos)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {resumen.cantidadIngresos} registro{resumen.cantidadIngresos !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>

              {/* Tarjeta Egresos */}
              <Link
                href="/egresos"
                className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border-2 border-transparent hover:border-red-500 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">💸</div>
                  <h2 className="text-xl font-bold text-red-600 mb-2">Egresos</h2>
                  <p className="text-2xl font-bold text-red-700 mb-2">
                    {formatearMonto(resumen.totalEgresos)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {resumen.cantidadEgresos} registro{resumen.cantidadEgresos !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>

              {/* Tarjeta Estadísticas */}
              <Link
                href="/estadisticas"
                className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border-2 border-transparent hover:border-purple-500 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">📊</div>
                  <h2 className="text-xl font-bold text-purple-600 mb-2">Estadísticas</h2>
                  <p className="text-gray-600 text-sm mt-4">
                    Visualiza gráficos y análisis de tus finanzas
                  </p>
                </div>
              </Link>

              {/* Tarjeta Metas */}
              <Link
                href="/metas"
                className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border-2 border-transparent hover:border-orange-500 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h2 className="text-xl font-bold text-orange-600 mb-2">Metas</h2>
                  <p className="text-gray-600 text-sm mt-4">
                    Define y alcanza tus objetivos financieros
                  </p>
                </div>
              </Link>
            </div>

            {/* Segunda fila: 2 tarjetas centradas */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-start-2">
                {/* Tarjeta Balance */}
                <div className={`bg-white rounded-xl shadow-md p-6 border-2 ${resumen.balance >= 0 ? 'border-blue-500' : 'border-red-500'}`}>
                  <div className="text-center">
                    <div className="text-5xl mb-4">💰</div>
                    <h2 className="text-xl font-bold text-blue-600 mb-4">Balance Total</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-green-700 font-medium text-sm">Ingresos:</span>
                        <span className="text-green-800 font-bold text-sm">{formatearMonto(resumen.totalIngresos)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-red-700 font-medium text-sm">Egresos:</span>
                        <span className="text-red-800 font-bold text-sm">{formatearMonto(resumen.totalEgresos)}</span>
                      </div>
                      
                      <div className={`flex justify-between items-center p-4 rounded-lg ${resumen.balance >= 0 ? 'bg-blue-50' : 'bg-red-50'} border-t-2 ${resumen.balance >= 0 ? 'border-blue-500' : 'border-red-500'}`}>
                        <span className={`font-bold ${resumen.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                          Total:
                        </span>
                        <span className={`font-bold text-xl ${resumen.balance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                          {formatearMonto(resumen.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Perfil */}
              <Link
                href="/perfil"
                className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border-2 border-transparent hover:border-[#096266] hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">⚙️</div>
                  <h2 className="text-xl font-bold text-[#096266] mb-2">Perfil</h2>
                  <p className="text-gray-600 text-sm mt-4">
                    Actualiza tu información personal
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#096266] mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Acciones Rápidas
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/ingresos"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                ➕ Agregar Ingreso
              </Link>

              <Link
                href="/egresos"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                ➖ Agregar Egreso
              </Link>

              <Link
                href="/metas"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                🎯 Nueva Meta
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#096266] text-white p-8 text-center mt-8">
        <p className="mb-2">© 2026 OrdenateYA! - Todos los derechos reservados</p>
        <p className="text-sm text-gray-300">
          Gestión financiera personal
        </p>
      </footer>
    </div>
  );
}