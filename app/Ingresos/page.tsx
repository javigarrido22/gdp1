"use client";

import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import IndicadoresEconomicos from "../components/IndicadoresEconomicos";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Ingresos = () => {
  const [ingresos, setIngresos] = useState([
    { id: 1, fecha: "2023-01-15", descripcion: "Salario", monto: 1500 },
    { id: 2, fecha: "2023-02-10", descripcion: "Venta de productos", monto: 300 },
    { id: 3, fecha: "2023-02-20", descripcion: "Intereses bancarios", monto: 50 },
    { id: 4, fecha: "2023-03-05", descripcion: "Proyecto freelance", monto: 800 },
    { id: 5, fecha: "2023-03-15", descripcion: "Venta de equipo", monto: 400 },
  ]);

  const [nuevoIngreso, setNuevoIngreso] = useState({
    fecha: "",
    descripcion: "",
    monto: "",
  });

  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Filtrar ingresos por el mes seleccionado
  const ingresosDelMes = mesSeleccionado !== null
    ? ingresos.filter((ingreso) => new Date(ingreso.fecha).getMonth() === mesSeleccionado)
    : ingresos;

  // Datos para el gráfico de torta
  const dataPie = {
    labels: ingresosDelMes.map((ingreso) => ingreso.descripcion),
    datasets: [
      {
        data: ingresosDelMes.map((ingreso) => ingreso.monto),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const handleMesClick = (mes: number) => {
    setMesSeleccionado(mes);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoIngreso({ ...nuevoIngreso, [name]: value });
  };

  const handleAgregarIngreso = () => {
    if (!nuevoIngreso.fecha || !nuevoIngreso.descripcion || !nuevoIngreso.monto) {
      setMensajeError("Favor completa todos los campos");
      return;
    }

    setIngresos([
      ...ingresos,
      {
        id: ingresos.length + 1,
        fecha: nuevoIngreso.fecha,
        descripcion: nuevoIngreso.descripcion,
        monto: parseFloat(nuevoIngreso.monto),
      },
    ]);

    setNuevoIngreso({ fecha: "", descripcion: "", monto: "" });
    setMensajeError("");
    setMensajeExito("Se ha añadido con éxito");
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const handleEliminarIngreso = (id: number) => {
    setIngresos(ingresos.filter((ingreso) => ingreso.id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", color: "black" }}>Ingresos</h1>
      
      <IndicadoresEconomicos />
      
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Franja de meses */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          {meses.map((mes, index) => (
            <button
              key={index}
              onClick={() => handleMesClick(index)}
              style={{
                padding: "10px",
                backgroundColor: mesSeleccionado === index ? "#0070f3" : "#f0f0f0",
                color: mesSeleccionado === index ? "#fff" : "#000",
                border: "1px solid #ddd",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {mes}
            </button>
          ))}
          <button
            onClick={() => setMesSeleccionado(null)}
            style={{
              padding: "10px",
              backgroundColor: mesSeleccionado === null ? "#0070f3" : "#f0f0f0",
              color: mesSeleccionado === null ? "#fff" : "#000",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Todos
          </button>
        </div>

        {/* Lista de ingresos */}
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {ingresosDelMes.map((ingreso) => (
            <li
              key={ingreso.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{ingreso.fecha}</strong> - {ingreso.descripcion}: ${ingreso.monto}
              </div>
              <button
                onClick={() => handleEliminarIngreso(ingreso.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        {ingresosDelMes.length === 0 && <p>No hay ingresos para este mes.</p>}

        {/* Botón para mostrar/ocultar formulario */}
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          {mostrarFormulario ? "Cancelar" : "Añadir"}
        </button>

        {/* Formulario para agregar ingresos */}
        {mostrarFormulario && (
          <div style={{ marginTop: "20px" }}>
            <h2>Añadir nuevo ingreso</h2>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Fecha:
                <input
                  type="date"
                  name="fecha"
                  value={nuevoIngreso.fecha}
                  onChange={handleInputChange}
                  style={{ marginLeft: "10px", padding: "5px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Descripción:
                <input
                  type="text"
                  name="descripcion"
                  value={nuevoIngreso.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción"
                  style={{ marginLeft: "10px", padding: "5px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Monto:
                <input
                  type="number"
                  name="monto"
                  value={nuevoIngreso.monto}
                  onChange={handleInputChange}
                  placeholder="Monto"
                  style={{ marginLeft: "10px", padding: "5px" }}
                />
              </label>
            </div>
            <button
              onClick={handleAgregarIngreso}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Agregar
            </button>
            {mensajeError && <p style={{ color: "red", marginTop: "10px" }}>{mensajeError}</p>}
          </div>
        )}

        {mensajeExito && <p style={{ color: "green", marginTop: "20px" }}>{mensajeExito}</p>}

        {/* Gráfico de torta */}
        {mesSeleccionado !== null && ingresosDelMes.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h2>Distribución de ingresos en {meses[mesSeleccionado]}</h2>
            <Pie data={dataPie} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ingresos;