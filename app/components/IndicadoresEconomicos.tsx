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
        <h2 style={{ textAlign: "center", color: "black", marginBottom: "1.5rem" }}>
          📈 Indicadores Económicos
        </h2>
        
        {cargando ? (
          <p style={{ textAlign: "center" }}>Cargando indicadores...</p>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem"
          }}>
            {indicadores.map((item) => (
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
        )}
      </div>
    </div>
  );
}