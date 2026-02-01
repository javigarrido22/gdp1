"use client";

import React, { useState } from "react";
import Tesseract from "tesseract.js"; // Importar Tesseract.js para OCR

const Egresos = () => {
  const [egresos, setEgresos] = useState([
    { id: 1, fecha: "2023-01-15", descripcion: "Alquiler", monto: 500 },
    { id: 2, fecha: "2023-02-10", descripcion: "Supermercado", monto: 200 },
    { id: 3, fecha: "2023-02-20", descripcion: "Transporte", monto: 50 },
    { id: 4, fecha: "2023-03-05", descripcion: "Entretenimiento", monto: 100 },
    { id: 5, fecha: "2023-03-15", descripcion: "Servicios", monto: 150 },
  ]);

  const [nuevoEgreso, setNuevoEgreso] = useState({
    fecha: "",
    descripcion: "",
    monto: "",
  });

  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [procesandoImagen, setProcesandoImagen] = useState(false);

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

  const handleMesClick = (mes: number) => {
    setMesSeleccionado(mes);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoEgreso({ ...nuevoEgreso, [name]: value });
  };

  const handleAgregarEgreso = () => {
    if (!nuevoEgreso.fecha || !nuevoEgreso.descripcion || !nuevoEgreso.monto) {
      setMensajeError("Favor completa todos los campos");
      return;
    }

    setEgresos([
      ...egresos,
      {
        id: egresos.length + 1,
        fecha: nuevoEgreso.fecha,
        descripcion: nuevoEgreso.descripcion,
        monto: parseFloat(nuevoEgreso.monto),
      },
    ]);

    setNuevoEgreso({ fecha: "", descripcion: "", monto: "" });
    setMensajeError("");
    setMensajeExito("Se ha añadido con éxito");
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const handleImagenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProcesandoImagen(true); // Mostrar mensaje de procesamiento

      try {
        const result = await Tesseract.recognize(file, "eng"); // Procesar la imagen con OCR
        const text = result.data.text;

        // Extraer datos del texto (esto es un ejemplo, ajusta según el formato de tus boletas)
        const fechaMatch = text.match(/\d{4}-\d{2}-\d{2}/); // Buscar fecha en formato YYYY-MM-DD
        const montoMatch = text.match(/\d+(\.\d{1,2})?/); // Buscar monto (número con decimales)
        const descripcion = "Boleta escaneada"; // Puedes ajustar esto según el texto extraído

        setNuevoEgreso({
          fecha: fechaMatch ? fechaMatch[0] : "",
          descripcion,
          monto: montoMatch ? montoMatch[0] : "",
        });

        setMensajeExito("Datos escaneados desde la boleta");
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
        setMensajeError("No se pudo procesar la boleta");
      } finally {
        setProcesandoImagen(false); // Ocultar mensaje de procesamiento
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Egresos</h1>

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

      {/* Lista de egresos */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {egresos
          .filter((egreso) =>
            mesSeleccionado !== null
              ? new Date(egreso.fecha).getMonth() === mesSeleccionado
              : true
          )
          .map((egreso) => (
            <li
              key={egreso.id}
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
                <strong>{egreso.fecha}</strong> - {egreso.descripcion}: ${egreso.monto}
              </div>
              <button
                onClick={() => setEgresos(egresos.filter((e) => e.id !== egreso.id))}
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
      {egresos.length === 0 && <p>No hay egresos para este mes.</p>}

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

      {/* Formulario para agregar egresos */}
      {mostrarFormulario && (
        <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h2 style={{ marginBottom: "20px", color: "#333", fontSize: "1.5rem" }}>Añadir nuevo egreso</h2>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
              Fecha:
            </label>
            <input
              type="date"
              name="fecha"
              value={nuevoEgreso.fecha}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
              Descripción:
            </label>
            <input
              type="text"
              name="descripcion"
              value={nuevoEgreso.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
              Monto:
            </label>
            <input
              type="number"
              name="monto"
              value={nuevoEgreso.monto}
              onChange={handleInputChange}
              placeholder="Monto"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
              Subir boleta:
            </label>
            <input
              type="file"
              accept="image/*,application/pdf" // Permitir solo archivos de imagen y pdf
              onChange={handleImagenChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "1rem",
              }}
            />
          </div>

          {procesandoImagen && (
            <p style={{ color: "blue", marginTop: "15px", fontWeight: "bold", textAlign: "center" }}>
              Procesando imagen, por favor espera...
            </p>
          )}

          <button
            onClick={handleAgregarEgreso}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Agregar
          </button>

          {mensajeError && (
            <p style={{ color: "red", marginTop: "15px", fontWeight: "bold", textAlign: "center" }}>
              {mensajeError}
            </p>
          )}
        </div>
      )}

      {mensajeExito && (
        <p style={{ color: "green", marginTop: "20px", fontWeight: "bold", textAlign: "center" }}>
          {mensajeExito}
        </p>
      )}
    </div>
  );
};

export default Egresos;