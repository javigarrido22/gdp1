"use client";

import { useState, useEffect } from "react";

interface Indicador {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  fecha: string;
  valor: number;
}

export default function IndicadoresEconomicos() {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerIndicadores = async () => {
      try {
        const response = await fetch("https://mindicador.cl/api");
        const data = await response.json();
        
        const indicadoresFormateados: Indicador[] = [];
        
        if (data.uf?.valor) {
          indicadoresFormateados.push({
            codigo: "uf",
            nombre: "UF (Unidad de Fomento)",
            unidad_medida: "Pesos",
            fecha: data.uf.fecha,
            valor: data.uf.valor,
          });
        }
        
        if (data.utm?.valor) {
          indicadoresFormateados.push({
            codigo: "utm",
            nombre: "UTM (Unidad Tributaria Mensual)",
            unidad_medida: "Pesos",
            fecha: data.utm.fecha,
            valor: data.utm.valor,
          });
        }
        
        if (data.dolar?.valor) {
          indicadoresFormateados.push({
            codigo: "dolar",
            nombre: "Dólar",
            unidad_medida: "Pesos",
            fecha: data.dolar.fecha,
            valor: data.dolar.valor,
          });
        }
        
        if (data.euro?.valor) {
          indicadoresFormateados.push({
            codigo: "euro",
            nombre: "Euro",
            unidad_medida: "Pesos",
            fecha: data.euro.fecha,
            valor: data.euro.valor,
          });
        }
        
        if (data.ipc?.valor) {
          indicadoresFormateados.push({
            codigo: "ipc",
            nombre: "IPC (Índice de Precios al Consumidor)",
            unidad_medida: "Porcentaje",
            fecha: data.ipc.fecha,
            valor: data.ipc.valor,
          });
        }
        
        if (data.bitcoin?.valor) {
          indicadoresFormateados.push({
            codigo: "bitcoin",
            nombre: "Bitcoin",
            unidad_medida: "Dólar",
            fecha: data.bitcoin.fecha,
            valor: data.bitcoin.valor,
          });
        }
        
        setIndicadores(indicadoresFormateados);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener indicadores:", error);
        setCargando(false);
      }
    };

    obtenerIndicadores();
    const intervalo = setInterval(obtenerIndicadores, 3600000);
    
    return () => clearInterval(intervalo);
  }, []);

  // Separar los primeros 4 y los últimos 2
  const primeraFila = indicadores.slice(0, 4);
  const segundaFila = indicadores.slice(4, 6);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center",
      width: "100%",
      marginTop: "2rem",
      marginBottom: "2rem"
    }}>
      <div style={{ 
        maxWidth: "1200px",
        width: "100%",
        padding: "0 1rem"
      }}>
        {/* Título mejorado */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderTop: "4px solid #096266",
          textAlign: "center"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "0.5rem"
          }}>
            <span style={{ fontSize: "2rem" }}>🏛️</span>
            <h2 style={{ 
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937"
            }}>
              Indicadores Económicos de Chile
            </h2>
          </div>
          <p style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "#6b7280"
          }}>
            Valores actualizados en tiempo real desde mindicador.cl
          </p>
        </div>
        
        {cargando ? (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              display: "inline-block",
              width: "2rem",
              height: "2rem",
              border: "3px solid #e5e7eb",
              borderTopColor: "#096266",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <p style={{ marginTop: "1rem", color: "#6b7280" }}>
              Cargando indicadores económicos...
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Primera fila: 4 tarjetas */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem"
            }}>
              {primeraFila.map((item) => (
                <div
                  key={item.codigo}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "black" }}>
                    {item.nombre}
                  </h3>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "bold", color: "#4CAF50" }}>
                    ${item.valor.toLocaleString("es-CL", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                    Actualizado: {new Date(item.fecha).toLocaleDateString("es-CL")}
                    {item.codigo === 'ipc' && (
                      <span style={{ fontSize: "0.75rem", color: "#999" }}> (Mensual)</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Segunda fila: 2 tarjetas centradas */}
            {segundaFila.length > 0 && (
              <div style={{ 
                display: "flex",
                justifyContent: "center",
                gap: "1rem"
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(250px, 300px))",
                  gap: "1rem"
                }}>
                  {segundaFila.map((item) => (
                    <div
                      key={item.codigo}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "1rem",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "black" }}>
                        {item.nombre}
                      </h3>
                      <p style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "bold", color: "#4CAF50" }}>
                        ${item.valor.toLocaleString("es-CL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                        Actualizado: {new Date(item.fecha).toLocaleDateString("es-CL")}
                        {item.codigo === 'ipc' && (
                          <span style={{ fontSize: "0.75rem", color: "#999" }}> (Mensual)</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}