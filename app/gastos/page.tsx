"use client";

import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Gastos = () => {
  const [gastos, setGastos] = useState([
    { id: 1, fecha: "2023-01-15", descripcion: "Alquiler", monto: 500 },
    { id: 2, fecha: "2023-02-10", descripcion: "Supermercado", monto: 200 },
    { id: 3, fecha: "2023-02-20", descripcion: "Transporte", monto: 50 },
    { id: 4, fecha: "2023-03-05", descripcion: "Entretenimiento", monto: 100 },
    { id: 5, fecha: "2023-03-15", descripcion: "Servicios", monto: 150 },
  ]);

  const [nuevoGasto, setNuevoGasto] = useState({
    fecha: "",
    descripcion: "",
    monto: "",
  });

  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);

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

  // Filtrar gastos por el mes seleccionado
  const gastosDelMes = mesSeleccionado !== null
    ? gastos.filter((gasto) => new Date(gasto.fecha).getMonth() === mesSeleccionado)
    : gastos;

  // Datos para el gráfico de torta
  const dataPie = {
    labels: gastosDelMes.map((gasto) => gasto.descripcion),
    datasets: [
      {
        data: gastosDelMes.map((gasto) => gasto.monto),
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
    setNuevoGasto({ ...nuevoGasto, [name]: value });
  };

  const handleAgregarGasto = () => {
    if (!nuevoGasto.fecha || !nuevoGasto.descripcion || !nuevoGasto.monto) {
      setMensajeError("Favor completa todos los campos");
      return;
    }

    setGastos([
      ...gastos,
      {
        id: gastos.length + 1,
        fecha: nuevoGasto.fecha,
        descripcion: nuevoGasto.descripcion,
        monto: parseFloat(nuevoGasto.monto),
      },
    ]);

    setNuevoGasto({ fecha: "", descripcion: "", monto: "" });
    setMensajeError("");
    setMensajeExito("Se ha añadido con éxito");
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const handleEliminarGasto = (id: number) => {
    setGastos(gastos.filter((gasto) => gasto.id !== id));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);

      // Simulación de escaneo de datos desde la imagen
      setTimeout(() => {
        setNuevoGasto({
          fecha: "2023-03-20", // Simulado
          descripcion: "Boleta escaneada",
          monto: "250",
        });
        setMensajeExito("Datos escaneados desde la imagen");
        setTimeout(() => setMensajeExito(""), 3000);
      }, 2000); // Simula un retraso en el escaneo
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Gastos</h1>

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

      {/* Lista de gastos */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {gastosDelMes.map((gasto) => (
          <li
            key={gasto.id}
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
              <strong>{gasto.fecha}</strong> - {gasto.descripcion}: ${gasto.monto}
            </div>
            <button
              onClick={() => handleEliminarGasto(gasto.id)}
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
      {gastosDelMes.length === 0 && <p>No hay gastos para este mes.</p>}

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

      {/* Formulario para agregar gastos */}
      {mostrarFormulario && (
        <div style={{ marginTop: "20px" }}>
          <h2>Añadir nuevo gasto</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Fecha:
              <input
                type="date"
                name="fecha"
                value={nuevoGasto.fecha}
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
                value={nuevoGasto.descripcion}
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
                value={nuevoGasto.monto}
                onChange={handleInputChange}
                placeholder="Monto"
                style={{ marginLeft: "10px", padding: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Subir boleta:
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
          <button
            onClick={handleAgregarGasto}
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
      {mesSeleccionado !== null && gastosDelMes.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>Distribución de gastos en {meses[mesSeleccionado]}</h2>
          <Pie data={dataPie} />
        </div>
      )}
    </div>
  );
};

export default Gastos;